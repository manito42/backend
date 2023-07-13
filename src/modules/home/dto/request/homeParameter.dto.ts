import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetHomeCategoryParameterDto {
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsInt()
  @Min(1)
  category_id: number;
}
