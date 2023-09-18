#! /bin/bash
# Error 발생시 중단한다.
set -e
logfile="/var/log/api-server/deploy/server-deploy$(date +%s).log"
exec > $logfile 2>&1

echo "change directory"
cd /home/ubuntu

npx prisma migrate deploy

echo "Starting server..."
npm run start:prod
