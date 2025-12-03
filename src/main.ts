import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Servir carpeta public del cliente (React)
  app.useStaticAssets(join(__dirname, '..', 'client', 'public'));

  // Servir imágenes de usuarios profesionales
  app.useStaticAssets(join(__dirname, '..', 'assets'), {
    prefix: '/assets/',
  });

  // Permitir CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || '*',
  });

  // Escuchar en Railway
  await app.listen(process.env.PORT || 8080, '0.0.0.0');
}
bootstrap();