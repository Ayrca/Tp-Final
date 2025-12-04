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
    private readonly profesionalRepository: Repository<Profesional>,
  ) {}

  // Subir imagen de trabajo a Cloudinary y guardar URL en DB
  async subirImagen(file: Express.Multer.File, idProfesional: number) {
    if (!file) throw new BadRequestException('No se recibió ninguna imagen');

    try {
      const urlImagen = await new Promise<string>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: `profesionales/${idProfesional}` },
          (error, result) => {
            if (error) return reject(error);
            if (!result || !result.secure_url) return reject(new Error('No se obtuvo URL de Cloudinary'));
            resolve(result.secure_url);
          },
        );
        stream.end(file.buffer);
      });

      const imagen = new Imagen();
      imagen.idProfesional = idProfesional;
      imagen.url = urlImagen;

      await this.imagenRepository.save(imagen);

      return { message: 'Imagen subida con éxito', url: urlImagen };
    } catch (error) {
      console.error('Error al subir la imagen a Cloudinary:', error);
      throw new BadRequestException('Error al subir la imagen');
    }
  }

  // Obtener todas las imágenes de un profesional
  async obtenerImagenes(idProfesional: number) {
    return this.imagenRepository.find({ where: { idProfesional } });
  }
}
