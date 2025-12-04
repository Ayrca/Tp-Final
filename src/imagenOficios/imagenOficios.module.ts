import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ImagenOficiosController } from './imagenOficios.controller';
import { ImagenOficiosService } from './imagenOficios.service';
import * as multer from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: multer.memoryStorage(), // archivos en memoria para subir a Cloudinary
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Tipo de archivo no permitido'), false);
        }
      },
    }),
  ],
  controllers: [ImagenOficiosController],
  providers: [ImagenOficiosService],
  exports: [ImagenOficiosService], 
})
export class ImagenOficiosModule {}
