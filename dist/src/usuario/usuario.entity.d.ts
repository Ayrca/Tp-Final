export declare class Usuario {
    idusuarioComun: number;
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    tipo: string;
    telefono: string;
    direccion: string;
    estadoCuenta: boolean;
    avatar: string;
    fechaNacimiento: Date;
    comparePassword(password: string): Promise<any>;
    hashPassword(): Promise<void>;
}
