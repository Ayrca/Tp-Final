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
exports.ImagenController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const imagen_service_1 = require("./imagen.service");
const usuario_service_1 = require("../usuario/usuario.service");
const profesional_service_1 = require("../profesional/profesional.service");
const cloudinary_config_1 = __importDefault(require("../cloudinary.config"));
let ImagenController = class ImagenController {
    imagenService;
    usuarioService;
    profesionalService;
    constructor(imagenService, usuarioService, profesionalService) {
        this.imagenService = imagenService;
        this.usuarioService = usuarioService;
        this.profesionalService = profesionalService;
    }
    async uploadImage(file, idProfesional) {
        if (!file)
            throw new common_1.BadRequestException('Archivo requerido');
        return await this.imagenService.guardarImagen(file, idProfesional);
    }
    async getImage(id) {
        const imagenes = await this.imagenService.findById(id);
        if (!imagenes || imagenes.length === 0) {
            return [];
        }
        return imagenes.map((imagen) => ({
            url: imagen.url,
        }));
    }
    async cambiarAvatar(file, idUsuario, tipoUsuario) {
        if (!file)
            throw new common_1.BadRequestException('Archivo requerido');
        const result = await cloudinary_config_1.default.uploader.upload(file.path, {
            folder: `avatars/${tipoUsuario}/${idUsuario}`,
        });
        const avatarUrl = result.secure_url;
        if (tipoUsuario === 'comun') {
            const usuario = await this.usuarioService.findOne(idUsuario);
            if (!usuario)
                throw new common_1.BadRequestException('Usuario comun no encontrado');
            usuario.avatar = avatarUrl;
            await this.usuarioService.update(idUsuario, usuario);
        }
        else {
            const usuario = await this.profesionalService.findOne(idUsuario);
            if (!usuario)
                throw new common_1.BadRequestException('Usuario profesional no encontrado');
            usuario.avatar = avatarUrl;
            await this.profesionalService.update(idUsuario, usuario);
        }
        return { avatar: avatarUrl };
    }
};
exports.ImagenController = ImagenController;
__decorate([
    (0, common_1.Post)('upload/:idProfesional'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Param)('idProfesional')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], ImagenController.prototype, "uploadImage", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ImagenController.prototype, "getImage", null);
__decorate([
    (0, common_1.Post)('cambiar-avatar/:idUsuario/:tipoUsuario'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('avatar')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Param)('idUsuario')),
    __param(2, (0, common_1.Param)('tipoUsuario')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, String]),
    __metadata("design:returntype", Promise)
], ImagenController.prototype, "cambiarAvatar", null);
exports.ImagenController = ImagenController = __decorate([
    (0, common_1.Controller)('imagen'),
    __metadata("design:paramtypes", [imagen_service_1.ImagenService,
        usuario_service_1.UsuarioService,
        profesional_service_1.ProfesionalService])
], ImagenController);
//# sourceMappingURL=imagen.controller.js.map