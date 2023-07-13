import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/services/prisma.service';
import { CategoryGetResponseDto } from './dto/response/categoryGetResponse.dto';
import { CategoryGetSelectQuery } from './queries/categoryGetSelect.query';
@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(): Promise<Array<CategoryGetResponseDto>> {
    return this.prisma.category.findMany({
      select: CategoryGetSelectQuery,
    });
  }
}
