FROM python:3.7-slim
# install the notebook package
RUN pip install --no-cache --upgrade pip && \
    pip install --no-cache notebook

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
COPY webui webui
COPY dev/audit-log-review audit
COPY postBuild /postBuild
RUN /postBuild
