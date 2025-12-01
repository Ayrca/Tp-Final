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
exports.TrabajoContratadoController = void 0;
const common_1 = require("@nestjs/common");
const trabajosContr_service_1 = require("./trabajosContr.service");
const trabajosContr_entity_1 = require("./trabajosContr.entity");
let TrabajoContratadoController = class TrabajoContratadoController {
    trabajoContratadoService;
    constructor(trabajoContratadoService) {
        this.trabajoContratadoService = trabajoContratadoService;
    }
    async actualizarEstado(idcontratacion, data) {
        return this.trabajoContratadoService.actualizarEstado(idcontratacion, data.estado, data.comentario, data.valoracion);
    }
    async findByProfesionalId(idProfesional) {
        return this.trabajoContratadoService.findByProfesionalId(idProfesional);
    }
    async findByUsuarioComunId(idUsuarioComun) {
        return this.trabajoContratadoService.findByUsuarioComunId(idUsuarioComun);
    }
    async create(trabajoContratado) {
        return this.trabajoContratadoService.create(trabajoContratado);
    }
    async delete(idTrabajoContratado) {
        return this.trabajoContratadoService.delete(idTrabajoContratado);
    }
    async getPromedioValoracion(idusuarioProfesional) {
        return this.trabajoContratadoService.getPromedioValoracion(idusuarioProfesional);
    }
};
exports.TrabajoContratadoController = TrabajoContratadoController;
__decorate([
    (0, common_1.Put)(':idcontratacion'),
    __param(0, (0, common_1.Param)('idcontratacion')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], TrabajoContratadoController.prototype, "actualizarEstado", null);
__decorate([
    (0, common_1.Get)(':idProfesional'),
    __param(0, (0, common_1.Param)('idProfesional')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TrabajoContratadoController.prototype, "findByProfesionalId", null);
__decorate([
    (0, common_1.Get)('usuario/:idusuarioComun'),
    __param(0, (0, common_1.Param)('idusuarioComun')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TrabajoContratadoController.prototype, "findByUsuarioComunId", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [trabajosContr_entity_1.TrabajoContratado]),
    __metadata("design:returntype", Promise)
], TrabajoContratadoController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':idTrabajoContratado'),
    __param(0, (0, common_1.Param)('idTrabajoContratado')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TrabajoContratadoController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)('promedio-valoracion/:idusuarioProfesional'),
    __param(0, (0, common_1.Param)('idusuarioProfesional')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TrabajoContratadoController.prototype, "getPromedioValoracion", null);
exports.TrabajoContratadoController = TrabajoContratadoController = __decorate([
    (0, common_1.Controller)('trabajoContratado'),
    __metadata("design:paramtypes", [trabajosContr_service_1.TrabajoContratadoService])
], TrabajoContratadoController);
//# sourceMappingURL=trabajosContr.controller.js.map