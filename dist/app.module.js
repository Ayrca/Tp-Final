"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const oficios_module_1 = require("./oficios/oficios.module");
const publicidad_module_1 = require("./publicidad/publicidad.module");
const profesional_module_1 = require("./profesional/profesional.module");
const usuario_module_1 = require("./usuario/usuario.module");
const auth_module_1 = require("./autenticaci\u00F3n/auth.module");
const imagen_module_1 = require("./imagen/imagen.module");
const trabajosContr_module_1 = require("./trabajosContratados/trabajosContr.module");
const avatarImagen_module_1 = require("./avatarImagen/avatarImagen.module");
const administrador_module_1 = require("./administrador/administrador.module");
const imagenPropaganda_module_1 = require("./imagenPropaganda/imagenPropaganda.module");
const imagenOficios_module_1 = require("./imagenOficios/imagenOficios.module");
const oficios_entity_1 = require("./oficios/oficios.entity");
const publicidad_entity_1 = require("./publicidad/publicidad.entity");
const profesional_entity_1 = require("./profesional/profesional.entity");
const usuario_entity_1 = require("./usuario/usuario.entity");
const imagen_entity_1 = require("./imagen/imagen.entity");
const trabajosContr_entity_1 = require("./trabajosContratados/trabajosContr.entity");
const administrador_entity_1 = require("./administrador/administrador.entity");
const jwt_1 = require("@nestjs/jwt");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'client', 'public'),
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: process.env.DB_HOST,
                port: parseInt(process.env.DB_PORT),
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE,
                entities: [
                    oficios_entity_1.Oficio,
                    publicidad_entity_1.Publicidad,
                    profesional_entity_1.Profesional,
                    usuario_entity_1.Usuario,
                    imagen_entity_1.Imagen,
                    trabajosContr_entity_1.TrabajoContratado,
                    administrador_entity_1.Administrador,
                ],
                synchronize: true,
                logging: true,
            }),
            imagenOficios_module_1.ImagenOficiosModule,
            imagenPropaganda_module_1.ImagenPropagandaModule,
            administrador_module_1.AdministradorModule,
            trabajosContr_module_1.TrabajoContratadoModule,
            oficios_module_1.OficiosModule,
            publicidad_module_1.PublicidadModule,
            profesional_module_1.ProfesionalModule,
            usuario_module_1.UsuarioModule,
            imagen_module_1.ImagenModule,
            avatarImagen_module_1.AvatarImagenModule,
            auth_module_1.AuthModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: '1h' },
            }),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map