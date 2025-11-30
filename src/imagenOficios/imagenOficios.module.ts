import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ImagenOficiosController } from './imagenOficios.controller';
import { ImagenOficiosService } from './imagenOficios.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './imagenOficios/',
    }),
  ],
  controllers: [ImagenOficiosController],
  providers: [ImagenOficiosService],
  exports: [ImagenOficiosService], 
})

export class ImagenOficiosModule {}