FROM node:12.14.1-alpine3.11
RUN apk update && \
apk add vim postgresql-client netcat-openbsd
RUN adduser -D -H -h /opt/apisnoop apisnoop
WORKDIR /opt/apisnoop
COPY auditlogger.js .
COPY package.json .
RUN npm i
EXPOSE 9900
USER apisnoop
CMD ["node", "auditlogger.js"]
