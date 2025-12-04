import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Publicidad } from './publicidad.entity';

@Injectable()
export class PublicidadService {
  constructor(
    @InjectRepository(Publicidad)
    private readonly publicidadRepository: Repository<Publicidad>,
  ) {}

  // ------------------------
  // Obtener todos los registros
  // ------------------------
  async findAll(): Promise<Publicidad[]> {
    return this.publicidadRepository.find();
  }

  // ------------------------
  // Obtener uno por ID
  // ------------------------
  async findOne(id: number): Promise<Publicidad> {
    const pub = await this.publicidadRepository.findOneBy({ idpublicidad: id });
    if (!pub) throw new BadRequestException(`Publicidad con id ${id} no encontrada`);
    return pub;
  }

  // ------------------------
  // Crear registro
  // ------------------------
  async create(publicidad: Publicidad): Promise<Publicidad> {
    return this.publicidadRepository.save(publicidad);
  }

  // ------------------------
  // Actualizar registro
  // ------------------------
  async update(id: number, publicidad: Publicidad): Promise<Publicidad> {
    const existing = await this.findOne(id); // valida existencia
    const updated = { ...existing, ...publicidad };
    return this.publicidadRepository.save(updated);
  }

  // ------------------------
  // Eliminar registro
  // ------------------------
  async delete(id: number): Promise<void> {
    const existing = await this.findOne(id);
    await this.publicidadRepository.remove(existing);
  }

  // ------------------------
  // Buscar por título parcial
  // ------------------------
  async findByNombreLike(tituloLike: string): Promise<Publicidad[]> {
    return this.publicidadRepository.find({
      where: { titulo: Like(`%${tituloLike}%`) },
    });
  }
}
