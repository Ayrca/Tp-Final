import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuarioModule } from '../usuario/usuario.module';
import { ProfesionalModule } from '../profesional/profesional.module';

import { JwtModule } from '@nestjs/jwt';



@Module({
  imports: [
    UsuarioModule, // Importa el módulo que contiene UsuarioService
     ProfesionalModule, // Importa ProfesionalModule
    JwtModule.register({
      secret: 'mi-llave-secreta',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService], // No es necesario agregar UsuarioService aquí
  exports: [AuthService],
})
export class AuthModule {}

