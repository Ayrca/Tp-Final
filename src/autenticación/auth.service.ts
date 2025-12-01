
import { Injectable } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service';
import { ProfesionalService } from '../profesional/profesional.service';
import { JwtService } from '@nestjs/jwt';
import { AdministradorService } from '../administrador/administrador.service';
import { MailerService } from '@nestjs-modules/mailer';

const BASE_URL = process.env.REACT_APP_BASE_URL;

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly profesionalService: ProfesionalService,
    private readonly administradorService: AdministradorService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

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

  async getUsuario(id: number, tipo: string) {
    if (tipo === 'profesional') {
      return this.profesionalService.findOne(id);
    } else if (tipo === 'usuario') {
      return this.usuarioService.findOne(id);
    } else if (tipo === 'administrador') {
      return this.administradorService.findOne(id);
    }
  }

async forgotPassword(email: string) {
  try {
    const usuario = await this.usuarioService.findOneByEmail(email);
    const profesional = await this.profesionalService.findOneByEmail(email);
    const administrador = await this.administradorService.findOneByEmail(email);
    let user;
    if (usuario) {
      user = usuario;
    } else if (profesional) {
      user = profesional;
    } else if (administrador) {
      user = administrador;
    }
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    const token = this.jwtService.sign({ userId: user.idusuarioProfesional || user.idusuarioComun || user.idusuarioAdm, tipo: user.tipo }, { expiresIn: '1h' });
    const url = `${BASE_URL}/reset-password/${token}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Cambio de contraseña',
      text: `Haz clic en este enlace para cambiar tu contraseña: ${url}`,
    });
    return { message: 'Email enviado', token }; // Devuelve el token generado
  } catch (error) {
    console.log(error);
    throw new Error('Error al enviar el correo electrónico');
  }
}

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
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  // Actualiza la contraseña del usuario
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