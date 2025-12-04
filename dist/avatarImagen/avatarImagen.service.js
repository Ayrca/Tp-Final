"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarImagenService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const usuario_entity_1 = require("../usuario/usuario.entity");
const profesional_entity_1 = require("../profesional/profesional.entity");
const cloudinary_config_1 = __importDefault(require("../cloudinary.config"));
let AvatarImagenService = class AvatarImagenService {
    usuarioRepository;
    profesionalRepository;
    constructor(usuarioRepository, profesionalRepository) {
        this.usuarioRepository = usuarioRepository;
        this.profesionalRepository = profesionalRepository;
    }
    async subirAvatar(file, idUsuario, tipoUsuario) {
        if (!file)
            throw new common_1.BadRequestException('No se recibió ninguna imagen');
        try {
            const urlImagen = await new Promise((resolve, reject) => {
                const stream = cloudinary_config_1.default.uploader.upload_stream({ folder: 'avatars' }, (error, result) => {
                    if (error)
                        return reject(error);
                    if (!result || !result.secure_url)
                        return reject(new Error('No se obtuvo URL de Cloudinary'));
                    resolve(result.secure_url);
                });
                stream.end(file.buffer);
            });
            if (tipoUsuario === 'profesional') {
                await this.profesionalRepository.update(idUsuario, { avatar: urlImagen });
            }
            else {
                await this.usuarioRepository.update(idUsuario, { avatar: urlImagen });
            }
            return { avatar: urlImagen };
        }
        catch (error) {
            console.error('Error al subir la imagen a Cloudinary:', error);
            throw new common_1.BadRequestException('Error al subir el avatar');
        }
    }
    async obtenerUsuario(idUsuario, tipoUsuario) {
        if (tipoUsuario === 'profesional') {
            return this.profesionalRepository.findOne({ where: { idusuarioProfesional: idUsuario } });
        }
        else {
            return this.usuarioRepository.findOne({ where: { idusuarioComun: idUsuario } });
        }
    }
};
exports.AvatarImagenService = AvatarImagenService;
exports.AvatarImagenService = AvatarImagenService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __param(1, (0, typeorm_1.InjectRepository)(profesional_entity_1.Profesional)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AvatarImagenService);
//# sourceMappingURL=avatarImagen.service.js.map