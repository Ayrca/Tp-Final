import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Publicidad } from './publicidad.entity';
import cloudinary from '../cloudinary.config';

@Injectable()
export class PublicidadService {
  constructor(
    @InjectRepository(Publicidad)
    private readonly publicidadRepository: Repository<Publicidad>,
  ) {}

  // ------------------------
  // Obtener todas las publicidades
  // ------------------------
  async findAll(): Promise<Publicidad[]> {
    return this.publicidadRepository.find();
  }

  // ------------------------
  // Obtener publicidad por ID
  // ------------------------
  async findOne(id: number): Promise<Publicidad> {
    const publicidad = await this.publicidadRepository.findOneBy({ idpublicidad: id });
    if (!publicidad) throw new BadRequestException(`Publicidad con id ${id} no encontrada`);
    return publicidad;
  }

  // ------------------------
  // Crear nueva publicidad con imagen opcional
  // ------------------------
  async create(publicidad: Publicidad, file?: Express.Multer.File): Promise<Publicidad> {
    if (file) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: `publicidad/${publicidad.titulo}`,
      });
      publicidad.urlImagen = result.secure_url;
    }
    return this.publicidadRepository.save(publicidad);
  }

  // ------------------------
  // Actualizar publicidad existente
  // ------------------------
  async update(id: number, publicidad: Publicidad, file?: Express.Multer.File): Promise<Publicidad> {
    const publicidadToUpdate = await this.publicidadRepository.findOneBy({ idpublicidad: id });
    if (!publicidadToUpdate) throw new BadRequestException(`Publicidad con id ${id} no encontrada`);

    publicidadToUpdate.titulo = publicidad.titulo;
    publicidadToUpdate.urlPagina = publicidad.urlPagina;

    if (file) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: `publicidad/${publicidad.titulo}`,
      });
      publicidadToUpdate.urlImagen = result.secure_url;
    } else if (publicidad.urlImagen) {
      publicidadToUpdate.urlImagen = publicidad.urlImagen;
    }

    return this.publicidadRepository.save(publicidadToUpdate);
  }

  // ------------------------
  // Eliminar publicidad
  // ------------------------
  async delete(id: number): Promise<void> {
    await this.publicidadRepository.delete(id);
  }

  // ------------------------
  // Buscar por título parcial
  // ------------------------
  async findByTituloLike(tituloLike: string): Promise<Publicidad[]> {
    return this.publicidadRepository.find({
      where: { titulo: Like(`%${tituloLike}%`) },
    });
  }
}
