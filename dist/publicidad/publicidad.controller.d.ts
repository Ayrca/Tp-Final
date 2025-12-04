import { PublicidadService } from './publicidad.service';
import { Publicidad } from './publicidad.entity';
export declare class PublicidadController {
    private readonly publicidadService;
    constructor(publicidadService: PublicidadService);
    findAll(tituloLike: string): Promise<Publicidad[]>;
    findOne(id: number): Promise<Publicidad>;
    delete(id: number): Promise<void>;
    createWithImage(file?: Express.Multer.File, titulo?: string, urlPagina?: string): Promise<Publicidad>;
    update(id: number, publicidad: Publicidad, file?: Express.Multer.File): Promise<Publicidad>;
}
