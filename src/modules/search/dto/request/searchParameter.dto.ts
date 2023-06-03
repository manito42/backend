import { IsString, MaxLength, MinLength } from 'class-validator';

export class GetSearchParameterDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  search?: string;
}
