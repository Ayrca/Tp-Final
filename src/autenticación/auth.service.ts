import { Injectable } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service';
import { ProfesionalService } from '../profesional/profesional.service';
import { JwtService } from '@nestjs/jwt';
import { AdministradorService } from '../administrador/administrador.service';

import * as brevo from '@getbrevo/brevo';

const FRONTEND_URL = process.env.FRONTEND_URL;

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly profesionalService: ProfesionalService,
    private readonly administradorService: AdministradorService,
    private readonly jwtService: JwtService,
  ) {}

  // -------------------------------------------------------------
  // LOGIN
  // -------------------------------------------------------------
  async login(email: string, password: string) {
    console.log('Iniciando sesión con email:', email);
    const usuario = await this.usuarioService.findOneByEmail(email);
    const profesional = await this.profesionalService.findOneByEmail(email);
    const administrador = await this.administradorService.findOneByEmail(email);

    if (usuario) {
      const isValid = await usuario.comparePassword(password);
      if (isValid) {
        const token = await this.generateToken(usuario, 'usuario');
        return { token, tipo: 'usuario' };
      }
    } else if (profesional) {
      const isValid = await profesional.comparePassword(password);
      if (isValid) {
        const token = await this.generateToken(profesional, 'profesional');
        return { token, tipo: 'profesional' };
      }
    } else if (administrador) {
      const isValid = await administrador.comparePassword(password);
      if (isValid) {
        const token = await this.generateToken(administrador, 'administrador');
        return { token, tipo: 'administrador' };
      }
    } else {
      console.log('Usuario, profesional o administrador no encontrado');
      return null;
    }

    console.log('Contraseña incorrecta');
    return null;
  }

  async validarPassword(usuario: any, password: string) {
    return await usuario.comparePassword(password);
  }

  // -------------------------------------------------------------
  // GENERAR TOKEN
  // -------------------------------------------------------------
  async generateToken(usuario: any, tipo: string) {
    let payload;

    if (tipo === 'usuario') {
      payload = { sub: usuario.idusuarioComun, tipo };
    } else if (tipo === 'profesional') {
      payload = { sub: usuario.idusuarioProfesional, tipo };
    } else if (tipo === 'administrador') {
      payload = { sub: usuario.idusuarioAdm, tipo };
    }

    return this.jwtService.sign(payload);
  }

  // -------------------------------------------------------------
  // OBTENER USUARIO POR TIPO
  // -------------------------------------------------------------
  async getUsuario(id: number, tipo: string) {
    if (tipo === 'profesional') {
      return this.profesionalService.findOne(id);
    } else if (tipo === 'usuario') {
      return this.usuarioService.findOne(id);
    } else if (tipo === 'administrador') {
      return this.administradorService.findOne(id);
    }
  }

  // -------------------------------------------------------------
  // ENVÍO DE EMAIL - BREVO API HTTP
  // -------------------------------------------------------------
  private async sendResetEmail(email: string, url: string) {
    const apiInstance = new brevo.TransactionalEmailsApi();

    apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY!,
    );


    const sendEmail = {
      to: [{ email }],
      sender: { name: "Mi App", email: "proyectoafip29@gmail.com" }, // Correo verificado en Brevo
      subject: "Cambio de contraseña",
      textContent: `Haz clic en este enlace para cambiar tu contraseña: ${url}`,
    };

    try {
      await apiInstance.sendTransacEmail(sendEmail);
      console.log("MAIL ENVIADO OK (BREVO API)");
    } catch (error) {
      console.log("ERROR BREVO API:", error);
      throw new Error("Error enviando email con Brevo");
    }
  }

  // -------------------------------------------------------------
  // FORGOT PASSWORD
  // -------------------------------------------------------------
async forgotPassword(email: string) {
  try {
    const usuario = await this.usuarioService.findOneByEmail(email);
    const profesional = await this.profesionalService.findOneByEmail(email);
    const administrador = await this.administradorService.findOneByEmail(email);

    let user;
    let tipo: 'usuario' | 'profesional' | 'administrador' | null = null;

    if (usuario) {
      user = usuario;
      tipo = 'usuario';
    } else if (profesional) {
      user = profesional;
      tipo = 'profesional';
    } else if (administrador) {
      user = administrador;
      tipo = 'administrador';
    }

    if (!user) {
      throw new Error('No existe una cuenta registrada con ese email');
    }

    const token = this.jwtService.sign(
      {
        userId:
          user.idusuarioProfesional ||
          user.idusuarioComun ||
          user.idusuarioAdm,
        tipo,
      },
      { expiresIn: '1h' }
    );

    const url = `${FRONTEND_URL}/ResetPassword/${token}`;

    await this.sendResetEmail(email, url);

    return { message: 'Email enviado', token };

  } catch (error) {
    console.log(error);
    throw new Error('Error al enviar el correo electrónico');
  }
}

  // -------------------------------------------------------------
  // RESET PASSWORD
  // -------------------------------------------------------------
  async resetPassword(token: string, password: string) {
    const decoded = this.jwtService.verify(token);

    let user;
    if (decoded.tipo === 'profesional') {
      user = await this.profesionalService.findOne(decoded.userId);
    } else if (decoded.tipo === 'usuario') {
      user = await this.usuarioService.findOne(decoded.userId);
    } else if (decoded.tipo === 'administrador') {
      user = await this.administradorService.findOne(decoded.userId);
    }

    if (!user) throw new Error('Usuario no encontrado');

    if (decoded.tipo === 'profesional') {
      await this.profesionalService.updatePassword(decoded.userId, password);
    } else if (decoded.tipo === 'usuario') {
      await this.usuarioService.updatePassword(decoded.userId, password);
    } else if (decoded.tipo === 'administrador') {
      await this.administradorService.updatePassword(decoded.userId, password);
    }

    return { message: 'Contraseña cambiada' };
  }
}