import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsModule } from './rooms/rooms.module';
import { UsersModule } from './users/users.module';
import { ReservationsModule } from './reservations/reservations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbType = configService.get<string>('DB_TYPE');

        // DB_TYPE 값에 따라 다른 설정 객체를 반환한다.
        switch (dbType) {
          case 'sqlite':
            // 'sqlite'일 경우, SQLite에 맞는 설정만 반환한다.
            return {
              type: 'sqlite',
              database: configService.get<string>('DB_DATABASE'),
              autoLoadEntities: true,
              synchronize:
                configService.get<string>('DB_SYNCHRONIZE') === 'true',
            };
          case 'postgres':
            // 'postgres'일 경우, PostgreSQL에 맞는 설정만 반환한다.
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
          // 다른 DB 타입이 필요하면 여기에 case를 추가
          default:
            // 지원하지 않는 DB 타입이면 에러를 발생시킨다.
            throw new Error(`Unsupported database type: ${dbType}`);
        }
      },
      inject: [ConfigService],
    }),
    RoomsModule,
    UsersModule,
    ReservationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
