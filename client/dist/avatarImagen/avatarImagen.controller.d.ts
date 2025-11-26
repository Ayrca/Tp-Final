/// <reference types="multer" />
import { AvatarImagenService } from './avatarImagen.service';
export declare class AvatarImagenController {
    private readonly avatarImagenService;
    constructor(avatarImagenService: AvatarImagenService);
    subirAvatar(file: Express.Multer.File, idUsuario: number, tipoUsuario: string): Promise<{
        avatar: string;
    }>;
}
