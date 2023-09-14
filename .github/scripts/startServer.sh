#! /bin/bash

logfile="/tmp/server-deploy.log"
exec > $logfile 2>&1

echo "change directory"
cd /home/ubuntu

npx prisma migrate deploy

echo "Starting server..."
npm run start:prod
