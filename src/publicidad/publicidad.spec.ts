import { Test, TestingModule } from '@nestjs/testing';
import { PublicidadService } from './publicidad.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Publicidad } from './publicidad.entity';
import { Repository } from 'typeorm';

describe('PublicidadService', () => {
  let service: PublicidadService;
  let publicidadRepository: Repository<Publicidad>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublicidadService,
        {
          provide: getRepositoryToken(Publicidad),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PublicidadService>(PublicidadService);
    publicidadRepository = module.get(getRepositoryToken(Publicidad));
  });

  it('debe encontrar una publicidad por ID', async () => {
    const id = 1;
    const publicidad = new Publicidad();
    publicidad.idpublicidad = id;
    publicidad.titulo = 'Publicidad de prueba';

    jest.spyOn(publicidadRepository, 'findOneBy').mockResolvedValue(publicidad);

    const resultado = await service.findOne(id);

    expect(resultado).toBe(publicidad);
    expect(publicidadRepository.findOneBy).toHaveBeenCalledTimes(1);
    expect(publicidadRepository.findOneBy).toHaveBeenCalledWith({ idpublicidad: id });
  });

  it('debe lanzar un error si la publicidad no se encuentra', async () => {
    const id = 1;

    jest.spyOn(publicidadRepository, 'findOneBy').mockResolvedValue(null);

    await expect(service.findOne(id)).rejects.toThrow(`Publicidad con id ${id} no encontrado`);
  });
});