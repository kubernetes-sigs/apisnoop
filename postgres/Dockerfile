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

 COPY ./db ./db
 COPY initdb /docker-entrypoint-initdb.d
 COPY ./snoopUtils.py /usr/local/lib/python3.7/dist-packages/snoopUtils.py
 HEALTHCHECK --interval=10s --timeout=5s --start-period=5s --retries=5 \
   CMD ["echo 'ready'"] || exit 1
