#! /bin/bash

echo "change directory"
cd /home/ubuntu

# deploy는 현재 ./prisma/migrations 폴더에 있는 마이그레이션 파일들을 읽어서 DB에 적용합니다.
echo "Deploying prisma..."
npx prisma migrate deploy


echo "Starting server..."
npm run start:prod