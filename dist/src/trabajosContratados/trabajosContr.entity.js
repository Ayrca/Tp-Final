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
exports.TrabajoContratado = void 0;
const typeorm_1 = require("typeorm");
const profesional_entity_1 = require("../profesional/profesional.entity");
const usuario_entity_1 = require("../usuario/usuario.entity");
let TrabajoContratado = class TrabajoContratado {
    idcontratacion;
    usuarioComun;
    profesional;
    rubro;
    telefonoProfesional;
    telefonoCliente;
    estado;
    valoracion;
    comentario;
    fechaContratacion;
};
exports.TrabajoContratado = TrabajoContratado;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TrabajoContratado.prototype, "idcontratacion", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => usuario_entity_1.Usuario),
    (0, typeorm_1.JoinColumn)({ name: 'usuarioComun_idusuarioComun' }),
    __metadata("design:type", usuario_entity_1.Usuario)
], TrabajoContratado.prototype, "usuarioComun", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => profesional_entity_1.Profesional),
    (0, typeorm_1.JoinColumn)({ name: 'usuarioProfesional_idusuarioProfesional' }),
    __metadata("design:type", profesional_entity_1.Profesional)
], TrabajoContratado.prototype, "profesional", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TrabajoContratado.prototype, "rubro", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TrabajoContratado.prototype, "telefonoProfesional", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TrabajoContratado.prototype, "telefonoCliente", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TrabajoContratado.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], TrabajoContratado.prototype, "valoracion", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TrabajoContratado.prototype, "comentario", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], TrabajoContratado.prototype, "fechaContratacion", void 0);
exports.TrabajoContratado = TrabajoContratado = __decorate([
    (0, typeorm_1.Entity)('contratacion')
], TrabajoContratado);
//# sourceMappingURL=trabajosContr.entity.js.map