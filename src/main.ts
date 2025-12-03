import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Servir TODO client/public
  app.useStaticAssets(
    join(__dirname, '..', 'client', 'public')
  );

  // Servir específicamente la carpeta /assets con su prefijo
  app.useStaticAssets(
    join(__dirname, '..', 'client', 'public', 'assets'),
    { prefix: '/assets/' }
  );

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || '*',
  });

  await app.listen(process.env.PORT || 8080, '0.0.0.0');
}
bootstrap();
