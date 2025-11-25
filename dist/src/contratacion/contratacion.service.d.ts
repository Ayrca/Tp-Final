import { Repository } from 'typeorm';
import { Contratacion } from './contratacion.entity';
export declare class ContratacionService {
    private readonly contratacionRepository;
    constructor(contratacionRepository: Repository<Contratacion>);
    findAll(): Promise<Contratacion[]>;
    findOne(id: number): Promise<Contratacion>;
    delete(id: number): Promise<void>;
}
