// NestJS Swagger 라이브러리에서 API 문서를 자동 생성하기 위해 사용하는 데코레이터입니다.
import { ApiProperty } from '@nestjs/swagger';
// class-validator 라이브러리에서 DTO의 속성들이 유효한 값인지 검증하기 위한 데코레이터들입니다.
import { IsNotEmpty, IsNumber } from 'class-validator';

/**
 * @class DeleteReservationDto
 * @description 회의실 예약을 삭제할 때 클라이언트로부터 받는 데이터의 형식을 정의하는 DTO입니다.
 * 예약 삭제 권한을 확인하기 위해 요청을 보낸 사용자의 ID를 포함합니다.
 */
export class DeleteReservationDto {
  // @ApiProperty: Swagger UI에 표시될 API 문서 정보를 설정합니다.
  @ApiProperty({
    description: '삭제를 요청하는 사용자(예약자)의 ID',
    example: 1,
  })
  // @IsNotEmpty: 이 값은 비어 있으면 안 됩니다 (필수 항목).
  @IsNotEmpty({ message: '요청자 ID는 필수 입력 항목입니다.' })
  // @IsNumber: 이 값은 숫자 형식이어야 합니다.
  @IsNumber({}, { message: '요청자 ID는 숫자여야 합니다.' })
  // requestingUserId: 예약 삭제를 시도하는 사용자의 고유 ID입니다.
  // 이 ID를 통해 해당 사용자가 예약을 삭제할 권한(예: 예약 당사자)이 있는지 서버에서 검증합니다.
  requestingUserId: number;
}
