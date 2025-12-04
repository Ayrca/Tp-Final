export declare class ImagenPropagandaService {
    subirImagen(imagen: Express.Multer.File): Promise<string>;
    borrarImagen(publicId: string): Promise<void>;
}
