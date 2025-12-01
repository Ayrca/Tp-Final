"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImagenController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const imagen_service_1 = require("./imagen.service");
const path_1 = require("path");
const fs = __importStar(require("fs"));
const usuario_service_1 = require("../usuario/usuario.service");
const profesional_service_1 = require("../profesional/profesional.service");
const BASE_URL = process.env.REACT_APP_BASE_URL;
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
        return await this.imagenService.guardarImagen(file, idProfesional);
    }
    async getImage(id) {
        const imagenes = await this.imagenService.findById(id);
        if (!imagenes || imagenes.length === 0) {
            return [];
        }
        return imagenes.map((imagen) => ({
            url: `/assets/imagenesUsuariosProfesionales/${imagen.url}`,
        }));
    }
    async cambiarAvatar(file, idUsuario, tipoUsuario) {
        console.log('Archivo recibido:', file);
        try {
            const filename = `${Date.now()}-${file.originalname}`;
            const uploadPath = (0, path_1.join)(__dirname, '..', 'client', 'public', 'assets', 'imagenesDePerfilesUsuarios');
            console.log('Ruta de subida:', uploadPath);
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }
            fs.renameSync(file.path, `${uploadPath}/${filename}`);
            console.log('Imagen subida correctamente');
            if (tipoUsuario === 'comun') {
                const usuario = await this.usuarioService.findOne(idUsuario);
                if (!usuario) {
                    throw new common_1.BadRequestException('Usuario comun no encontrado');
                }
                usuario.avatar = `${BASE_URL}/imagenesDePerfilesUsuarios/${filename}`;
                await this.usuarioService.update(idUsuario, usuario);
            }
            else if (tipoUsuario === 'profesional') {
                const usuario = await this.profesionalService.findOne(idUsuario);
                if (!usuario) {
                    throw new common_1.BadRequestException('Usuario profesional no encontrado');
                }
                usuario.avatar = `${BASE_URL}/imagenesDePerfilesUsuarios/${filename}`;
                await this.profesionalService.update(idUsuario, usuario);
            }
            return { avatar: `${BASE_URL}/imagenesDePerfilesUsuarios/${filename}` };
        }
        catch (error) {
            console.error('Error al subir la imagen:', error);
            throw new common_1.BadRequestException('Error al subir la imagen');
        }
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