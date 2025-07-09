import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @ApiOperation({ summary: '새 회의실 생성' })
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  // 모든 회의실 조회
  @Get()
  @ApiOperation({ summary: '모든 회의실 목록 조회' })
  findAll() {
    return this.roomsService.findAll();
  }

  // 특정 회의실 조회
  @Get(':id')
  @ApiOperation({ summary: '특정 회의실 정보 조회' })
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(+id);
  }

  // 회의실 수정
  @Patch(':id')
  @ApiOperation({ summary: '회의실 정보 수정' })
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(+id, updateRoomDto);
  }

  // 회의실 삭제
  @Delete(':id')
  @ApiOperation({ summary: '회의실 삭제' })
  remove(@Param('id') id: string) {
    return this.roomsService.remove(+id);
  }
}
