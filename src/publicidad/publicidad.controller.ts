
import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { PublicidadService } from './publicidad.service';
import { Publicidad } from './publicidad.entity';
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


@Post()
async create(@Body() publicidad: Publicidad): Promise<Publicidad> {
  return this.publicidadService.create(publicidad);
}


@Put(':id')
async update(@Param('id') id: number, @Body() publicidad: Publicidad): Promise<Publicidad> {
  return this.publicidadService.update(id, publicidad);
}


}