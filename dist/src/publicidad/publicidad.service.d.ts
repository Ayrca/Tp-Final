import { Repository } from 'typeorm';
import { Publicidad } from './publicidad.entity';
export declare class PublicidadService {
    private readonly publicidadRepository;
    constructor(publicidadRepository: Repository<Publicidad>);
    findAll(): Promise<Publicidad[]>;
    findOne(id: number): Promise<Publicidad>;
    create(publicidad: Publicidad): Promise<Publicidad>;
    update(id: number, publicidad: Publicidad): Promise<Publicidad>;
    delete(id: number): Promise<void>;
    findByNombreLike(tituloLike: string): Promise<Publicidad[]>;
}
