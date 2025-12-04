import { ImagenOficiosService } from './imagenOficios.service';
export declare class ImagenOficiosController {
    private readonly imagenOficiosService;
    constructor(imagenOficiosService: ImagenOficiosService);
    create(imagen?: Express.Multer.File): Promise<{
        urlImagen: string;
    }>;
}
