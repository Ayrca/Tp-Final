import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS solo
  app.enableCors({
    origin: 'https://tp-final-83udg9es2-ayrtons-projects-e1e3b1b7.vercel.app',
    credentials: true, // permite enviar cookies y headers de autenticación
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server running on port ${port}`);
}

bootstrap();