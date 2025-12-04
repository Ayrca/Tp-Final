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

  // Guardar imagen subiéndola a Cloudinary
  async guardarImagen(file: Express.Multer.File, idProfesional: number): Promise<any> {
    if (!idProfesional) {
      throw new BadRequestException('El idProfesional es requerido');
    }

    if (!file) {
      throw new BadRequestException('El archivo es requerido');
    }

    // Subida a Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: `profesionales/${idProfesional}`,
    });

    // Guardamos solo la URL en la base de datos
    const imagen = new Imagen();
    imagen.url = result.secure_url;
    imagen.idProfesional = idProfesional;
    await this.imagenRepository.save(imagen);

    return { message: 'Imagen guardada con éxito', url: result.secure_url };
  }

  // Obtener todas las imágenes de un profesional
  async findById(id: number): Promise<Imagen[]> {
    return this.imagenRepository.find({ where: { idProfesional: id } });
  }
}