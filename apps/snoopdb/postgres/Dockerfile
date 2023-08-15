FROM postgres:15-bullseye
LABEL MAINTAINER="Zach Mandeville <zz@ii.coop>"
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
  firefox-esr \
  postgresql-plpython3-15 \
  postgresql-15-plsh \
  postgresql-server-dev-15 \
  python3-pip \
  python3-bs4 \
  python3-psycopg2 \
  python3-ipdb \
  python3-requests \
  python3-yaml \
  python3-semver \
  libpq-dev \
  wget \
  make \
  gcc \
  libc6-dev \
  curl \
  jq \
  git \
  software-properties-common \
  apt-transport-https


RUN python3 --version
RUN pip3 install --upgrade pip
RUN pip3 install --upgrade requests

RUN env PG_CONFIG=$(which pg_config) \
    && git clone https://github.com/theory/pg-semver.git \
    && cd pg-semver \
    && make && make install

# Install yq
RUN wget https://github.com/mikefarah/yq/releases/download/v4.2.0/yq_linux_amd64.tar.gz -O - \
    | tar xz && mv yq_linux_amd64 /usr/bin/yq

RUN mkdir /tmp/coverage && chmod 777 /tmp/coverage
COPY initdb /docker-entrypoint-initdb.d
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
COPY ./snoopUtils.py /usr/local/lib/python3.7/dist-packages/snoopUtils.py
# ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh", "--user postgres"]
