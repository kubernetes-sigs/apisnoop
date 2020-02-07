if [ -z "${debian_chroot:-}" ] && [ -r /etc/debian_chroot ]; then
    debian_chroot=$(cat /etc/debian_chroot)
fi

case "$TERM" in
    xterm-color|*-256color) color_prompt=yes;;
esac

if [ "$color_prompt" = yes ]; then
    PS1='${debian_chroot:+($debian_chroot)}\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ '
else
    PS1='${debian_chroot:+($debian_chroot)}\u@\h:\w\$ '
fi
unset color_prompt force_color_prompt

if [ -f ~/.bash_aliases ]; then
    . ~/.bash_aliases
fi

if [ -d "$HOME/go/bin" ]; then
    export PATH=$PATH:"$HOME/go/bin"
fi
export PATH=$PATH:"/usr/local/go/bin"

if [ ! -n "$SSH_AUTH_SOCK" ] && [ -n "$(find /tmp -maxdepth 1 -name 'ssh-*' -print -quit)" ] ; then
    sudo chgrp -R users /tmp/ssh-*
    sudo chmod -R 0770 /tmp/ssh-*
    export SSH_AUTH_SOCK=$(find /tmp /run/host/tmp/ -type s -regex '.*/ssh-.*/agent..*$' 2> /dev/null | tail -n 1)
fi

function k8s_e2e_it() {
    set -x
    if [ -z "\$1" ]; then
        echo "No test provided";
        return 1;
    fi;
    if [ -f "\$HOME/go/src/k8s.io/kubernetes/_output/bin/e2e.test" ] || [ "$USE_MAKE" ]; then
        BIN="\$HOME/go/src/k8s.io/kubernetes/_output/bin/e2e.test";
    elif [ -f "\$HOME/go/src/k8s.io/kubernetes/bazel-bin/test/e2e/e2e.test" ] || [ "$USE_BAZEL" ]; then
        BIN="\$HOME/go/src/k8s.io/kubernetes/bazel-bin/test/e2e/e2e.test";
    fi;
    cd ~/go/src/k8s.io/kubernetes;
    (
        export KUBECONFIG="\$HOME/.kube/config";
        time "\$BIN" --ginkgo.focus="$1" -v=2 --provider=skeleton
    ) 2>&1;
}

export TZ="Pacific/Auckland"
export EDITOR=vim

