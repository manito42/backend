#! /bin/bash

echo "change directory"
cd /home/ubuntu

npx prisma migrate deploy

echo "Starting server..."
npm run start:prod