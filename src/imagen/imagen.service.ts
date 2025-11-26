
import { Injectable,BadRequestException} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Imagen } from './imagen.entity';
<<<<<<< HEAD
=======
import { join } from 'path';
import { Usuario } from '../usuario/usuario.entity';
import { Profesional } from '../profesional/profesional.entity';

>>>>>>> origin/Francisco
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
<<<<<<< HEAD
  constructor(
    @InjectRepository(Imagen)
    private readonly imagenRepository: Repository<Imagen>,
  ) {}
=======

 
constructor(
  @InjectRepository(Imagen)
  private readonly imagenRepository: Repository<Imagen>,
  @InjectRepository(Usuario)
  private readonly usuarioComunRepository: Repository<Usuario>,
  @InjectRepository(Profesional)
  private readonly usuarioProfesionalRepository: Repository<Profesional>,
) {}

>>>>>>> origin/Francisco

async guardarImagen(file: any, idProfesional: number): Promise<any> {
  if (!idProfesional) {
    throw new BadRequestException('El idProfesional es requerido');
  }
  const filename = file.originalname;
<<<<<<< HEAD
  const filePath = `client/public/assets/imagenesUsuarios/${filename}`;
=======
  const filePath = `client/public/assets/imagenesUsuariosProfesionales/${filename}`;
>>>>>>> origin/Francisco
  fs.renameSync(file.path, filePath);
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
<<<<<<< HEAD
    const uploadPath = path.join(__dirname, '..', 'imagenesUsuarios');
=======
    const uploadPath = path.join(__dirname, '..', 'imagenesUsuariosProfesionales');
>>>>>>> origin/Francisco
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