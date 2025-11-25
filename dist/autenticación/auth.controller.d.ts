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
    getPerfil(req: IRequest): Promise<import("../profesional/profesional.entity").Profesional | import("../usuario/usuario.entity").Usuario>;
}
export {};
