(
 (org-mode
  (eval
   .
   (progn
     (set (make-local-variable 'ssh-user)
          ;; "pair")
          user-login-name)
     ;; might be nice to set this as a global property in the org file
     (set (make-local-variable 'ssh-host)
          "sharing.io")
     (set (make-local-variable 'ssh-user-host)
          (concat ssh-user "@" ssh-host))

     (set (make-local-variable 'item-str)
          "(nth 4 (org-heading-components))")
     (set (make-local-variable 'user-buffer)
          (concat user-login-name "." (file-name-base load-file-name)))
     (set (make-local-variable 'tmate-sh)
          (concat "/tmp/" user-buffer ".target.sh"))
     (set (make-local-variable 'socket)
          (concat "/tmp/" user-buffer ".target.iisocket"))
     (set (make-local-variable 'socket-param)
          (concat ":sockets " socket))
     (set (make-local-variable 'sql-sqlite-program)
          (executable-find "sqlite3"))
     (set (make-local-variable 'select-enable-clipboard) t)
     (set (make-local-variable 'select-enable-primary) t)
     (set (make-local-variable 'sql-connection-alist)
          (list
           (list 'raiinbow
                 (list 'sql-product '(quote sqlite))
                 (list 'sql-database "raiinbow.sqlite")
                 )
           (list 'apisnoop
                 (list 'sql-product '(quote postgres))
                 (list 'sql-user "apisnoop")
                 (list 'sql-database "apisnoop")
                 (list 'sql-port (+ (* (user-uid) 10) 1))
                 (list 'sql-server "localhost")
                 ;; (list 'sql-user user-login-name)
                 ;;(list 'sql-database user-login-name)
                 ;; (list 'sql-port (concat (number-to-string (user-uid)) "1"))
                 )
           ))
     (set (make-local-variable 'start-tmate-command)
          (concat
           "tmate -S "
           socket
           " new-session -A -s "
           user-login-name
           " -n main "
           "\"tmate wait tmate-ready "
           "&& TMATE_CONNECT=\\$("
           "tmate display -p '#{tmate_ssh} # "
           user-buffer
           ".target # "
           ;; would like this to be shorter
           (concat
            (format-time-string "%Y-%m-%d %T")
            (funcall (lambda ($x) (format "%s:%s" (substring $x 0 3) (substring $x 3 5))) (format-time-string "%z")))
           " # #{tmate_web} ') "
           "; echo \\$TMATE_CONNECT "
           "; (echo \\$TMATE_CONNECT | xclip -i -sel p -f | xclip -i -sel c ) 2>/dev/null "
           "; echo Share the above with your friends and hit enter when done. "
           "; read "
           "; bash --login\""
           )
          )
     ;; at some point we can bring back working on remote hosts
     (set (make-local-variable 'start-tmate-over-ssh-command)
          (concat
           "tmate -S "
           socket
           " new-session -A -s "
           user-login-name
           " -n main "
           "\"tmate wait tmate-ready "
           "\\&\\& TMATE_CONNECT=\\$\\("
           "tmate display -p '#{tmate_ssh} # "
           user-buffer
           ".target # "
           (concat
            (format-time-string "%Y-%m-%d %T")
            (funcall (lambda ($x) (format "%s:%s" (substring $x 0 3) (substring $x 3 5))) (format-time-string "%z")))
           " #{tmate_web} '\\) "
           "; echo \\$TMATE_CONNECT "
           "; \\(echo \\$TMATE_CONNECT \\| xclip -i -sel p -f \\| xclip -i -sel c \\) 2>/dev/null "
           "; echo Share the above with your friends and hit enter when done. "
           "; read "
           "; bash --login\""
           )
          )
     (set (make-local-variable 'org-file-properties)
          (list
           (cons 'header-args:tmate
                 (concat
                  ":noweb yes"
                  " :noweb-ref " item-str
                  " :comments org"
                  " :eval never-export"
                  " :results silent "
                  " :session (concat user-login-name \":main\" )"
                  ;; " :session (concat user-login-name \":\" " item-str ")"
                  " :socket " socket
                  " :window " user-login-name
                  " :terminal sakura"
                  " :exports code"
                  ;; If you want each tmate command to run from a particular directory
                  ;; " :prologue (concat \"cd \" ssh-dir \"\n\")"
                  ;; " :prologue (concat "cd " org-file-dir "\n") ))
                  ))
           (cons 'header-args:sql-mode
                 (concat
                  ":noweb yes"
                  " :noweb-ref " item-str
                  " :comments org"
                  " :eval never-export"
                  " :results code"
                  " :product postgres"
                  " :session data"
                  ;; " :session (symbol-value user-login-name)"
                  ;; " :session (concat user-login-name \":\" " "main" ")"
                  ;; " :session (concat user-login-name \":\" " item-str ")"
                  " :exports both"
                  ))
           (cons 'header-args:emacs-lisp
                 (concat
                  ":noweb yes"
                  " :noweb-ref " item-str
                  " :comments org"
                  " :eval never-export"
                  " :results code"
                  " :exports both"
                  ))
           (cons 'header-args:elisp
                 (concat
                  ":noweb yes"
                  " :noweb-ref " item-str
                  " :comments org"
                  " :eval never-export"
                  " :results code"
                  " :exports both"
                  ))
           (cons 'header-args:bash
                 (concat
                  ":noweb yes"
                  " :noweb-ref " item-str
                  " :comments org"
                  " :eval never-export"
                  " :results output code verbatis replace"
                  " :exports both"
                  " :wrap EXAMPLE"
                  ;; This can help catch stderr and other issues
                  ;; " :prologue \"exec 2>&1\n\""
                  ;; " :epilogue \":\n\""
                  ;; " :prologue exec 2>&1\n(\n"
                  ;; " :epilogue )\n:\n"
                  ;; If you want commands executing over tramp
                  ;; " :dir (symbol-value 'tmpdir)"
                  ;; " :dir (concat \"ssh:\" ssh-user \"@\" ssh-host \":~\""
                  ;; " :dir (concat \"ssh:\" ssh-user \"@\" ssh-host \":~\""
                  ;; If you want to feed an application via HEREDOC
                  ;;   :PROPERTIES:
                  ;; " :prologue exec 2>&1\nbq query -n 2000 --nouse_legacy_sql  <<EOF\n"
                  ;; " :epilogue "\nEOF\n:\n"
                  ))
           (cons 'header-args:shell
                 (concat
                  ":noweb yes"
                  " :noweb-ref " item-str
                  " :comments org"
                  " :eval never-export"
                  " :results output code verbatis replace"
                  " :exports both"
                  " :wrap EXAMPLE"
                  ))
           (cons 'header-args:json
                 (concat
                  ":noweb yes"
                  " :comments org"
                  " :noweb-ref " item-str
                  " :exports both"
                  ))
           (cons 'header-args:yaml
                 (concat
                  ":noweb yes"
                  " :comments org"
                  " :noweb-ref " item-str
                  " :exports both"
                  ))
           )
          )
     ;; (message tmate-sh-sh)
     ;; For testing / setting DISPLAY to something else
     ;; (getenv "DISPLAY")
     ;; (setenv "DISPLAY" ":0")
     ;; As we start on other OSes, we'll need to copy this differently
     (if (xclip-working)
         (populate-x-clipboard)
       (populate-terminal-clipboard)
       )
     (switch-to-buffer "start-tmate-sh")
     (y-or-n-p "Have you Pasted?")
          ))))
