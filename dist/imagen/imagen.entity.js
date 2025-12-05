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
exports.Imagen = void 0;
const typeorm_1 = require("typeorm");
const profesional_entity_1 = require("../profesional/profesional.entity");
let Imagen = class Imagen {
    idImagen;
    url;
    idProfesional;
    profesional;
    publicId;
};
exports.Imagen = Imagen;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Imagen.prototype, "idImagen", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Imagen.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Imagen.prototype, "idProfesional", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => profesional_entity_1.Profesional),
    (0, typeorm_1.JoinColumn)({ name: 'idProfesional' }),
    __metadata("design:type", profesional_entity_1.Profesional)
], Imagen.prototype, "profesional", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Imagen.prototype, "publicId", void 0);
exports.Imagen = Imagen = __decorate([
    (0, typeorm_1.Entity)()
], Imagen);
//# sourceMappingURL=imagen.entity.js.map