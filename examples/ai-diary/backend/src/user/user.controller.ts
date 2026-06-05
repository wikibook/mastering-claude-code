import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';

class CreateUserDto {
  email: string;
  name?: string;
  image?: string;
}

@Controller('api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async createOrUpdateUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.findOrCreate(createUserDto);
  }
}
