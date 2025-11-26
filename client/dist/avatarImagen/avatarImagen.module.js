"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarImagenModule = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const avatarImagen_controller_1 = require("./avatarImagen.controller");
const avatarImagen_service_1 = require("./avatarImagen.service");
const usuario_entity_1 = require("../usuario/usuario.entity");
const profesional_entity_1 = require("../profesional/profesional.entity");
const typeorm_1 = require("@nestjs/typeorm");
let AvatarImagenModule = class AvatarImagenModule {
};
AvatarImagenModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([usuario_entity_1.Usuario, profesional_entity_1.Profesional]),
            platform_express_1.MulterModule.register({
                dest: './client/public/assets/imagenesDePerfilesUsuarios',
                fileFilter: (req, file, cb) => {
                    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
                    if (allowedMimeTypes.includes(file.mimetype)) {
                        cb(null, true);
                    }
                    else {
                        cb(new Error('Tipo de archivo no permitido'), false);
                    }
                },
                limits: {
                    fileSize: 1024 * 1024 * 5,
                },
            }),
        ],
        controllers: [avatarImagen_controller_1.AvatarImagenController],
        providers: [avatarImagen_service_1.AvatarImagenService],
    })
], AvatarImagenModule);
exports.AvatarImagenModule = AvatarImagenModule;
//# sourceMappingURL=avatarImagen.module.js.map