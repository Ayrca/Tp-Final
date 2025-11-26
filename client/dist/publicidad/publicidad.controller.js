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
exports.PublicidadController = void 0;
const common_1 = require("@nestjs/common");
const publicidad_service_1 = require("./publicidad.service");
const publicidad_entity_1 = require("./publicidad.entity");
let PublicidadController = class PublicidadController {
    publicidadService;
    constructor(publicidadService) {
        this.publicidadService = publicidadService;
    }
    async findAll(tituloLike) {
        if (tituloLike) {
            return this.publicidadService.findByNombreLike(tituloLike);
        }
        else {
            return this.publicidadService.findAll();
        }
    }
    async findOne(id) {
        return this.publicidadService.findOne(id);
    }
    async delete(id) {
        return this.publicidadService.delete(id);
    }
    async create(publicidad) {
        return this.publicidadService.create(publicidad);
    }
    async update(id, publicidad) {
        return this.publicidadService.update(id, publicidad);
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('nombre_like')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicidadController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PublicidadController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PublicidadController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [publicidad_entity_1.Publicidad]),
    __metadata("design:returntype", Promise)
], PublicidadController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, publicidad_entity_1.Publicidad]),
    __metadata("design:returntype", Promise)
], PublicidadController.prototype, "update", null);
PublicidadController = __decorate([
    (0, common_1.Controller)('publicidad'),
    __metadata("design:paramtypes", [publicidad_service_1.PublicidadService])
], PublicidadController);
exports.PublicidadController = PublicidadController;
//# sourceMappingURL=publicidad.controller.js.map