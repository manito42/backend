import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayloadInterface } from '../interfaces/jwt/jwtPayload.interface';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext): JwtPayloadInterface => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});
