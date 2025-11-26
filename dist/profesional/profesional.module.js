"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfesionalModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const profesional_controller_1 = require("./profesional.controller");
const profesional_service_1 = require("./profesional.service");
const profesional_entity_1 = require("./profesional.entity");
const oficios_module_1 = require("../oficios/oficios.module");
const jwt_1 = require("@nestjs/jwt");
let ProfesionalModule = class ProfesionalModule {
};
exports.ProfesionalModule = ProfesionalModule;
exports.ProfesionalModule = ProfesionalModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([profesional_entity_1.Profesional]),
            oficios_module_1.OficiosModule,
            jwt_1.JwtModule.register({
                secret: 'mi-llave-secreta',
                signOptions: { expiresIn: '1h' },
            }),
        ],
        controllers: [profesional_controller_1.ProfesionalController],
        providers: [profesional_service_1.ProfesionalService],
        exports: [profesional_service_1.ProfesionalService],
    })
], ProfesionalModule);
//# sourceMappingURL=profesional.module.js.map