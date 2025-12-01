import { Test, TestingModule } from '@nestjs/testing';
import { ProfesionalService } from './profesional.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Profesional } from './profesional.entity';
import { OficiosService } from '../oficios/oficios.service';
import { Repository } from 'typeorm';

describe('ProfesionalService', () => {
  let service: ProfesionalService;
  let profesionalRepository: Repository<Profesional>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfesionalService,
        {
          provide: getRepositoryToken(Profesional),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: OficiosService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ProfesionalService>(ProfesionalService);
    profesionalRepository = module.get(getRepositoryToken(Profesional));
  });

  it('debe encontrar un profesional por ID', async () => {
    const id = 1;
    const profesional = new Profesional();
    profesional.idusuarioProfesional = id;
    profesional.nombre = 'Juan';
    profesional.apellido = 'Pérez';

    jest.spyOn(profesionalRepository, 'findOne').mockResolvedValue(profesional);

    const resultado = await service.findOne(id);

    expect(resultado).toBe(profesional);
    expect(profesionalRepository.findOne).toHaveBeenCalledTimes(1);
    expect(profesionalRepository.findOne).toHaveBeenCalledWith({ where: { idusuarioProfesional: id }, relations: ['oficio'] });
  });
});

