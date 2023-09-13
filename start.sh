#! /bin/bash
cd /app

npx prisma migrate dev 

npm run start:dev 
