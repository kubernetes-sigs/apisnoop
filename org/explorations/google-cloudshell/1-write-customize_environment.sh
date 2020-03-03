cat << EOL > ~/.customize_environment
#!/bin/bash

DEVSHELL_USER=\${DEVSHELL_USER-$USER}

env | sort

# Remove all versions of emacs
sudo apt-get install -y inotify-tools
sudo apt-get purge -y emacs emacsen-common
# Setup emacs-snapshot
echo "deb http://londo.ganneff.de stretch main" | sudo tee /etc/apt/sources.list.d/emacs.list
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys AD287B4E92138B93
sudo apt-get update
sudo apt-get install -y tmate rsync || true
sudo apt autoremove -y emacs*
sudo mv /etc/apt/sources.list /etc/apt/sources.list.bak
sudo su -c 'echo "deb http://ftp.debian.org/debian buster main" >> /etc/apt/sources.list.d/buster-src.list'
sudo apt update
sudo apt install -y emacs
sudo mv /etc/apt/sources.list /etc/apt/sources.list.bak
sudo apt update

sudo wget -O go.tgz "https://golang.org/dl/go1.13.4.linux-amd64.tar.gz"
sudo su -c 'echo "692d17071736f74be04a72a06dab9cac1cd759377bd85316e52b2227604c004c  go.tgz" | sha256sum -c -' || exit 1
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf go.tgz
sudo rm go.tgz

# some homefolder setup
touch /home/\$DEVSHELL_USER/.ssh/authorized_keys

# Recursively clone .emacs.d
if [ ! -d /home/\$DEVSHELL_USER/.emacs.d ]; then
   echo SettingUp iimacs: /home/\$DEVSHELL_USER/.emacs.d already
   su -c "git clone --recursive https://github.com/iimacs/.emacs.d /home/\$DEVSHELL_USER/.emacs.d" \$DEVSHELL_USER
   # A cache of packages that are usually required...
   # speeds up first load
   curl https://storage.googleapis.com/apisnoop/dev/iimacs-cloudshell-cache.tgz | su -c "tar xzfC - /home/\$DEVSHELL_USER/.emacs.d" \$DEVSHELL_USER
   mv /home/\$DEVSHELL_USER/.emacs.d/.spacemacs-hh \
      /home/\$DEVSHELL_USER/.emacs.d/.spacemacs-alpha
else
   echo /home/\$DEVSHELL_USER/.emacs.d already exists
fi
# tmate needs a .ssh/ private key... unsure why
if [ ! -d /home/\$DEVSHELL_USER/.ssh ]; then
   mkdir -p /home/\$DEVSHELL_USER/.ssh
   chown \$DEVSHELL_USER /home/\$DEVSHELL_USER/.ssh
   chmod go-rwx /home/\$DEVSHELL_USER/.ssh
fi
if [ ! -f /home/\$DEVSHELL_USER/.ssh/id_rsa ]; then
   su -c "ssh-keygen -f /home/\$DEVSHELL_USER/.ssh/id_rsa -t rsa -N ''" \$DEVSHELL_USER
else
   echo /home/\$DEVSHELL_USER/.ssh/id_rsa already exists!
fi

# tmux/tmate escape-time makes it hard to use emacs
if [ ! -f /home/\$DEVSHELL_USER/.tmux.conf ]; then
   echo Setting up tmux
   # echo set -s escape-time 0 > su -c "tee /home/\$DEVSHELL_USER/.tmux.conf"
   echo "set -s escape-time 0" >> "/home/\$DEVSHELL_USER/.tmux.conf"
fi

echo "unset TMUX" >> /home/\$DEVSHELL_USER/.bashrc

#ls -a | grep -v .customize_environment | tail +3 | xargs -n 1 rm  -rf
wall ".customize_environment is complete"
EOL
