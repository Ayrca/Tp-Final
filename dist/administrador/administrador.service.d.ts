import { Repository } from 'typeorm';
import { Administrador } from './administrador.entity';
export declare class AdministradorService {
    private readonly administradorRepository;
    constructor(administradorRepository: Repository<Administrador>);
    findAll(): Promise<Administrador[]>;
    findOneByEmail(email: string): Promise<Administrador | null>;
    findOne(id: number): Promise<Administrador | null>;
    create(administrador: Administrador): Promise<Administrador>;
    update(id: number, administrador: Administrador): Promise<Administrador | null>;
    delete(id: number): Promise<void>;
    updatePassword(id: number, password: string): Promise<Administrador>;
}
