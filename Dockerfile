FROM python:2.7.15-slim
# install the notebook package
RUN pip install --no-cache --upgrade pip && \
    pip install --no-cache notebook && \
    pip install --no-cache requests && \
    pip install --no-cache ipdb

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
        jq \
        -y --allow-unauthenticated
RUN echo "alias emc='emacsclient -t '" > /etc/profile.d/emc-alias.sh
RUN curl -L https://github.com/tmate-io/tmate/releases/download/2.2.1/tmate-2.2.1-static-linux-amd64.tar.gz \
  | tar  -f - -C /usr/local/bin -xvz --strip-components=1
COPY dev/audit-log-review audit
COPY webui webui
COPY index.ipynb index.ipynb
COPY sources.yaml sources.yaml
COPY downloadArtifacts.py downloadArtifacts.py
RUN  python downloadArtifacts.py sources.yaml ./data
RUN chown -R $NB_USER.$NB_USER audit webui *.py *pynb data
USER ${NB_USER}
COPY processAudits /
RUN /processAudits
