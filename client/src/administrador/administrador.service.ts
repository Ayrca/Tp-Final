
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Administrador } from './administrador.entity';


@Injectable()
export class AdministradorService {
  constructor(
    @InjectRepository(Administrador)
    private readonly administradorRepository: Repository<Administrador>,
  ) {}

  async findAll(): Promise<Administrador[]> {
    return this.administradorRepository.find();
  }

  
async findOneByEmail(email: string): Promise<Administrador | null> {
  return this.administradorRepository.findOne({ where: { email } });
}

async findOne(id: number): Promise<Administrador | null> {
  return this.administradorRepository.findOne({ where: { idusuarioAdm: id } });
}

  async create(administrador: Administrador): Promise<Administrador> {
    return this.administradorRepository.save(administrador);
  }

async update(id: number, administrador: Administrador): Promise<Administrador | null> {
  await this.administradorRepository.update(id, administrador);
  return this.administradorRepository.findOne({ where: { idusuarioAdm: id } });
}



  async delete(id: number): Promise<void> {
    await this.administradorRepository.delete(id);
  }
}


