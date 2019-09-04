;;; Directory Local Variables
;;; For more information see (info "(emacs) Directory Variables")
(
 (org-mode
  (org-babel-tmate-session-prefix . "")
  (org-babel-tmate-default-window-name . "main")
  (org-confirm-babel-evaluate . nil)
  (org-use-property-inheritance . t)
  (org-file-dir . (file-name-directory buffer-file-name))
  ;; (sql-postgres-options . (list "-P pager=off --no-password"))
  ;; (sql-postgres-options . (list "-P" "pager=off" "--no-password"))
  ;; (sql-postgres-options . "-P pager=off --no-password")
  ;;'("-P" "pager=off" "--no-password"))
  (eval
   .
   (progn
     ;; (let ((socket-arg (concat ":socket " "FLOOPIE" ))))
     ;; (set (make-local-variable 'tmpdir)
     ;;      (make-temp-file (concat "/dev/shm/" user-buffer "-") t))
     (set (make-local-variable 'ssh-user)
          ;; "pair")
          user-login-name)
     ;; might be nice to set this as a global property in the org file
     (set (make-local-variable 'ssh-host)
          "sharing.io")
     (set (make-local-variable 'ssh-user-host)
          (concat ssh-user "@" ssh-host))
     (set (make-local-variable 'time-stamp-zone)
          "Pacific/Auckland")
     (set (make-local-variable 'time-stamp-pattern)
          ;; https://www.emacswiki.org/emacs/TimeStamp
          "10/#+UPDATED: needs time-local formatted regexp")
     (set (make-local-variable 'user-buffer)
          (concat user-login-name "." (file-name-base load-file-name)))
     (set (make-local-variable 'tmate-sh)
          (concat "/tmp/" user-buffer ".target.sh"))
     (set (make-local-variable 'socket)
          (concat "/tmp/" user-buffer ".target.iisocket"))
     (set (make-local-variable 'socket-param)
          (concat ":sockets " socket))
     (set (make-local-variable 'item-str)
          "(nth 4 (org-heading-components))")
     (set (make-local-variable 'togetherly-port)
          (+ (random 60000) 1024))
     (set (make-local-variable 'sql-sqlite-program)
          (executable-find "sqlite3"))
     (set (make-local-variable 'sql-connection-alist)
          (list
           (list 'raiinbow
                 (list 'sql-product '(quote sqlite))
                 ;; (list 'sql-user user-login-name)
                 ;; (list 'sql-user "apisnoop")
                 ;;(list 'sql-database user-login-name)
                 (list 'sql-database "raiinbow.sqlite")
                 ;;(list 'sql-port (+ (* (user-uid) 10) 1))
                 ;; (list 'sql-port (concat (number-to-string (user-uid)) "1"))
                 ;;(list 'sql-server "localhost")
                 ;; (list 'sql-server "172.17.0.1")
                 )
           (list 'apisnoop
                 (list 'sql-product '(quote postgres))
                 ;; (list 'sql-user user-login-name)
                 (list 'sql-user "apisnoop")
                 ;;(list 'sql-database user-login-name)
                 (list 'sql-database "apisnoop")
                 (list 'sql-port (+ (* (user-uid) 10) 1))
                 ;; (list 'sql-port (concat (number-to-string (user-uid)) "1"))
                 (list 'sql-server "localhost")
                 ;; (list 'sql-server "172.17.0.1")
            )
           ))
     (set (make-local-variable 'org-file-properties)
          (list
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
     (set (make-local-variable 'select-enable-clipboard) t)
     (set (make-local-variable 'select-enable-primary) t)
     (defun ii-org-confirm-babel-evaluate (lang body)
       nil ;; allow everything for now
       ;;(not (string= lang "ditaa"))  ;don't ask for ditaa
       )
     (set (make-local-variable 'org-confirm-babel-evaluate) #'ii-org-confirm-babel-evaluate)
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
      (set (make-local-variable 'start-tmate-for-togetherly-client)
          (let (
                (togetherly-socket (make-temp-file (concat "/tmp/" user-buffer "-")))
                )
            (concat
             "tmate -S "
             togetherly-socket
             " new-session -A -s "
             user-login-name
             " -n main "
             "\"tmate wait tmate-ready "
             "&& TMATE_CONNECT=\\$("
             "tmate display -p '#{tmate_ssh} # "
             user-buffer
             "."
             togetherly-socket
             ".TOGETHERLY # "
             ;; would like this to be shorter
             (concat
              (format-time-string "%Y-%m-%d %T")
              (funcall (lambda ($x) (format "%s:%s" (substring $x 0 3) (substring $x 3 5))) (format-time-string "%z")))
             " # #{tmate_web} ') "
             "; echo \\$TMATE_CONNECT "
             "; (echo \\$TMATE_CONNECT | xclip -i -sel p -f | xclip -i -sel c ) 2>/dev/null "
             "; echo Share this url with someone both be able to togethrly the same buffer. "
             "; read "
             "; emacs -nw --eval '\(togetherly-client-quick-start \"" (number-to-string togetherly-port) "\")'\""
             )
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
     ;; # eval: (set (make-local-variable 'ssh-user-host) (concat ssh-user "@" ssh-host))
     ;; # eval: (set (make-local-variable 'start-tmate-over-ssh-command) (concat "tmate -S " socket " new-session -A -s " user-login-name " -n main \\\"tmate wait tmate-ready \\&\\& tmate display -p \\'#{tmate_ssh}\\' \\| xclip -i -sel p -f \\| xclip -i -sel c \\&\\& bash --login\\\""))
     ;; # eval: (set (make-local-variable 'start-tmate-locally-command) (concat "tmate -S " socket " new-session -A -s " user-login-name " -n main \\\"tmate wait tmate-ready \\&\\& tmate display -p \\'#{tmate_ssh}\\' \\| xclip -i -sel p -f \\| xclip -i -sel c \\&\\& bash --login\\\""))
     ;; # eval: (xclip-mode 1) 
     ;; # eval: (gui-select-text (concat "ssh -tAX " ssh-user-host " -L " socket ":" socket " " start-tmate-over-ssh-command))
     (defun togetherly-server-start-now ()
       "Start a Togetherly server with this buffer."
       (interactive)
       (cond ((null togetherly--server)
              (let* ((addr "127.0.0.1")
                     (server-port togetherly-port)
                     (server-name user-login-name)
                     (server-proc (make-network-process
                                   :name "togetherly-server" :server t
                                   :service server-port :noquery t :host addr
                                   :sentinel 'togetherly--server-sentinel-function
                                   :filter 'togetherly--server-filter-function))
                     (rcolor (car togetherly-region-colors))
                     (pcolor (car togetherly-cursor-colors)))
                (setq togetherly-region-colors   (cdr togetherly-region-colors)
                      togetherly-cursor-colors   (cdr togetherly-cursor-colors)
                      togetherly--server         `(,server-proc ,server-name ,rcolor . ,pcolor)
                      togetherly--server-buffer  (current-buffer)
                      togetherly--server-clients nil
                      togetherly--server-timer-object
                      (run-with-timer nil togetherly-cursor-sync-rate
                                      'togetherly--server-broadcast-cursor-positions))
                (set (make-local-variable 'header-line-format)
                     (concat " " (propertize server-name 'face `(:background ,pcolor)))))
              (add-hook 'before-change-functions 'togetherly--server-before-change nil t)
              (add-hook 'after-change-functions 'togetherly--server-after-change nil t)
              (add-hook 'kill-buffer-query-functions 'togetherly--server-kill-buffer-query)
              (populate-x-togetherly) ;; go ahead and create the tmate paste for the togetherly
              )
             ((y-or-n-p "Togetherly server already started. Migrate to this buffer ? ")
              (set (make-local-variable 'header-line-format)
                   (buffer-local-value 'header-line-format togetherly--server-buffer))
              (add-hook 'before-change-functions 'togetherly--server-before-change nil t)
              (add-hook 'after-change-functions 'togetherly--server-after-change nil t)
              (with-current-buffer togetherly--server-buffer
                (remove-hook 'before-change-functions 'togetherly--server-before-change t)
                (remove-hook 'after-change-functions 'togetherly--server-after-change t)
                (kill-local-variable 'header-line-format))
              (setq togetherly--server-buffer (current-buffer))
              (togetherly--server-broadcast `(welcome ,(togetherly--buffer-string) . ,major-mode))
              )
             (t
              (message "Togetherly: Canceled."))))
     (defun populate-x-togetherly ()
       "Populate the clipboard with the command for a together client"
       (interactive)
       (message "Setting X Clipboard to contain the start-tmate command")
       (xclip-mode 1)
       (gui-select-text start-tmate-for-togetherly-client)
       )
     (defun runs-and-exits-zero (program &rest args)
       "Run PROGRAM with ARGS and return the exit code."
       (with-temp-buffer
         (if (= 0 (apply 'call-process program nil (current-buffer) nil args))
             'true
           ))
       )
     (defun xclip-working ()
       "Quick Check to see if X is working."
       (if (getenv "DISPLAY")
           ;; this xset test is a bit flakey
           ;; (if (runs-and-exits-zero "xset" "q")
               ;; Using xclip to set an invalid selection is as lightly intrusive
               ;; check I could come up with, and not overwriting anything
               ;; however it seems to hang
               ;; (if (runs-and-exits-zero "xclip" "-selection" "unused")
               ;;     'true)
               'true
             ;; )
         )
       )
     (defun create-target-script (filename command)
       "Create a temporary script to create/connect to target tmate window"
       (message "Creating a script file in tmp")
       (with-current-buffer (find-file-noselect filename)
         (erase-buffer)
         (insert-for-yank
          (concat "\n#!/bin/sh\n\n" command))
         (save-buffer)
         (set-file-modes filename #o755)
         )
       )
     (defun populate-terminal-clipboard ()
       "Populate the osc52 clipboard via terminal with the start-tmate-sh"
       ;; TODO
       (message "Unable to set X Clipboard to contain the start-tmate-sh")
       (create-target-script tmate-sh start-tmate-command)
       ;; (gui-select-text tmate-sh)
       (setq current-tmate-sh tmate-sh) ;; since tmate-sh is buffer-local..
       ;;(setq current-tmate-ssh (concat "export IISOCK=" socket " ; rm -f $IISOCK ; ssh -tAX " ssh-user-host " -L $IISOCK:$IISOCK " tmate-sh))
       (setq current-tmate-ssh (concat "ssh -tAX " ssh-user-host " " tmate-sh))

       (with-current-buffer (get-buffer-create "start-tmate-sh" )
         (insert-for-yank "You will need to copy this manually:\n\n" )
         (insert-for-yank
          (concat "\nTo open on another host, forward your iisocket by pasting:\n\n" current-tmate-ssh
                  "\n\nOR open another terminal on the same host and paste:\n\n" current-tmate-sh)
          ))
       )
     (defun populate-x-clipboard ()
       "Populate the X clipboard with the start-tmate-sh"
       (message "Setting X Clipboard to contain the start-tmate-sh")
       (xclip-mode 1)
       ;; (gui-select-text (concat "rm -fi " socket "; ssh -tAX " ssh-user "@" ssh-host " -L " socket ":" socket " " start-tmate-over-ssh-command))
       (create-target-script tmate-sh start-tmate-command)
       ;; (gui-select-text tmate-sh)
       ;; If we work to detect if it's a remote host, this might make sense
       ;; but for now we mostly connect to the pair box
       ;; (setq current-tmate-ssh (concat "export II=" socket " ; rm -f $II ; ssh -tAX " ssh-user-host " -L $II:$II " tmate-sh))
       (setq current-tmate-sh tmate-sh) ;; since tmate-sh is buffer-local..
       (setq current-tmate-ssh (concat "ssh -tAX " ssh-user-host " " tmate-sh))
       (gui-select-text current-tmate-ssh)
       ; (gui-select-text start-tmate-command)
       (xclip-mode 0)
       (with-current-buffer (get-buffer-create "start-tmate-sh")
         (insert-for-yank "The following has been populated to your local X clipboard:\n")
         (insert-for-yank
          ;; we can use the global current-tmate-sh
          (concat "\nTo open on another host, forward your iisocket by pasting:\n\n" current-tmate-ssh
                  "\n\nOR open another terminal on the same host and paste:\n\n" current-tmate-sh)
          ))
       ;; and unset it when done
       (setq current-tmate-ssh nil)
       (setq current-tmate-sh nil)
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
     ;; needs to be global, so it's availabel to the other buffer
     ;; (setq tmate-command start-tmate-command)
     ;; (setq tmate-command start-tmate-over-ssh-command)

     ;; (setq tmate-command start-tmate-sh-over-ssh-command)
     ;; (setq tmate-command tmate-sh)
     ;; (setq tmate-command tmate-sh)
     ;; (with-current-buffer (get-buffer-create "start-tmate-sh")
     ;;   (insert-for-yank
     ;;    (concat "\nOpen another terminal on the same host and paste:\n\n" tmate-sh)
     ;;    ))
     (switch-to-buffer "start-tmate-sh")
     (y-or-n-p "Have you Pasted?")
     ;; https://www.wisdomandwonder.com/article/10630/how-fast-can-you-tangle-in-org-mode
     (setq help/default-gc-cons-threshold gc-cons-threshold)
     (defun help/set-gc-cons-threshold (&optional multiplier notify)
       "Set `gc-cons-threshold' either to its default value or a
   `multiplier' thereof."
       (let* ((new-multiplier (or multiplier 1))
              (new-threshold (* help/default-gc-cons-threshold
                                new-multiplier)))
         (setq gc-cons-threshold new-threshold)
         (when notify (message "Setting `gc-cons-threshold' to %s"
                               new-threshold))))
     (defun help/double-gc-cons-threshold () "Double `gc-cons-threshold'." (help/set-gc-cons-threshold 2))
     (add-hook 'org-babel-pre-tangle-hook #'help/double-gc-cons-threshold)
     (add-hook 'org-babel-post-tangle-hook #'help/set-gc-cons-threshold)
     ;; info:org#Conflicts for org 9 and very recent yas
     (defun yas/org-very-safe-expand ()
       (let ((yas/fallback-behavior 'return-nil)) (yas/expand)))

     (yas/expand)
     (make-variable-buffer-local 'yas/trigger-key)
     (setq yas/trigger-key [tab])
     (add-to-list 'org-tab-first-hook 'yas/org-very-safe-expand)
     (define-key yas/keymap [tab] 'yas/next-field)
     ;; (edebug-trace "TRACING socket:%S" socket)
     ;; (edebug-trace "TRACING org-babel-header-args:tmate %S" org-babel-header-args:emacs-lisp)
     ;; we could try and create a buffer / clear it on the fly
     ;; ssh later? 
     ;; (with-current-buffer (get-buffer-create "start-tmate-command")
     ;;   (insert-for-yank
     ;;    (concat "\nOpen another terminal on the same host and paste:\n\n" tmate-command)
     ;;    ))
     ;; FIXME! How do we find out what our local filname is?
     ;; This was designed for dir-locals... can we reach in?
     ;; (switch-to-buffer (get-buffer buffer-file-name))
     ;; (spacemacs/toggle-maximize-buffer)
     ;; set up publishing
     (require 'ox-publish)
     (require 'org-checklist)
     (setq org-publish-project-alist
           '(
             ("org-reports"
              :base-directory "~/ii/apisnoop_v3/org/reports/"
              :base-extension "org"
              :publishing-directory "~/ii/apisnoop_v3/www/"
              :recursive t
              :publishing-function org-html-publish-to-html
              :headline-levels 4 ; Just the default for this project.
              :auto-preamble t
              :auto-sitemap t                ; Generate sitemap.org automagically...
              :sitemap-filename "sitemap.org"  ; ... call it sitemap.org (it's the default)...
              :sitemap-title "Sitemap"         ; ... with title 'Sitemap'.

              )
             ("org-static"
              :base-directory "~/ii/apisnoop_v3/org/reports/"
              :base-extension "css\\|js\\|png\\|jpg\\|gif\\|pdf\\|mp3\\|ogg\\|swf"
              :publishing-directory "~/ii/apisnoop_v3/www/"
              :recursive t
              :publishing-function org-publish-attachment
              )
             ("reports" :components ("org-reports" "org-static"))
             ))

     )
   )
  )
 )
;; Add Later
;; https://www.emacswiki.org/emacs/AutomaticFileHeaders #templates / updates etc
;; ^^ based on https://www.emacswiki.org/emacs/download/header2.el
;; ;; https://stackoverflow.com/questions/13228001/org-mode-nested-properties
;; https://www.reddit.com/r/emacs/comments/4154bu/how_to_get_orgmode_to_recognize_markdownstyle/
;; ^^ https://www.reddit.com/r/emacs/comments/4154bu/how_to_get_orgmode_to_recognize_markdownstyle/cz0bb45/
;;http://endlessparentheses.com/markdown-style-link-ids-in-org-mode.html
