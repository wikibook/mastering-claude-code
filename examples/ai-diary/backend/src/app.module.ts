import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { DiaryModule } from './diary/diary.module';
import { UserModule } from './user/user.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    DiaryModule,
    UserModule,
    AiModule,
  ],
})
export class AppModule {}
