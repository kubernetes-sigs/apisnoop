export PATH=$PATH:/usr/local/go/bin
[ "$BASH_VERSION" != "" ] || [ "$ZSH_VERSION" != "" ] || return 0
[ "$PS1" != "" ] || return 0
[ "$IS_TOOLBOX" = true ] || return 0

toolbox_config="$HOME/.config/toolbox"
host_welcome_stub="$toolbox_config/host-welcome-shown"
toolbox_welcome_stub="$toolbox_config/toolbox-welcome-shown"

# shellcheck disable=SC1091
. /usr/lib/os-release

if [ -f /run/.containerenv ] || [ -f /.dockerenv ] \
    && [ -f /run/.toolboxenv ]; then
    if [ -n "$SSH_AUTH_SOCK" ]; then
        export SSH_AUTH_SOCK=$(find /tmp /run/host/tmp/ -type s -regex '.*/ssh-.*/agent..*$' 2> /dev/null | tail -n 1)
    fi
    PS1=$(printf "\[\033[35m\]⬢\[\033[0m\]%s" "[\u@\h \W]\\$ ")

    if ! [ -f "$toolbox_welcome_stub" ]; then
        echo ""
        echo "Welcome to the iitoolbox; a container where you can install and run"
        echo "all your tools."
        echo ""
        echo " - Use APT in the usual manner to install command line tools"
        echo " - emacs is installed and ready-to-go with spacemacs"
        echo " - To create a new tools container, run 'toolbox create'"
        echo ""
        printf "For more information, see "
        # shellcheck disable=SC1003
        printf '\033]8;;https://gitlab.ii.coop/ii/tooling/iitoolbox\033]8;;\033\\'
        printf '\033]8;;https://docs.fedoraproject.org/en-US/fedora-silverblue/toolbox/\033\\documentation\033]8;;\033\\'
        printf ".\n"
        echo ""

        mkdir -p "$toolbox_config"
        touch "$toolbox_welcome_stub"
    fi
fi

unset toolbox_config
unset host_welcome_stub
unset toolbox_welcome_stub
