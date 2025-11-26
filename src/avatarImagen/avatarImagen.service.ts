
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';
import { Profesional } from '../profesional/profesional.entity';

@Injectable()
export class AvatarImagenService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Profesional)
    private readonly profesionalRepository: Repository<Profesional>,
  ) {}

//subir foto de avatar
async subirAvatar(file: any, idUsuario: number, tipoUsuario: string) {
  try {
    if (tipoUsuario === 'profesional') {
      await this.profesionalRepository.update(idUsuario, { avatar: `http://localhost:3000/assets/imagenesDePerfilesUsuarios/${file.filename}` });                                                                         
    } else {
      await this.usuarioRepository.update(idUsuario, { avatar: `http://localhost:3000/assets/imagenesDePerfilesUsuarios/${file.filename}` });
    }
    return { avatar: `http://localhost:3000/assets/imagenesDePerfilesUsuarios/${file.filename}` };
  } catch (error) {
    console.error('Error al subir la imagen:', error);
    throw new Error('Error al subir el avatar');
  }
}


}