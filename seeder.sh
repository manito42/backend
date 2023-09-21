#! /bin/bash

npm ci
npx prisma generate

npx ts-node ./src/database/seeders/seeder.ts
