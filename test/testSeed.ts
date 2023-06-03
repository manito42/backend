import { Seeder } from '../src/database/seeders/seeder.class';

export async function testSeed(seeder: Seeder) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await seeder.clear();
      await seeder.seed(100, 100, 100);
      break; // If successful, break out of the loop
    } catch (err) {
      console.error(`Attempt ${attempt + 1} to clear and seed the database failed.`);
      if (attempt == 2) {
        // If this was the last attempt, fail the tests
        console.error('Unable to prepare the database for testing, failing tests.');
        process.exit(1); // Exit with a failure code
      }
    }
  }
}
