

import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
               
const IMAGENES_OFICIOS_PATH = path.join(__dirname, '..', '..', 'client', 'public', 'assets', 'images', 'oficios');

@Injectable()
export class ImagenOficiosService {
  async create(imagen: Express.Multer.File): Promise<{ urlImagen: string }> {
    try {
      const nombreImagen = `${Date.now()}-${imagen.originalname}`;
      const urlImagen = path.join(IMAGENES_OFICIOS_PATH, nombreImagen);
      fs.writeFileSync(urlImagen, imagen.buffer);
      return { urlImagen: `/assets/images/oficios/${nombreImagen}`};
    } catch (error) {
      throw new Error('Error al subir la imagen');
    }
  }
}