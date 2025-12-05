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
const imagen_service_1 = require("./imagen.service");
const platform_express_1 = require("@nestjs/platform-express");
const multer = __importStar(require("multer"));
let ImagenController = class ImagenController {
    imagenService;
    constructor(imagenService) {
        this.imagenService = imagenService;
    }
    async uploadImagen(file, idProfesional) {
        if (!file) {
            throw new common_1.HttpException('No se ha proporcionado un archivo', common_1.HttpStatus.BAD_REQUEST);
        }
        if (!idProfesional) {
            throw new common_1.HttpException('idProfesional es requerido', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            return await this.imagenService.subirImagen(file, idProfesional);
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException('Error al subir la imagen', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getImagenes(idProfesional) {
        return this.imagenService.obtenerImagenes(idProfesional);
    }
    async eliminarImagen(idImagen) {
        try {
            return await this.imagenService.eliminarImagen(idImagen);
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException(error.message || 'Error al eliminar la imagen', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ImagenController = ImagenController;
__decorate([
    (0, common_1.Post)('upload/:idProfesional'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: multer.memoryStorage(),
        fileFilter: (req, file, cb) => {
            const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (allowedMimeTypes.includes(file.mimetype))
                cb(null, true);
            else
                cb(new Error('Tipo de archivo no permitido'), false);
        },
        limits: { fileSize: 1024 * 1024 * 5 },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Param)('idProfesional')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], ImagenController.prototype, "uploadImagen", null);
__decorate([
    (0, common_1.Get)(':idProfesional'),
    __param(0, (0, common_1.Param)('idProfesional')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ImagenController.prototype, "getImagenes", null);
__decorate([
    (0, common_1.Delete)(':idImagen'),
    __param(0, (0, common_1.Param)('idImagen')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ImagenController.prototype, "eliminarImagen", null);
exports.ImagenController = ImagenController = __decorate([
    (0, common_1.Controller)('imagen'),
    __metadata("design:paramtypes", [imagen_service_1.ImagenService])
], ImagenController);
//# sourceMappingURL=imagen.controller.js.map