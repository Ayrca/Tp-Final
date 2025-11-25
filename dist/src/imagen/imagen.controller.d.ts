import { ImagenService } from './imagen.service';
export declare class ImagenController {
    private readonly imagenService;
    constructor(imagenService: ImagenService);
    uploadImage(file: any, idProfesional: number): Promise<any>;
    getImage(id: number): Promise<{
        url: string;
    }[]>;
}
