import { Test, TestingModule } from '@nestjs/testing';
import { ImagenPropagandaService } from './imagenPropaganda.service';
import * as fs from 'fs';
import * as path from 'path';

describe('ImagenPropagandaService', () => {
  let service: ImagenPropagandaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImagenPropagandaService],
    }).compile();

    service = module.get<ImagenPropagandaService>(ImagenPropagandaService);
  });

  it('debe subir una imagen', async () => {
    const imagen = {
      originalname: 'imagen.jpg',
      buffer: Buffer.from('imagen de prueba'),
    };

    const nombreImagen = await service.subirImagen(imagen);

    expect(nombreImagen).toContain('.jpg');
    expect(fs.existsSync(path.join(__dirname, '..', '..', 'client', 'public', 'assets', 'images', 'patro', nombreImagen))).toBe(true);

    // Llimpiar la imagen subida
    fs.unlinkSync(path.join(__dirname, '..', '..', 'client', 'public', 'assets', 'images', 'patro', nombreImagen));
  });

  it('debe borrar una imagen', async () => {
    const imagen = {
      originalname: 'imagen.jpg',
      buffer: Buffer.from('imagen de prueba'),
    };

    const nombreImagen = await service.subirImagen(imagen);

    await service.borrarImagen(nombreImagen);

    expect(fs.existsSync(path.join(__dirname, '..', '..', 'client', 'public', 'assets', 'images', 'patro', nombreImagen))).toBe(false);
  });
});
