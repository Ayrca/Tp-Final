import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrabajoContratado } from './trabajosContr.entity';
import { ProfesionalService } from 'src/profesional/profesional.service';

@Injectable()
export class TrabajoContratadoService {
  constructor(
    @InjectRepository(TrabajoContratado)
    private readonly trabajoContratadoRepository: Repository<TrabajoContratado>,
  ) {}

async actualizarEstado(idcontratacion: number, estado: string, comentario: string, valoracion: number) {
  const trabajoContratado = await this.trabajoContratadoRepository.findOne({
    where: { idcontratacion },
  });
  if (!trabajoContratado) {
    throw new Error('Trabajo no encontrado');
  }
  trabajoContratado.estado = estado;
  trabajoContratado.comentario = comentario;
  trabajoContratado.valoracion = valoracion;
  return this.trabajoContratadoRepository.save(trabajoContratado);
}

async findByUsuarioComunId(idUsuarioComun: number): Promise<TrabajoContratado[]> {
  return this.trabajoContratadoRepository.find({
    where: { usuarioComun: { idusuarioComun: idUsuarioComun } },
    relations: ['profesional', 'usuarioComun'], 
  });
}

async findByProfesionalId(idProfesional: number): Promise<TrabajoContratado[]> {
  return this.trabajoContratadoRepository.find({
    where: { profesional: { idusuarioProfesional: idProfesional } },
    relations: ['profesional', 'usuarioComun'],
    select: {
      idcontratacion: true,
      rubro: true,
      estado: true,
      fechaContratacion: true,
      valoracion: true,
      comentario: true,
      telefonoProfesional: true,
      telefonoCliente: true,
      profesional: { idusuarioProfesional: true },
      usuarioComun: { idusuarioComun: true, nombre: true, apellido: true, telefono: true }
    }
  });
}
  async create(trabajoContratado: TrabajoContratado): Promise<TrabajoContratado> {
    return this.trabajoContratadoRepository.save(trabajoContratado);
  }

  async delete(idTrabajoContratado: number): Promise<void> {
    await this.trabajoContratadoRepository.delete(idTrabajoContratado);
  }

}