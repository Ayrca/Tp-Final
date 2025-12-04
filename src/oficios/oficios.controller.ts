import { 
  Controller, Get, Post, Put, Delete, Body, Param, Query, UploadedFile, UseInterceptors, BadRequestException, HttpException, HttpStatus 
} from '@nestjs/common';
import { OficiosService } from './oficios.service';
import { Oficio } from './oficios.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('oficios')
export class OficiosController {
  constructor(private readonly oficiosService: OficiosService) {}

  // Obtener todos los oficios o filtrar por nombre
  @Get()
  async findAll(@Query('nombre_like') nombreLike: string): Promise<Oficio[]> {
    return nombreLike 
      ? this.oficiosService.findByNombreLike(nombreLike) 
      : this.oficiosService.findAll();
  }

  // Obtener un oficio por ID
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Oficio> {
    return this.oficiosService.findOne(id);
  }

  // Crear oficio con imagen opcional
  @Post('upload')
  @UseInterceptors(FileInterceptor('file')) // ⚡ mismo que Avatar/ImagenesProf
  async create(
    @Body() oficio: { nombre: string },
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Oficio> {
    if (!oficio.nombre) throw new BadRequestException('El nombre del oficio es requerido');

    try {
      const nuevoOficio = new Oficio();
      nuevoOficio.nombre = oficio.nombre;

      return await this.oficiosService.create(nuevoOficio, file);
    } catch (error) {
      console.error('Error al crear oficio:', error);
      throw new HttpException('No se pudo crear el oficio', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Actualizar oficio con imagen opcional
  @Put('upload/:id')
  @UseInterceptors(FileInterceptor('file')) // ⚡ mismo que Avatar/ImagenesProf
  async update(
    @Param('id') id: number,
    @Body() oficio: { nombre: string; urlImagen?: string },
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Oficio> {
    try {
      return await this.oficiosService.update(id, oficio as Oficio, file);
    } catch (error) {
      console.error('Error al actualizar oficio:', error);
      throw new HttpException('No se pudo actualizar el oficio', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Eliminar oficio
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    try {
      return await this.oficiosService.delete(id);
    } catch (error) {
      console.error('Error al borrar oficio:', error);
      throw new HttpException('No se pudo borrar el oficio', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
