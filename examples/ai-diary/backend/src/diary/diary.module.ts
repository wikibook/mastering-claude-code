import { Module } from '@nestjs/common';
import { DiaryController } from './diary.controller';
import { DiaryService } from './diary.service';
import { AiModule } from '../ai/ai.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [AiModule, UserModule],
  controllers: [DiaryController],
  providers: [DiaryService],
})
export class DiaryModule {}
