import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Publicidad} from './publicidad.entity';
import { Like } from 'typeorm';
@Injectable()
export class PublicidadService {
  constructor(
    @InjectRepository(Publicidad)
    private readonly publicidadRepository: Repository<Publicidad>,
  ) {}
  async findAll(): Promise<Publicidad[]> {
    return this.publicidadRepository.find();
  }

async findOne(id: number): Promise<Publicidad> {
  const publicidad = await this.publicidadRepository.findOneBy({  idpublicidad: id });
  if (!publicidad) {
    throw new Error(`Publicidad con id ${id} no encontrado`);
  }
  return publicidad;
}

  async create(publicidad: Publicidad): Promise<Publicidad> {
    return this.publicidadRepository.save(publicidad);
  }
  async update(id: number, publicidad: Publicidad): Promise<Publicidad> {
    await this.publicidadRepository.update(id, publicidad);
    return this.findOne(id);
  }
  async delete(id: number): Promise<void> {
    await this.publicidadRepository.delete(id);
  }

async findByNombreLike( tituloLike: string): Promise<Publicidad[]> {
    return this.publicidadRepository.find({
      where: {
       titulo: Like(`%${ tituloLike}%`),
      },
    });
  }
  }