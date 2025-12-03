import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Imagen } from './imagen.entity';
import { Usuario } from '../usuario/usuario.entity';
import { Profesional } from '../profesional/profesional.entity';

@Injectable()
export class ImagenService {

  private uploadPath = path.join(__dirname, '..', '..', 'assets', 'imagenesUsuariosProfesionales');

  constructor(
    @InjectRepository(Imagen)
    private readonly imagenRepository: Repository<Imagen>,
    @InjectRepository(Usuario)
    private readonly usuarioComunRepository: Repository<Usuario>,
    @InjectRepository(Profesional)
    private readonly usuarioProfesionalRepository: Repository<Profesional>,
  ) {}

  async guardarImagen(file: any, idProfesional: number): Promise<any> {
    if (!idProfesional) {
      throw new BadRequestException('El idProfesional es requerido');
    }

    // Crear carpeta si no existe
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }

    const filename = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(this.uploadPath, filename);

    // Mover archivo
    fs.renameSync(file.path, filePath);

    // Guardar URL completa
    const imagen = new Imagen();
    imagen.url = `${process.env.BACKEND_URL}/assets/imagenesUsuariosProfesionales/${filename}`;
    imagen.idProfesional = idProfesional;

    await this.imagenRepository.save(imagen);

    return { message: 'Imagen guardada con éxito' };
  }

  async findById(id: number): Promise<Imagen[]> {
    return this.imagenRepository.find({ where: { idProfesional: id } });
  }

  async obtenerImagen(filename: string): Promise<Buffer> {
    try {
      const filePath = path.join(this.uploadPath, filename);
      return fs.readFileSync(filePath);
    } catch (error) {
      throw new Error(`Error al obtener la imagen: ${error.message}`);
    }
  }
}