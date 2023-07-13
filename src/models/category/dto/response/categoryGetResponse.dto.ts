import { ICategoryResponse } from '../../../../common/interfaces/api/category/categoryResponse.interface';

export class CategoryGetResponseDto implements ICategoryResponse {
  id: number;
  name: string;
}
