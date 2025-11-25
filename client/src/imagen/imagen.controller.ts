
import { Controller, Post, UploadedFile, UseInterceptors, Body, Get,Param ,BadRequestException, Res} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagenService } from './imagen.service';
import { join } from 'path';
import { createReadStream } from 'fs';
import * as fs from 'fs';
import { UsuarioService } from '../usuario/usuario.service';
import { ProfesionalService } from '../profesional/profesional.service';

@Controller('imagen')
export class ImagenController {
  constructor(
    private readonly imagenService: ImagenService,
  private readonly usuarioService: UsuarioService,
  private readonly profesionalService: ProfesionalService,
   
  ) {}




@Post('upload/:idProfesional')
@UseInterceptors(FileInterceptor('file'))
async uploadImage(@UploadedFile() file: any, @Param('idProfesional') idProfesional: number) {
  return await this.imagenService.guardarImagen(file, idProfesional);
}



@Get(':id')
async getImage(@Param('id') id: number) {
  const imagenes = await this.imagenService.findById(id);
  if (!imagenes || imagenes.length === 0) {
    return [];
  }
  return imagenes.map((imagen) => ({
    url: `http://localhost:3000/assets/imagenesUsuariosProfesionales/${imagen.url}`,
  }));
}





@Post('cambiar-avatar/:idUsuario/:tipoUsuario')
@UseInterceptors(FileInterceptor('avatar'))
async cambiarAvatar(@UploadedFile() file: any, @Param('idUsuario') idUsuario: number, @Param('tipoUsuario') tipoUsuario: 'comun' | 'profesional') {
  console.log('Archivo recibido:', file);
  try {
    const filename = `${Date.now()}-${file.originalname}`;
    const uploadPath = join(__dirname, '..', 'client', 'public', 'assets', 'imagenesDePerfilesUsuarios');
    console.log('Ruta de subida:', uploadPath);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    fs.renameSync(file.path, `${uploadPath}/${filename}`);
    console.log('Imagen subida correctamente');
    if (tipoUsuario === 'comun') {
      const usuario = await this.usuarioService.findOne(idUsuario);
      if (!usuario) {
        throw new BadRequestException('Usuario comun no encontrado');
      }
      usuario.avatar = `http://localhost:3000/imagenesDePerfilesUsuarios/${filename}`;                                                         
      await this.usuarioService.update(idUsuario, usuario);
    } else if (tipoUsuario === 'profesional') {
      const usuario = await this.profesionalService.findOne(idUsuario);
      if (!usuario) {
        throw new BadRequestException('Usuario profesional no encontrado');
      }
      usuario.avatar = `http://localhost:3000/imagenesDePerfilesUsuarios/${filename}`;
      await this.profesionalService.update(idUsuario, usuario);
    }
    return { avatar: `http://localhost:3000/imagenesDePerfilesUsuarios/${filename}` };
  } catch (error) {
    console.error('Error al subir la imagen:', error);
    throw new BadRequestException('Error al subir la imagen');
  }
}




}