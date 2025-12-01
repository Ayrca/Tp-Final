import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';  // <-- ESTE es el importante
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Permitir CORS para tu frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || '*',
  });

  // Escuchar en Railway
  await app.listen(process.env.PORT || 8080, '0.0.0.0');
}
bootstrap();