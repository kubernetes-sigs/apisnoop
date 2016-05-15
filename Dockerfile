FROM alpine:3.3

ENV LANG=en_US.UTF-8

COPY requirements.txt /tmp/requirements.txt
RUN apk add --no-cache \
        git \
        g++ \
        py-pip \
        libffi \
        libffi-dev \
        libjpeg-turbo \
        libjpeg-turbo-dev \
        libxml2 \
        libxml2-dev \
        libxslt \
        libxslt-dev \
        openssl \
        openssl-dev \
        python \
        python-dev \
        zlib \
        zlib-dev \
    && LDFLAGS=-L/lib pip install -r /tmp/requirements.txt \
    && apk del --purge \
        git \
        g++ \
        libffi-dev \
        libjpeg-turbo-dev \
        libxml2-dev \
        libxslt-dev \
        openssl-dev \
        python-dev \
        zlib-dev \
    && rm /tmp/requirements.txt \
    && rm -rf ~/.cache/pip \
    && adduser -u 7799 -D mitmproxy

USER mitmproxy
RUN mkdir /home/mitmproxy/.mitmproxy
VOLUME /home/mitmproxy/.mitmproxy

EXPOSE 8080 8081
CMD ["mitmproxy"]
