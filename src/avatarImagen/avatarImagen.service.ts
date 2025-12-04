import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';
import { Profesional } from '../profesional/profesional.entity';
import cloudinary from '../cloudinary.config';

@Injectable()
export class AvatarImagenService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Profesional)
    private readonly profesionalRepository: Repository<Profesional>,
  ) {}

  // Subir foto de avatar a Cloudinary
  async subirAvatar(file: Express.Multer.File, idUsuario: number, tipoUsuario: 'comun' | 'profesional') {
    if (!file) throw new BadRequestException('No se recibió ninguna imagen');

    try {
      const urlImagen = await new Promise<string>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'avatars' },
          (error, result) => {
            if (error) return reject(error);
            if (!result || !result.secure_url) return reject(new Error('No se obtuvo URL de Cloudinary'));
            resolve(result.secure_url);
          },
        );
        stream.end(file.buffer);
      });

      if (tipoUsuario === 'profesional') {
        await this.profesionalRepository.update(idUsuario, { avatar: urlImagen });
      } else {
        await this.usuarioRepository.update(idUsuario, { avatar: urlImagen });
      }

      return { avatar: urlImagen };
    } catch (error) {
      console.error('Error al subir la imagen a Cloudinary:', error);
      throw new BadRequestException('Error al subir el avatar');
    }
  }

  async obtenerUsuario(idUsuario: number, tipoUsuario: string) {
    if (tipoUsuario === 'profesional') {
      return this.profesionalRepository.findOne({ where: { idusuarioProfesional: idUsuario } });
    } else {
      return this.usuarioRepository.findOne({ where: { idusuarioComun: idUsuario } });
    }
  }
}
