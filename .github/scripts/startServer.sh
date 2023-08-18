#! /bin/bash

# Start the server
echo "Starting server..."
cd /home/ubuntu

# deploy는 현재 ./prisma/migrations 폴더에 있는 마이그레이션 파일들을 읽어서 DB에 적용합니다.
/home/ubuntu/.nvm/versions/node/v18.16.0/bin/npx prisma migrate deploy

/home/ubuntu/.nvm/versions/node/v18.16.0/bin/npm run start:prod