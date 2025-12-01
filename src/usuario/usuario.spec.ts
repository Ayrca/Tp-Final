import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from './usuario.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Usuario } from './usuario.entity';
import { Repository } from 'typeorm';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let usuarioRepository: Repository<Usuario>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
    usuarioRepository = module.get(getRepositoryToken(Usuario));
  });

  it('debe encontrar un usuario por ID', async () => {
    const id = 1;
    const usuario = new Usuario();
    usuario.idusuarioComun = id;
    usuario.nombre = 'Juan';
    usuario.apellido = 'Pérez';

    jest.spyOn(usuarioRepository, 'findOneBy').mockResolvedValue(usuario);

    const resultado = await service.findOne(id);

    expect(resultado).toBe(usuario);
    expect(usuarioRepository.findOneBy).toHaveBeenCalledTimes(1);
    expect(usuarioRepository.findOneBy).toHaveBeenCalledWith({ idusuarioComun: id });
  });

  it('debe lanzar un error si el ID no es un número', async () => {
    const id = 'abc';
 
      await expect(service.findOne(id as any)).rejects.toThrow(`El ID debe ser un número, pero se recibió ${id} de tipo string`);
    
  });

  it('debe lanzar un error si el usuario no se encuentra', async () => {
    const id = 1;

    jest.spyOn(usuarioRepository, 'findOneBy').mockResolvedValue(null);
    await expect(service.findOne(id)).rejects.toThrow(`Usuario con idusuarioComun ${id} no encontrado`);
  
  });
});