export declare class ImagenOficiosService {
    create(imagen: Express.Multer.File): Promise<{
        urlImagen: string;
    }>;
}
