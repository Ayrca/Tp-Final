
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ImagenPropagandaService {

async subirImagen(imagen: any): Promise<string> {
  const ruta = path.join(__dirname, '..', '..', 'client', 'public', 'assets', 'images', 'patro');
  const nombreImagen = `${Date.now()}${path.extname(imagen.originalname)}`;
  const rutaImagen = path.join(ruta, nombreImagen);
  fs.writeFileSync(rutaImagen, imagen.buffer);
  return nombreImagen;
}
 

async borrarImagen(nombreImagen: string): Promise<void> {
  const ruta = path.join(__dirname, '..', '..', 'client', 'public', 'assets', 'images', 'patro', nombreImagen);
  fs.unlinkSync(ruta);
  return;
}





}

