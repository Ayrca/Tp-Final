import { ImagenPropagandaService } from './imagenPropaganda.service';
export declare class ImagenPropagandaController {
    private readonly imagenService;
    constructor(imagenService: ImagenPropagandaService);
    subirImagen(imagen?: Express.Multer.File): Promise<string>;
    borrarImagen(publicId: string): Promise<void>;
}
