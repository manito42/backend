#! /bin/bash

echo "change directory"
cd /home/ubuntu

npx prisma migrate deploy > /tmp/migrate.log

echo "Starting server..."
npm run start:prod
