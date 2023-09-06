import { IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetSearchQueryDto {
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

  @IsOptional()
  @IsBoolean({ message: "search_by_hashtag_name must be 'true' or 'false'" })
  @Transform(({ value }) => {
    return value === 'true';
  })
  search_by_hashtag_name?: boolean = true;

  @IsOptional()
  @IsBoolean({ message: "search_by_user_nickname must be 'true' or 'false'" })
  @Transform(({ value }) => {
    return value === 'true';
  })
  search_by_user_nickname?: boolean = true;

  @IsOptional()
  @IsBoolean({ message: "search_by_category_name must be 'true' or 'false'" })
  @Transform(({ value }) => {
    return value === 'true';
  })
  search_by_category_name?: boolean = true;
}
