import { Controller, Post, UploadedFile, Param, UseInterceptors } from '@nestjs/common';
import { AvatarImagenService } from './avatarImagen.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import { diskStorage } from 'multer';

@Controller('avatar')
export class AvatarImagenController {
  constructor(private readonly avatarImagenService: AvatarImagenService) {}

  @Post('subir/:idUsuario/:tipoUsuario')
  @UseInterceptors(FileInterceptor('avatar', {
    storage: diskStorage({
      destination: './client/public/assets/imagenesDePerfilesUsuarios/',
      filename: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname);
        const fileName = Date.now() + fileExtension;
        cb(null, fileName);
      },
    }),

    fileFilter: (req, file, cb) => {
      const allowedMimeTypes = [
        'image/jpeg',  // JPG y JPEG
        'image/png',
        'image/gif',
        'image/webp',  
        'image/heic',
        'image/heif', 
      ];
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Tipo de archivo no permitido'), false);
      }
    }

  }))
  async subirAvatar(@UploadedFile() file: Express.Multer.File, @Param('idUsuario') idUsuario: number, @Param('tipoUsuario') tipoUsuario: string) {
    try {
      if (!file) {
        throw new HttpException({ message: 'No se ha proporcionado un archivo', type: 'error' }, HttpStatus.BAD_REQUEST);
      }
      const usuario = await this.avatarImagenService.obtenerUsuario(idUsuario, tipoUsuario);
      if (usuario) {
        const imagenActual = usuario.avatar;
        if (imagenActual && typeof imagenActual === 'string') {
          const nombreImagen = imagenActual.split('/').pop();
          if (nombreImagen) {
            const rutaImagenActual = path.join(__dirname, '..', 'client', 'public', imagenActual.replace('/', '')); try {
              if (fs.existsSync(rutaImagenActual)) {
                fs.unlinkSync(rutaImagenActual);
                console.log(`La imagen ${nombreImagen} ha sido eliminada`);
              } else {
                console.log(`La imagen ${nombreImagen} no existe en la carpeta`);
              }
            } catch (error) {
              console.error(`Error al eliminar la imagen ${nombreImagen}:, error`);
            }
          }
        }
      } else {
        console.error('Usuario no encontrado');
        throw new HttpException({ message: 'Usuario no encontrado', type: 'error' }, HttpStatus.NOT_FOUND);
      }
      return this.avatarImagenService.subirAvatar(file, idUsuario, tipoUsuario);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else if (error.message === 'Tipo de archivo no permitido') {
        throw new HttpException({ message: 'Tipo de archivo no permitido', type: 'error' }, HttpStatus.BAD_REQUEST);
      } else {
        console.error(error);
        throw new HttpException({ message: 'Error al subir el archivo', type: 'error' }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}