import { Repository } from 'typeorm';
import { TrabajoContratado } from './trabajosContr.entity';
export declare class TrabajoContratadoService {
    private readonly trabajoContratadoRepository;
    constructor(trabajoContratadoRepository: Repository<TrabajoContratado>);
    actualizarEstado(idcontratacion: number, estado: string, comentario: string, valoracion: number): Promise<TrabajoContratado>;
    findByUsuarioComunId(idUsuarioComun: number): Promise<TrabajoContratado[]>;
    findByProfesionalId(idProfesional: number): Promise<TrabajoContratado[]>;
    create(trabajoContratado: TrabajoContratado): Promise<TrabajoContratado>;
    delete(idTrabajoContratado: number): Promise<void>;
}
