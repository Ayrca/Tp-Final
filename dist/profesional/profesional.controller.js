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
exports.ProfesionalController = void 0;
const common_1 = require("@nestjs/common");
const profesional_service_1 = require("./profesional.service");
const profesional_entity_1 = require("./profesional.entity");
const auth_guard_1 = require("../autenticaci\u00F3n/auth.guard");
const jwt_1 = require("@nestjs/jwt");
let ProfesionalController = class ProfesionalController {
    profesionalService;
    jwtService;
    constructor(profesionalService, jwtService) {
        this.profesionalService = profesionalService;
        this.jwtService = jwtService;
    }
    async actualizarProfesional(req, datosActualizados) {
        try {
            console.log('req.user:', req.user);
            const id = req.user?.sub;
            console.log('ID del usuario:', id);
            if (!id) {
                throw new Error('Usuario no autenticado');
            }
            const profesionalActualizado = await this.profesionalService.actualizarProfesional(id, datosActualizados);
            return profesionalActualizado;
        }
        catch (error) {
            console.error('Error al actualizar profesional:', error);
            throw error;
        }
    }
    async findByOficio(id) {
        return this.profesionalService.findByOficio(id);
    }
    async findOne(id) {
        const profesional = await this.profesionalService.findOne(id);
        return {
            ...profesional,
            oficio: profesional.oficio,
        };
    }
    async findProfesionalCompleto(id) {
        const profesional = await this.profesionalService.findProfesionalCompleto(id);
        return profesional;
    }
    async findAll() {
        return this.profesionalService.findAll();
    }
    async create(oficio) {
        return this.profesionalService.create(oficio);
    }
    async delete(id) {
        return this.profesionalService.delete(id);
    }
    async getPerfilProfesional(req) {
        console.log('Entrando en getPerfilProfesional');
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = this.jwtService.verify(token);
            const id = decoded.sub;
            const profesional = await this.profesionalService.findOne(id);
            if (!profesional) {
                throw new Error('Profesional no encontrado');
            }
            const { idusuarioProfesional, nombre, apellido, email, tipo, oficio, empresa, telefono, direccion, avatar, estadoCuenta, descripcion, fechaNacimiento, valoracion } = profesional;
            return {
                id: idusuarioProfesional,
                nombre,
                apellido,
                email,
                tipo,
                oficio: { nombre: oficio.nombre, },
                telefono,
                direccion,
                avatar,
                estadoCuenta,
                descripcion,
                fechaNacimiento,
                valoracion
            };
        }
        catch (error) {
            console.error('Error en getPerfilProfesional:', error);
            throw error;
        }
    }
    async registrar(datos) {
        return this.profesionalService.registrar(datos);
    }
    async banearProfesional(id) {
        return this.profesionalService.banearProfesional(id);
    }
    async desbloquearProfesional(id) {
        return this.profesionalService.desbloquearProfesional(id);
    }
};
exports.ProfesionalController = ProfesionalController;
__decorate([
    (0, common_1.Put)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfesionalController.prototype, "actualizarProfesional", null);
__decorate([
    (0, common_1.Get)('oficio/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProfesionalController.prototype, "findByOficio", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProfesionalController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('completo/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProfesionalController.prototype, "findProfesionalCompleto", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProfesionalController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [profesional_entity_1.Profesional]),
    __metadata("design:returntype", Promise)
], ProfesionalController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProfesionalController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)('profesional/perfil'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfesionalController.prototype, "getPerfilProfesional", null);
__decorate([
    (0, common_1.Post)('registro'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfesionalController.prototype, "registrar", null);
__decorate([
    (0, common_1.Put)(':id/baneo'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProfesionalController.prototype, "banearProfesional", null);
__decorate([
    (0, common_1.Put)(':id/desbloqueo'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProfesionalController.prototype, "desbloquearProfesional", null);
exports.ProfesionalController = ProfesionalController = __decorate([
    (0, common_1.Controller)('profesional'),
    __metadata("design:paramtypes", [profesional_service_1.ProfesionalService,
        jwt_1.JwtService])
], ProfesionalController);
//# sourceMappingURL=profesional.controller.js.map