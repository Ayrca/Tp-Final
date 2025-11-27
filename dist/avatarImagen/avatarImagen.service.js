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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarImagenService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const usuario_entity_1 = require("../usuario/usuario.entity");
const profesional_entity_1 = require("../profesional/profesional.entity");
let AvatarImagenService = class AvatarImagenService {
    usuarioRepository;
    profesionalRepository;
    constructor(usuarioRepository, profesionalRepository) {
        this.usuarioRepository = usuarioRepository;
        this.profesionalRepository = profesionalRepository;
    }
    async subirAvatar(file, idUsuario, tipoUsuario) {
        try {
            if (tipoUsuario === 'profesional') {
                await this.profesionalRepository.update(idUsuario, { avatar: `/assets/imagenesDePerfilesUsuarios/${file.filename}` });
            }
            else {
                await this.usuarioRepository.update(idUsuario, { avatar: `/assets/imagenesDePerfilesUsuarios/${file.filename}` });
            }
            return { avatar: `/assets/imagenesDePerfilesUsuarios/${file.filename}` };
        }
        catch (error) {
            console.error('Error al subir la imagen:', error);
            throw new Error('Error al subir el avatar');
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