
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

  @Post()
  async create(@Body() administrador: Administrador): Promise<Administrador> {
    return this.administradorService.create(administrador);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.administradorService.delete(id);
  }

@Put('cambiar-password')
async cambiarPassword(@Body() { id, password }: { id: number, password: string }) {
  try {
    const administradorActualizado = await this.administradorService.updatePassword(id, password);
    return administradorActualizado;
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    throw error;
  }
}

}