
import { Controller, Post, Body, HttpStatus, HttpException, Get, Req, UseGuards, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Request } from 'express';
import { ParseIntPipe } from '@nestjs/common';

interface IRequest extends Request {
  user: any;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() datos: any) {
    const resultado = await this.authService.login(datos.email, datos.password);
    if (!resultado) {
      throw new HttpException('Credenciales inválidas', HttpStatus.UNAUTHORIZED);
    }
    return { access_token: resultado.token };
  }

  @Get('perfil')
  @UseGuards(AuthGuard)
  async getPerfil(@Req() req: IRequest) {
    const usuario = await this.authService.getUsuario(req.user.sub, req.user.tipo);
    return usuario;
  }

@Post('forgot-password')
async forgotPassword(@Body('email') email: string) {
  console.log('Correo electrónico:', email);
  try {
    const resultado = await this.authService.forgotPassword(email);
    return resultado;
  } catch (error) {
    console.log(error);
    throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  }
}

  @Post('reset-password/:token')
  async resetPassword(@Body('password') password: string, @Param('token') token: string) {
    try {
      const resultado = await this.authService.resetPassword(token, password);
      return resultado;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

@Get('usuario/:userId/:tipo')
async getUsuario(@Param('userId', ParseIntPipe) userId: number, @Param('tipo') tipo: string) {
  try {
    const usuario = await this.authService.getUsuario(userId, tipo);
    return usuario;
  } catch (error) {
    throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  }
}  
}