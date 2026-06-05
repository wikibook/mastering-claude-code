import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { CreateDiaryDto } from './dto/create-diary.dto';

@Injectable()
export class DiaryService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async create(userId: string, createDiaryDto: CreateDiaryDto) {
    // AI 분석 수행
    const analysis = await this.aiService.analyzeDiary(createDiaryDto.content);

    // 일기 저장
    return this.prisma.diary.create({
      data: {
        title: createDiaryDto.title,
        content: createDiaryDto.content,
        mood: analysis.mood,
        aiResponse: analysis.response,
        userId,
      },
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.diary.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const diary = await this.prisma.diary.findFirst({
      where: { id, userId },
    });

    if (!diary) {
      throw new NotFoundException('일기를 찾을 수 없습니다.');
    }

    return diary;
  }

  async remove(id: string, userId: string) {
    const diary = await this.prisma.diary.findFirst({
      where: { id, userId },
    });

    if (!diary) {
      throw new NotFoundException('일기를 찾을 수 없습니다.');
    }

    return this.prisma.diary.delete({
      where: { id },
    });
  }
}
