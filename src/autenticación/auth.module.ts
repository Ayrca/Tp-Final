import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';   // ← IMPORTANTE
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuarioModule } from '../usuario/usuario.module';
import { ProfesionalModule } from '../profesional/profesional.module';
import { AdministradorModule } from '../administrador/administrador.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    UsuarioModule,
    ProfesionalModule,
    AdministradorModule,

    JwtModule.register({
      secret: 'mi-llave-secreta',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}