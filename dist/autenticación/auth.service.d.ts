import { UsuarioService } from '../usuario/usuario.service';
import { ProfesionalService } from '../profesional/profesional.service';
import { JwtService } from '@nestjs/jwt';
import { AdministradorService } from '../administrador/administrador.service';
import { MailerService } from '@nestjs-modules/mailer';
export declare class AuthService {
    private readonly usuarioService;
    private readonly profesionalService;
    private readonly administradorService;
    private readonly jwtService;
    private readonly mailerService;
    constructor(usuarioService: UsuarioService, profesionalService: ProfesionalService, administradorService: AdministradorService, jwtService: JwtService, mailerService: MailerService);
    login(email: string, password: string): Promise<{
        token: string;
        tipo: string;
    } | null>;
    validarPassword(usuario: any, password: string): Promise<any>;
    generateToken(usuario: any, tipo: string): Promise<string>;
    getUsuario(id: number, tipo: string): Promise<import("../profesional/profesional.entity").Profesional | import("../usuario/usuario.entity").Usuario | import("../administrador/administrador.entity").Administrador | null | undefined>;
    forgotPassword(email: string): Promise<{
        message: string;
        token: string;
    }>;
    resetPassword(token: string, password: string): Promise<{
        message: string;
    }>;
}
