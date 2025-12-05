import { ImagenService } from './imagen.service';
export declare class ImagenController {
    private readonly imagenService;
    constructor(imagenService: ImagenService);
    uploadImagen(file?: Express.Multer.File, idProfesional?: number): Promise<{
        message: string;
        url: string;
    }>;
    getImagenes(idProfesional: number): Promise<import("./imagen.entity").Imagen[]>;
    eliminarImagen(idImagen: number): Promise<{
        message: string;
    }>;
}
