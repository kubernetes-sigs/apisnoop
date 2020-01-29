FROM node:slim

RUN addgroup --system --gid 1001 appuser \
    &&  adduser --system --uid 1001 --ingroup appuser appuser

COPY . /webapp

RUN chown -R appuser:appuser /webapp

USER appuser

WORKDIR /webapp

RUN npm install

EXPOSE 3000
# EXPOSE 10000

CMD ["npm", "run", "dev"]
# RUN npm run build
# USER root
# CMD ["npm", "start"]
