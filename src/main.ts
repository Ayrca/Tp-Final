import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  try {
    app.enableCors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    });

    const port = process.env.PORT || 3000;

    // 👇 Railway necesita explícitamente 0.0.0.0
    await app.listen(port, '0.0.0.0');

    console.log(`Server running on port ${port}`);
  } catch (error) {
    console.error('🔥 ERROR AL INICIAR NESTJS 🔥');
    console.error(error);
  }
}

bootstrap();