import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: '사용자 이름', example: '홍길동' })
  @IsString()
  name: string;

  @ApiProperty({ description: '사용자 이메일', example: 'gildong@example.com' })
  @IsString()
  email: string;
}
