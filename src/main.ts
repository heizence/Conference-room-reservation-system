import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger 문서 설정
  const config = new DocumentBuilder()
    .setTitle('회의실 예약 시스템 API')
    .setDescription('회의실 예약 시스템을 위한 API 명세서입니다.')
    .setVersion('1.0')
    .build();

  // Swagger 문서 생성
  const document = SwaggerModule.createDocument(app, config);
  // '/api' 경로에 Swagger UI를 설정
  SwaggerModule.setup('apidoc', app, document);

  const PORT = Number(process.env.PORT!);
  await app.listen(PORT);
}
bootstrap();
