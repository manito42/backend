import { Injectable } from '@nestjs/common';
import { CategoryGetResponseDto } from './dto/response/categoryGetResponse.dto';
import { CategoryRepository } from '../../database/repository/category.repository';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async findMany(): Promise<Array<CategoryGetResponseDto>> {
    return await this.categoryRepository.findMany();
  }
}
