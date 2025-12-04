import { ImagenService } from './imagen.service';
import { ProfesionalService } from '../profesional/profesional.service';
export declare class ImagenController {
    private readonly imagenService;
    private readonly profesionalService;
    constructor(imagenService: ImagenService, profesionalService: ProfesionalService);
    uploadImage(file: Express.Multer.File, idProfesional: number): Promise<{
        url: string;
        message: string;
    }>;
    getImage(id: number): Promise<{
        url: string;
    }[]>;
}
