import { Controller, Get } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryGetResponseDto } from './dto/response/categoryGetResponse.dto';

@Controller('/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/')
  async getCategories(): Promise<Array<CategoryGetResponseDto>> {
    return await this.categoryService.findMany();
  }
}
