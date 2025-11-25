import { Repository } from 'typeorm';
import { Imagen } from './imagen.entity';
export declare class ImagenService {
    private readonly imagenRepository;
    constructor(imagenRepository: Repository<Imagen>);
    guardarImagen(file: any, idProfesional: number): Promise<any>;
    findById(id: number): Promise<Imagen[]>;
    obtenerImagen(filename: string): Promise<Buffer>;
}
