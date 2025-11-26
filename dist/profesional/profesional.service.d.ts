import { Repository } from 'typeorm';
import { Profesional } from './profesional.entity';
import { OficiosService } from '../oficios/oficios.service';
export declare class ProfesionalService {
    private readonly ProfesionalRepository;
    private readonly oficiosService;
    constructor(ProfesionalRepository: Repository<Profesional>, oficiosService: OficiosService);
    actualizarProfesional(id: number, datosActualizados: any): Promise<Profesional>;
    findAll(): Promise<Profesional[]>;
    findOne(id: number): Promise<Profesional>;
    findProfesionalCompleto(id: number): Promise<any>;
    findByOficio(id: number): Promise<Profesional[]>;
    findOneByEmail(email: string): Promise<Profesional | null>;
    findByEmail(email: string): Promise<Profesional | null>;
    create(profesional: Profesional): Promise<Profesional>;
    update(id: number, profesional: Profesional): Promise<Profesional>;
    delete(id: number): Promise<void>;
    findByNombreLike(nombreLike: string): Promise<Profesional[]>;
    registrar(datos: any): Promise<Profesional>;
    banearProfesional(id: number): Promise<Profesional>;
    desbloquearProfesional(id: number): Promise<Profesional>;
}
