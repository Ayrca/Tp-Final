import { Test, TestingModule } from '@nestjs/testing';
import { TrabajoContratadoService } from './trabajosContr.service';
import { TrabajoContratado } from './trabajosContr.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';


describe('TrabajoContratadoService', () => {
  let service: TrabajoContratadoService;
  let trabajoContratadoRepository: Repository<TrabajoContratado>;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrabajoContratadoService,
        {
          provide: getRepositoryToken(TrabajoContratado),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TrabajoContratadoService>(TrabajoContratadoService);
    trabajoContratadoRepository = module.get(getRepositoryToken(TrabajoContratado));
  });



  it('debe actualizar el estado de un trabajo contratado', async () => {
    const idcontratacion = 1;
    const estado = 'terminado';
    const comentario = 'Comentario de prueba';
    const valoracion = 5;

    const trabajoContratado = new TrabajoContratado();
    trabajoContratado.idcontratacion = idcontratacion;
    trabajoContratado.estado = estado;
    trabajoContratado.comentario = comentario;
    trabajoContratado.valoracion = valoracion;

    jest.spyOn(trabajoContratadoRepository, 'findOne').mockResolvedValue(trabajoContratado);
    jest.spyOn(trabajoContratadoRepository, 'save').mockResolvedValue(trabajoContratado);

    const resultado = await service.actualizarEstado(idcontratacion, estado, comentario, valoracion);
    expect(resultado).toBe(trabajoContratado);
  });

  it('debe obtener trabajos contratados por ID de usuario común', async () => {
    const idUsuarioComun = 1;

    const trabajosContratados = [new TrabajoContratado(), new TrabajoContratado()];

    jest.spyOn(trabajoContratadoRepository, 'find').mockResolvedValue(trabajosContratados);

    const resultado = await service.findByUsuarioComunId(idUsuarioComun);
    expect(resultado).toBe(trabajosContratados);
  });

  it('debe obtener trabajos contratados por ID de profesional', async () => {
    const idProfesional = 1;

    const trabajosContratados = [new TrabajoContratado(), new TrabajoContratado()];

    jest.spyOn(trabajoContratadoRepository, 'find').mockResolvedValue(trabajosContratados);

    const resultado = await service.findByProfesionalId(idProfesional);
    expect(resultado).toBe(trabajosContratados);
  });

  it('debe crear un trabajo contratado', async () => {
    const trabajoContratado = new TrabajoContratado();

    jest.spyOn(trabajoContratadoRepository, 'save').mockResolvedValue(trabajoContratado);

    const resultado = await service.create(trabajoContratado);
    expect(resultado).toBe(trabajoContratado);
  });

  it('debe eliminar un trabajo contratado', async () => {
    const idTrabajoContratado = 1;

   jest.spyOn(trabajoContratadoRepository, 'delete').mockResolvedValue({ raw: [], affected: 1 });

    const resultado = await service.delete(idTrabajoContratado);
    expect(resultado).toBeUndefined();
  });

  it('debe obtener un trabajo contratado por ID', async () => {
    const idcontratacion = 1;

    const trabajoContratado = new TrabajoContratado();
    trabajoContratado.idcontratacion = idcontratacion;

    jest.spyOn(trabajoContratadoRepository, 'findOne').mockResolvedValue(trabajoContratado);

    const resultado = await service.findById(idcontratacion);
    expect(resultado).toBe(trabajoContratado);
  });

  it('debe obtener el promedio de valoración de un profesional', async () => {
    const idusuarioProfesional = 1;

    const trabajosContratados = [
  { idcontratacion: 1, valoracion: 5, profesional: { idusuarioProfesional: 1 }, usuarioComun: { idusuarioComun: 1 }, rubro: 'Rubro 1', estado: 'terminado' },
  { idcontratacion: 2, valoracion: 4, profesional: { idusuarioProfesional: 1 }, usuarioComun: { idusuarioComun: 2 }, rubro: 'Rubro 2', estado: 'terminado' },
  { idcontratacion: 3, valoracion: 3, profesional: { idusuarioProfesional: 1 }, usuarioComun: { idusuarioComun: 3 }, rubro: 'Rubro 3', estado: 'terminado' },
] as TrabajoContratado[];

    jest.spyOn(trabajoContratadoRepository, 'find').mockResolvedValue(trabajosContratados);

    const resultado = await service.getPromedioValoracion(idusuarioProfesional);
    expect(resultado).toBe(4);
  });
});
