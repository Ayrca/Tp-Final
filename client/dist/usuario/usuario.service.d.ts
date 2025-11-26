import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
export declare class UsuarioService {
    private readonly usuarioRepository;
    constructor(usuarioRepository: Repository<Usuario>);
    findAll(): Promise<Usuario[]>;
    findOne(usuarioId: number): Promise<Usuario>;
    findByEmail(email: string): Promise<Usuario | null>;
    findOneByEmail(email: string): Promise<Usuario | null>;
    create(usuario: Usuario): Promise<Usuario>;
    update(id: number, usuario: Usuario): Promise<Usuario>;
    delete(id: number): Promise<void>;
    findByNombreLike(tituloLike: string): Promise<Usuario[]>;
    registrar(datos: any): Promise<Usuario>;
}
