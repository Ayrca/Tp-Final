import { UsuarioService } from './usuario.service';
import { Usuario } from './usuario.entity';
import { JwtService } from '@nestjs/jwt';
import { ProfesionalService } from '../profesional/profesional.service';
export declare class UsuarioController {
    private readonly usuarioService;
    private readonly profesionalService;
    private readonly jwtService;
    constructor(usuarioService: UsuarioService, profesionalService: ProfesionalService, jwtService: JwtService);
    create(usuario: Usuario): Promise<Usuario>;
    update(id: number, usuario: Usuario): Promise<Usuario>;
    delete(id: number): Promise<void>;
    registrar(datos: any): Promise<Usuario>;
    verificarEmail(email: string): Promise<{
        mensaje: string;
    }>;
    getUsuario(id: string): Promise<Usuario>;
    getPerfil(req: any): Promise<{
        id: any;
        nombre: any;
        apellido: any;
        email: any;
        tipo: any;
        telefono: any;
        direccion: any;
        estadoCuenta: any;
        avatar: any;
        fechaNacimiento: any;
    }>;
}
