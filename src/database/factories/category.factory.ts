import { faker } from '@faker-js/faker';
import { ICategoryRequest } from '../../common/interfaces/api/category/categoryRequest.interface';
import { ICategoryResponse } from '../../common/interfaces/api/category/categoryResponse.interface';

export class CategoryFactory {
  constructor() {}

  static getCategory(): ICategoryResponse {
    return {
      id: faker.number.int({ min: 1, max: 1000 }),
      name: faker.lorem.word(),
    };
  }

  static getCategories(count: number): Array<ICategoryResponse> {
    const categories = [];
    for (let i = 0; i < count; i++) {
      categories.push(CategoryFactory.getCategory());
    }
    return categories;
  }

  static getCreateCategory(): ICategoryRequest {
    return {
      name: faker.lorem.word(),
    };
  }

  static getCreateCategories(count: number): Array<ICategoryRequest> {
    const categories = [];
    for (let i = 0; i < count; i++) {
      categories.push(CategoryFactory.getCreateCategory());
    }
    return categories;
  }

  static getRealSeed(): Array<ICategoryRequest> {
    return [
      {
        name: 'DEVELOPMENT',
      },
      {
        name: 'HOBBY',
      },
    ];
  }
}
