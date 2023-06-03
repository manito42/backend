import { PrismaService } from '../../database/services/prisma.service';
import { CategoryService } from './category.service';
import { CategoryGetSelectQuery } from './queries/categoryGetSelect.query';

describe('CategoryService', () => {
  let categoryService: CategoryService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    prismaService = new PrismaService();
    await prismaService.$connect(); // Connect to the MySQL database.
    categoryService = new CategoryService(prismaService);
  });

  afterAll(async () => {
    await prismaService.$disconnect(); // Disconnect from the MySQL database.
  });

  describe('findMany', () => {
    it('test normal case [return array of hashtags]', async () => {
      const result = await prismaService.category.findMany({
        select: CategoryGetSelectQuery,
        take: 20,
      });
      expect(await categoryService.findMany()).toStrictEqual(result);
    });
  });
});
