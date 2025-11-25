import { PublicidadService } from './publicidad.service';
import { Publicidad } from './publicidad.entity';
export declare class PublicidadController {
    private readonly publicidadService;
    constructor(publicidadService: PublicidadService);
    findAll(tituloLike: string): Promise<Publicidad[]>;
    findOne(id: number): Promise<Publicidad>;
    create(oficio: Publicidad): Promise<Publicidad>;
    update(id: number, oficio: Publicidad): Promise<Publicidad>;
    delete(id: number): Promise<void>;
}
