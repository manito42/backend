#! /bin/bash
cd /app

npm ci

npx prisma migrate dev 

chmod +x seeder.sh

npm run start:dev 
