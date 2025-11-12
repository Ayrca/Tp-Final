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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const usuario_service_1 = require("../usuario/usuario.service");
const profesional_service_1 = require("../profesional/profesional.service");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    usuarioService;
    profesionalService;
    jwtService;
    constructor(usuarioService, profesionalService, jwtService) {
        this.usuarioService = usuarioService;
        this.profesionalService = profesionalService;
        this.jwtService = jwtService;
    }
    async login(email, password) {
        console.log('Iniciando sesión con email:', email);
        const usuario = await this.usuarioService.findOneByEmail(email);
        const profesional = await this.profesionalService.findOneByEmail(email);
        if (usuario) {
            const isValid = await usuario.comparePassword(password);
            if (isValid) {
                const token = await this.generateToken(usuario, 'usuario');
                return { token, tipo: 'usuario' };
            }
        }
        else if (profesional) {
            const isValid = await profesional.comparePassword(password);
            if (isValid) {
                const token = await this.generateToken(profesional, 'profesional');
                return { token, tipo: 'profesional' };
            }
        }
        else {
            console.log('Usuario o profesional no encontrado');
            return null;
        }
        console.log('Contraseña incorrecta');
        return null;
    }
    async validarPassword(usuario, password) {
        return await usuario.comparePassword(password);
    }
    async generateToken(usuario, tipo) {
        let payload;
        if (tipo === 'usuario') {
            payload = { sub: usuario.idusuarioComun, tipo };
        }
        else if (tipo === 'profesional') {
            payload = { sub: usuario.idusuarioProfesional, tipo };
        }
        return this.jwtService.sign(payload);
    }
    async getUsuario(id, tipo) {
        if (tipo === 'profesional') {
            return this.profesionalService.findOne(id);
        }
        else {
            return this.usuarioService.findOne(id);
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [usuario_service_1.UsuarioService,
        profesional_service_1.ProfesionalService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map