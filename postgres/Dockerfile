FROM postgres:12.0
 MAINTAINER Zach Mandeville <zz@ii.coop>
 RUN apt-get update \
   && apt-get install -y --no-install-recommends \
   postgresql-plpython3-12 \
   postgresql-12-plsh \
   postgresql-server-dev-12 \
   python3-bs4\
   python3-psycopg2\
   python3-ipdb\
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

 RUN env PG_CONFIG=$(which pg_config) \
     && git clone https://github.com/theory/pg-semver.git \
     && cd pg-semver \
     && make && make install

COPY initdb /docker-entrypoint-initdb.d
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
COPY ./snoopUtils.py /usr/local/lib/python3.7/dist-packages/snoopUtils.py
