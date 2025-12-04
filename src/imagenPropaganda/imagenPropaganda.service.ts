import { Injectable, BadRequestException } from '@nestjs/common';
import cloudinary from '../cloudinary.config';
import type { Express } from 'express';

@Injectable()
export class ImagenPropagandaService {

  // Subir imagen a Cloudinary
  async subirImagen(imagen: Express.Multer.File): Promise<string> {
    if (!imagen) throw new BadRequestException('No se recibió ninguna imagen');

    try {
      const urlImagen = await new Promise<string>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'propaganda' },
          (error, result) => {
            if (error) return reject(error);
            if (!result || !result.secure_url) return reject(new Error('No se obtuvo URL de Cloudinary'));
            resolve(result.secure_url);
          },
        );
        stream.end(imagen.buffer);
      });

      return urlImagen;
    } catch (error) {
      console.error('Error al subir la imagen a Cloudinary:', error);
      throw new BadRequestException('Error al subir la imagen');
    }
  }

  // Opcional: borrar imagen en Cloudinary
  async borrarImagen(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId); // publicId es el nombre de la imagen en Cloudinary
    } catch (error) {
      console.error('Error al borrar la imagen en Cloudinary:', error);
      throw new BadRequestException('Error al borrar la imagen');
    }
  }
}
