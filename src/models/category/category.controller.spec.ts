import { PrismaService } from '../../database/services/prisma.service';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryFactory } from '../../database/factories/category.factory';
describe('CategoryController', () => {
  let categoryController: CategoryController;
  let categoryService: CategoryService;

  beforeEach(() => {
    categoryService = new CategoryService(new PrismaService());
    categoryController = new CategoryController(categoryService);
  });

  describe('findMany', () => {
    it('test normal case [return array of menteeFeedback]', async () => {
      const result = CategoryFactory.getCategories(10);
      jest.spyOn(categoryService, 'findMany').mockImplementation(async () => result);
      expect(await categoryController.getCategories()).toBe(result);
    });
  });
});
