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
                    "Replace instances of goback with inputted resource name."
                    (interactive)
                    (let ((from-string RESOURCENAME)
                          (to-string (read-string "Enter new resource: ")))
                      (save-excursion
                        (progn
                          (goto-char (point-min))
                          (replace-string from-string to-string)
                          (setq-local RESOURCENAME to-string)
                          (message (concat "Replaced all instances of " from-string " to " to-string))))))))))
