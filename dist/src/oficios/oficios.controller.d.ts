import { OficiosService } from './oficios.service';
import { Oficio } from './oficios.entity';
export declare class OficiosController {
    private readonly oficiosService;
    constructor(oficiosService: OficiosService);
    findAll(nombreLike: string): Promise<Oficio[]>;
    findOne(id: number): Promise<Oficio>;
    create(oficio: Oficio): Promise<Oficio>;
    update(id: number, oficio: Oficio): Promise<Oficio>;
    delete(id: number): Promise<void>;
}
