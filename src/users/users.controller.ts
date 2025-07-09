import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: '새 사용자 생성' })
  @ApiResponse({
    status: 201,
    description: '성공적으로 사용자를 생성했습니다.',
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청입니다. (예: 이메일 중복)',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: '모든 사용자 목록 조회' })
  @ApiResponse({ status: 200, description: '성공' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 사용자 정보 조회' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없습니다.' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '사용자 정보 수정' })
  @ApiResponse({
    status: 200,
    description: '성공적으로 사용자를 수정했습니다.',
  })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없습니다.' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '사용자 삭제' })
  @ApiResponse({
    status: 200,
    description: '성공적으로 사용자를 삭제했습니다.',
  })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없습니다.' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
