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
exports.TrabajoContratadoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const trabajosContr_entity_1 = require("./trabajosContr.entity");
let TrabajoContratadoService = class TrabajoContratadoService {
    trabajoContratadoRepository;
    constructor(trabajoContratadoRepository) {
        this.trabajoContratadoRepository = trabajoContratadoRepository;
    }
    async actualizarEstado(idcontratacion, estado, comentario, valoracion) {
        const trabajoContratado = await this.trabajoContratadoRepository.findOne({
            where: { idcontratacion },
        });
        if (!trabajoContratado) {
            throw new Error('Trabajo no encontrado');
        }
        trabajoContratado.estado = estado;
        trabajoContratado.comentario = comentario;
        trabajoContratado.valoracion = valoracion;
        return this.trabajoContratadoRepository.save(trabajoContratado);
    }
    async findByUsuarioComunId(idUsuarioComun) {
        return this.trabajoContratadoRepository.find({
            where: { usuarioComun: { idusuarioComun: idUsuarioComun } },
            relations: ['profesional', 'usuarioComun'],
            select: {
                idcontratacion: true,
                rubro: true,
                estado: true,
                fechaContratacion: true,
                valoracion: true,
                comentario: true,
                telefonoProfesional: true,
                telefonoCliente: true,
                profesional: { nombre: true },
                usuarioComun: {
                    idusuarioComun: true,
                    nombre: true,
                    apellido: true,
                    telefono: true
                }
            }
        });
    }
    async findByProfesionalId(idProfesional) {
        return this.trabajoContratadoRepository.find({
            where: { profesional: { idusuarioProfesional: idProfesional } },
            relations: ['profesional', 'usuarioComun'],
            select: {
                idcontratacion: true,
                rubro: true,
                estado: true,
                fechaContratacion: true,
                valoracion: true,
                comentario: true,
                telefonoProfesional: true,
                telefonoCliente: true,
                profesional: { idusuarioProfesional: true },
                usuarioComun: { idusuarioComun: true, nombre: true, apellido: true, telefono: true }
            }
        });
    }
    async create(trabajoContratado) {
        return this.trabajoContratadoRepository.save(trabajoContratado);
    }
    async delete(idTrabajoContratado) {
        await this.trabajoContratadoRepository.delete(idTrabajoContratado);
    }
};
TrabajoContratadoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(trabajosContr_entity_1.TrabajoContratado)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TrabajoContratadoService);
exports.TrabajoContratadoService = TrabajoContratadoService;
//# sourceMappingURL=trabajosContr.service.js.map