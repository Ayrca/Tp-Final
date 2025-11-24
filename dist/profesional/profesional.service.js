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
exports.ProfesionalService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const profesional_entity_1 = require("./profesional.entity");
const typeorm_3 = require("typeorm");
const oficios_service_1 = require("../oficios/oficios.service");
let ProfesionalService = class ProfesionalService {
    ProfesionalRepository;
    oficiosService;
    constructor(ProfesionalRepository, oficiosService) {
        this.ProfesionalRepository = ProfesionalRepository;
        this.oficiosService = oficiosService;
    }
    async actualizarProfesional(id, datosActualizados) {
        try {
            console.log('ID del profesional:', id);
            console.log('Datos actualizados:', datosActualizados);
            const resultado = await this.ProfesionalRepository.update(id, datosActualizados);
            console.log('Resultado de la actualización:', resultado);
            if (resultado.affected === 0) {
                throw new Error(`No se encontró el profesional con ID ${id}`);
            }
            return this.findOne(id);
        }
        catch (error) {
            console.error('Error al actualizar profesional:', error);
            throw error;
        }
    }
    async findAll() {
        return this.ProfesionalRepository.find({ relations: ['oficio'] });
    }
    async findOne(id) {
        console.log('Buscando profesional con id:', id);
        const profesional = await this.ProfesionalRepository.findOne({ where: { idusuarioProfesional: id }, relations: ['oficio'], });
        console.log('Profesional encontrado:', profesional);
        if (!profesional) {
            throw new Error(`Profesional con id ${id} no encontrado`);
        }
        return profesional;
    }
    async findProfesionalCompleto(id) {
        const profesional = await this.ProfesionalRepository.findOne({
            where: { idusuarioProfesional: id },
            relations: ['oficio'],
        });
        return profesional;
    }
    async findByOficio(id) {
        return this.ProfesionalRepository.find({
            where: {
                oficio: { idOficios: id },
            },
        });
    }
    async findOneByEmail(email) {
        return this.ProfesionalRepository.findOneBy({ email });
    }
    async findByEmail(email) {
        const profesional = await this.ProfesionalRepository.findOneBy({ email });
        if (!profesional) {
            return null;
        }
        return profesional;
    }
    async create(profesional) {
        return this.ProfesionalRepository.save(profesional);
    }
    async update(id, profesional) {
        await this.ProfesionalRepository.update(id, profesional);
        return this.findOne(id);
    }
    async delete(id) {
        await this.ProfesionalRepository.delete(id);
    }
    async findByNombreLike(nombreLike) {
        return this.ProfesionalRepository.find({
            where: {
                nombre: (0, typeorm_3.Like)(`%${nombreLike}%`),
            },
        });
    }
    async registrar(datos) {
        const ultimoProfesional = await this.ProfesionalRepository.find({
            order: { idusuarioProfesional: 'DESC' },
            take: 1,
        });
        const nuevoId = ultimoProfesional.length > 0 ? ultimoProfesional[0].idusuarioProfesional + 1 : 1;
        const profesional = new profesional_entity_1.Profesional();
        profesional.idusuarioProfesional = nuevoId;
        profesional.nombre = datos.nombre;
        profesional.apellido = datos.apellido;
        profesional.email = datos.email;
        profesional.password = datos.password;
        profesional.tipo = datos.tipo;
        profesional.telefono = datos.telefono;
        profesional.direccion = datos.direccion;
        profesional.estadoCuenta = datos.estadoCuenta || true;
        profesional.avatar = datos.avatar || '';
        profesional.fechaNacimiento = datos.fechaNacimiento;
        profesional.empresa = datos.empresa;
        const oficio = await this.oficiosService.findOne(datos.oficio);
        profesional.oficio = oficio;
        return this.ProfesionalRepository.save(profesional);
    }
};
exports.ProfesionalService = ProfesionalService;
exports.ProfesionalService = ProfesionalService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(profesional_entity_1.Profesional)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        oficios_service_1.OficiosService])
], ProfesionalService);
//# sourceMappingURL=profesional.service.js.map