// NestJS 애플리케이션 인스턴스를 생성하기 위한 NestFactory를 가져옵니다.
import { NestFactory } from '@nestjs/core';
// 애플리케이션의 루트 모듈인 AppModule을 가져옵니다.
import { AppModule } from './app.module';
// 요청 데이터의 유효성 검사를 위한 ValidationPipe를 가져옵니다.
import { ValidationPipe } from '@nestjs/common';
// Swagger(OpenAPI) 문서 생성을 위한 클래스들을 가져옵니다.
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * @function bootstrap
 * @description 애플리케이션을 초기화하고 실행하는 메인 함수입니다.
 */
async function bootstrap() {
  // NestFactory.create()를 사용하여 AppModule을 기반으로 NestJS 애플리케이션 인스턴스를 생성합니다.
  const app = await NestFactory.create(AppModule);

  // app.useGlobalPipes()를 통해 애플리케이션 전체에 적용될 파이프를 설정합니다.
  // ValidationPipe는 class-validator와 함께 DTO의 유효성 검사를 자동으로 수행해 줍니다.
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true
      // DTO에 정의되지 않은 속성이 요청 데이터에 포함되어 있으면 해당 속성을 자동으로 제거합니다.
      whitelist: true,

      // forbidNonWhitelisted: true
      // DTO에 정의되지 않은 속성이 있으면 제거하는 대신, 에러를 발생시킵니다. (보안 강화)
      forbidNonWhitelisted: true,

      // transform: true
      // 클라이언트로부터 받은 평문(plain) JavaScript 객체를 DTO 클래스의 인스턴스로 변환합니다.
      transform: true,
      transformOptions: {
        // enableImplicitConversion: true
        // 경로 파라미터나 쿼리 스트링으로 받은 문자열을 DTO에 명시된 타입(예: number, boolean)으로 암묵적으로 변환해 줍니다.
        enableImplicitConversion: true,
      },
    }),
  );

  // --- Swagger(API 문서) 설정 시작 ---

  // 1. DocumentBuilder를 사용하여 Swagger 문서의 기본 설정을 구성합니다.
  const config = new DocumentBuilder()
    .setTitle('회의실 예약 시스템 API') // 문서의 제목
    .setDescription('회의실 예약 시스템을 위한 API 명세서입니다.') // 문서에 대한 설명
    .setVersion('1.0') // API 버전
    .build(); // 설정 객체 생성

  // 2. SwaggerModule.createDocument()를 사용하여 애플리케이션 구조를 분석하고 완전한 Swagger 문서를 생성합니다.
  const document = SwaggerModule.createDocument(app, config);

  // 3. SwaggerModule.setup()을 통해 특정 경로에 Swagger UI를 설정합니다.
  // 이제 '서버주소/apidoc'으로 접속하면 API 문서를 볼 수 있습니다.
  SwaggerModule.setup('apidoc', app, document);

  // --- Swagger 설정 종료 ---

  // .env 파일에서 PORT 환경 변수를 읽어와 서버 포트로 사용합니다.
  const PORT = Number(process.env.PORT) || 3000; // 환경 변수가 없으면 3000번 포트를 기본값으로 사용
  // 설정된 포트로 들어오는 HTTP 요청을 수신 대기합니다.
  await app.listen(PORT);
}

// 애플리케이션을 시작합니다.
bootstrap();
