import { ImagenPropagandaService } from './imagenPropaganda.service';
export declare class ImagenPropagandaController {
    private readonly imagenService;
    constructor(imagenService: ImagenPropagandaService);
    subirImagen(imagen: any): Promise<string>;
    borrarImagen(nombreImagen: string): Promise<void>;
}
