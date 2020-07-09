((
  org-mode .((eval
              . (progn
                     (setq org-babel-default-header-args:sql-mode
                           ;; Set up all sql-mode blocks to be postgres and literate
                           '((:results . "replace code")
                             (:product . "postgres")
                             (:noweb . "yes")
                             (:comments . "no")
                             (:wrap . "SRC example"))))))))
