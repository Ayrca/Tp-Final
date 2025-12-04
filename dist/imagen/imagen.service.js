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
exports.ImagenService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const imagen_entity_1 = require("./imagen.entity");
const profesional_entity_1 = require("../profesional/profesional.entity");
const cloudinary_config_1 = __importDefault(require("../cloudinary.config"));
let ImagenService = class ImagenService {
    imagenRepository;
    usuarioProfesionalRepository;
    constructor(imagenRepository, usuarioProfesionalRepository) {
        this.imagenRepository = imagenRepository;
        this.usuarioProfesionalRepository = usuarioProfesionalRepository;
    }
    async guardarImagen(file, idProfesional) {
        if (!idProfesional) {
            throw new common_1.BadRequestException('El idProfesional es requerido');
        }
        if (!file) {
            throw new common_1.BadRequestException('El archivo es requerido');
        }
        const result = await cloudinary_config_1.default.uploader.upload(file.path, {
            folder: `profesionales/${idProfesional}`,
        });
        const imagen = this.imagenRepository.create({
            url: result.secure_url,
            idProfesional: idProfesional,
        });
        await this.imagenRepository.save(imagen);
        return { url: result.secure_url, message: 'Imagen guardada con éxito' };
    }
    async findById(id) {
        return this.imagenRepository.find({ where: { idProfesional: id } });
    }
};
exports.ImagenService = ImagenService;
exports.ImagenService = ImagenService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(imagen_entity_1.Imagen)),
    __param(1, (0, typeorm_1.InjectRepository)(profesional_entity_1.Profesional)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ImagenService);
//# sourceMappingURL=imagen.service.js.map