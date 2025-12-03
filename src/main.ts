import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ------------------------------
  // Servir imágenes subidas
  // ------------------------------

  app.useStaticAssets(join(__dirname, '..', 'upload'), {
    prefix: '/upload',
  });

  // ------------------------------
  // CORS para permitir frontend
  // ------------------------------
  app.enableCors({
    origin: process.env.FRONTEND_URL || '*',
  });

  // ------------------------------
  // Levantar servidor
  // ------------------------------
  await app.listen(process.env.PORT || 8080, '0.0.0.0');
}
bootstrap();