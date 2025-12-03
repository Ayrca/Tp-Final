
import { Injectable,BadRequestException} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Imagen } from './imagen.entity';
import { join } from 'path';
import { Usuario } from '../usuario/usuario.entity';
import { Profesional } from '../profesional/profesional.entity';

interface File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}
@Injectable()
export class ImagenService {

 
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

  // Generar nombre único
  const filename = `${Date.now()}-${file.originalname}`;

  // Ruta donde se guardará en producción: dist/upload/imagenesUsuariosProfesionales
  const uploadPath = join(__dirname, '..', 'upload', 'imagenesUsuariosProfesionales');

  // Crear carpeta si no existe
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  // Mover archivo
  const finalPath = join(uploadPath, filename);
  fs.renameSync(file.path, finalPath);

  // Guardar solo el nombre en la base
  const imagen = new Imagen();
  imagen.url = filename;
  imagen.idProfesional = idProfesional;
  await this.imagenRepository.save(imagen);

  return { message: 'Imagen guardada con éxito' };
}


async findById(id: number): Promise<Imagen[]> {
  return this.imagenRepository.find({ where: { idProfesional: id } });
}



async obtenerImagen(filename: string): Promise<Buffer> {
  try {
    const uploadPath = path.join(__dirname, '..', 'upload', 'imagenesUsuariosProfesionales');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    const filePath = path.join(uploadPath, filename);
    return fs.readFileSync(filePath);
  } catch (error) {
    throw new Error(`Error al obtener la imagen: ${error.message}`);
  }
}



}