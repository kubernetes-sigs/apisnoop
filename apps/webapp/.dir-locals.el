((nil .
      (
       (eval .
             (defun my-setup-indent (n)
               ;; java/c/c++
               (setq-local standard-indent n)
               (setq-local c-basic-offset n)
               ;; web development
               (setq-local javascript-indent-level n) ; javascript-mode
               (setq-local js-indent-level n) ; js-mode
               (setq-local react-indent-level n) ; react-mode
               (setq-local js2-basic-offset n) ; js2-mode, in latest js2-mode, it's alias of js-indent-level
               (setq-local web-mode-attr-indent-offset n) ; web-mode
               (setq-local web-mode-code-indent-offset n) ; web-mode, js code in html file
               (setq-local web-mode-css-indent-offset n) ; web-mode, css in html file
               (setq-local web-mode-markup-indent-offset n) ; web-mode, html tag in html file
               (setq-local web-mode-sql-indent-offset n) ; web-mode
               (setq-local web-mode-attr-value-indent-offset n) ; web-mode
               (setq-local css-indent-offset n) ; css-mode
               (setq-local sh-basic-offset n) ; shell scripts
               (setq-local sh-indentation n)))

       (eval .
             (defun my-personal-code-style ()
               (interactive)
               (message "My personal code style!")
               ;; use space instead of tab
               (setq indent-tabs-mode nil)
               ;; indent 2 spaces width
               (my-setup-indent 2)))
       (eval . (add-hook 'css-mode-hook 'my-personal-code-style))
       (eval . (add-hook 'js2-mode-hook 'my-personal-code-style))
       (eval . (add-hook 'js-mode-hook 'my-personal-code-style))
       (eval . (add-hook 'web-mode-hook 'my-personal-code-style)))))
