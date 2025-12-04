import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { AvatarImagenController } from './avatarImagen.controller';
import { AvatarImagenService } from './avatarImagen.service';
import { Usuario } from '../usuario/usuario.entity';
import { Profesional } from '../profesional/profesional.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as multer from 'multer';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, Profesional]),
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
      limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
      },
    }),
  ],
  controllers: [AvatarImagenController],
  providers: [AvatarImagenService],
})
export class AvatarImagenModule {}
