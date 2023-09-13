#! /bin/bash
cd /app

npx prisma migrate dev 

chmod +x seeder.sh

npm run start:dev 
