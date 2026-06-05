import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { DiaryService } from './diary.service';
import { UserService } from '../user/user.service';
import { CreateDiaryDto } from './dto/create-diary.dto';

@Controller('api/diaries')
export class DiaryController {
  constructor(
    private diaryService: DiaryService,
    private userService: UserService,
  ) {}

  // 임시로 이메일 헤더로 사용자 식별 (실제 환경에서는 JWT 검증 필요)
  private async getUserFromHeader(authorization: string) {
    // 개발 환경: email을 직접 전달받음 (테스트용)
    // 프로덕션: JWT 토큰 검증 후 사용자 정보 추출
    if (!authorization) {
      throw new UnauthorizedException('인증이 필요합니다.');
    }

    // Bearer 토큰에서 이메일 추출 (개발용 간이 구현)
    const token = authorization.replace('Bearer ', '');

    // 테스트를 위해 토큰을 이메일로 사용
    const user = await this.userService.findByEmail(token);
    if (!user) {
      // 사용자가 없으면 자동 생성 (개발용)
      return this.userService.findOrCreate({ email: token });
    }
    return user;
  }

  @Post()
  async create(
    @Body() createDiaryDto: CreateDiaryDto,
    @Headers('authorization') authorization: string,
  ) {
    const user = await this.getUserFromHeader(authorization);
    return this.diaryService.create(user.id, createDiaryDto);
  }

  @Get()
  async findAll(@Headers('authorization') authorization: string) {
    const user = await this.getUserFromHeader(authorization);
    return this.diaryService.findAllByUser(user.id);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Headers('authorization') authorization: string,
  ) {
    const user = await this.getUserFromHeader(authorization);
    return this.diaryService.findOne(id, user.id);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Headers('authorization') authorization: string,
  ) {
    const user = await this.getUserFromHeader(authorization);
    return this.diaryService.remove(id, user.id);
  }
}
