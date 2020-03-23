FROM postgres:12.0
 MAINTAINER Hippie Hacker <hh@ii.coop>
 RUN apt-get update \
   && apt-get install -y --no-install-recommends \
   postgresql-plpython3-12 \
   postgresql-12-plsh \
   python3-bs4\
   python3-psycopg2\
   python3-ipdb\
   python3-requests \
   wget \
   make \
   gcc \
   libc6-dev \
   curl \
   jq \
   git \
   software-properties-common \
   apt-transport-https
 #  && rm -rf /var/lib/apt/lists/*

 # RUN curl -L https://dl.google.com/go/go1.12.4.linux-amd64.tar.gz \
 #   | tar -C /usr/local -xzf - \
 #   && echo 'export PATH=$PATH:/usr/local/go/bin' \
 #   > /etc/profile.d/usr-local-go-path.sh \
 #   && echo 'export PATH=$PATH:$HOME/go/bin' \
 #   > /etc/profile.d/homedir-go-path.sh
 # RUN . /etc/profile.d/usr-local-go-path.sh \
 #   && . /etc/profile.d/homedir-go-path.sh \
 #   && go get github.com/golangci/gofmt/gofmt \
 #   && go get -u golang.org/x/lint/golint \
 #   && go get golang.org/x/tools/cmd/goimports \
 #   && go get github.com/jgautheron/goconst/cmd/goconst \
 #   && go get github.com/jgautheron/usedexports \
 #   && go get -u github.com/kisielk/errcheck \
 #   && go get github.com/ii/apisnoopregexp \
 #   && cd ~/go/src/github.com/ii/apisnoopregexp \
 #   && make install \
 #   && cp ~/go/bin/rmatch /usr/local/bin
 COPY ./initdb /docker-entrypoint-initdb.d
 COPY ./snoopUtils.py /usr/local/lib/python3.7/dist-packages/snoopUtils.py
 HEALTHCHECK --interval=10s --timeout=5s --start-period=5s --retries=5 \
   CMD ["pg_isready", "-U ", "apisnoop"] || exit 1
# RUN sed -i -e"s/^#logging_collector = off.*$/logging_collector = on/" /var/lib/postgresql/data/postgresql.conf
