import { Repository } from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';
import { Profesional } from '../profesional/profesional.entity';
export declare class AvatarImagenService {
    private readonly usuarioRepository;
    private readonly profesionalRepository;
    constructor(usuarioRepository: Repository<Usuario>, profesionalRepository: Repository<Profesional>);
    subirAvatar(file: any, idUsuario: number, tipoUsuario: string): Promise<{
        avatar: string;
    }>;
}
