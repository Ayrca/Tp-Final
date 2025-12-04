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
exports.OficiosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const oficios_entity_1 = require("./oficios.entity");
const cloudinary_config_1 = __importDefault(require("../cloudinary.config"));
let OficiosService = class OficiosService {
    oficioRepository;
    constructor(oficioRepository) {
        this.oficioRepository = oficioRepository;
    }
    async findAll() {
        return this.oficioRepository.find();
    }
    async findOne(id) {
        const oficio = await this.oficioRepository.findOneBy({ idOficios: id });
        if (!oficio) {
            throw new common_1.BadRequestException(`Oficio con id ${id} no encontrado`);
        }
        return oficio;
    }
    async create(oficio, file) {
        if (file) {
            const result = await cloudinary_config_1.default.uploader.upload(file.path, {
                folder: `oficios/${oficio.nombre}`,
            });
            oficio.urlImagen = result.secure_url;
        }
        return this.oficioRepository.save(oficio);
    }
    async update(id, oficio, file) {
        const oficioToUpdate = await this.oficioRepository.findOneBy({ idOficios: id });
        if (!oficioToUpdate)
            throw new common_1.BadRequestException(`Oficio con id ${id} no encontrado`);
        oficioToUpdate.nombre = oficio.nombre;
        if (file) {
            const result = await cloudinary_config_1.default.uploader.upload(file.path, {
                folder: `oficios/${oficio.nombre}`,
            });
            oficioToUpdate.urlImagen = result.secure_url;
        }
        else if (oficio.urlImagen) {
            oficioToUpdate.urlImagen = oficio.urlImagen;
        }
        return this.oficioRepository.save(oficioToUpdate);
    }
    async delete(id) {
        await this.oficioRepository.delete(id);
    }
    async findByNombreLike(nombreLike) {
        return this.oficioRepository.find({
            where: { nombre: (0, typeorm_2.Like)(`%${nombreLike}%`) },
        });
    }
};
exports.OficiosService = OficiosService;
exports.OficiosService = OficiosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(oficios_entity_1.Oficio)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], OficiosService);
//# sourceMappingURL=oficios.service.js.map