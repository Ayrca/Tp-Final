import { Test, TestingModule } from '@nestjs/testing';
import { OficiosService } from './oficios.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Oficio } from './oficios.entity';
import { Repository } from 'typeorm';

describe('OficiosService', () => {
  let service: OficiosService;
  let oficioRepository: Repository<Oficio>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OficiosService,
        {
          provide: getRepositoryToken(Oficio),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OficiosService>(OficiosService);
    oficioRepository = module.get(getRepositoryToken(Oficio));
  });

  it('debe encontrar un oficio por ID', async () => {
    const id = 1;
    const oficio = new Oficio();
    oficio.idOficios = id;
    oficio.nombre = 'Electricista';

    jest.spyOn(oficioRepository, 'findOneBy').mockResolvedValue(oficio);

    const resultado = await service.findOne(id);

    expect(resultado).toBe(oficio);
    expect(oficioRepository.findOneBy).toHaveBeenCalledTimes(1);
    expect(oficioRepository.findOneBy).toHaveBeenCalledWith({ idOficios: id });
  });

  it('debe lanzar un error si el oficio no se encuentra', async () => {
    const id = 1;

    jest.spyOn(oficioRepository, 'findOneBy').mockResolvedValue(null);

    await expect(service.findOne(id)).rejects.toThrow(`Oficio con id ${id} no encontrado`);
  });
});