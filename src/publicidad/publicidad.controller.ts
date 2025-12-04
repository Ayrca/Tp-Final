import { Controller, Get, Post, Put, Delete, Body, Param, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PublicidadService } from './publicidad.service';
import { Publicidad } from './publicidad.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import cloudinary from '../cloudinary.config';

@Controller('publicidad')
export class PublicidadController {
  constructor(private readonly publicidadService: PublicidadService) {}

  @Get()
  async findAll(@Query('nombre_like') tituloLike: string): Promise<Publicidad[]> {
    if (tituloLike) {
      return this.publicidadService.findByNombreLike(tituloLike);
    } else {
      return this.publicidadService.findAll();
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Publicidad> {
    return this.publicidadService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.publicidadService.delete(id);
  }

  // -----------------------------------
  // Crear publicidad con imagen
  // -----------------------------------
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async createWithImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('titulo') titulo: string,
    @Body('urlPagina') urlPagina: string,
  ): Promise<Publicidad> {
    if (!file) throw new Error('Archivo requerido');
    
    // Subida a Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'publicidad',
    });

    // Guardar en DB
    const nuevaPublicidad = new Publicidad();
    nuevaPublicidad.titulo = titulo;
    nuevaPublicidad.urlPagina = urlPagina;
    nuevaPublicidad.urlImagen = result.secure_url;

    return this.publicidadService.create(nuevaPublicidad);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() publicidad: Publicidad): Promise<Publicidad> {
    return this.publicidadService.update(id, publicidad);
  }
}
