import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { AdministradorService } from './administrador.service';
import { Administrador } from './administrador.entity';

@Controller('administradores')
export class AdministradorController {
  constructor(private readonly administradorService: AdministradorService) {}

  @Get()
  async findAll(): Promise<Administrador[]> {
    return this.administradorService.findAll();
  }
/*
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Administrador> {
    return this.administradorService.findOne(id);
  }
*/
  @Post()
  async create(@Body() administrador: Administrador): Promise<Administrador> {
    return this.administradorService.create(administrador);
  }
/*
  @Put(':id')
  async update(@Param('id') id: number, @Body() administrador: Administrador): Promise<Administrador> {
    return this.administradorService.update(id, administrador);
  }
*/
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.administradorService.delete(id);
  }
}