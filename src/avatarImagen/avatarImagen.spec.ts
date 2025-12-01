import { Test, TestingModule } from '@nestjs/testing';
import { AvatarImagenService } from './avatarImagen.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Usuario } from '../usuario/usuario.entity';
import { Profesional } from '../profesional/profesional.entity';

describe('AvatarImagenService', () => {
  let service: AvatarImagenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AvatarImagenService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: {
            update: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Profesional),
          useValue: {
            update: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AvatarImagenService>(AvatarImagenService);
  });

  it('debe subir un avatar', async () => {
    const file = {
      filename: 'avatar.jpg',
    };

    const idUsuario = 1;
    const tipoUsuario = 'profesional';

    const usuario = {
      idusuarioProfesional: idUsuario,
      avatar: 'avatar.jpg',
    };

    (service['profesionalRepository'].findOne as jest.Mock).mockResolvedValue(usuario);
    (service['profesionalRepository'].update as jest.Mock).mockResolvedValue({});

    const resultado = await service.subirAvatar(file, idUsuario, tipoUsuario);

    expect(resultado).toEqual({ avatar: `/assets/imagenesDePerfilesUsuarios/${file.filename}`});
  });

  it('debe lanzar un error si no se puede subir el avatar', async () => {
    const file = {
      filename: 'avatar.jpg',
    };

    const idUsuario = 1;
    const tipoUsuario = 'profesional';

    (service['profesionalRepository'].update as jest.Mock).mockRejectedValue(new Error('Error al subir el avatar'));

    await expect(service.subirAvatar(file, idUsuario, tipoUsuario)).rejects.toThrow('Error al subir el avatar');
  });
});
