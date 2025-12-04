import { OficiosService } from './oficios.service';
import { Oficio } from './oficios.entity';
export declare class OficiosController {
    private readonly oficiosService;
    constructor(oficiosService: OficiosService);
    findAll(nombreLike: string): Promise<Oficio[]>;
    findOne(id: number): Promise<Oficio>;
    update(id: number, oficio: {
        nombre: string;
        urlImagen?: string;
    }, imagen?: Express.Multer.File): Promise<Oficio>;
    delete(id: number): Promise<void>;
    create(oficio: {
        nombre: string;
    }, imagen?: Express.Multer.File): Promise<Oficio>;
}
