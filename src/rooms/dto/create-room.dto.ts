import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ description: '회의실 이름', example: '1번 대회의실' })
  @IsString()
  name: string;

  @ApiProperty({ description: '회의실 위치 (층)', example: 5 })
  @IsNumber()
  floor: number;

  @ApiProperty({ description: '최대 수용 인원', example: 20 })
  @IsInt()
  @Min(1)
  capacity: number;

  @ApiProperty({
    description: '상세 위치 (선택 사항)',
    example: 'A동 301호 옆',
    required: false,
  })
  @IsString()
  @IsOptional()
  location?: string;
}
