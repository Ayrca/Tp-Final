import { Test, TestingModule } from '@nestjs/testing';
import { AdministradorService } from './administrador.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Administrador } from './administrador.entity';

describe('AdministradorService', () => {
  let service: AdministradorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdministradorService,
        {
          provide: getRepositoryToken(Administrador),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AdministradorService>(AdministradorService);
  });

  it('debe actualizar la contraseña correctamente', async () => {
    const id = 1;
    const password = 'nuevaContraseña';
    const administrador = {
      idusuarioAdm: id,
      password: 'contraseñaAnterior',
    };

    (service['administradorRepository'].findOne as jest.Mock).mockResolvedValue(administrador);
    (service['administradorRepository'].save as jest.Mock).mockResolvedValue({ ...administrador, password });

    const resultado = await service.updatePassword(id, password);

    expect(resultado.password).toBe(password);
  });

  it('debe lanzar un error si el administrador no existe', async () => {
    const id = 1;
    const password = 'nuevaContraseña';

    (service['administradorRepository'].findOne as jest.Mock).mockResolvedValue(null);

    await expect(service.updatePassword(id, password)).rejects.toThrow(`Administrador con id ${id} no encontrado`);
  });
});
