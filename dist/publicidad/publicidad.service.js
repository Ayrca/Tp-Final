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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicidadService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const publicidad_entity_1 = require("./publicidad.entity");
const cloudinary_config_1 = __importDefault(require("../cloudinary.config"));
let PublicidadService = class PublicidadService {
    publicidadRepository;
    constructor(publicidadRepository) {
        this.publicidadRepository = publicidadRepository;
    }
    async findAll() {
        return this.publicidadRepository.find();
    }
    async findOne(id) {
        const publicidad = await this.publicidadRepository.findOneBy({ idpublicidad: id });
        if (!publicidad)
            throw new common_1.BadRequestException(`Publicidad con id ${id} no encontrada`);
        return publicidad;
    }
    async create(publicidad, file) {
        if (file) {
            const result = await cloudinary_config_1.default.uploader.upload(file.path, {
                folder: `publicidad/${publicidad.titulo}`,
            });
            publicidad.urlImagen = result.secure_url;
        }
        return this.publicidadRepository.save(publicidad);
    }
    async update(id, publicidad, file) {
        const publicidadToUpdate = await this.publicidadRepository.findOneBy({ idpublicidad: id });
        if (!publicidadToUpdate)
            throw new common_1.BadRequestException(`Publicidad con id ${id} no encontrada`);
        publicidadToUpdate.titulo = publicidad.titulo;
        publicidadToUpdate.urlPagina = publicidad.urlPagina;
        if (file) {
            const result = await cloudinary_config_1.default.uploader.upload(file.path, {
                folder: `publicidad/${publicidad.titulo}`,
            });
            publicidadToUpdate.urlImagen = result.secure_url;
        }
        else if (publicidad.urlImagen) {
            publicidadToUpdate.urlImagen = publicidad.urlImagen;
        }
        return this.publicidadRepository.save(publicidadToUpdate);
    }
    async delete(id) {
        await this.publicidadRepository.delete(id);
    }
    async findByTituloLike(tituloLike) {
        return this.publicidadRepository.find({
            where: { titulo: (0, typeorm_2.Like)(`%${tituloLike}%`) },
        });
    }
};
exports.PublicidadService = PublicidadService;
exports.PublicidadService = PublicidadService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(publicidad_entity_1.Publicidad)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PublicidadService);
//# sourceMappingURL=publicidad.service.js.map