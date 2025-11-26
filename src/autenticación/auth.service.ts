
<<<<<<< HEAD


=======
>>>>>>> origin/Francisco
import { Injectable } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service';
import { ProfesionalService } from '../profesional/profesional.service';
import { JwtService } from '@nestjs/jwt';
<<<<<<< HEAD
=======
import { AdministradorService } from '../administrador/administrador.service';


>>>>>>> origin/Francisco

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly profesionalService: ProfesionalService,
<<<<<<< HEAD
     private readonly jwtService: JwtService,
  ) {}

async login(email: string, password: string) {
  console.log('Iniciando sesión con email:', email);
  const usuario = await this.usuarioService.findOneByEmail(email);
  const profesional = await this.profesionalService.findOneByEmail(email);
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
  } else {
    console.log('Usuario o profesional no encontrado');
    return null;
  }
  console.log('Contraseña incorrecta');
  return null;
}
=======
    private readonly administradorService: AdministradorService,
    private readonly jwtService: JwtService,
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


>>>>>>> origin/Francisco


async validarPassword(usuario: any, password: string) {
  return await usuario.comparePassword(password);
}


<<<<<<< HEAD

async generateToken(usuario: any, tipo: string) {
  let payload;
  if (tipo === 'usuario') {
    payload = { sub: usuario.idusuarioComun, tipo };
  } else if (tipo === 'profesional') {
    payload = { sub: usuario.idusuarioProfesional, tipo };
  }
  return this.jwtService.sign(payload);
}

/*
async getUsuario(id: number) {
  // Busca al usuario en la base de datos y devuelve sus datos
  const usuario = await this.usuarioService.findOne(id);
  return usuario;
}
*/

async getUsuario(id: number, tipo: string) {
  if (tipo === 'profesional') {
    return this.profesionalService.findOne(id);
  } else {
    return this.usuarioService.findOne(id);
  }
}

=======
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
>>>>>>> origin/Francisco

}

