import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetHomeQueryDto {
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
}
