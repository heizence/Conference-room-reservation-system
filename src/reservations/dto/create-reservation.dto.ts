import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({
    description: '예약 시작 시간 (ISO 8601 형식)',
    example: '2025-07-10T10:00:00Z',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startTime: Date;

  @ApiProperty({
    description: '예약 종료 시간 (ISO 8601 형식)',
    example: '2025-07-10T11:00:00Z',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endTime: Date;

  @ApiProperty({ description: '예약자(사용자)의 ID', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  reserverId: number;

  @ApiProperty({ description: '예약할 회의실의 ID', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  roomId: number;

  @ApiProperty({
    description: '참석자(사용자)들의 ID 배열 (선택 사항)',
    example: [2, 3],
    required: false,
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  attendeeIds?: number[];
}
