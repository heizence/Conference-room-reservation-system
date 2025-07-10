// @nestjs/swagger에서 API 문서 생성을 위한 ApiProperty와
// 기존 DTO의 모든 속성을 선택적으로 만들어주는 PartialType 유틸리티를 가져옵니다.
import { ApiProperty, PartialType } from '@nestjs/swagger';
// 예약 생성 시 사용했던 DTO를 재사용하기 위해 가져옵니다.
import { CreateReservationDto } from './create-reservation.dto';
// 유효성 검사를 위한 데코레이터를 가져옵니다.
import { IsNotEmpty, IsNumber } from 'class-validator';

/**
 * @class UpdateReservationDto
 * @description 회의실 예약을 수정할 때 사용하는 DTO입니다.
 * * `PartialType(CreateReservationDto)`를 상속받아,
 * CreateReservationDto의 모든 필드(`startTime`, `endTime` 등)를 선택적(optional)으로 만듭니다.
 * 이를 통해 클라이언트는 변경하려는 필드만 요청 본문에 담아 보낼 수 있습니다.
 */
export class UpdateReservationDto extends PartialType(CreateReservationDto) {
  // @ApiProperty: Swagger UI에 표시될 API 문서 정보를 설정합니다.
  @ApiProperty({
    description: '수정을 요청하는 사용자(예약자)의 ID',
    example: 1,
  })
  // @IsNotEmpty: 이 값은 비어 있으면 안 됩니다.
  @IsNotEmpty({ message: '요청자 ID는 필수 입력 항목입니다.' })
  // @IsNumber: 이 값은 숫자 형식이어야 합니다.
  @IsNumber({}, { message: '요청자 ID는 숫자여야 합니다.' })
  // requestingUserId: 예약 수정을 시도하는 사용자의 고유 ID입니다.
  // 이 ID를 통해 서버는 해당 사용자가 예약을 수정할 권한이 있는지 검증합니다.
  requestingUserId: number;
}
