import { Controller, Post, UploadedFile, Body, Param, UseInterceptors, HttpException, HttpStatus, Get, Put, Delete } from '@nestjs/common';
import { PublicidadService } from './publicidad.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import type { Express } from 'express';
import cloudinary from '../cloudinary.config';
import { Publicidad } from './publicidad.entity';

@Controller('publicidad')
export class PublicidadController {
  constructor(private readonly publicidadService: PublicidadService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (allowedMimeTypes.includes(file.mimetype)) cb(null, true);
      else cb(new Error('Tipo de archivo no permitido'), false);
    },
    limits: { fileSize: 1024 * 1024 * 5 },
  }))
  async createWithImage(
    @UploadedFile() file?: Express.Multer.File,
    @Body('titulo') titulo?: string,
    @Body('urlPagina') urlPagina?: string,
  ): Promise<Publicidad> {
    if (!file) throw new HttpException('No se ha proporcionado archivo', HttpStatus.BAD_REQUEST);
    if (!titulo || !urlPagina) throw new HttpException('Titulo y URL son requeridos', HttpStatus.BAD_REQUEST);

    try {
      const urlImagen = await new Promise<string>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'publicidad' },
          (error, result) => {
            if (error) return reject(error);
            if (!result?.secure_url) return reject(new Error('No se obtuvo URL de Cloudinary'));
            resolve(result.secure_url);
          }
        );
        stream.end(file.buffer);
      });

      const nuevaPublicidad = new Publicidad();
      nuevaPublicidad.titulo = titulo;
      nuevaPublicidad.urlPagina = urlPagina;
      nuevaPublicidad.urlImagen = urlImagen;

      return this.publicidadService.create(nuevaPublicidad);
    } catch (error) {
      console.error(error);
      throw new HttpException('Error al subir la imagen', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // -----------------------------
  // ✅ Convertimos @Param('id') a number
  // -----------------------------
  @Put(':id')
  async update(@Param('id') id: string, @Body() publicidad: Publicidad): Promise<Publicidad> {
    const idNum = parseInt(id, 10);
    if (isNaN(idNum)) throw new HttpException('ID inválido', HttpStatus.BAD_REQUEST);
    return this.publicidadService.update(idNum, publicidad);
  }

  @Get()
  async findAll(): Promise<Publicidad[]> {
    return this.publicidadService.findAll();
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    const idNum = parseInt(id, 10);
    if (isNaN(idNum)) throw new HttpException('ID inválido', HttpStatus.BAD_REQUEST);
    return this.publicidadService.delete(idNum);
  }
}
