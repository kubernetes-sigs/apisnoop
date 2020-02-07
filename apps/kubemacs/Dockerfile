# "iimacs" Add "Spacemacs" layer, supporting files and "ii" user
# Version 0.2 Jan 2020

FROM ubuntu:eoan-20200114

RUN apt-get update && \
    apt-get upgrade -y

ADD profile.d-iitoolbox.sh /etc/profile.d/iitoolbox.sh

RUN mkdir -p /etc/sudoers.d && \
    echo "%sudo    ALL=(ALL:ALL) NOPASSWD: ALL" > /etc/sudoers.d/sudo

# install some useful packages
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y emacs-nox sudo wget curl acl docker apt-transport-https zsh sqlite3 apt-utils apt-file rsync inotify-tools jq vim xtermcontrol tzdata gnupg2 software-properties-common build-essential silversearcher-ag ripgrep psmisc git docker.io apache2-utils

# install Kubernetes client and Google Cloud SDK
RUN echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list && \
	curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key --keyring /usr/share/keyrings/cloud.google.gpg add - && \
	apt-get update && \
	DEBIAN_FRONTEND=noninteractive apt-get install -y kubectl google-cloud-sdk

# install golang
RUN cd /tmp && \
  wget https://dl.google.com/go/go1.13.4.linux-amd64.tar.gz && \
  tar -C /usr/local -xvf /tmp/go1.13.4.linux-amd64.tar.gz

ENV GOROOT=/usr/local/go \
  PATH=$PATH:/usr/local/go/bin
# gopls, gocode, and others needed for dev will install into /usr/local/bin
RUN GOPATH=/usr/local go get -u -v github.com/nsf/gocode && rm -rf /root/.cache /usr/local/pkg /usr/local/src
RUN GOPATH=/usr/local go get -u -v golang.org/x/tools/... && rm -rf /root/.cache /usr/local/pkg /usr/local/src

# install nodejs
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash - && \
   DEBIAN_FRONTEND=noninteractive apt-get install -y nodejs

# ensure that Python3 is default
RUN update-alternatives --install /usr/bin/python python /usr/bin/python2.7 1 && \
    update-alternatives --install /usr/bin/python python /usr/bin/python3 2

# k8s kind
RUN curl -Lo /usr/local/bin/kind \
  https://github.com/kubernetes-sigs/kind/releases/download/v0.7.0/kind-$(uname)-amd64 \
  && chmod +x /usr/local/bin/kind

# postgresql-client-12 to connect to the db
RUN echo deb http://apt.postgresql.org/pub/repos/apt/ eoan-pgdg main \
  |  tee -a /etc/apt/sources.list.d/postgresql.list && \
  wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc \
  | apt-key add - \
  && apt-get update \
  && apt-get install -y \
  && apt-get install -y postgresql-client-12

# tmate allows others to connect to your session
# they support using self hosted / though we default to using their hosted service
RUN curl -L \
  https://github.com/tmate-io/tmate/releases/download/2.4.0/tmate-2.4.0-static-linux-amd64.tar.xz \
  | tar xvJ -f - --strip-components 1  -C /usr/local/bin tmate-2.4.0-static-linux-amd64/tmate

# This var ensures that emacs loads iimacs before all else
ENV IIMACSVERSION=0.9.34 \
  EMACSLOADPATH=/var/local/iimacs.d:
# Checking out iimacs
RUN git clone --depth 1 --recursive https://github.com/iimacs/.emacs.d /var/local/iimacs.d
# TODO This cache of compiled .elc files should be part of the build cache at some point
#  TARFILE=kubemacs-cache-0.9.32.tgz ; kubectl exec kubemacs-0 -- tar --directory /var/local/iimacs.d --create  --gzip --file - spacemacs/elpa/26.3 > $TARFILE ; gsutil cp $TARFILE gs://apisnoop/dev/$TARFILE
RUN curl https://storage.googleapis.com/apisnoop/dev/kubemacs-cache-0.9.32.tgz \
  | tar xfzC - /var/local/iimacs.d \
  && chgrp -R users /var/local/iimacs.d \
  && chmod -R g+w /var/local/iimacs.d

RUN curl -fsSL "https://github.com/windmilleng/tilt/releases/download/v0.11.3/tilt.0.11.3.linux.x86_64.tar.gz" | tar -C /usr/local/bin -xzv tilt

# we use osc52 support to copy text back to your OS over kubectl exec tmate
COPY bin/* /usr/local/bin/

# RUN groupadd -g 999 docker
# RUN groupdel docker && \
#   groupadd -g 999 docker
# From here on out we setup the user
COPY homedir/* /etc/skel/
COPY kubeconfig /etc/skel/.kube/config
RUN chmod 0600 /etc/skel/.pgpass
RUN useradd -m -G sudo,users,docker -s /bin/bash -u 2000 ii
USER ii

# # Fetch Golang dependencies for development
# RUN mkdir -p ~/go/src/k8s.io && git clone https://github.com/kubernetes/kubernetes.git ~/go/src/k8s.io/kubernetes
# RUN cd ~/go/src/k8s.io/kubernetes ; go mod download
#  go get -u -v ...
# RUN go get -u -v k8s.io/apimachinery/pkg/apis/meta/v1
# ENV GO111MODULE=on
# RUN go get -u -v k8s.io/client-go/kubernetes@v0.17.0
# RUN go get -u -v k8s.io/client-go/tools/clientcmd@v0.17.0
# RUN git clone --depth 1 https://github.com/cncf/apisnoop /home/ii/apisnoop
# RUN cd /home/ii/apisnoop/org/tickets ; go mod download

# Ensure authentication to apisnoop postgres database
ENV PGUSER=apisnoop \
  PGDATABASE=apisnoop \
  PGHOST=postgres \
  PGPORT=5432
ENV TZ="Pacific/Auckland"
ENTRYPOINT ["/bin/bash"]
CMD ["simple-init.sh"]
HEALTHCHECK --interval=10s --timeout=5s --start-period=5s --retries=5 \
  CMD ["tmate", "-S ", "/tmp/ii.default.target.iisocket", "wait-for", "tmate-ready"] || exit 1
