import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuarioModule } from '../usuario/usuario.module';
import { ProfesionalModule } from '../profesional/profesional.module';
import { AdministradorModule } from '../administrador/administrador.module';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    UsuarioModule,
    ProfesionalModule,
    AdministradorModule,
    JwtModule.register({
      secret: 'mi-llave-secreta',
      signOptions: { expiresIn: '1h' },
    }),
MailerModule.forRoot({
  transport: {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'afipfipa@gmail.com',
      pass: 'nptw uomr omyj xaao',
    },
  },
})
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}