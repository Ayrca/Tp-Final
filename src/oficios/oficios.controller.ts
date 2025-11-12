
import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { OficiosService } from './oficios.service';
import { Oficio } from './oficios.entity';
@Controller('oficios')
export class OficiosController {
  constructor(private readonly oficiosService: OficiosService) {}
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
  @Post()
  async create(@Body() oficio: Oficio): Promise<Oficio> {
    return this.oficiosService.create(oficio);
  }
  @Put(':id')
  async update(@Param('id') id: number, @Body() oficio: Oficio): Promise<Oficio> {
    return this.oficiosService.update(id, oficio);
  }
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.oficiosService.delete(id);
  }
}