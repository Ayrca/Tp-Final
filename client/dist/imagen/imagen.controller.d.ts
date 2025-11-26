import { ImagenService } from './imagen.service';
import { UsuarioService } from '../usuario/usuario.service';
import { ProfesionalService } from '../profesional/profesional.service';
export declare class ImagenController {
    private readonly imagenService;
    private readonly usuarioService;
    private readonly profesionalService;
    constructor(imagenService: ImagenService, usuarioService: UsuarioService, profesionalService: ProfesionalService);
    uploadImage(file: any, idProfesional: number): Promise<any>;
    getImage(id: number): Promise<{
        url: string;
    }[]>;
    cambiarAvatar(file: any, idUsuario: number, tipoUsuario: 'comun' | 'profesional'): Promise<{
        avatar: string;
    }>;
}
