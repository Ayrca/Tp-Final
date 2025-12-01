import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de CORS
  const frontend = process.env.FRONTEND_URL || '*';
  console.log("🔵 FRONTEND_URL:", frontend);

  app.enableCors({
    origin: frontend,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Puerto de Railway o fallback a 3000
  const port = process.env.PORT || 3000;
  console.log('🔵 PORT env:', process.env.PORT);

  // Mantener el servidor escuchando en todas las interfaces
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Server running on port ${port}`);

  // Captura de señales para depuración
  process.on('SIGTERM', () => {
    console.log('⚠️ SIGTERM recibido. Cerrando aplicación...');
    process.exit(0);
  });

  process.on('SIGINT', () => {
    console.log('⚠️ SIGINT recibido. Cerrando aplicación...');
    process.exit(0);
  });
}

bootstrap();
