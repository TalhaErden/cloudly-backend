import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Validation (DTO) Kontrollerini Aktif Et
  // Bunu yapmazsak @IsNotEmpty gibi kurallar çalışmaz!
  app.useGlobalPipes(new ValidationPipe());

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