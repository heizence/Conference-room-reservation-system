// NestJS Swagger 라이브러리에서 API 문서를 자동 생성하기 위해 사용하는 데코레이터입니다.
import { ApiProperty } from '@nestjs/swagger';
// class-validator 라이브러리에서 DTO의 속성들이 유효한 값인지 검증하기 위한 데코레이터들입니다.
import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

/**
 * @class CreateRoomDto
 * @description 새로운 회의실을 생성할 때 클라이언트로부터 받는 데이터의 형식을 정의하는 DTO입니다.
 */
export class CreateRoomDto {
  // @ApiProperty: Swagger UI에 표시될 API 문서 정보를 설정합니다.
  @ApiProperty({ description: '회의실 이름', example: '1번 대회의실' })
  // @IsString: 이 값은 문자열 형식이어야 합니다.
  @IsString({ message: '회의실 이름은 문자열이어야 합니다.' })
  // name: 회의실의 이름을 저장하는 속성입니다.
  name: string;

  @ApiProperty({ description: '회의실 위치 (층)', example: 5 })
  // @IsNumber: 이 값은 숫자 형식이어야 합니다.
  @IsNumber({}, { message: '층 정보는 숫자여야 합니다.' })
  // floor: 회의실이 위치한 층을 저장하는 속성입니다.
  floor: number;

  @ApiProperty({ description: '최대 수용 인원', example: 20 })
  // @IsInt: 이 값은 정수여야 합니다.
  @IsInt({ message: '수용 인원은 정수여야 합니다.' })
  // @Min(1): 이 값은 최소 1 이상이어야 합니다.
  @Min(1, { message: '수용 인원은 최소 1명 이상이어야 합니다.' })
  // capacity: 회의실의 최대 수용 인원을 저장하는 속성입니다.
  capacity: number;

  @ApiProperty({
    description: '상세 위치 (선택 사항)',
    example: 'A동 301호 옆',
    required: false, // Swagger UI에서 선택적 항목으로 표시합니다.
  })
  @IsString({ message: '상세 위치는 문자열이어야 합니다.' })
  // @IsOptional: 이 값은 선택적 항목으로, 요청 본문에 포함되지 않아도 유효성 검사를 통과합니다.
  @IsOptional()
  // location: 회의실의 구체적인 위치 설명을 저장하는 속성입니다. '?'는 TypeScript에서 이 속성이 없어도 됨을 의미합니다.
  location?: string;
}
