import { Injectable, BadRequestException } from '@nestjs/common';
import cloudinary from '../cloudinary.config';

@Injectable()
export class ImagenOficiosService {
  async create(imagen: Express.Multer.File): Promise<{ urlImagen: string }> {
    if (!imagen) throw new BadRequestException('No se recibió ninguna imagen');

    try {
      // Subir a Cloudinary
      const result = await cloudinary.uploader.upload_stream(
        { folder: `oficios` },
        (error, result) => {
          if (error) throw new Error('Error al subir la imagen a Cloudinary');
          return result;
        },
      );

      // Para usar uploader.upload_stream necesitamos un pequeño helper
      return new Promise<{ urlImagen: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'oficios' },
        (error, result) => {
          if (error) return reject(error);
          if (!result || !result.secure_url) return reject(new Error('No se obtuvo URL de Cloudinary'));
          resolve({ urlImagen: result.secure_url });
        },
      );
        stream.end(imagen.buffer);
      });

    } catch (error) {
      throw new BadRequestException('Error al subir la imagen: ' + error.message);
    }
  }
}
