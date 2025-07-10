// NestJS Swagger 라이브러리에서 API 문서를 자동 생성하기 위해 사용하는 데코레이터입니다.
import { ApiProperty } from '@nestjs/swagger';
// class-validator 라이브러리에서 DTO의 속성들이 유효한 값인지 검증하기 위한 데코레이터입니다.
import { IsString } from 'class-validator';

/**
 * @class CreateUserDto
 * @description 새로운 사용자를 생성할 때 클라이언트로부터 받는 데이터의 형식을 정의하는 DTO입니다.
 */
export class CreateUserDto {
  // @ApiProperty: Swagger UI에 표시될 API 문서 정보를 설정합니다.
  @ApiProperty({ description: '사용자 이름', example: '홍길동' })
  // @IsString: 이 값은 문자열 형식이어야 함을 검증합니다.
  @IsString()
  // name: 사용자의 이름을 저장하는 속성입니다.
  name: string;

  @ApiProperty({ description: '사용자 이메일', example: 'gildong@example.com' })
  @IsString()
  // email: 사용자의 이메일 주소를 저장하는 속성입니다.
  email: string;
}
