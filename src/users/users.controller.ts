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
// 비즈니스 로직을 처리할 UsersService를 가져옵니다.
import { UsersService } from './users.service';
// 데이터 전송 객체(DTO)들을 가져옵니다.
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// Swagger 문서 생성을 위한 데코레이터들을 가져옵니다.
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

/**
 * @class UsersController
 * @description 'Users' API 그룹을 정의하고, '/users' 경로의 요청을 처리하는 컨트롤러입니다.
 * @ApiTags: Swagger UI에서 API들을 'Users'라는 카테고리로 묶어줍니다.
 * @Controller: 이 클래스가 컨트롤러임을 선언하고, 기본 경로(prefix)를 'users'로 설정합니다.
 */
@ApiTags('Users')
@Controller('users')
export class UsersController {
  // 생성자를 통해 UsersService를 의존성 주입(Dependency Injection) 받습니다.
  constructor(private readonly usersService: UsersService) {}

  /**
   * @description [POST] /users - 새로운 사용자를 생성합니다.
   * @param createUserDto - 요청 본문(body)에 담겨 올 사용자 생성 데이터입니다.
   */
  @Post()
  @ApiOperation({ summary: '새 사용자 생성' })
  @ApiResponse({
    status: 201,
    description: '성공적으로 사용자를 생성했습니다.',
  })
  @ApiResponse({
    status: 409, // 400 Bad Request 보다 409 Conflict가 중복된 리소스 생성 시도에 더 적합한 상태 코드입니다.
    description: '이미 존재하는 이메일입니다.',
  })
  create(@Body() createUserDto: CreateUserDto) {
    // UsersService의 create 메서드를 호출하여 비즈니스 로직을 수행합니다.
    return this.usersService.create(createUserDto);
  }

  /**
   * @description [GET] /users - 모든 사용자 목록을 조회합니다.
   */
  @Get()
  @ApiOperation({ summary: '모든 사용자 목록 조회' })
  @ApiResponse({ status: 200, description: '요청 성공' })
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * @description [GET] /users/:id - 특정 ID의 사용자 정보를 조회합니다.
   * @param id - URL 경로(path)에서 추출한 사용자의 고유 ID입니다.
   */
  @Get(':id')
  @ApiOperation({ summary: '특정 사용자 정보 조회' })
  @ApiResponse({ status: 200, description: '요청 성공' })
  @ApiResponse({
    status: 404,
    description: '해당 ID의 사용자를 찾을 수 없습니다.',
  })
  findOne(@Param('id') id: string) {
    // URL 파라미터는 문자열로 들어오므로, '+' 연산자를 사용해 숫자로 변환합니다.
    return this.usersService.findOne(+id);
  }

  /**
   * @description [PATCH] /users/:id - 특정 사용자의 정보를 수정합니다.
   * @param id - 수정할 사용자의 고유 ID입니다.
   * @param updateUserDto - 수정할 내용이 담긴 데이터입니다.
   */
  @Patch(':id')
  @ApiOperation({ summary: '사용자 정보 수정' })
  @ApiResponse({
    status: 200,
    description: '성공적으로 사용자 정보를 수정했습니다.',
  })
  @ApiResponse({
    status: 404,
    description: '해당 ID의 사용자를 찾을 수 없습니다.',
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  /**
   * @description [DELETE] /users/:id - 특정 사용자를 삭제합니다.
   * @param id - 삭제할 사용자의 고유 ID입니다.
   */
  @Delete(':id')
  @ApiOperation({ summary: '사용자 삭제' })
  @ApiResponse({
    status: 200,
    description: '성공적으로 사용자를 삭제했습니다.',
  })
  @ApiResponse({
    status: 404,
    description: '해당 ID의 사용자를 찾을 수 없습니다.',
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
