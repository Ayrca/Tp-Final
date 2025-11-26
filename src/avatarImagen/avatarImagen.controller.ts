import { Controller, Post, UploadedFile, Param, UseInterceptors  } from '@nestjs/common';
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
@UseInterceptors(FileInterceptor('avatar'))
async subirAvatar(@UploadedFile() file: Express.Multer.File, @Param('idUsuario') idUsuario: number, @Param('tipoUsuario') tipoUsuario: string) {

      console.log('idUsuario:', idUsuario);
  console.log('tipoUsuario:', tipoUsuario);
  console.log('file:', file);
  try {
    if (!file) {
      throw new HttpException('No se ha proporcionado un archivo', HttpStatus.BAD_REQUEST);
    }
    const uploadPath = path.join(__dirname, '..', 'client', 'public', 'assets', 'imagenesDePerfilesUsuarios');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    return this.avatarImagenService.subirAvatar(file, idUsuario, tipoUsuario);
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    } else {
      console.error(error);
      throw new HttpException('Error al subir el archivo', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}



}