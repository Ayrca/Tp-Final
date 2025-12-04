import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profesional } from './profesional.entity';
import { Like } from 'typeorm';
import { OficiosService } from '../oficios/oficios.service';

@Injectable()
export class ProfesionalService {
  constructor(
    @InjectRepository(Profesional)
    private readonly ProfesionalRepository: Repository<Profesional>,
    private readonly oficiosService: OficiosService,
  ) {}

  async actualizarProfesional(id: number, datosActualizados: any): Promise<Profesional> {
    try {
      console.log('ID del profesional:', id);
      console.log('Datos actualizados:', datosActualizados);
      const resultado = await this.ProfesionalRepository.update(id, datosActualizados);
      console.log('Resultado de la actualización:', resultado);
      if (resultado.affected === 0) {
        throw new Error(`No se encontró el profesional con ID ${id}`);
      }
      return this.findOne(id);
    } catch (error) {
      console.error('Error al actualizar profesional:', error);
      throw error;
    }
  }

  async findAll(): Promise<Profesional[]> {
    return this.ProfesionalRepository.find({ relations: ['oficio'] });
  }

  async findOne(id: number): Promise<Profesional> {
    console.log('Buscando profesional con id:', id);
    const profesional = await this.ProfesionalRepository.findOne({ where: { idusuarioProfesional: id }, relations: ['oficio'] });
    console.log('Profesional encontrado:', profesional);
    if (!profesional) {
      throw new Error(`Profesional con id ${id} no encontrado`);
    }
    return profesional;
  }

  async findProfesionalCompleto(id: number): Promise<any> {
    const profesional = await this.ProfesionalRepository.findOne({ where: { idusuarioProfesional: id }, relations: ['oficio'] });
    return profesional;
  }

  async findByOficio(id: number): Promise<Profesional[]> {
    return this.ProfesionalRepository.find({ where: { oficio: { idOficios: id } } });
  }

  async findOneByEmail(email: string) {
    return this.ProfesionalRepository.findOneBy({ email });
  }

  async findByEmail(email: string): Promise<Profesional | null> {
    const profesional = await this.ProfesionalRepository.findOneBy({ email });
    if (!profesional) {
      return null;
    }
    return profesional;
  }

  async create(profesional: Profesional): Promise<Profesional> {
    return this.ProfesionalRepository.save(profesional);
  }

  async update(id: number, profesional: Profesional): Promise<Profesional> {
    await this.ProfesionalRepository.update(id, profesional);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.ProfesionalRepository.delete(id);
  }

  async findByNombreLike(nombreLike: string): Promise<Profesional[]> {
    return this.ProfesionalRepository.find({ where: { nombre: Like(`%${nombreLike}%`)} });
  }
 
  async registrar(datos: any) {
    const ultimoProfesional = await this.ProfesionalRepository.find({ order: { idusuarioProfesional: 'DESC' }, take: 1 });
    const nuevoId = ultimoProfesional.length > 0 ? ultimoProfesional[0].idusuarioProfesional + 1 : 1;
    const profesional = new Profesional();
    profesional.idusuarioProfesional = nuevoId;
    profesional.nombre = datos.nombre;
    profesional.apellido = datos.apellido;
    profesional.email = datos.email;
    profesional.password = datos.password;
    profesional.tipo = datos.tipo;
    profesional.telefono = datos.telefono;
    profesional.direccion = datos.direccion;
    profesional.estadoCuenta = datos.estadoCuenta || true;
    profesional.avatar = datos.avatar || '';
    profesional.fechaNacimiento = datos.fechaNacimiento;
    profesional.empresa = datos.empresa;
    profesional.disponible = datos.disponible || true; // Agregar la disponibilidad
    const oficio = await this.oficiosService.findOne(datos.oficio);
    profesional.oficio = oficio;
    return this.ProfesionalRepository.save(profesional);
  }

  async banearProfesional(id: number): Promise<Profesional> {
    const profesional = await this.findOne(id);
    if (!profesional) {
      throw new Error(`Profesional con id ${id} no encontrado`);
    }
    profesional.estadoCuenta = false;
    return this.ProfesionalRepository.save(profesional);
  }

  async desbloquearProfesional(id: number): Promise<Profesional> {
    const profesional = await this.findOne(id);
    if (!profesional) {
      throw new Error(`Profesional con id ${id} no encontrado`);
    }
    profesional.estadoCuenta = true;
    return this.ProfesionalRepository.save(profesional);
  }

async updatePassword(id: number, password: string): Promise<Profesional> {
  const profesional = await this.findOne(id);
  if (!profesional) {
    throw new Error(`Profesional con id ${id} no encontrado`);
  }
  profesional.password = password;
  return this.ProfesionalRepository.save(profesional);
}

async actualizarValoracion(id: number, valoracion: number): Promise<Profesional> {
  const profesional = await this.ProfesionalRepository.findOne({
    where: { idusuarioProfesional: id },
  });

  if (!profesional) {
    throw new Error('Profesional no encontrado');
  }

  profesional.valoracion = valoracion;
  return this.ProfesionalRepository.save(profesional);
}
}