import { IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
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
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  search_by_hashtag_name?: boolean;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  search_by_user_nickname?: boolean;
}
