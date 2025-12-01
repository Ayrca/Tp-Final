import { Test, TestingModule } from '@nestjs/testing';
import { ImagenOficiosService } from './imagenOficios.service';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('fs', () => ({
  writeFileSync: jest.fn(),
  existsSync: jest.fn(() => true),
  unlinkSync: jest.fn(),
}));

describe('ImagenOficiosService', () => {
  let service: ImagenOficiosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImagenOficiosService],
    }).compile();

    service = module.get<ImagenOficiosService>(ImagenOficiosService);
  });

  it('debe subir una imagen', async () => {
    const imagen = {
      originalname: 'imagen.jpg',
      buffer: Buffer.from('imagen de prueba'),
      fieldname: 'imagen',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: 1024,
    } as Express.Multer.File;

    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

    const resultado = await service.create(imagen);

    expect(resultado.urlImagen).toContain('/assets/images/oficios/');

    const imagenNombre = resultado.urlImagen.split('/').pop()!;
    expect(imagenNombre).not.toBeUndefined();
    expect(fs.existsSync(path.join(__dirname, '..', '..', 'client', 'public', 'assets', 'images', 'oficios', imagenNombre))).toBe(true);

    // Llimpiar la imagen subida
    fs.unlinkSync(path.join(__dirname, '..', '..', 'client', 'public', 'assets', 'images', 'oficios', imagenNombre));
  });

  it('debe lanzar un error si hay un problema al subir la imagen', async () => {
    const imagen = {
      originalname: 'imagen.jpg',
      buffer: Buffer.from('imagen de prueba'),
      fieldname: 'imagen',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: 1024,
    } as Express.Multer.File;

    (fs.writeFileSync as jest.Mock).mockImplementation(() => {
      throw new Error('Error al escribir el archivo');
    });

    await expect(service.create(imagen)).rejects.toThrow('Error al subir la imagen');
  });
});
