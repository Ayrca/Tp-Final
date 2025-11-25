"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const usuario_controller_1 = require("./usuario.controller");
const usuario_service_1 = require("./usuario.service");
const usuario_entity_1 = require("./usuario.entity");
const jwt_1 = require("@nestjs/jwt");
const profesional_module_1 = require("../../../src/profesional/profesional.module");
let UsuarioModule = class UsuarioModule {
};
exports.UsuarioModule = UsuarioModule;
exports.UsuarioModule = UsuarioModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([usuario_entity_1.Usuario]),
            jwt_1.JwtModule.register({
                secret: 'mi-llave-secreta',
                signOptions: { expiresIn: '1h' },
            }),
            profesional_module_1.ProfesionalModule,
        ],
        controllers: [usuario_controller_1.UsuarioController],
        providers: [usuario_service_1.UsuarioService, profesional_module_1.ProfesionalModule],
        exports: [usuario_service_1.UsuarioService],
    })
], UsuarioModule);
//# sourceMappingURL=usuario.module.js.map