import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OficiosController } from './oficios.controller';
import { OficiosService } from './oficios.service';
import { Oficio } from './oficios.entity';
import { ImagenOficiosModule } from '../imagenOficios/imagenOficios.module';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';

@Module({
  imports: [
    TypeOrmModule.forFeature([Oficio]),
    ImagenOficiosModule,
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
  controllers: [OficiosController],
  providers: [OficiosService],
  exports: [OficiosService],
})
export class OficiosModule {}
