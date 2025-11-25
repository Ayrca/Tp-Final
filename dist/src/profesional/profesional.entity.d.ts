import { Oficio } from '../oficios/oficios.entity';
export declare class Profesional {
    idusuarioProfesional: number;
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    tipo: string;
    oficio: Oficio;
    empresa: string;
    telefono: string;
    direccion: string;
    avatar: string;
    estadoCuenta: boolean;
    descripcion: string;
    fechaNacimiento: Date;
    valoracion: Date;
    comparePassword(password: string): Promise<any>;
    hashPassword(): Promise<void>;
}
