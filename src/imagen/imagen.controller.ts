
import { Controller, Post, UploadedFile, UseInterceptors, Body, Get,Param ,BadRequestException, Res} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagenService } from './imagen.service';
import { join } from 'path';
import { createReadStream } from 'fs';
import * as fs from 'fs';


@Controller('imagen')
export class ImagenController {
  constructor(private readonly imagenService: ImagenService) {}


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
    url: `http://localhost:3000/assets/imagenesUsuarios/${imagen.url}`,
  }));
}


  
}