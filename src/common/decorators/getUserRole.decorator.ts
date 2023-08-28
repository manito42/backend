import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRole } from '@prisma/client';

export const GetUserRole = createParamDecorator((data, ctx: ExecutionContext): UserRole => {
  const req = ctx.switchToHttp().getRequest();
  return req.user.role;
});
