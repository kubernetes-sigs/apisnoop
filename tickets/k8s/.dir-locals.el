((nil .
      ((eval .
             (defun apisnoop/insert-ticket-template ()
               "Inserts contents of current directory's ticket-template.org file into current buffer."
               (interactive)
               (let ((ticket-template "./ticket-template.org"))
                 (if (file-exists-p ticket-template)
                     (insert-file-contents ticket-template)
                   (message "No file named %s found in current directory" ticket-template)))))
       (eval .
             (defun apisnoop/delete-live-events ()
               "deletes all live events from audit_events table using psql.  Requires you to have already
                started up apisnoop."
               (interactive)
               (shell-command "psql -c \"DELETE FROM audit_event WHERE bucket='apisnoop' and job='live'; \"")))
       )))
