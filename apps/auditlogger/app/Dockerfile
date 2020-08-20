FROM node:12.14.1-alpine3.11
RUN adduser -D -H -h /app user
WORKDIR /app
COPY auditlogger.js .
COPY package.json .
RUN npm i
EXPOSE 9900
USER user
CMD ["node", "auditlogger.js"]
