((org-mode .
           (
            (eval . (setq-local RESOURCENAME "RESOURCENAME"))
            (eval .
                  (defun apisnoop/insert-mock-template ()
                    "Inserts contents of current directory's mock-template.org file into current buffer."
                    (interactive)
                    (let ((mock-template "./mock-template.org"))
                      (if (file-exists-p mock-template)
                          (progn (insert-file-contents mock-template)
                                 (normal-mode))
                        (message "No file named %s found in current directory" mock-template)))))
            (eval .
                  (defun apisnoop/delete-live-events ()
                    "deletes all live events from audit_events table using psql.  Requires you to have already
                started up apisnoop."
                    (interactive)
                    (shell-command "psql -c \"DELETE FROM audit_event WHERE bucket='apisnoop' and job='live'; \"")))
            (eval .
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
                                    to-string)))))))
            (eval .
                  (defun apisnoop/get-mock-test-value ()
                    "grabs value from code block title 'Mock Test In Go"
                    (save-excursion
                      (let((mock-test (car (org-element-map (org-element-parse-buffer) 'src-block
                                             (lambda (src-block) 
                                               (let ((name (org-element-property :name src-block))
                                                     (value (org-element-property :value src-block)))
                                                 (if (and (stringp name) (string= name "Mock Test In Go"))
                                                     value)))))))
                        mock-test))))
            (eval .
                  (defun apisnoop/format-error-message (match)
                    "Given a src block with an error message contained in the first set of parentheses, extract just the error message, and format it as a ginkgo ExpectNoError message"
                      (save-match-data
                        (let* ((err (cadr (s-split "[()]" match)))
                               (g-pre (s-concat (s-repeat 7 " ") "framework.ExpectNoError\("))
                               (g-err (s-concat g-pre err "\)")))
                          g-err))))
            (eval .
                  (defun apisnoop/create-named-src-block (name lang body)
                    "Generates org-mode src-block string, with given name, code language, and src-block body."
                    (let* ((NAME (concat "#+NAME: " name "\n"))
                           (BEGIN (concat "#+begin_src " lang "\n"))
                           (END "#+end_src\n"))
                      (concat NAME BEGIN body END))))
            (eval .
                  (defun apisnoop/mock->ginkgo-test ()
                    "Takes the contents of the code block named 'Mock Test in Go' and runs it through a set of conversions so its body closer matches the ginkgo test framework.  It inputs this new code block beneath the heading named 'Ginkgo Test'.

This function assumes you have the appropriately named code block and heading, which, if you used our mock-template, you do.  For more details on writing a mock-test to be easier to convert to ginkgo, check out our docs page: docs/writing-a-mock-test.org"
                    (interactive)
                    (save-excursion
                      (let* ((mock-test (apisnoop/get-mock-test-value)) 
                             (match " *if err != nil {\n *fmt.Println(err, \"[a-z A-Z]*\")\n *return\n *}")
                             (gingko-test (replace-regexp-in-string match (apisnoop/format-error-message match) mock-test))
                             (src-code-block (apisnoop/create-named-src-block "Ginkgo Test" "go" gingko-test)))
                        (goto-char (org-find-entry-with-id "gt001"))
                        (goto-char (org-element-property :contents-begin (org-element-at-point)))
                        (let ((first-element (org-element-at-point)))
                          (when (eq 'property-drawer (car first-element))
                            (goto-char (org-element-property :end first-element))))
                        (insert  src-code-block)))
                    )))))
