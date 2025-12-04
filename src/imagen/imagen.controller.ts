import { Controller, Post, Get, UploadedFile, Param, UseInterceptors, HttpException, HttpStatus } from '@nestjs/common';
import { ImagenService } from './imagen.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import type { Express } from 'express';

@Controller('imagen')
export class ImagenController {
  constructor(private readonly imagenService: ImagenService) {}

  // Subir imagen de trabajo
  @Post('upload/:idProfesional')
  @UseInterceptors(FileInterceptor('file', {
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (allowedMimeTypes.includes(file.mimetype)) cb(null, true);
      else cb(new Error('Tipo de archivo no permitido'), false);
    },
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
  }))
  async uploadImagen(
    @UploadedFile() file?: Express.Multer.File,
    @Param('idProfesional') idProfesional?: number,
  ) {
    if (!file) {
      throw new HttpException('No se ha proporcionado un archivo', HttpStatus.BAD_REQUEST);
    }
    if (!idProfesional) {
      throw new HttpException('idProfesional es requerido', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.imagenService.subirImagen(file, idProfesional);
    } catch (error) {
      console.error(error);
      throw new HttpException('Error al subir la imagen', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Obtener todas las imágenes de un profesional
  @Get(':idProfesional')
  async getImagenes(@Param('idProfesional') idProfesional: number) {
    return this.imagenService.obtenerImagenes(idProfesional);
  }
}
