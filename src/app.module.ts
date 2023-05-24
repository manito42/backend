import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './database/services/prisma.service';
import { UserModule } from './models/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
