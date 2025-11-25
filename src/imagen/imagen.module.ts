

import { Module } from '@nestjs/common';
import { ImagenController } from './imagen.controller';
import { ImagenService } from './imagen.service';
import { MulterModule } from '@nestjs/platform-express';
import { Imagen } from './imagen.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    MulterModule.register({
      dest: './client/public/assets/imagenesUsuarios', // carpeta donde se guardarán las imágenes
    }),
    TypeOrmModule.forFeature([Imagen]), // Agrega esto
  ],
  controllers: [ImagenController],
  providers: [ImagenService],
})
export class ImagenModule {}

