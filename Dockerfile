FROM node:18.16-alpine
EXPOSE 3000
WORKDIR /app

RUN apk add --no-cache dumb-init curl

# COPY DEV FILES
COPY start.sh /tmp/start.sh
COPY package.json .
COPY package-lock.json .

RUN chmod +x /tmp/start.sh

ENTRYPOINT ["/usr/bin/dumb-init", "--"]

CMD ["/bin/ash", "/tmp/start.sh"]
