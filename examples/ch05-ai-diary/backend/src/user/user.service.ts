import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface CreateUserDto {
  email: string;
  name?: string;
  image?: string;
}

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOrCreate(data: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      // 기존 사용자가 있으면 정보 업데이트
      return this.prisma.user.update({
        where: { email: data.email },
        data: {
          name: data.name,
          image: data.image,
        },
      });
    }

    // 새 사용자 생성
    return this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        image: data.image,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
}
