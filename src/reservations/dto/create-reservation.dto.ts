// NestJS Swagger 라이브러리에서 API 문서를 자동 생성하기 위해 사용하는 데코레이터입니다.
import { ApiProperty } from '@nestjs/swagger';
// class-transformer 라이브러리에서 들어온 요청 데이터를 DTO 클래스 타입으로 변환하기 위해 사용합니다.
import { Type } from 'class-transformer';
// class-validator 라이브러리에서 DTO의 속성들이 유효한 값인지 검증하기 위한 데코레이터들입니다.
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

/**
 * @class CreateReservationDto
 * @description 회의실 예약을 생성할 때 클라이언트로부터 받는 데이터의 형식을 정의하는 DTO(Data Transfer Object) 클래스입니다.
 * 각 속성은 class-validator와 class-transformer 데코레이터를 통해 유효성 검사 및 타입 변환이 이루어집니다.
 */
export class CreateReservationDto {
  // @ApiProperty: Swagger UI에 표시될 API 문서 정보를 설정합니다.
  @ApiProperty({
    description: '예약 시작 시간 (ISO 8601 형식)', // API 문서에 표시될 설명
    example: '2025-07-10T10:00:00Z', // API 문서에 표시될 예시 값
  })
  // @IsNotEmpty: 이 값은 비어 있으면 안 됩니다 (필수 항목).
  @IsNotEmpty({ message: '예약 시작 시간은 필수 입력 항목입니다.' })
  // @IsDate: 이 값은 유효한 날짜 형식이어야 합니다.
  @IsDate({ message: '유효한 날짜 형식이 아닙니다.' })
  // @Type: 들어온 데이터(예: JSON 문자열)를 Date 객체로 변환해 줍니다.
  @Type(() => Date)
  // startTime: 예약 시작 시간을 저장하는 속성입니다.
  startTime: Date;

  @ApiProperty({
    description: '예약 종료 시간 (ISO 8601 형식)',
    example: '2025-07-10T11:00:00Z',
  })
  @IsNotEmpty({ message: '예약 종료 시간은 필수 입력 항목입니다.' })
  @IsDate({ message: '유효한 날짜 형식이 아닙니다.' })
  @Type(() => Date)
  // endTime: 예약 종료 시간을 저장하는 속성입니다.
  endTime: Date;

  @ApiProperty({ description: '예약자(사용자)의 ID', example: 1 })
  @IsNotEmpty({ message: '예약자 ID는 필수 입력 항목입니다.' })
  // @IsNumber: 이 값은 숫자 형식이어야 합니다.
  @IsNumber({}, { message: '예약자 ID는 숫자여야 합니다.' })
  // reserverId: 예약을 생성하는 사용자의 고유 ID입니다.
  reserverId: number;

  @ApiProperty({ description: '예약할 회의실의 ID', example: 1 })
  @IsNotEmpty({ message: '회의실 ID는 필수 입력 항목입니다.' })
  @IsNumber({}, { message: '회의실 ID는 숫자여야 합니다.' })
  // roomId: 예약 대상 회의실의 고유 ID입니다.
  roomId: number;

  @ApiProperty({
    description: '참석자(사용자)들의 ID 배열 (선택 사항)',
    example: [2, 3], // 배열 형태의 예시
    required: false, // Swagger UI에서 선택적 항목으로 표시
  })
  // @IsArray: 이 값은 배열 형식이어야 합니다.
  @IsArray({ message: '참석자 목록은 배열 형태여야 합니다.' })
  // @IsNumber({}, { each: true }): 배열의 각 요소(each: true)가 숫자여야 함을 검증합니다.
  @IsNumber({}, { each: true, message: '각 참석자 ID는 숫자여야 합니다.' })
  // @IsOptional: 이 값은 선택적 항목으로, 요청 본문에 포함되지 않아도 유효성 검사를 통과합니다.
  @IsOptional()
  // attendeeIds: 회의에 참석하는 다른 사용자들의 ID 목록입니다. '?'는 TypeScript에서 이 속성이 없어도 됨을 의미합니다.
  attendeeIds?: number[];
}
