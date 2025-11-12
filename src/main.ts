

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
//  app.useStaticAssets(join(__dirname, '..', 'client', 'public'));
  app.enableCors({
    origin: 'http://localhost:3001',
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();


