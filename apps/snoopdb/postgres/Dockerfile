FROM postgres:12-buster
LABEL MAINTAINER="Zach Mandeville <zz@ii.coop>"
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
  firefox-esr \
  postgresql-plpython3-12 \
  postgresql-12-plsh \
  postgresql-server-dev-12 \
  python3-pip \
  python3-bs4 \
  python3-psycopg2 \
  python3-ipdb \
  python3-requests \
  python3-yaml \
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
RUN pip3 install selenium webdriver-manager
RUN wget "https://github.com/mozilla/geckodriver/releases/download/v0.29.1/geckodriver-v0.29.1-linux64.tar.gz" \
    && tar xvf geckodriver* \
    && chmod +x geckodriver \
    && mv geckodriver /usr/local/bin

RUN env PG_CONFIG=$(which pg_config) \
    && git clone https://github.com/theory/pg-semver.git \
    && cd pg-semver \
    && make && make install

RUN mkdir /tmp/coverage && chmod 777 /tmp/coverage
COPY initdb /docker-entrypoint-initdb.d
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
COPY ./snoopUtils.py /usr/local/lib/python3.7/dist-packages/snoopUtils.py
# ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh", "--user postgres"]
