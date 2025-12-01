import { AuthService } from './auth.service';
import { Request } from 'express';
interface IRequest extends Request {
    user: any;
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(datos: any): Promise<{
        access_token: string;
    }>;
    getPerfil(req: IRequest): Promise<import("../profesional/profesional.entity").Profesional | import("../usuario/usuario.entity").Usuario | import("../administrador/administrador.entity").Administrador | null | undefined>;
    forgotPassword(email: string): Promise<{
        message: string;
        token: string;
    }>;
    resetPassword(password: string, token: string): Promise<{
        message: string;
    }>;
    getUsuario(userId: number, tipo: string): Promise<import("../profesional/profesional.entity").Profesional | import("../usuario/usuario.entity").Usuario | import("../administrador/administrador.entity").Administrador | null | undefined>;
}
export {};
