FROM node:lts-alpine3.18

RUN apk add --no-cache tzdata ca-certificates bash util-linux

WORKDIR /app
RUN adduser -D -H -h /app user
COPY web .
RUN chown -R user:user /app

EXPOSE 5000
USER user
ENV publish="public"

RUN npm install && \
    npm run build && \
    sed -i "s/public --single/public --host 0.0.0.0/" package.json

CMD ["/app/node_modules/.bin/sirv","public","--host","0.0.0.0"]

