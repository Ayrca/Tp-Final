import { 
  Controller, Get, Post, Put, Delete, Body, Param, Query, UploadedFile, UseInterceptors, BadRequestException 
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
  @UseInterceptors(FileInterceptor('imagen'))
  async create(
    @Body() oficio: { nombre: string },
    @UploadedFile() imagen?: Express.Multer.File,
  ): Promise<Oficio> {
    if (!oficio.nombre) throw new BadRequestException('El nombre del oficio es requerido');

    const nuevoOficio = new Oficio();
    nuevoOficio.nombre = oficio.nombre;

    return this.oficiosService.create(nuevoOficio, imagen);
  }

  // Actualizar oficio con imagen opcional
  @Put('upload/:id')
  @UseInterceptors(FileInterceptor('imagen'))
  async update(
    @Param('id') id: number,
    @Body() oficio: { nombre: string; urlImagen?: string },
    @UploadedFile() imagen?: Express.Multer.File,
  ): Promise<Oficio> {
    return this.oficiosService.update(id, oficio as Oficio, imagen);
  }

  // Eliminar oficio
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.oficiosService.delete(id);
  }
}
