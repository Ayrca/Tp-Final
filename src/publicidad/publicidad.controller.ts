import { 
  Controller, Get, Post, Put, Delete, Body, Param, Query, UploadedFile, UseInterceptors, BadRequestException 
} from '@nestjs/common';
import { PublicidadService } from './publicidad.service';
import { Publicidad } from './publicidad.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import cloudinary from '../cloudinary.config';

@Controller('publicidad')
export class PublicidadController {
  constructor(private readonly publicidadService: PublicidadService) {}

  @Get()
  async findAll(@Query('titulo_like') tituloLike: string): Promise<Publicidad[]> {
    return tituloLike
      ? this.publicidadService.findByTituloLike(tituloLike)
      : this.publicidadService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Publicidad> {
    return this.publicidadService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.publicidadService.delete(id);
  }

  // ------------------------
  // Crear publicidad con imagen
  // ------------------------
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async createWithImage(
    @UploadedFile() file?: Express.Multer.File,
    @Body('titulo') titulo?: string,
    @Body('urlPagina') urlPagina?: string,
  ): Promise<Publicidad> {
    if (!titulo) throw new BadRequestException('El título es requerido');

    const nuevaPublicidad = new Publicidad();
    nuevaPublicidad.titulo = titulo || '';
    nuevaPublicidad.urlPagina = urlPagina || '';

    return this.publicidadService.create(nuevaPublicidad, file);
  }

  // ------------------------
  // Actualizar publicidad con imagen opcional
  // ------------------------
  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: number,
    @Body() publicidad: Publicidad,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Publicidad> {
    return this.publicidadService.update(id, publicidad, file);
  }
}
