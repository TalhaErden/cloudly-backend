import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

dotenv.config();  // .env dosyasını yükle

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. CORS Konfigürasyonu
  app.enableCors({
    origin: process.env.CORS_ORIGIN || ['http://localhost:3001', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // 2. Swagger Konfigürasyonu
  const config = new DocumentBuilder()
    .setTitle('Cloudly Case Study API')
    .setDescription('Multi-Tenant Proje Yönetimi API Dökümantasyonu')
    .setVersion('1.0')
    .addTag('organizations')
    .addTag('projects')
    .addTag('tasks')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // Swagger'ı '/api' yoluna kuruyoruz
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();