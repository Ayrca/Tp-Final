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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicidadController = void 0;
const common_1 = require("@nestjs/common");
const publicidad_service_1 = require("./publicidad.service");
const platform_express_1 = require("@nestjs/platform-express");
const multer = __importStar(require("multer"));
const cloudinary_config_1 = __importDefault(require("../cloudinary.config"));
const publicidad_entity_1 = require("./publicidad.entity");
let PublicidadController = class PublicidadController {
    publicidadService;
    constructor(publicidadService) {
        this.publicidadService = publicidadService;
    }
    async createWithImage(file, titulo, urlPagina) {
        if (!file)
            throw new common_1.HttpException('No se ha proporcionado archivo', common_1.HttpStatus.BAD_REQUEST);
        if (!titulo || !urlPagina)
            throw new common_1.HttpException('Titulo y URL son requeridos', common_1.HttpStatus.BAD_REQUEST);
        try {
            const urlImagen = await new Promise((resolve, reject) => {
                const stream = cloudinary_config_1.default.uploader.upload_stream({ folder: 'publicidad' }, (error, result) => {
                    if (error)
                        return reject(error);
                    if (!result?.secure_url)
                        return reject(new Error('No se obtuvo URL de Cloudinary'));
                    resolve(result.secure_url);
                });
                stream.end(file.buffer);
            });
            const nuevaPublicidad = new publicidad_entity_1.Publicidad();
            nuevaPublicidad.titulo = titulo;
            nuevaPublicidad.urlPagina = urlPagina;
            nuevaPublicidad.urlImagen = urlImagen;
            return this.publicidadService.create(nuevaPublicidad);
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException('Error al subir la imagen', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, publicidad) {
        const idNum = parseInt(id, 10);
        if (isNaN(idNum))
            throw new common_1.HttpException('ID inválido', common_1.HttpStatus.BAD_REQUEST);
        return this.publicidadService.update(idNum, publicidad);
    }
    async findAll() {
        return this.publicidadService.findAll();
    }
    async delete(id) {
        const idNum = parseInt(id, 10);
        if (isNaN(idNum))
            throw new common_1.HttpException('ID inválido', common_1.HttpStatus.BAD_REQUEST);
        return this.publicidadService.delete(idNum);
    }
};
exports.PublicidadController = PublicidadController;
__decorate([
    (0, common_1.Post)('upload'),
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
    __param(1, (0, common_1.Body)('titulo')),
    __param(2, (0, common_1.Body)('urlPagina')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], PublicidadController.prototype, "createWithImage", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, publicidad_entity_1.Publicidad]),
    __metadata("design:returntype", Promise)
], PublicidadController.prototype, "update", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicidadController.prototype, "findAll", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicidadController.prototype, "delete", null);
exports.PublicidadController = PublicidadController = __decorate([
    (0, common_1.Controller)('publicidad'),
    __metadata("design:paramtypes", [publicidad_service_1.PublicidadService])
], PublicidadController);
//# sourceMappingURL=publicidad.controller.js.map