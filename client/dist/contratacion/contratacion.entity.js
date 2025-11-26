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
exports.Contratacion = void 0;
const typeorm_1 = require("typeorm");
let Contratacion = class Contratacion {
    idcontratacion;
    usuarioComun_idusuarioComun;
    usuarioProfesional_idusuarioProfesional;
    rubro;
    telefonoProfesional;
    telefonoCliente;
    estado;
    valoracion;
    comentario;
    fechaContratacion;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Contratacion.prototype, "idcontratacion", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Contratacion.prototype, "usuarioComun_idusuarioComun", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Contratacion.prototype, "usuarioProfesional_idusuarioProfesional", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Contratacion.prototype, "rubro", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Contratacion.prototype, "telefonoProfesional", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Contratacion.prototype, "telefonoCliente", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Contratacion.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Contratacion.prototype, "valoracion", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Contratacion.prototype, "comentario", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Contratacion.prototype, "fechaContratacion", void 0);
Contratacion = __decorate([
    (0, typeorm_1.Entity)('contratacion')
], Contratacion);
exports.Contratacion = Contratacion;
//# sourceMappingURL=contratacion.entity.js.map