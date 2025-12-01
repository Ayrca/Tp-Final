import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// Módulos
import { OficiosModule } from './oficios/oficios.module';
import { PublicidadModule } from './publicidad/publicidad.module';
import { ProfesionalModule } from './profesional/profesional.module';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './autenticación/auth.module';
import { ImagenModule } from './imagen/imagen.module';
import { TrabajoContratadoModule } from './trabajosContratados/trabajosContr.module';
import { AvatarImagenModule } from './avatarImagen/avatarImagen.module';
import { AdministradorModule } from './administrador/administrador.module';
import { ImagenPropagandaModule } from './imagenPropaganda/imagenPropaganda.module';
import { ImagenOficiosModule } from './imagenOficios/imagenOficios.module';

// Entidades
import { Oficio } from './oficios/oficios.entity';
import { Publicidad } from './publicidad/publicidad.entity';
import { Profesional } from './profesional/profesional.entity';
import { Usuario } from './usuario/usuario.entity';
import { Imagen } from './imagen/imagen.entity';
import { TrabajoContratado } from './trabajosContratados/trabajosContr.entity';
import { Administrador } from './administrador/administrador.entity';

import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

        // TypeORM
      TypeOrmModule.forRoot({
        type: 'mysql',
        host: process.env.DB_HOST!,
        port: parseInt(process.env.DB_PORT!),
        username: process.env.DB_USERNAME!,
        password: process.env.DB_PASSWORD!,
        database: process.env.DB_DATABASE!,
        entities: [
          Oficio,
          Publicidad,
          Profesional,
          Usuario,
          Imagen,
          TrabajoContratado,
          Administrador,
        ],
        synchronize: false,
        autoLoadEntities: false,
        logging: false,
      }),
    ImagenOficiosModule,
    ImagenPropagandaModule,
    AdministradorModule,
    TrabajoContratadoModule,
    OficiosModule,
    PublicidadModule,
    ProfesionalModule,
    UsuarioModule,
    ImagenModule,
    AvatarImagenModule,
    AuthModule,

    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}