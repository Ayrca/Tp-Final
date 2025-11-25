"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImagenModule = void 0;
const common_1 = require("@nestjs/common");
const imagen_controller_1 = require("./imagen.controller");
const imagen_service_1 = require("./imagen.service");
const platform_express_1 = require("@nestjs/platform-express");
const imagen_entity_1 = require("./imagen.entity");
const typeorm_1 = require("@nestjs/typeorm");
let ImagenModule = class ImagenModule {
};
exports.ImagenModule = ImagenModule;
exports.ImagenModule = ImagenModule = __decorate([
    (0, common_1.Module)({
        imports: [
            platform_express_1.MulterModule.register({
                dest: './client/public/assets/imagenesUsuarios',
            }),
            typeorm_1.TypeOrmModule.forFeature([imagen_entity_1.Imagen]),
        ],
        controllers: [imagen_controller_1.ImagenController],
        providers: [imagen_service_1.ImagenService],
    })
], ImagenModule);
//# sourceMappingURL=imagen.module.js.map