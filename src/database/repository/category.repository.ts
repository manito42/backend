import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { CategoryGetSelectQuery } from '../../models/category/queries/categoryGetSelect.query';
import { CategoryGetResponseDto } from '../../models/category/dto/response/categoryGetResponse.dto';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany(): Promise<Array<CategoryGetResponseDto>> {
    return this.prismaService.category.findMany({
      select: CategoryGetSelectQuery,
    });
  }
}
