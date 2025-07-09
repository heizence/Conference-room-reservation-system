import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateReservationDto } from './create-reservation.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateReservationDto extends PartialType(CreateReservationDto) {
  @ApiProperty({ description: '예약자(사용자)의 ID', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  requestingUserId: number;
}
