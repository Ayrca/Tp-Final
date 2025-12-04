import { Repository } from 'typeorm';
import { Imagen } from './imagen.entity';
import { Profesional } from '../profesional/profesional.entity';
export declare class ImagenService {
    private readonly imagenRepository;
    private readonly usuarioProfesionalRepository;
    constructor(imagenRepository: Repository<Imagen>, usuarioProfesionalRepository: Repository<Profesional>);
    guardarImagen(file: Express.Multer.File, idProfesional: number): Promise<{
        url: string;
        message: string;
    }>;
    findById(id: number): Promise<Imagen[]>;
}
