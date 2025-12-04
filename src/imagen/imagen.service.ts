import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Imagen } from './imagen.entity';
import { Profesional } from '../profesional/profesional.entity';
import cloudinary from '../cloudinary.config';

@Injectable()
export class ImagenService {
  constructor(
    @InjectRepository(Imagen)
    private readonly imagenRepository: Repository<Imagen>,
    @InjectRepository(Profesional)
    private readonly usuarioProfesionalRepository: Repository<Profesional>,
  ) {}

  // -----------------------------------
  // Subir imagen y guardar URL en DB
  // -----------------------------------
  async guardarImagen(file: Express.Multer.File, idProfesional: number): Promise<{ url: string; message: string }> {
    if (!idProfesional) {
      throw new BadRequestException('El idProfesional es requerido');
    }

    if (!file) {
      throw new BadRequestException('El archivo es requerido');
    }

    // Subida a Cloudinary en la carpeta del profesional
    const result = await cloudinary.uploader.upload(file.path, {
      folder: `profesionales/${idProfesional}`,
    });

    // Guardamos la URL en la base de datos
    const imagen = this.imagenRepository.create({
      url: result.secure_url,
      idProfesional: idProfesional,
    });
    await this.imagenRepository.save(imagen);

    // Devolvemos la URL al frontend
    return { url: result.secure_url, message: 'Imagen guardada con éxito' };
  }

  // -----------------------------------
  // Obtener todas las imágenes de un profesional
  // -----------------------------------
  async findById(id: number): Promise<Imagen[]> {
    return this.imagenRepository.find({ where: { idProfesional: id } });
  }
}
