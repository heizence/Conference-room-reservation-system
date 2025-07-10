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
// 비즈니스 로직을 처리할 RoomsService를 가져옵니다.
import { RoomsService } from './rooms.service';
// 데이터 전송 객체(DTO)들을 가져옵니다.
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
// Swagger 문서 생성을 위한 데코레이터들을 가져옵니다.
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

/**
 * @class RoomsController
 * @description 'Rooms' API 그룹을 정의하고, '/rooms' 경로의 요청을 처리하는 컨트롤러입니다.
 * @ApiTags: Swagger UI에서 API들을 'Rooms'라는 카테고리로 묶어줍니다.
 * @Controller: 이 클래스가 컨트롤러임을 선언하고, 기본 경로(prefix)를 'rooms'로 설정합니다.
 */
@ApiTags('Rooms')
@Controller('rooms')
export class RoomsController {
  // 생성자를 통해 RoomsService를 의존성 주입(Dependency Injection) 받습니다.
  constructor(private readonly roomsService: RoomsService) {}

  /**
   * @description [POST] /rooms - 새로운 회의실을 생성합니다.
   * @param createRoomDto - 요청 본문(body)에 담겨 올 회의실 생성 데이터입니다.
   */
  @Post()
  @ApiOperation({ summary: '새 회의실 생성' })
  @ApiResponse({
    status: 201,
    description: '성공적으로 회의실을 생성했습니다.',
  })
  @ApiResponse({
    status: 409,
    description: '이미 같은 이름의 회의실이 존재합니다.',
  })
  create(@Body() createRoomDto: CreateRoomDto) {
    // RoomsService의 create 메서드를 호출하여 비즈니스 로직을 수행합니다.
    return this.roomsService.create(createRoomDto);
  }

  /**
   * @description [GET] /rooms - 모든 회의실 목록을 조회합니다.
   */
  @Get()
  @ApiOperation({ summary: '모든 회의실 목록 조회' })
  @ApiResponse({ status: 200, description: '요청 성공' })
  findAll() {
    return this.roomsService.findAll();
  }

  /**
   * @description [GET] /rooms/:id - 특정 ID의 회의실 정보를 조회합니다.
   * @param id - URL 경로(path)에서 추출한 회의실의 고유 ID입니다.
   */
  @Get(':id')
  @ApiOperation({ summary: '특정 회의실 정보 조회' })
  @ApiResponse({ status: 200, description: '요청 성공' })
  @ApiResponse({
    status: 404,
    description: '해당 ID의 회의실을 찾을 수 없습니다.',
  })
  findOne(@Param('id') id: string) {
    // URL 파라미터는 문자열로 들어오므로, '+' 연산자를 사용해 숫자로 변환합니다.
    return this.roomsService.findOne(+id);
  }

  /**
   * @description [PATCH] /rooms/:id - 특정 회의실의 정보를 수정합니다.
   * @param id - 수정할 회의실의 고유 ID입니다.
   * @param updateRoomDto - 수정할 내용이 담긴 데이터입니다.
   */
  @Patch(':id')
  @ApiOperation({ summary: '회의실 정보 수정' })
  @ApiResponse({
    status: 200,
    description: '성공적으로 회의실 정보를 수정했습니다.',
  })
  @ApiResponse({
    status: 404,
    description: '해당 ID의 회의실을 찾을 수 없습니다.',
  })
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(+id, updateRoomDto);
  }

  /**
   * @description [DELETE] /rooms/:id - 특정 회의실을 삭제합니다.
   * @param id - 삭제할 회의실의 고유 ID입니다.
   */
  @Delete(':id')
  @ApiOperation({ summary: '회의실 삭제' })
  @ApiResponse({
    status: 200,
    description: '성공적으로 회의실을 삭제했습니다.',
  })
  @ApiResponse({
    status: 404,
    description: '해당 ID의 회의실을 찾을 수 없습니다.',
  })
  remove(@Param('id') id: string) {
    return this.roomsService.remove(+id);
  }
}
