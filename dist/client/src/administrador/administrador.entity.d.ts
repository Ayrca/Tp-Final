export declare class Administrador {
    idusuarioAdm: number;
    nombre: string;
    apellido: string;
    tipo: string;
    email: string;
    password: string;
    comparePassword(password: string): Promise<any>;
}
