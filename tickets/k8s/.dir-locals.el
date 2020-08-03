((
  org-mode
  .
  ((
    eval
    .
    (progn
      ;; define our funs!
      (message "START: ii/sql-org-hacks")
      (set (make-local-variable 'sql-sqlite-program)
           (executable-find "sqlite3"))
      (set (make-local-variable 'sql-server)
           (if (getenv "PGHOST")
               (getenv "PGHOST")
             (if (file-exists-p "/var/run/secrets/kubernetes.io/serviceaccount/namespace")
                 "postgres"
               "localhost"
               )))
      (set (make-local-variable 'sql-port)
           (if (getenv "PGPORT")
               (string-to-number (getenv "PGPORT"))
             5432))
      (set (make-local-variable 'sql-user)
           (if (getenv "PGUSER")
               (getenv "PGUSER")
             "apisnoop"))
      (set (make-local-variable 'sql-database)
           (if (getenv "PGDATABASE")
               (getenv "PGDATABASE")
             "apisnoop"))
      (set (make-local-variable 'sql-product)
           '(quote postgres))
      (set (make-local-variable 'sql-connection-alist)
           (list
            ;; setting these allows for the connection to be
            ;; created on the fly
            (list 'none
                  (list 'sql-product '(quote postgres))
                  (list 'sql-user sql-user)
                  (list 'sql-database sql-database)
                  (list 'sql-port sql-port)
                  (list 'sql-server sql-server))))
      (message "END: ii/sql-org-hacks")
      (setq-local RESOURCENAME "RESOURCENAME")
      (defun apisnoop/insert-mock-template ()
        "Inserts contents of current directory's mock-template.org file into current buffer."
        (interactive)
        (let ((mock-template "./mock-template.org"))
          (if (file-exists-p mock-template)
              (progn (insert-file-contents mock-template)
                     (normal-mode))
            (message "No file named %s found in current directory" mock-template))))
      (defun apisnoop/delete-live-events ()
        "deletes all live events from audit_events table using psql.  Requires you to have already
         started up apisnoop."
        (interactive)
        (shell-command "psql -c \"DELETE FROM audit_event WHERE bucket='apisnoop' and job='live'; \""))
      (defun apisnoop/set-resource-name ()
        "Replace instances of RESOURCENAME with inputted resource name.
         This will save your new resource name, so you can run this mulitple times,
         changing from current resource name to new resource name each time."
        (interactive)
        (let ((from-string RESOURCENAME)
              (to-string (read-string "Enter new resource: ")))
          (save-excursion
            (progn
              (goto-char (point-min))
              (replace-string from-string to-string)
              (setq-local RESOURCENAME to-string)
              (message (concat
                        "Replaced all instances of "
                        from-string
                        " to "
                        to-string))))))
      (defun apisnoop/get-mock-test-value ()
        "grabs value from code block title 'Mock Test In Go"
        (save-excursion
          (let* ((mock-test (car (org-element-map (org-element-parse-buffer) 'src-block
                                   (lambda (src-block)
                                     (let ((name (org-element-property :name src-block))
                                           (value (org-element-property :value src-block)))
                                       (if (and (stringp name) (string= name "Mock Test In Go"))
                                           value))))))
                 (separator "// TEST \\(BEGINS\\|ENDS\\) HERE")
                 (good-stuff (cadr (s-split separator  mock-test))))
            good-stuff)))
      (defun apisnoop/format-nil-errors (mock-test)
        "Formats general purpose errors (when err != null) to fit within ginkgo framework"
        (let* ((match " *if err != nil {\n *fmt.Println(err, \"[a-z A-Z]*\")\n *return\n *}")
               (g-pre (s-concat (s-repeat 7 " ") "framework.ExpectNoError\(")))
          (replace-regexp-in-string match
                                    (lambda (match)
                                      (save-match-data
                                        (let* ((err (cadr (s-split "[()]" match)))
                                               (g-err (s-concat g-pre err "\)")))
                                          g-err)))
                                    mock-test)))
      (defun apisnoop/format-eq-errors (mock-test)
        "Formats equality comparison errors (podA != podB) to fit within ginkgo framework"
        (let* ((match "if \\([a-zA-Z0-9.,']+\\) != \\([a-zA-Z-0-9.,']+\\) *{\n *fmt.Println(\"[a-z A-Z]*\")\n[\t| ]+return\n *}")
               (g-pre "framework.ExpectEqual\("))
          (replace-regexp-in-string match
                                    (lambda (match)
                                      (save-match-data
                                        (let* ((comparisons (s-split " *!= *"(s-chop-prefix "if "(s-trim(car(s-slice-at "{" match))))))
                                               (c1 (car comparisons))
                                               (c2 (cadr comparisons))
                                               (err (cadr(s-split "[()]" match)))
                                               (g-err (s-concat g-pre c1 ", " c2 ", " err "\)")))
                                          g-err)))
                                    mock-test)))
      (defun apisnoop/format-comp-errors (mock-test)
        "Formats numeric comparison errors (podA >= podB etc) to fit within ginkgo framework"
        (let* ((match " *if \\([a-zA-Z0-9.]+\\) *\\(==\\|>=\\|<=\\|>\\|<\\) *[0-9]+ *{\n[ \ta-zA-Z()\".,'!\n]*}")
               (g-pre "       framework.Expect\("))
          (replace-regexp-in-string match
                                    (lambda (match)
                                      (save-match-data
                                        (let* ((comparison (s-chop-prefix "if "(s-trim(car(s-slice-at "{" match)))))
                                               (err (cadr(s-split "[()]" match)))
                                               (g-err (s-concat g-pre comparison ", true, " err "\)")))
                                          g-err)))
                                    mock-test)))
      (defun apisnoop/mock->ginkgo-test ()
        "Takes the contents of the code block named 'Mock Test in Go' and runs it through a set of conversions so its body closer matches the ginkgo test framework.  It inputs this new code block beneath the heading named 'Ginkgo Test'.

This function assumes you have the appropriately named code block and heading, which, if you used our mock-template, you do.  For more details on writing a mock-test to be easier to convert to ginkgo, check out our docs page: docs/writing-a-mock-test.org"
        (interactive)
        (save-excursion
          (let* ((mock-test (apisnoop/get-mock-test-value))
                 (ginkgo-test (-> mock-test
                                  apisnoop/format-nil-errors
                                  apisnoop/format-eq-errors
                                  apisnoop/format-comp-errors))
                 (src-code-block (concat "#+NAME: Ginkgo Test\n"
                                         "#+begin_src go\n"
                                         (s-trim-right ginkgo-test)
                                         "\n#+end_src\n")))
            (goto-char (org-find-entry-with-id "gt001z4ch1sc00l"))
            (goto-char (org-element-property :contents-begin (org-element-at-point)))
            (let ((first-element (org-element-at-point)))
              (when (eq 'property-drawer (car first-element))
                (goto-char (org-element-property :end first-element))))
            (insert  src-code-block))))
      (defun apisnoop/open-babel-dir ()
        "Copies the go.mod and go.sum files to the ob-go babel tmp"
        (interactive)
        (let ((babel-dir (concat org-babel-temporary-directory "/")))
          (find-file babel-dir)
          (message "Opened %s" babel-dir))
        )
      (defun apisnoop/go-mod-to-babel-dir ()
        "Copies the go.mod and go.sum files to the ob-go babel tmp"
        (interactive)
        (let ((babel-dir (concat org-babel-temporary-directory "/")))
          (copy-file "go.mod" babel-dir)
          (copy-file "go.sum" babel-dir)
          (message "Copied go.{mod,sum} to: %s" babel-dir))
        )
      ))))) ;; end org-mode eval progn
