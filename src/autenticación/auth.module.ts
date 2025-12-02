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
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: '9d201f001@smtp-brevo.com',
      pass: 'DS50pEfHyxCa7BP1',
    },
  },
  defaults: {
    from: '"Mi App" <proyectoafip26@gmail.com>', 
  },
})


  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}