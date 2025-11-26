import { Repository } from 'typeorm';
import { Oficio } from './oficios.entity';
export declare class OficiosService {
    private readonly oficioRepository;
    constructor(oficioRepository: Repository<Oficio>);
    findAll(): Promise<Oficio[]>;
    findOne(id: number): Promise<Oficio>;
    create(oficio: Oficio): Promise<Oficio>;
    update(id: number, oficio: Oficio): Promise<Oficio>;
    delete(id: number): Promise<void>;
    findByNombreLike(nombreLike: string): Promise<Oficio[]>;
}
