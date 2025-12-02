import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { TrabajoContratado } from './trabajosContr.entity';

@Injectable()
export class TrabajoContratadoService {
  constructor(
    @InjectRepository(TrabajoContratado)
    private readonly trabajoContratadoRepository: Repository<TrabajoContratado>,
  ) {}

  async actualizarEstado(
    idcontratacion: number,
    estado: string,
    comentario: string,
    valoracion: number
  ) {
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
      select: {
        idcontratacion: true,
        rubro: true,
        estado: true,
        fechaContratacion: true,
        valoracion: true,
        comentario: true,
        telefonoProfesional: true,
        telefonoCliente: true,
        profesional: {
          idusuarioProfesional: true,
          nombre: true,
          apellido: true,
        },
        usuarioComun: {
          idusuarioComun: true,
          nombre: true,
          apellido: true,
          telefono: true
        }
      }
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
        profesional: { 
          idusuarioProfesional: true,
          nombre: true,
          apellido: true
        },
        usuarioComun: { 
          idusuarioComun: true, 
          nombre: true, 
          apellido: true, 
          telefono: true 
        }
      }
    });
  }

  async create(trabajoContratado: TrabajoContratado): Promise<TrabajoContratado> {
    return this.trabajoContratadoRepository.save(trabajoContratado);
  }

  async delete(idTrabajoContratado: number): Promise<void> {
    await this.trabajoContratadoRepository.delete(idTrabajoContratado);
  }

  async findById(idcontratacion: number): Promise<TrabajoContratado> {
    const trabajoContratado = await this.trabajoContratadoRepository.findOne({
      where: { idcontratacion },
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
        profesional: {
          idusuarioProfesional: true,
          nombre: true,
          apellido: true
        },
        usuarioComun: {
          idusuarioComun: true,
          nombre: true,
          apellido: true,
          telefono: true
        }
      }
    });

    if (!trabajoContratado) {
      throw new Error(`TrabajoContratado con id ${idcontratacion} no encontrado`);
    }

    return trabajoContratado;
  }

  async getPromedioValoracion(idusuarioProfesional: number) {
    const trabajosContratados = await this.trabajoContratadoRepository.find({
      where: {
        profesional: { idusuarioProfesional },
        estado: 'terminado',
        valoracion: MoreThan(0),
      },
    });

    if (trabajosContratados.length === 0) {
      return 0;
    }

    const sumaValoraciones = trabajosContratados.reduce(
      (sum, trabajo) => sum + trabajo.valoracion, 
      0
    );
    const promedioValoracion = sumaValoraciones / trabajosContratados.length;

    return promedioValoracion;
  }
}