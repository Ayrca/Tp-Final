import { Module } from '@nestjs/common';
import { ImagenController } from './imagen.controller';
import { ImagenService } from './imagen.service';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Imagen } from './imagen.entity';
import { Usuario } from '../usuario/usuario.entity';
import { Profesional } from '../profesional/profesional.entity';
import { UsuarioModule } from '../usuario/usuario.module';
import { ProfesionalModule } from '../profesional/profesional.module';
import * as multer from 'multer';

@Module({
  imports: [
    // Multer ahora en memoria, sin guardar archivos localmente
    MulterModule.register({
      storage: multer.memoryStorage(),
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Tipo de archivo no permitido'), false);
        }
      },
    }),
    TypeOrmModule.forFeature([Imagen, Usuario, Profesional]),
    UsuarioModule,
    ProfesionalModule,
  ],
  controllers: [ImagenController],
  providers: [ImagenService],
})
export class ImagenModule {}