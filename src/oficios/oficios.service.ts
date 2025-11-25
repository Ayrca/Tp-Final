import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Oficio } from './oficios.entity';
import { Like } from 'typeorm';

@Injectable()
export class OficiosService {
  constructor(
    @InjectRepository(Oficio)
    private readonly oficioRepository: Repository<Oficio>,
  ) {}
  async findAll(): Promise<Oficio[]> {
    return this.oficioRepository.find();
  }


async findOne(id: number): Promise<Oficio> {
  const oficio = await this.oficioRepository.findOneBy({  idOficios: id });
  if (!oficio) {
    throw new Error(`Oficio con id ${id} no encontrado`);
  }
  return oficio;
}

  async create(oficio: Oficio): Promise<Oficio> {
    return this.oficioRepository.save(oficio);
  }

async update(id: number, oficio: Oficio): Promise<Oficio> {
  const oficioToUpdate = await this.oficioRepository.findOneBy({ idOficios: id });
  if (!oficioToUpdate) {
    throw new Error(`Oficio con id ${id} no encontrado`);
  }
  oficioToUpdate.nombre = oficio.nombre;
  oficioToUpdate.urlImagen = oficio.urlImagen;
  return this.oficioRepository.save(oficioToUpdate);
}

  async delete(id: number): Promise<void> {
    await this.oficioRepository.delete(id);
  }

async findByNombreLike(nombreLike: string): Promise<Oficio[]> {
    return this.oficioRepository.find({
      where: {
       nombre: Like(`%${nombreLike}%`),
      },
    });
  }



}