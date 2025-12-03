import { Module } from '@nestjs/common';
import { ImagenController } from './imagen.controller';
import { ImagenService } from './imagen.service';
import { MulterModule } from '@nestjs/platform-express';
import { Imagen } from './imagen.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { extname } from 'path';
import { Usuario } from '../usuario/usuario.entity';
import { Profesional } from '../profesional/profesional.entity';
import { UsuarioModule } from '../usuario/usuario.module';
import { ProfesionalModule } from '../profesional/profesional.module';
@Module({
  imports: [
    MulterModule.register({
    dest: './src/upload/imagenesUsuariosProfesionales',
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