// NestJS의 모듈 데코레이터를 가져옵니다.
import { Module } from '@nestjs/common';
// .env 파일의 환경 변수를 애플리케이션 전반에서 사용할 수 있게 해주는 Config 모듈과 서비스를 가져옵니다.
import { ConfigModule, ConfigService } from '@nestjs/config';
// 애플리케이션의 루트 경로를 처리하는 컨트롤러와 서비스를 가져옵니다.
import { AppController } from './app.controller';
import { AppService } from './app.service';
// TypeORM 모듈을 가져옵니다.
import { TypeOrmModule } from '@nestjs/typeorm';
// 애플리케이션의 각 기능(Feature) 모듈들을 가져옵니다.
import { RoomsModule } from './rooms/rooms.module';
import { UsersModule } from './users/users.module';
import { ReservationsModule } from './reservations/reservations.module';

/**
 * @class AppModule
 * @description 애플리케이션의 루트 모듈(Root Module)입니다.
 * 모든 기능 모듈, 설정 모듈, 데이터베이스 연결 등을 여기서 통합하고 구성합니다.
 */
@Module({
  // imports: 이 모듈에서 사용할 다른 모듈들을 등록합니다.
  imports: [
    // 1. 설정 모듈 (ConfigModule)
    ConfigModule.forRoot({
      // isGlobal: true 옵션은 ConfigModule을 전역(Global) 모듈로 설정합니다.
      // 이로 인해 다른 모듈에서 ConfigModule을 다시 import하지 않아도 ConfigService를 주입하여 사용할 수 있습니다.
      isGlobal: true,
    }),
    // 2. 데이터베이스 연동 모듈 (TypeOrmModule)
    // forRootAsync를 사용하여 비동기적으로 모듈을 설정합니다.
    // ConfigModule이 환경 변수를 로드할 때까지 기다린 후 DB 설정을 하기 위함입니다.
    TypeOrmModule.forRootAsync({
      // 이 모듈 설정 내에서 사용할 다른 모듈을 지정합니다. 여기서는 ConfigService를 주입받기 위해 필요합니다.
      imports: [ConfigModule],
      // useFactory는 동적으로 모듈 설정을 생성하는 함수입니다.
      // 이 함수는 'inject'에 명시된 provider들을 매개변수로 받습니다.
      useFactory: (configService: ConfigService) => {
        // .env 파일에서 DB_TYPE 값을 읽어옵니다.
        const dbType = configService.get<string>('DB_TYPE');

        // DB_TYPE 값에 따라 다른 설정 객체를 반환하는 동적 설정 로직입니다.
        switch (dbType) {
          case 'sqlite':
            // 'sqlite'일 경우, SQLite에 맞는 설정만 반환합니다.
            return {
              type: 'sqlite',
              database: configService.get<string>('DB_DATABASE'), // 사용할 SQLite 파일 경로
              autoLoadEntities: true, // true로 설정하면 TypeORM이 엔티티를 자동으로 로드합니다. (엔티티를 수동으로 배열에 나열할 필요 없음)
              synchronize:
                configService.get<string>('DB_SYNCHRONIZE') === 'true', // true일 경우, 앱 실행 시 엔티티와 DB 스키마를 동기화합니다. (개발 환경에서만 사용하는 것을 강력히 권장)
            };
          case 'postgres':
            // 'postgres'일 경우, PostgreSQL에 맞는 설정만 반환합니다.
            return {
              type: 'postgres',
              host: configService.get<string>('DB_HOST'),
              port: configService.get<number>('DB_PORT'),
              username: configService.get<string>('DB_USERNAME'),
              password: configService.get<string>('DB_PASSWORD'),
              database: configService.get<string>('DB_DATABASE'),
              autoLoadEntities: true,
              synchronize:
                configService.get<string>('DB_SYNCHRONIZE') === 'true',
            };
          // 다른 DB 타입(예: mysql)이 필요하면 여기에 case를 추가할 수 있습니다.
          default:
            // 지원하지 않는 DB 타입이면 에러를 발생시켜 서버 실행을 중단합니다.
            throw new Error(`지원하지 않는 데이터베이스 타입입니다: ${dbType}`);
        }
      },
      // useFactory 함수에 주입할 Provider를 지정합니다.
      inject: [ConfigService],
    }),
    // 3. 기능 모듈 (Feature Modules)
    // 각 기능별로 분리된 모듈들을 여기에 등록하여 애플리케이션에 통합합니다.
    RoomsModule,
    UsersModule,
    ReservationsModule,
  ],
  // controllers: 이 모듈(AppModule)에 포함될 컨트롤러들을 등록합니다.
  controllers: [AppController],
  // providers: 이 모듈 내에서 사용될 서비스들을 등록합니다.
  providers: [AppService],
})
export class AppModule {}
