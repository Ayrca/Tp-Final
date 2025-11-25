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
exports.ImagenController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const imagen_service_1 = require("./imagen.service");
let ImagenController = class ImagenController {
    imagenService;
    constructor(imagenService) {
        this.imagenService = imagenService;
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
            url: `http://localhost:3000/assets/imagenesUsuarios/${imagen.url}`,
        }));
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
exports.ImagenController = ImagenController = __decorate([
    (0, common_1.Controller)('imagen'),
    __metadata("design:paramtypes", [imagen_service_1.ImagenService])
], ImagenController);
//# sourceMappingURL=imagen.controller.js.map