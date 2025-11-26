
import { Controller, Post, Delete, Param, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagenPropagandaService } from './imagenPropaganda.service';

@Controller('imagenPropaganda')
export class ImagenPropagandaController {
  constructor(private readonly imagenService: ImagenPropagandaService) {}

  @Post()
  @UseInterceptors(FileInterceptor('imagen'))
  async subirImagen(@UploadedFile() imagen: any): Promise<string> {
    return this.imagenService.subirImagen(imagen);
  }

  @Delete(':nombreImagen')
  async borrarImagen(@Param('nombreImagen') nombreImagen: string): Promise<void> {
    return this.imagenService.borrarImagen(nombreImagen);
  }


}