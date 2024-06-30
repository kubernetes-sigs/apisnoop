FROM cgr.dev/chainguard/deno@sha256:cf138c122aae989daedb6fd7c8b5317ea5799ae42509a12a3d70557e7806ebd0
WORKDIR /app
COPY ./auditlogger.js /app/auditlogger.js
EXPOSE 9900
RUN ["deno", "cache", "/app/auditlogger.js"]
ENTRYPOINT ["deno", "run", "--allow-net", "--allow-read", "--allow-env", "/app/auditlogger.js"]
