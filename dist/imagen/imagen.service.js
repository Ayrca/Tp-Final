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
    profesionalRepository;
    constructor(imagenRepository, profesionalRepository) {
        this.imagenRepository = imagenRepository;
        this.profesionalRepository = profesionalRepository;
    }
    async subirImagen(file, idProfesional) {
        if (!file)
            throw new common_1.BadRequestException('No se recibió ninguna imagen');
        try {
            const urlImagen = await new Promise((resolve, reject) => {
                const stream = cloudinary_config_1.default.uploader.upload_stream({ folder: `profesionales/${idProfesional}` }, (error, result) => {
                    if (error)
                        return reject(error);
                    if (!result || !result.secure_url)
                        return reject(new Error('No se obtuvo URL de Cloudinary'));
                    resolve(result.secure_url);
                });
                stream.end(file.buffer);
            });
            const imagen = new imagen_entity_1.Imagen();
            imagen.idProfesional = idProfesional;
            imagen.url = urlImagen;
            await this.imagenRepository.save(imagen);
            return { message: 'Imagen subida con éxito', url: urlImagen };
        }
        catch (error) {
            console.error('Error al subir la imagen a Cloudinary:', error);
            throw new common_1.BadRequestException('Error al subir la imagen');
        }
    }
    async obtenerImagenes(idProfesional) {
        return this.imagenRepository.find({ where: { idProfesional } });
    }
    async eliminarImagen(idImagen) {
        const imagen = await this.imagenRepository.findOneBy({ idImagen });
        if (!imagen)
            throw new common_1.BadRequestException('Imagen no encontrada');
        if (imagen.publicId) {
            await cloudinary_config_1.default.uploader.destroy(imagen.publicId);
        }
        await this.imagenRepository.remove(imagen);
        return { message: 'Imagen eliminada con éxito' };
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