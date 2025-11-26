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
exports.Oficio = void 0;
const typeorm_1 = require("typeorm");
const profesional_entity_1 = require("../profesional/profesional.entity");
let Oficio = class Oficio {
    idOficios;
    nombre;
    urlImagen;
    profesionales;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Oficio.prototype, "idOficios", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Oficio.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Oficio.prototype, "urlImagen", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => profesional_entity_1.Profesional, (profesional) => profesional.oficio),
    __metadata("design:type", Array)
], Oficio.prototype, "profesionales", void 0);
Oficio = __decorate([
    (0, typeorm_1.Entity)('oficios')
], Oficio);
exports.Oficio = Oficio;
//# sourceMappingURL=oficios.entity.js.map