import { IsAlpha, MaxLength } from 'class-validator';
import { ICategoryRequest } from '../../../../common/interfaces/api/category/categoryRequest.interface';

export class CategoryCreatePayloadDto implements ICategoryRequest {
  // alphabet only
  @MaxLength(20, { message: '카레고리는 20자 이하로 입력해주세요.' })
  @IsAlpha('en-US', { message: '카레고리는 영어만 입력해주세요.' })
  name: string;
}
