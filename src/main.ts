import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Servir la carpeta 'public' para imágenes y assets
  app.useStaticAssets(join(__dirname, '..', 'client', 'public'));

  // Permitir CORS para tu frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || '*',
  });

  // Escuchar en Railway / Vercel
  await app.listen(process.env.PORT || 8080, '0.0.0.0');
}
bootstrap();