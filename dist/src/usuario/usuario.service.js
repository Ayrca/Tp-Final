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
exports.UsuarioService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const usuario_entity_1 = require("./usuario.entity");
const typeorm_3 = require("typeorm");
let UsuarioService = class UsuarioService {
    usuarioRepository;
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }
    async findAll() {
        return this.usuarioRepository.find();
    }
    async findOne(usuarioId) {
        console.log('ID recibido en findOne:', usuarioId);
        if (typeof usuarioId !== 'number') {
            throw new Error(`El ID debe ser un número, pero se recibió ${usuarioId} de tipo ${typeof usuarioId}`);
        }
        const usuario = await this.usuarioRepository.findOneBy({ idusuarioComun: usuarioId });
        if (!usuario) {
            throw new Error(`Usuario con idusuarioComun ${usuarioId} no encontrado`);
        }
        return usuario;
    }
    async findByEmail(email) {
        const usuario = await this.usuarioRepository.findOneBy({ email });
        if (!usuario) {
            return null;
        }
        return usuario;
    }
    async findOneByEmail(email) {
        return this.usuarioRepository.findOneBy({ email });
    }
    async create(usuario) {
        return this.usuarioRepository.save(usuario);
    }
    async update(id, usuario) {
        await this.usuarioRepository.update(id, usuario);
        return this.findOne(id);
    }
    async delete(id) {
        await this.usuarioRepository.delete(id);
    }
    async findByNombreLike(tituloLike) {
        return this.usuarioRepository.find({
            where: { nombre: (0, typeorm_3.Like)(`%${tituloLike}%`) },
        });
    }
    async registrar(datos) {
        const usuario = new usuario_entity_1.Usuario();
        usuario.nombre = datos.nombre;
        usuario.apellido = datos.apellido;
        usuario.email = datos.email;
        usuario.password = datos.password;
        usuario.tipo = datos.tipo;
        usuario.telefono = datos.telefono;
        usuario.direccion = datos.direccion;
        usuario.estadoCuenta = datos.estadoCuenta || true;
        usuario.avatar = datos.avatar || '';
        usuario.fechaNacimiento = datos.fechaNacimiento;
        return this.usuarioRepository.save(usuario);
    }
};
exports.UsuarioService = UsuarioService;
exports.UsuarioService = UsuarioService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsuarioService);
//# sourceMappingURL=usuario.service.js.map