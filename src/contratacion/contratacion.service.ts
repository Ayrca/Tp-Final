import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contratacion } from './contratacion.entity';
import { Like } from 'typeorm';
@Injectable()
export class ContratacionService {
  constructor(
    @InjectRepository(Contratacion)
    private readonly contratacionRepository: Repository<Contratacion>,
  ) {}
  async findAll(): Promise<Contratacion[]> {
    return this.contratacionRepository.find();
  }

async findOne(id: number): Promise<Contratacion> {
  const contratacion = await this.contratacionRepository.findOneBy({  idcontratacion: id });
  if (!contratacion) {
    throw new Error(`Oficio con id ${id} no encontrado`);
  }
  return contratacion;
}
/*
  async create(TrabSolicitados: Contratacion): Promise<Contratacion> {
    return this.contratacionRepository.save(Contratacion);
  }
*/

/*
  async update(id: number, TrabSolicitados: Contratacion): Promise<Contratacion> {
    await this.contratacionRepository.update(id, contratacion);
    return this.findOne(id);
  }
  */

  async delete(id: number): Promise<void> {
    await this.contratacionRepository.delete(id);
  }

/*
async findByNombreLike(nombreLike: string): Promise<Contratacion[]> {
    return this.contratacionRepository.find({
      where: {
       nombre: Like(`%${nombreLike}%`),
      },
    });
  }
*/



}