// validate-param.dto.ts
import { IsPositive } from 'class-validator';

export class IdParamDto {
  @IsPositive()
  id: number;
}
