import { Controller, Post, UploadedFile, Param, UseInterceptors, HttpException, HttpStatus } from '@nestjs/common';
import { AvatarImagenService } from './avatarImagen.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import type { Express } from 'express';

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
  async subirAvatar(
    @UploadedFile() file?: Express.Multer.File,
    @Param('idUsuario') idUsuario?: number,
    @Param('tipoUsuario') tipoUsuario?: 'comun' | 'profesional',
  ) {
    if (!file) {
      throw new HttpException(
        { message: 'No se ha proporcionado un archivo', type: 'error' },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!idUsuario || !tipoUsuario) {
      throw new HttpException(
        { message: 'Parámetros inválidos', type: 'error' },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      // Subir a Cloudinary y guardar la URL en la DB
      return await this.avatarImagenService.subirAvatar(file, idUsuario, tipoUsuario);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        { message: 'Error al subir el archivo', type: 'error' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
