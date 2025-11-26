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
exports.AdministradorService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const administrador_entity_1 = require("./administrador.entity");
let AdministradorService = class AdministradorService {
    administradorRepository;
    constructor(administradorRepository) {
        this.administradorRepository = administradorRepository;
    }
    async findAll() {
        return this.administradorRepository.find();
    }
    async findOneByEmail(email) {
        return this.administradorRepository.findOne({ where: { email } });
    }
    async findOne(id) {
        return this.administradorRepository.findOne({ where: { idusuarioAdm: id } });
    }
    async create(administrador) {
        return this.administradorRepository.save(administrador);
    }
    async update(id, administrador) {
        await this.administradorRepository.update(id, administrador);
        return this.administradorRepository.findOne({ where: { idusuarioAdm: id } });
    }
    async delete(id) {
        await this.administradorRepository.delete(id);
    }
};
AdministradorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(administrador_entity_1.Administrador)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AdministradorService);
exports.AdministradorService = AdministradorService;
//# sourceMappingURL=administrador.service.js.map