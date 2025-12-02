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
const administrador_service_1 = require("../administrador/administrador.service");
const mailer_1 = require("@nestjs-modules/mailer");
const FRONTEND_URL = process.env.FRONTEND_URL;
let AuthService = class AuthService {
    usuarioService;
    profesionalService;
    administradorService;
    jwtService;
    mailerService;
    constructor(usuarioService, profesionalService, administradorService, jwtService, mailerService) {
        this.usuarioService = usuarioService;
        this.profesionalService = profesionalService;
        this.administradorService = administradorService;
        this.jwtService = jwtService;
        this.mailerService = mailerService;
    }
    async login(email, password) {
        console.log('Iniciando sesión con email:', email);
        const usuario = await this.usuarioService.findOneByEmail(email);
        const profesional = await this.profesionalService.findOneByEmail(email);
        const administrador = await this.administradorService.findOneByEmail(email);
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
        else if (administrador) {
            const isValid = await administrador.comparePassword(password);
            if (isValid) {
                const token = await this.generateToken(administrador, 'administrador');
                return { token, tipo: 'administrador' };
            }
        }
        else {
            console.log('Usuario, profesional o administrador no encontrado');
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
        else if (tipo === 'administrador') {
            payload = { sub: usuario.idusuarioAdm, tipo };
        }
        return this.jwtService.sign(payload);
    }
    async getUsuario(id, tipo) {
        if (tipo === 'profesional') {
            return this.profesionalService.findOne(id);
        }
        else if (tipo === 'usuario') {
            return this.usuarioService.findOne(id);
        }
        else if (tipo === 'administrador') {
            return this.administradorService.findOne(id);
        }
    }
    async forgotPassword(email) {
        try {
            const usuario = await this.usuarioService.findOneByEmail(email);
            const profesional = await this.profesionalService.findOneByEmail(email);
            const administrador = await this.administradorService.findOneByEmail(email);
            let user;
            if (usuario) {
                user = usuario;
            }
            else if (profesional) {
                user = profesional;
            }
            else if (administrador) {
                user = administrador;
            }
            if (!user) {
                throw new Error('Usuario no encontrado');
            }
            const token = this.jwtService.sign({ userId: user.idusuarioProfesional || user.idusuarioComun || user.idusuarioAdm, tipo: user.tipo }, { expiresIn: '1h' });
            const url = `${FRONTEND_URL}/ResetPassword/${token}`;
            await this.mailerService.sendMail({
                to: email,
                subject: 'Cambio de contraseña',
                text: `Haz clic en este enlace para cambiar tu contraseña: ${url}`,
            });
            return { message: 'Email enviado', token };
        }
        catch (error) {
            console.log(error);
            throw new Error('Error al enviar el correo electrónico');
        }
    }
    async resetPassword(token, password) {
        const decoded = this.jwtService.verify(token);
        let user;
        if (decoded.tipo === 'profesional') {
            user = await this.profesionalService.findOne(decoded.userId);
        }
        else if (decoded.tipo === 'usuario') {
            user = await this.usuarioService.findOne(decoded.userId);
        }
        else if (decoded.tipo === 'administrador') {
            user = await this.administradorService.findOne(decoded.userId);
        }
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        if (decoded.tipo === 'profesional') {
            await this.profesionalService.updatePassword(decoded.userId, password);
        }
        else if (decoded.tipo === 'usuario') {
            await this.usuarioService.updatePassword(decoded.userId, password);
        }
        else if (decoded.tipo === 'administrador') {
            await this.administradorService.updatePassword(decoded.userId, password);
        }
        return { message: 'Contraseña cambiada' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [usuario_service_1.UsuarioService,
        profesional_service_1.ProfesionalService,
        administrador_service_1.AdministradorService,
        jwt_1.JwtService,
        mailer_1.MailerService])
], AuthService);
//# sourceMappingURL=auth.service.js.map