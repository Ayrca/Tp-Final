import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request, HttpStatus, HttpException  } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Usuario } from './usuario.entity';
import { Req } from '@nestjs/common';
import { AuthGuard } from '../autenticación/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ProfesionalService } from '../profesional/profesional.service';

@Controller('usuario')
export class UsuarioController {
  
  constructor(private readonly usuarioService: UsuarioService,
              private readonly profesionalService: ProfesionalService,
              private readonly jwtService: JwtService) {}

  @Post()
  async create(@Body() usuario: Usuario): Promise<Usuario> {
    return this.usuarioService.create(usuario);
  }

@Put(':id')
async update(@Param('id') id: number, @Body() usuario: Usuario): Promise<Usuario> {
  id = Number(id); // Convierte el ID a un número
  return this.usuarioService.update(id, usuario);
}

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.usuarioService.delete(id);
  }

  //Registro de usuariosComunes
  @Post('registro')
  async registrar(@Body() datos: any) {
    return this.usuarioService.registrar(datos);
  }

@Post('verificar-email')
async verificarEmail(@Body('email') email: string) {
  const usuario = await this.usuarioService.findByEmail(email);
  const profesional = await this.profesionalService.findByEmail(email);
  if (usuario || profesional) {
    throw new HttpException('El email ya está en uso', HttpStatus.BAD_REQUEST);
  } else {
    return { mensaje: 'El email está disponible' };
  }
}

@Get()
async getUsuarios() {
  return this.usuarioService.findAll();
}

@Get(':id')
async getUsuario(@Param('id') id: string) {
  const idNumber = parseInt(id, 10);
  if (isNaN(idNumber)) {
    throw new Error('El ID debe ser un número');
  }
  return this.usuarioService.findOne(idNumber);
}

@Get('perfil')
@UseGuards(AuthGuard)
async getPerfil(@Request() req: any) {
  console.log('Entrando en getPerfil usuario comun');
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = this.jwtService.verify(token);
    const id = decoded.sub;
    const tipo1 = decoded.tipo;
    let usuario;
    if (tipo1 === 'profesional') {
      usuario = await this.profesionalService.findOne(id);
    } else {
      usuario = await this.usuarioService.findOne(id);
    }
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }
  const { idusuarioComun, nombre, apellido, email, tipo, telefono, direccion, estadoCuenta, avatar, fechaNacimiento } = usuario;
    return { id: idusuarioComun, nombre, apellido, email, tipo, telefono, direccion, estadoCuenta, avatar, fechaNacimiento };
  } catch (error) {
    console.error('Error en getPerfil:', error);
    throw error;
  }
}

@Put(':id/baneo')
async banearUsuario(@Param('id') id: string): Promise<Usuario> {
  return this.usuarioService.banearUsuario(parseInt(id, 10));
}

@Put(':id/desbloqueo')
async desbloquearUsuario(@Param('id') id: string): Promise<Usuario> {
  return this.usuarioService.desbloquearUsuario(parseInt(id, 10));
}

@Put('cambiar-password')
@UseGuards(AuthGuard)
async cambiarPassword(@Req() req: any, @Body() { password }: { password: string }) {
  try {
    const id = req.user?.sub;
    if (!id) {
      throw new Error('Usuario no autenticado');
    }
    const usuarioActualizado = await this.usuarioService.updatePassword(id, password);
    return usuarioActualizado;
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    throw error;
  }
}
}