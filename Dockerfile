FROM node:18.16-alpine
EXPOSE 3000

# COPY DEV FILES
COPY . /app

WORKDIR /app
# NPM INSTALL
RUN npm ci
RUN chmod +x ./prisma_init.sh

CMD ["./prisma_init.sh"]