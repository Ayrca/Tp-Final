import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS solo
  app.enableCors({
    origin: 'https://tp-final-neon.vercel.app',
    credentials: true, // permite enviar cookies y headers de autenticación
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server running on port ${port}`);
}

bootstrap();