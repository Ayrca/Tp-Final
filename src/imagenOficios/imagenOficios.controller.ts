
import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagenOficiosService } from './imagenOficios.service';

@Controller('imagenOficios')
export class ImagenOficiosController {
  constructor(private readonly imagenOficiosService: ImagenOficiosService) {}

  @Post()
  @UseInterceptors(FileInterceptor('imagen'))
  async create(@UploadedFile() imagen: Express.Multer.File) {
    return this.imagenOficiosService.create(imagen);
  }
}