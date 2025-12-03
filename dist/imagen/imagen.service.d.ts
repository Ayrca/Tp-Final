import { Repository } from 'typeorm';
import { Imagen } from './imagen.entity';
import { Usuario } from '../usuario/usuario.entity';
import { Profesional } from '../profesional/profesional.entity';
export declare class ImagenService {
    private readonly imagenRepository;
    private readonly usuarioComunRepository;
    private readonly usuarioProfesionalRepository;
    constructor(imagenRepository: Repository<Imagen>, usuarioComunRepository: Repository<Usuario>, usuarioProfesionalRepository: Repository<Profesional>);
    guardarImagen(file: any, idProfesional: number): Promise<any>;
    findById(id: number): Promise<Imagen[]>;
    obtenerImagen(filename: string): Promise<Buffer>;
}
