import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { SelectAllType } from '../../../../common/constants/selectAll.type';
import { IsIntSelectAll } from '../../../../common/decorators/isIntSelectAll.decorator';

export class GetReservationQueryDto {
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  take?: number = 20;

  @Transform(({ value }) => {
    return Number(value);
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  page?: number = 0;

  @Transform(({ value }) => {
    if (value === SelectAllType.ALL) return value;
    return Number(value);
  })
  @IsIntSelectAll({ min: 0 })
  hashtag_id?: number | SelectAllType = SelectAllType.ALL;

  @Transform(({ value }) => {
    if (value === SelectAllType.ALL) return value;
    return Number(value);
  })
  @IsIntSelectAll({ min: 0 })
  category_id?: number | SelectAllType = SelectAllType.ALL;
}
