import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ContratacionService } from './contratacion.service';
import { Contratacion } from './contratacion.entity';
@Controller('contratacion')
export class ContratacionController {
  constructor(private readonly TrabSolicitadosService: Contratacion) {}
  /*
  @Get()
  async findAll(@Query('nombre_like') nombreLike: string): Promisecontratacion[]> {
    if (nombreLike) {
      return this.contratacionService.findByNombreLike(nombreLike);
    } else {
      return this.contratacionService.findAll();
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number): PromiseContratacion> {
    return this.contratacionService.findOne(id);
  }

  @Post()
  async create(@Body() contratacion: contratacion): Promisecontratacion> {
    return this.contratacionService.createcontratacion);
  }

  @Put(':id')
  async update(@Param('id') id: number,contrcontratacion): Promisecontratacion> {
    return this.contratacionService.update(id,contratacion);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.contratacionService.delete(id);
  }
*/
}