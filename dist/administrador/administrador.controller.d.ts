import { AdministradorService } from './administrador.service';
import { Administrador } from './administrador.entity';
export declare class AdministradorController {
    private readonly administradorService;
    constructor(administradorService: AdministradorService);
    findAll(): Promise<Administrador[]>;
    create(administrador: Administrador): Promise<Administrador>;
    delete(id: number): Promise<void>;
    cambiarPassword({ id, password }: {
        id: number;
        password: string;
    }): Promise<Administrador>;
}
