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
exports.UsuarioController = void 0;
const common_1 = require("@nestjs/common");
const usuario_service_1 = require("./usuario.service");
const usuario_entity_1 = require("./usuario.entity");
const auth_guard_1 = require("../autenticaci\u00F3n/auth.guard");
const jwt_1 = require("@nestjs/jwt");
const profesional_service_1 = require("../profesional/profesional.service");
let UsuarioController = class UsuarioController {
    usuarioService;
    profesionalService;
    jwtService;
    constructor(usuarioService, profesionalService, jwtService) {
        this.usuarioService = usuarioService;
        this.profesionalService = profesionalService;
        this.jwtService = jwtService;
    }
    async create(usuario) {
        return this.usuarioService.create(usuario);
    }
    async update(id, usuario) {
        id = Number(id);
        return this.usuarioService.update(id, usuario);
    }
    async delete(id) {
        return this.usuarioService.delete(id);
    }
    async registrar(datos) {
        return this.usuarioService.registrar(datos);
    }
    async verificarEmail(email) {
        const usuario = await this.usuarioService.findByEmail(email);
        const profesional = await this.profesionalService.findByEmail(email);
        if (usuario || profesional) {
            throw new common_1.HttpException('El email ya está en uso', common_1.HttpStatus.BAD_REQUEST);
        }
        else {
            return { mensaje: 'El email está disponible' };
        }
    }
    async getUsuario(id) {
        const idNumber = parseInt(id, 10);
        if (isNaN(idNumber)) {
            throw new Error('El ID debe ser un número');
        }
        return this.usuarioService.findOne(idNumber);
    }
    async getPerfil(req) {
        console.log('Entrando en getPerfil usuario comun');
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = this.jwtService.verify(token);
            const id = decoded.sub;
            const tipo1 = decoded.tipo;
            let usuario;
            if (tipo1 === 'profesional') {
                usuario = await this.profesionalService.findOne(id);
            }
            else {
                usuario = await this.usuarioService.findOne(id);
            }
            if (!usuario) {
                throw new Error('Usuario no encontrado');
            }
            const { idusuarioComun, nombre, apellido, email, tipo, telefono, direccion, estadoCuenta, avatar, fechaNacimiento } = usuario;
            return { id: idusuarioComun, nombre, apellido, email, tipo, telefono, direccion, estadoCuenta, avatar, fechaNacimiento };
        }
        catch (error) {
            console.error('Error en getPerfil:', error);
            throw error;
        }
    }
};
exports.UsuarioController = UsuarioController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [usuario_entity_1.Usuario]),
    __metadata("design:returntype", Promise)
], UsuarioController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, usuario_entity_1.Usuario]),
    __metadata("design:returntype", Promise)
], UsuarioController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsuarioController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)('registro'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsuarioController.prototype, "registrar", null);
__decorate([
    (0, common_1.Post)('verificar-email'),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsuarioController.prototype, "verificarEmail", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsuarioController.prototype, "getUsuario", null);
__decorate([
    (0, common_1.Get)('perfil'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsuarioController.prototype, "getPerfil", null);
exports.UsuarioController = UsuarioController = __decorate([
    (0, common_1.Controller)('usuario'),
    __metadata("design:paramtypes", [usuario_service_1.UsuarioService,
        profesional_service_1.ProfesionalService,
        jwt_1.JwtService])
], UsuarioController);
//# sourceMappingURL=usuario.controller.js.map