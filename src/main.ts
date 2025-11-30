import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS correctamente
  app.enableCors({
    origin: ['https://tp-final-neon.vercel.app'], // debe ser un array o string exacto
    credentials: true, // si envías cookies o auth headers
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // opcional, pero útil
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server running on port ${port}`);
}

bootstrap();