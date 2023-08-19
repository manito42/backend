#! /bin/bash

echo "change directory"
cd /home/ubuntu

ls -al

# install Dependency
npm i

# generate prisma client
npx prisma generate

# deploy는 현재 ./prisma/migrations 폴더에 있는 마이그레이션 파일들을 읽어서 DB에 적용합니다.
echo "Deploying prisma..."
npx prisma migrate deploy

# build server
npm run build

pm2
echo "Starting server..."
npm run start:prod