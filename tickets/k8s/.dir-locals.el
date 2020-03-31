((org-mode .
      ((eval .
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
       )))
