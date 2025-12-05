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

  // Subir imagen
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

  // Obtener todas las imágenes
  async obtenerImagenes(idProfesional: number) {
    return this.imagenRepository.find({ where: { idProfesional } });
  }

  // Eliminar imagen
  async eliminarImagen(idImagen: number) {
    const imagen = await this.imagenRepository.findOne({ where: { idImagen } });
    if (!imagen) throw new BadRequestException('Imagen no encontrada');

    try {
      // Eliminar de Cloudinary si guardaste publicId
      if (imagen.publicId) {
        await cloudinary.uploader.destroy(imagen.publicId);
      }

      // Eliminar de la base de datos
      await this.imagenRepository.remove(imagen);

      return { message: 'Imagen eliminada correctamente' };
    } catch (error) {
      console.error('Error al eliminar la imagen:', error);
      throw new BadRequestException('No se pudo eliminar la imagen');
    }
  }
}