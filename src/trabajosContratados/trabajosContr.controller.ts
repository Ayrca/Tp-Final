import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { TrabajoContratadoService } from './trabajosContr.service';
import { TrabajoContratado } from './trabajosContr.entity';




@Controller('trabajoContratado')
export class TrabajoContratadoController {
  constructor(private readonly trabajoContratadoService: TrabajoContratadoService) {}



@Put(':idcontratacion')
async actualizarEstado(@Param('idcontratacion') idcontratacion: number, @Body() data: { estado: string, comentario: string, valoracion: number }) {
  return this.trabajoContratadoService.actualizarEstado(idcontratacion, data.estado, data.comentario, data.valoracion);
}



@Get(':idProfesional')
async findByProfesionalId(@Param('idProfesional') idProfesional: number): Promise<TrabajoContratado[]> {
  return this.trabajoContratadoService.findByProfesionalId(idProfesional);
}


@Get('usuario/:idusuarioComun')
async findByUsuarioComunId(@Param('idusuarioComun') idUsuarioComun: number): Promise<TrabajoContratado[]> {
  return this.trabajoContratadoService.findByUsuarioComunId(idUsuarioComun);
}



  @Post()
  async create(@Body() trabajoContratado: TrabajoContratado): Promise<TrabajoContratado> {
    return this.trabajoContratadoService.create(trabajoContratado);
  }



  @Delete(':idTrabajoContratado')
  async delete(@Param('idTrabajoContratado') idTrabajoContratado: number): Promise<void> {
    return this.trabajoContratadoService.delete(idTrabajoContratado);
  }
}