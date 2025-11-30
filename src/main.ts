import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: 'Content-Type, Accept, Authorization',
    },
  });

  console.log("FRONTEND_URL desde Railway:", process.env.FRONTEND_URL);

  const port = process.env.PORT || 3000;

  // 🔥 ESTA LÍNEA ES CLAVE PARA RAILWAY 🔥
  await app.listen(port, '0.0.0.0');

  console.log(`Server running on port ${port}`);
}

bootstrap();