import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteReservationDto {
  @ApiProperty({ description: '예약자(사용자)의 ID', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  requestingUserId: number;
}
