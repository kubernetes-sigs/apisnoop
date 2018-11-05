FROM python:3.7-slim
# install the notebook package
RUN pip install --no-cache --upgrade pip && \
    pip install --no-cache notebook && \
    pip install --no-cache requests

# create user with a home directory
ARG NB_USER
ARG NB_UID
ENV USER ${NB_USER}
ENV HOME /home/${NB_USER}
RUN apt-get update -y
RUN apt-get upgrade -y
RUN adduser --disabled-password \
    --gecos "Default user" \
    --uid ${NB_UID} \
    --shell /bin/bash \
    ${NB_USER}
WORKDIR ${HOME}
RUN apt-get install wget curl gnupg -y --allow-unauthenticated
RUN wget -q http://londo.ganneff.de/apt.key  -O- | apt-key add -
RUN echo "deb http://londo.ganneff.de stretch main" > /etc/apt/sources.list.d/emacs.list
RUN apt-get update -y
RUN apt install git \
        emacs-snapshot \
        emacs-snapshot-el \
        vim \
        -y --allow-unauthenticated
RUN echo "alias emc='emacsclient -t '" > /etc/profile.d/emc-alias.sh
RUN curl -L https://github.com/tmate-io/tmate/releases/download/2.2.1/tmate-2.2.1-static-linux-amd64.tar.gz \
  | tar  -f - -C /usr/local/bin -xvz --strip-components=1
USER ${NB_USER}
RUN git clone https://github.com/ii/spacemacs.git $HOME/.emacs.d && ln -s ~/.emacs.d/private/local/.spacemacs $HOME/.spacemacs
RUN git clone https://github.com/ii/ob-tmate ~/.emacs.d/private/local/ob-tmate.el/
RUN git clone https://github.com/benma/go-dlv.el ~/.emacs.d/private/local/go-dlv.el/
COPY webui webui
COPY dev/audit-log-review audit
COPY postBuild /postBuild
RUN /postBuild
