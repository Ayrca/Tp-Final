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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const usuario_service_1 = require("../usuario/usuario.service");
const profesional_service_1 = require("../profesional/profesional.service");
const jwt_1 = require("@nestjs/jwt");
const administrador_service_1 = require("../administrador/administrador.service");
const brevo = __importStar(require("@getbrevo/brevo"));
const FRONTEND_URL = process.env.FRONTEND_URL;
let AuthService = class AuthService {
    usuarioService;
    profesionalService;
    administradorService;
    jwtService;
    constructor(usuarioService, profesionalService, administradorService, jwtService) {
        this.usuarioService = usuarioService;
        this.profesionalService = profesionalService;
        this.administradorService = administradorService;
        this.jwtService = jwtService;
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
    async sendResetEmail(email, url) {
        const apiInstance = new brevo.TransactionalEmailsApi();
        apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);
        const sendEmail = {
            to: [{ email }],
            sender: { name: "Mi App", email: "proyectoafip26@gmail.com" },
            subject: "Cambio de contraseña",
            textContent: `Haz clic en este enlace para cambiar tu contraseña: ${url}`,
        };
        try {
            await apiInstance.sendTransacEmail(sendEmail);
            console.log("MAIL ENVIADO OK (BREVO API)");
        }
        catch (error) {
            console.log("ERROR BREVO API:", error);
            throw new Error("Error enviando email con Brevo");
        }
    }
    async forgotPassword(email) {
        try {
            const usuario = await this.usuarioService.findOneByEmail(email);
            const profesional = await this.profesionalService.findOneByEmail(email);
            const administrador = await this.administradorService.findOneByEmail(email);
            let user;
            if (usuario)
                user = usuario;
            else if (profesional)
                user = profesional;
            else if (administrador)
                user = administrador;
            if (!user) {
                throw new Error('Usuario no encontrado');
            }
            const token = this.jwtService.sign({
                userId: user.idusuarioProfesional ||
                    user.idusuarioComun ||
                    user.idusuarioAdm,
                tipo: user.tipo,
            }, { expiresIn: '1h' });
            const url = `${FRONTEND_URL}/ResetPassword/${token}`;
            await this.sendResetEmail(email, url);
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
        if (!user)
            throw new Error('Usuario no encontrado');
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
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map