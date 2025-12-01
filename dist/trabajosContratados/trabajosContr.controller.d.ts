import { TrabajoContratadoService } from './trabajosContr.service';
import { TrabajoContratado } from './trabajosContr.entity';
export declare class TrabajoContratadoController {
    private readonly trabajoContratadoService;
    constructor(trabajoContratadoService: TrabajoContratadoService);
    actualizarEstado(idcontratacion: number, data: {
        estado: string;
        comentario: string;
        valoracion: number;
    }): Promise<TrabajoContratado>;
    findByProfesionalId(idProfesional: number): Promise<TrabajoContratado[]>;
    findByUsuarioComunId(idUsuarioComun: number): Promise<TrabajoContratado[]>;
    create(trabajoContratado: TrabajoContratado): Promise<TrabajoContratado>;
    delete(idTrabajoContratado: number): Promise<void>;
    getPromedioValoracion(idusuarioProfesional: number): Promise<number>;
}
