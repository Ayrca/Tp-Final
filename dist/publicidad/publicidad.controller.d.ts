import { PublicidadService } from './publicidad.service';
import { Publicidad } from './publicidad.entity';
export declare class PublicidadController {
    private readonly publicidadService;
    constructor(publicidadService: PublicidadService);
    createWithImage(file?: Express.Multer.File, titulo?: string, urlPagina?: string): Promise<Publicidad>;
    update(id: string, publicidad: Publicidad): Promise<Publicidad>;
    findAll(): Promise<Publicidad[]>;
    delete(id: string): Promise<void>;
}
