import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { ReservationStatus } from '@prisma/client';

export enum ReservationRole {
  MENTOR = 'MENTOR',
  MENTEE = 'MENTEE',
  ALL = 'ALL',
}

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
  @IsEnum(ReservationRole)
  role?: ReservationRole = ReservationRole.ALL;

  @Transform(({ value }) => value.split(','))
  @IsEnum(ReservationStatus, { each: true })
  status?: ReservationStatus[] = Object.values(ReservationStatus);
}
