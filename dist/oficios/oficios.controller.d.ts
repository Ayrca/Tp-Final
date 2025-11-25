import { OficiosService } from './oficios.service';
import { Oficio } from './oficios.entity';
import { ImagenOficiosService } from '../imagenOficios/imagenOficios.service';
export declare class OficiosController {
    private readonly oficiosService;
    private readonly imagenOficiosService;
    constructor(oficiosService: OficiosService, imagenOficiosService: ImagenOficiosService);
    findAll(nombreLike: string): Promise<Oficio[]>;
    findOne(id: number): Promise<Oficio>;
    update(id: number, oficio: Oficio): Promise<Oficio>;
    delete(id: number): Promise<void>;
    create(imagen: Express.Multer.File, oficio: {
        nombre: string;
    }): Promise<Oficio>;
}
