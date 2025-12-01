import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
import { Usuario } from './usuario.entity';
import { JwtModule } from '@nestjs/jwt';

import { ProfesionalModule } from 'src/profesional/profesional.module';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario]),
   JwtModule.register({
      secret: 'mi-llave-secreta',
      signOptions: { expiresIn: '1h' },
    }),
    ProfesionalModule,
],
  controllers: [UsuarioController],

  providers: [UsuarioService, ProfesionalModule],
 exports: [UsuarioService], // Exporta el UsuarioService

})
export class UsuarioModule {}