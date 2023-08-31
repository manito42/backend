import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { SelectAllType } from '../../../../common/constants/selectAll.type';
import { IsIntSelectAll } from '../../../../common/decorators/isIntSelectAll.decorator';

export class GetMentorFeedbacksQueryDto {
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
  @Min(0)
  page?: number = 0;

  @Transform(({ value }) => {
    if (value === SelectAllType.ALL) return value;
    return Number(value);
  })
  @IsOptional()
  @IsIntSelectAll({ min: 0 })
  mentor_id?: number | SelectAllType = SelectAllType.ALL;

  @Transform(({ value }) => {
    if (value === SelectAllType.ALL) return value;
    return Number(value);
  })
  @IsOptional()
  @IsIntSelectAll({ min: 0 })
  mentee_id?: number | SelectAllType = SelectAllType.ALL;

  @Transform(({ value }) => {
    if (value === SelectAllType.ALL) return value;
    return Number(value);
  })
  @IsOptional()
  @IsIntSelectAll({ min: 0 })
  reservation_id?: number | SelectAllType = SelectAllType.ALL;
}
