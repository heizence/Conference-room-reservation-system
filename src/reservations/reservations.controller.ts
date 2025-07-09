import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DeleteReservationDto } from './dto/delete-reservation.dto';

@ApiTags('Reservations')
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  // 예약 생성
  @Post()
  @ApiOperation({ summary: '새 예약 생성' })
  @ApiResponse({ status: 201, description: '성공적으로 예약을 생성했습니다.' })
  @ApiResponse({
    status: 404,
    description: '사용자 또는 회의실을 찾을 수 없습니다.',
  })
  @ApiResponse({
    status: 409,
    description: '해당 시간대에 이미 예약이 존재합니다.',
  })
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationsService.create(createReservationDto);
  }

  // 모든 예약 조회
  @Get()
  @ApiOperation({ summary: '모든 예약 목록 조회' })
  findAll() {
    return this.reservationsService.findAll();
  }

  // 특정 예약 조회
  @Get(':id')
  @ApiOperation({ summary: '특정 예약 정보 조회' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 404, description: '예약을 찾을 수 없습니다.' })
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(+id);
  }

  // 예약 수정
  @Patch(':id')
  @ApiOperation({ summary: '예약 정보 수정' })
  @ApiResponse({ status: 200, description: '성공적으로 예약을 수정했습니다.' })
  @ApiResponse({ status: 404, description: '예약을 찾을 수 없습니다.' })
  update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationsService.update(+id, updateReservationDto);
  }

  // 예약 삭제
  @Delete(':id')
  @ApiOperation({ summary: '예약 삭제' })
  @ApiResponse({ status: 200, description: '성공적으로 예약을 삭제했습니다.' })
  @ApiResponse({ status: 404, description: '예약을 찾을 수 없습니다.' })
  remove(
    @Param('id') id: string,
    @Body() deleteReservationDto: DeleteReservationDto,
  ) {
    return this.reservationsService.remove(+id, deleteReservationDto);
  }
}
