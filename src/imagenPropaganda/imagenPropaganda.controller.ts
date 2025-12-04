import { Controller, Post, Delete, Param, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagenPropagandaService } from './imagenPropaganda.service';
import * as multer from 'multer';
import type { Express } from 'express';

@Controller('imagenPropaganda')
export class ImagenPropagandaController {
  constructor(private readonly imagenService: ImagenPropagandaService) {}

  @Post()
  @UseInterceptors(FileInterceptor('imagen', {
    storage: multer.memoryStorage(),
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
  }))
  async subirImagen(@UploadedFile() imagen?: Express.Multer.File): Promise<string> {
    if (!imagen) {
      throw new BadRequestException('No se proporcionó ninguna imagen');
    }
    return this.imagenService.subirImagen(imagen);
  }

  @Delete(':publicId')
  async borrarImagen(@Param('publicId') publicId: string): Promise<void> {
    if (!publicId) {
      throw new BadRequestException('No se proporcionó el publicId');
    }
    return this.imagenService.borrarImagen(publicId);
  }
}
