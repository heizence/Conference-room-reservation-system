// NestJS의 기본 컨트롤러 및 HTTP 요청 메서드 데코레이터를 가져옵니다.
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
// Swagger 문서 생성을 위한 데코레이터들을 가져옵니다.
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DeleteReservationDto } from './dto/delete-reservation.dto';

/**
 * @class ReservationsController
 * @description 'Reservations' API 그룹을 정의하고, '/reservations' 경로의 요청을 처리하는 컨트롤러입니다.
 * @ApiTags: Swagger UI에서 API들을 'Reservations'라는 카테고리로 묶어줍니다.
 * @Controller: 이 클래스가 컨트롤러임을 선언하고, 기본 경로(prefix)를 'reservations'로 설정합니다.
 */
@ApiTags('Reservations')
@Controller('reservations')
export class ReservationsController {
  // 생성자(constructor)를 통해 ReservationsService를 의존성 주입(Dependency Injection) 받습니다.
  // 'private readonly'는 이 클래스 내에서만 접근 가능하고 수정할 수 없는 멤버 변수로 만듭니다.
  constructor(private readonly reservationsService: ReservationsService) {}

  /**
   * @description [POST] /reservations - 새로운 예약을 생성합니다.
   * @ApiOperation: Swagger UI에 표시될 API의 요약 정보를 설정합니다.
   * @ApiResponse: API의 응답 상태 코드별 설명을 설정합니다.
   * @param createReservationDto - 요청 본문(body)에 담겨 올 예약 생성 데이터입니다.
   */
  @Post()
  @ApiOperation({ summary: '새 예약 생성' })
  @ApiResponse({ status: 201, description: '성공적으로 예약을 생성했습니다.' })
  @ApiResponse({
    status: 404,
    description: '요청된 사용자 또는 회의실을 찾을 수 없습니다.',
  })
  @ApiResponse({
    status: 409,
    description: '해당 시간대에 이미 다른 예약이 존재하여 충돌이 발생했습니다.',
  })
  create(@Body() createReservationDto: CreateReservationDto) {
    // ReservationsService의 create 메서드를 호출하여 비즈니스 로직을 수행합니다.
    return this.reservationsService.create(createReservationDto);
  }

  /**
   * @description [GET] /reservations - 모든 예약 목록을 조회합니다.
   */
  @Get()
  @ApiOperation({ summary: '모든 예약 목록 조회' })
  findAll() {
    return this.reservationsService.findAll();
  }

  /**
   * @description [GET] /reservations/:id - 특정 ID의 예약 정보를 조회합니다.
   * @param id - URL 경로(path)에서 추출한 예약의 고유 ID입니다.
   */
  @Get(':id')
  @ApiOperation({ summary: '특정 예약 정보 조회' })
  @ApiResponse({ status: 200, description: '요청 성공' })
  @ApiResponse({
    status: 404,
    description: '해당 ID의 예약을 찾을 수 없습니다.',
  })
  findOne(@Param('id') id: string) {
    // URL 파라미터는 문자열로 들어오므로, '+' 연산자를 사용해 숫자로 변환합니다.
    return this.reservationsService.findOne(+id);
  }

  /**
   * @description [PATCH] /reservations/:id - 특정 예약의 정보를 수정합니다.
   * @param id - 수정할 예약의 고유 ID입니다.
   * @param updateReservationDto - 수정할 내용이 담긴 데이터입니다.
   */
  @Patch(':id')
  @ApiOperation({ summary: '예약 정보 수정' })
  @ApiResponse({ status: 200, description: '성공적으로 예약을 수정했습니다.' })
  @ApiResponse({
    status: 404,
    description: '해당 ID의 예약을 찾을 수 없습니다.',
  })
  update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationsService.update(+id, updateReservationDto);
  }

  /**
   * @description [DELETE] /reservations/:id - 특정 예약을 삭제합니다.
   * @param id - 삭제할 예약의 고유 ID입니다.
   * @param deleteReservationDto - 삭제 요청자의 정보를 담은 데이터입니다.
   */
  @Delete(':id')
  @ApiOperation({ summary: '예약 삭제' })
  @ApiResponse({ status: 200, description: '성공적으로 예약을 삭제했습니다.' })
  @ApiResponse({
    status: 404,
    description: '해당 ID의 예약을 찾을 수 없습니다.',
  })
  remove(
    @Param('id') id: string,
    @Body() deleteReservationDto: DeleteReservationDto,
  ) {
    return this.reservationsService.remove(+id, deleteReservationDto);
  }
}
