import { Controller, Post, UploadedFile, UseInterceptors, Param, BadRequestException, Get } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagenService } from './imagen.service';
import { ProfesionalService } from '../profesional/profesional.service';
import cloudinary from '../cloudinary.config';

@Controller('imagen')
export class ImagenController {
  constructor(
    private readonly imagenService: ImagenService,
    private readonly profesionalService: ProfesionalService,
  ) {}

  // Subir imagen de trabajos anteriores
  @Post('upload/:idProfesional')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File, 
    @Param('idProfesional') idProfesional: number
  ) {
    if (!file) throw new BadRequestException('Archivo requerido');

    // Usamos tu método existente guardarImagen
    const imagen = await this.imagenService.guardarImagen(file, idProfesional);

    return imagen; // retorna el objeto con la URL que guardó en la DB
  }

  // Obtener todas las imágenes de un profesional
  @Get(':id')
  async getImage(@Param('id') id: number) {
    const imagenes = await this.imagenService.findById(id);
    if (!imagenes || imagenes.length === 0) return [];
    return imagenes.map((imagen) => ({ url: imagen.url }));
  }
}
