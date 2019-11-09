FROM node:12.13.0-stretch
RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
RUN  echo "deb http://apt.postgresql.org/pub/repos/apt/ stretch-pgdg main" > /etc/apt/sources.list.d/pgdg.list
RUN apt update && \
    apt install -y vim postgresql-client-12 netcat
WORKDIR /opt/apisnoop
COPY auditlogger.js .
COPY package.json .
RUN npm i
EXPOSE 9900
CMD ["node", "auditlogger.js"]
