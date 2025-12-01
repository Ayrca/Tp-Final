import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsuarioService } from '../usuario/usuario.service';
import { ProfesionalService } from '../profesional/profesional.service';
import { AdministradorService } from '../administrador/administrador.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';

describe('AuthService', () => {
  let service: AuthService;
  let usuarioService: UsuarioService;
  let profesionalService: ProfesionalService;
  let administradorService: AdministradorService;
  let jwtService: JwtService;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsuarioService,
          useValue: {
            findOneByEmail: jest.fn(),
          },
        },
        {
          provide: ProfesionalService,
          useValue: {
            findOneByEmail: jest.fn(),
          },
        },
        {
          provide: AdministradorService,
          useValue: {
            findOneByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usuarioService = module.get<UsuarioService>(UsuarioService);
    profesionalService = module.get<ProfesionalService>(ProfesionalService);
    administradorService = module.get<AdministradorService>(AdministradorService);
    jwtService = module.get<JwtService>(JwtService);
    mailerService = module.get<MailerService>(MailerService);
  });

  it('debe iniciar sesión correctamente', async () => {
    const email = 'usuario@example.com';
    const password = 'password';
    const usuario = {
      idusuarioComun: 1,
      email,
      password,
      comparePassword: jest.fn(() => true),
    };

    (usuarioService.findOneByEmail as jest.Mock).mockResolvedValue(usuario);
    (jwtService.sign as jest.Mock).mockReturnValue('token');

    const resultado = await service.login(email, password);

    expect(resultado).toEqual({ token: 'token', tipo: 'usuario' });
  });

  it('debe lanzar un error si las credenciales son incorrectas', async () => {
    const email = 'usuario@example.com';
    const password = 'password';

    (usuarioService.findOneByEmail as jest.Mock).mockResolvedValue(null);

    const resultado = await service.login(email, password);

    expect(resultado).toBeNull();
  });
});
