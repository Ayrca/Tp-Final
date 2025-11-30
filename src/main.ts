import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  console.log("🔵 FRONTEND_URL:", process.env.FRONTEND_URL);

  app.enableCors({
    origin: (origin, callback) => {
      console.log("🔵 Origin recibido:", origin);

      const permitido = [process.env.FRONTEND_URL];

      if (!origin) return callback(null, true);

      if (permitido.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ CORS bloqueado:", origin);
        callback(new Error("No permitido por CORS"), false);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Server running on port ${port}`);
}

bootstrap();
