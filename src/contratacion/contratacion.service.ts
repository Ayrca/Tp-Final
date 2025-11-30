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

async delete(id: number): Promise<void> {
    await this.contratacionRepository.delete(id);
  }
}