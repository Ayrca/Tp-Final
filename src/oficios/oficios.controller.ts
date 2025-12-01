
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { OficiosService } from './oficios.service';
import { Oficio } from './oficios.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagenOficiosService } from '../imagenOficios/imagenOficios.service';


@Controller('oficios')
export class OficiosController {
  constructor(private readonly oficiosService: OficiosService, private readonly imagenOficiosService: ImagenOficiosService) {}


  @Get()
  async findAll(@Query('nombre_like') nombreLike: string): Promise<Oficio[]> {
    if (nombreLike) {
      return this.oficiosService.findByNombreLike(nombreLike);
    } else {
      return this.oficiosService.findAll();
    }
  }
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Oficio> {
    return this.oficiosService.findOne(id);
  }
  
  @Put(':id')
  async update(@Param('id') id: number, @Body() oficio: Oficio): Promise<Oficio> {
    return this.oficiosService.update(id, oficio);
  }
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.oficiosService.delete(id);
  }

    @Post()
  @UseInterceptors(FileInterceptor('imagen'))
  async create(@UploadedFile() imagen: Express.Multer.File, @Body() oficio: { nombre: string }) {
    const imagenOficio = await this.imagenOficiosService.create(imagen);
    const nuevoOficio = new Oficio();
    nuevoOficio.nombre = oficio.nombre;
    nuevoOficio.urlImagen = imagenOficio.urlImagen;
    return this.oficiosService.create(nuevoOficio);
  }

}
