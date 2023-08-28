FILE=/init.prisma
if test -f "$FILE"; then
    echo "$FILE exists. pass initialization"
else
  npx prisma generate
  npx prisma migrate reset --force
  npx prisma migrate dev --name init_dev
  # SEED THE DUMMY
  npx ts-node ./src/database/seeders/seeder.ts
  # SET INIT FILE
  touch $FILE
fi
# RUN APP
npm run start:dev

