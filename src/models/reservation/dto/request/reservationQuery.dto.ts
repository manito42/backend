import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

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
    return Number(value);
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  hashtag_id?: number;
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  category_id?: number;
}
