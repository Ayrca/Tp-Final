import { Profesional } from '../profesional/profesional.entity';
import { Usuario } from '../usuario/usuario.entity';
export declare class TrabajoContratado {
    idcontratacion: number;
    usuarioComun: Usuario;
    profesional: Profesional;
    rubro: string;
    telefonoProfesional: string;
    telefonoCliente: string;
    estado: string;
    valoracion: number;
    comentario: string;
    fechaContratacion: Date;
}
