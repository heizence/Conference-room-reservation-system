// NestJS에서 모듈을 정의하기 위한 @Module 데코레이터를 가져옵니다.
import { Module } from '@nestjs/common';
// 이 모듈에서 사용할 서비스와 컨트롤러를 가져옵니다.
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
// TypeORM과 NestJS를 연동하기 위한 모듈을 가져옵니다.
import { TypeOrmModule } from '@nestjs/typeorm';
// 이 모듈의 서비스 레이어에서 사용할 Room 엔티티를 가져옵니다.
import { Room } from './entities/room.entity';

/**
 * @class RoomsModule
 * @description 회의실 관련 기능(Controller, Service)들을 하나로 묶어주는 모듈입니다.
 */
@Module({
  // imports: 이 모듈에서 사용할 다른 모듈들을 등록합니다.
  imports: [
    // TypeOrmModule.forFeature(): 이 모듈의 스코프 내에서 사용할 Repository를 등록합니다.
    // 여기에 등록된 Room 엔티티는 RoomsService에서 Repository를 통해 데이터베이스와 상호작용하는 데 사용됩니다.
    TypeOrmModule.forFeature([Room]),
  ],
  // controllers: 이 모듈에 포함될 컨트롤러들을 등록합니다.
  controllers: [RoomsController],
  // providers: 이 모듈 내에서 사용될 서비스(Provider)들을 등록합니다.
  // 등록된 서비스는 NestJS의 의존성 주입(DI) 시스템을 통해 주입될 수 있습니다.
  providers: [RoomsService],
})
export class RoomsModule {}
