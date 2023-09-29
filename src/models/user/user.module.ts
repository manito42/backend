import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from '../../database/services/prisma.module';
import { JwtConfigModule } from 'src/config/jwt/config.module';

@Module({
  imports: [PrismaModule, JwtConfigModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
