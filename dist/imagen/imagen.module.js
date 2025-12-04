"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImagenModule = void 0;
const common_1 = require("@nestjs/common");
const imagen_controller_1 = require("./imagen.controller");
const imagen_service_1 = require("./imagen.service");
const platform_express_1 = require("@nestjs/platform-express");
const typeorm_1 = require("@nestjs/typeorm");
const imagen_entity_1 = require("./imagen.entity");
const usuario_entity_1 = require("../usuario/usuario.entity");
const profesional_entity_1 = require("../profesional/profesional.entity");
const usuario_module_1 = require("../usuario/usuario.module");
const profesional_module_1 = require("../profesional/profesional.module");
const multer = __importStar(require("multer"));
let ImagenModule = class ImagenModule {
};
exports.ImagenModule = ImagenModule;
exports.ImagenModule = ImagenModule = __decorate([
    (0, common_1.Module)({
        imports: [
            platform_express_1.MulterModule.register({
                storage: multer.memoryStorage(),
                fileFilter: (req, file, cb) => {
                    const allowedMimeTypes = [
                        'image/jpeg',
                        'image/png',
                        'image/gif',
                        'image/webp',
                        'image/heic',
                        'image/heif',
                    ];
                    if (allowedMimeTypes.includes(file.mimetype)) {
                        cb(null, true);
                    }
                    else {
                        cb(new Error('Tipo de archivo no permitido'), false);
                    }
                },
            }),
            typeorm_1.TypeOrmModule.forFeature([imagen_entity_1.Imagen, usuario_entity_1.Usuario, profesional_entity_1.Profesional]),
            usuario_module_1.UsuarioModule,
            profesional_module_1.ProfesionalModule,
        ],
        controllers: [imagen_controller_1.ImagenController],
        providers: [imagen_service_1.ImagenService],
    })
], ImagenModule);
//# sourceMappingURL=imagen.module.js.map