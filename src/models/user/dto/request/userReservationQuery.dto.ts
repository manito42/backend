import { IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetUserReservationQueryDto {
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
  @IsBoolean({ message: "as_mentee must be 'true' or 'false'" })
  @Transform(({ value }) => {
    return value === 'true';
  })
  as_mentee?: boolean = true;

  @IsOptional()
  @IsBoolean({ message: "as_mentor must be 'true' or 'false'" })
  @Transform(({ value }) => {
    return value === 'true';
  })
  as_mentor?: boolean = true;

  @IsOptional()
  @IsBoolean({ message: "all must be 'true' or 'false'" })
  @Transform(({ value }) => {
    return value === 'true';
  })
  active?: boolean = false;
}
