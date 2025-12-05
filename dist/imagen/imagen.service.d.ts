import { Repository } from 'typeorm';
import { Imagen } from './imagen.entity';
import { Profesional } from '../profesional/profesional.entity';
export declare class ImagenService {
    private readonly imagenRepository;
    private readonly profesionalRepository;
    constructor(imagenRepository: Repository<Imagen>, profesionalRepository: Repository<Profesional>);
    subirImagen(file: Express.Multer.File, idProfesional: number): Promise<{
        message: string;
        url: string;
    }>;
    obtenerImagenes(idProfesional: number): Promise<Imagen[]>;
    eliminarImagen(idImagen: number): Promise<{
        message: string;
    }>;
}
