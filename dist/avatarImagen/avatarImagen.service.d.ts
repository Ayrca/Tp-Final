import { Repository } from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';
import { Profesional } from '../profesional/profesional.entity';
export declare class AvatarImagenService {
    private readonly usuarioRepository;
    private readonly profesionalRepository;
    constructor(usuarioRepository: Repository<Usuario>, profesionalRepository: Repository<Profesional>);
    subirAvatar(file: Express.Multer.File, idUsuario: number, tipoUsuario: 'comun' | 'profesional'): Promise<{
        avatar: string;
    }>;
    obtenerUsuario(idUsuario: number, tipoUsuario: string): Promise<Profesional | Usuario | null>;
}
