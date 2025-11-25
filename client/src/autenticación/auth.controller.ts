
import { Controller, Post, Body, HttpStatus, HttpException, Get, Req, UseGuards } from '@nestjs/common';


import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Request } from 'express';
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




}
