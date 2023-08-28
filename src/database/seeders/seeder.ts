import { Seeder } from './seeder.class';

const USER_COUNT = 100;
const HASHTAG_COUNT = 20;
const RESERVATION_COUNT = 0;

// 사용법: await sleep(1000)

async function main() {
  const seeder = new Seeder();
  try {
    await seeder.clear();
    await seeder.seed(USER_COUNT, HASHTAG_COUNT, RESERVATION_COUNT);
  } catch (e) {
    console.error(e);
    // clear db
    await seeder.clear();
    throw Error(e);
  } finally {
    await seeder.prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {});
