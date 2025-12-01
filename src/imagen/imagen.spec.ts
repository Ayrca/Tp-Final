import { Test, TestingModule } from '@nestjs/testing';
import { ImagenService } from './imagen.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Imagen } from './imagen.entity';
import { Usuario } from '../usuario/usuario.entity';
import { Profesional } from '../profesional/profesional.entity';
import * as fs from 'fs';

jest.mock('fs', () => ({
  renameSync: jest.fn(),
}));

describe('ImagenService', () => {
  let service: ImagenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImagenService,
        {
          provide: getRepositoryToken(Imagen),
          useValue: {
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Usuario),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Profesional),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ImagenService>(ImagenService);
  });

  it('debe guardar una imagen', async () => {
    const file = {
      originalname: 'imagen.jpg',
      path: 'path/to/imagen.jpg',
    };

    const idProfesional = 1;

    (fs.renameSync as jest.Mock).mockImplementation(() => {});

    const resultado = await service.guardarImagen(file, idProfesional);

    expect(resultado).toEqual({ message: 'Imagen guardada con éxito' });
  });


it('debe lanzar un error si no se proporciona idProfesional', async () => {
  const file = {
    originalname: 'imagen.jpg',
    path: 'path/to/imagen.jpg',
  };

  await expect(service.guardarImagen(file, undefined as any)).rejects.toThrow('El idProfesional es requerido');
});
});
