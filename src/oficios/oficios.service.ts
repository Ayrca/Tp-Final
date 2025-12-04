import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Oficio } from './oficios.entity';
import cloudinary from '../cloudinary.config';

@Injectable()
export class OficiosService {
  constructor(
    @InjectRepository(Oficio)
    private readonly oficioRepository: Repository<Oficio>,
  ) {}

  // ------------------------
  // Obtener todos los oficios
  // ------------------------
  async findAll(): Promise<Oficio[]> {
    return this.oficioRepository.find();
  }

  // ------------------------
  // Obtener un oficio por ID
  // ------------------------
  async findOne(id: number): Promise<Oficio> {
    const oficio = await this.oficioRepository.findOneBy({ idOficios: id });
    if (!oficio) {
      throw new BadRequestException(`Oficio con id ${id} no encontrado`);
    }
    return oficio;
  }

  // ------------------------
  // Crear un nuevo oficio
  // ------------------------
  async create(oficio: Oficio, file?: Express.Multer.File): Promise<Oficio> {
    if (file) {
      // Subida a Cloudinary desde buffer
      const urlImagen = await new Promise<string>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: `oficios/${oficio.nombre}` },
          (error, result) => {
            if (error) return reject(error);
            if (!result || !result.secure_url) return reject(new Error('No se obtuvo URL de Cloudinary'));
            resolve(result.secure_url);
          }
        );
        stream.end(file.buffer);
      });
      oficio.urlImagen = urlImagen;
    }

    return this.oficioRepository.save(oficio);
  }

  // ------------------------
  // Actualizar un oficio existente
  // ------------------------
  async update(id: number, oficio: Oficio, file?: Express.Multer.File): Promise<Oficio> {
    const oficioToUpdate = await this.oficioRepository.findOneBy({ idOficios: id });
    if (!oficioToUpdate) throw new BadRequestException(`Oficio con id ${id} no encontrado`);

    oficioToUpdate.nombre = oficio.nombre;

    if (file) {
      const urlImagen = await new Promise<string>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: `oficios/${oficio.nombre}` },
          (error, result) => {
            if (error) return reject(error);
            if (!result || !result.secure_url) return reject(new Error('No se obtuvo URL de Cloudinary'));
            resolve(result.secure_url);
          }
        );
        stream.end(file.buffer);
      });
      oficioToUpdate.urlImagen = urlImagen;
    } else if (oficio.urlImagen) {
      // Mantener la URL existente si no se sube archivo
      oficioToUpdate.urlImagen = oficio.urlImagen;
    }

    return this.oficioRepository.save(oficioToUpdate);
  }

  // ------------------------
  // Eliminar un oficio
  // ------------------------
  async delete(id: number): Promise<void> {
    await this.oficioRepository.delete(id);
  }

  // ------------------------
  // Buscar oficios por nombre parcial
  // ------------------------
  async findByNombreLike(nombreLike: string): Promise<Oficio[]> {
    return this.oficioRepository.find({
      where: { nombre: Like(`%${nombreLike}%`) },
    });
  }
}
