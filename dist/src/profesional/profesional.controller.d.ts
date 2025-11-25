import { ProfesionalService } from './profesional.service';
import { Profesional } from './profesional.entity';
import { JwtService } from '@nestjs/jwt';
export declare class ProfesionalController {
    private readonly profesionalService;
    private readonly jwtService;
    constructor(profesionalService: ProfesionalService, jwtService: JwtService);
    actualizarProfesional(req: any, datosActualizados: any): Promise<Profesional>;
    findByOficio(id: number): Promise<Profesional[]>;
    findOne(id: number): Promise<any>;
    findProfesionalCompleto(id: number): Promise<any>;
    findAll(): Promise<Profesional[]>;
    create(oficio: Profesional): Promise<Profesional>;
    delete(id: number): Promise<void>;
    getPerfilProfesional(req: any): Promise<{
        id: number;
        nombre: string;
        apellido: string;
        email: string;
        tipo: string;
        oficio: {
            nombre: string;
        };
        telefono: string;
        direccion: string;
        avatar: string;
        estadoCuenta: boolean;
        descripcion: string;
        fechaNacimiento: Date;
        valoracion: Date;
    }>;
    registrar(datos: any): Promise<Profesional>;
}
