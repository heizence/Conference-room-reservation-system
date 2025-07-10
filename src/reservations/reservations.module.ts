// NestJS에서 모듈을 정의하기 위한 @Module 데코레이터를 가져옵니다.
import { Module } from '@nestjs/common';
// 이 모듈에서 사용할 서비스와 컨트롤러를 가져옵니다.
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
// TypeORM과 NestJS를 연동하기 위한 모듈을 가져옵니다.
import { TypeOrmModule } from '@nestjs/typeorm';
// 이 모듈의 서비스 레이어에서 사용할 엔티티(데이터베이스 테이블 모델)들을 가져옵니다.
import { Reservation } from './entities/reservation.entity';
import { User } from '../users/entities/user.entity';
import { Room } from '../rooms/entities/room.entity';

/**
 * @class ReservationsModule
 * @description 예약 관련 기능들을 하나로 묶어주는 모듈입니다.
 * @Module 데코레이터는 관련된 컨트롤러, 서비스, 그리고 필요한 다른 모듈들을 그룹화하는 역할을 합니다.
 */
@Module({
  // imports: 이 모듈에서 사용할 다른 모듈들을 배열에 등록합니다.
  imports: [
    // TypeOrmModule.forFeature(): 이 모듈의 스코프 내에서 사용할 Repository를 등록합니다.
    // 여기에 등록된 엔티티(Reservation, User, Room)들은 ReservationsService에서
    // Repository를 통해 데이터베이스와 상호작용하는 데 사용될 수 있습니다.
    TypeOrmModule.forFeature([Reservation, User, Room]),
  ],
  // controllers: 이 모듈에 포함될 컨트롤러들을 등록합니다.
  // 등록된 컨트롤러는 들어오는 HTTP 요청을 처리합니다.
  controllers: [ReservationsController],
  // providers: 이 모듈 내에서 사용될 서비스(Provider)들을 등록합니다.
  // 여기에 등록된 서비스는 NestJS의 의존성 주입(DI) 시스템을 통해
  // 컨트롤러 등 다른 구성 요소에 주입될 수 있습니다.
  providers: [ReservationsService],
})
export class ReservationsModule {}
