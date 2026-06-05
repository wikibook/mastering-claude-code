import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateDiaryDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  content: string;
}
