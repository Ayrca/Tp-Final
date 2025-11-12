import { UsuarioService } from '../usuario/usuario.service';
import { ProfesionalService } from '../profesional/profesional.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly usuarioService;
    private readonly profesionalService;
    private readonly jwtService;
    constructor(usuarioService: UsuarioService, profesionalService: ProfesionalService, jwtService: JwtService);
    login(email: string, password: string): Promise<{
        token: string;
        tipo: string;
    } | null>;
    validarPassword(usuario: any, password: string): Promise<any>;
    generateToken(usuario: any, tipo: string): Promise<string>;
    getUsuario(id: number, tipo: string): Promise<import("../profesional/profesional.entity").Profesional | import("../usuario/usuario.entity").Usuario>;
}
