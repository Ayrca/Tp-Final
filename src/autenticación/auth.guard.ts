
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

import { AuthGuard as NestAuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
 
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }
    const token = authHeader.split(' ')[1];
    console.log('Token recibido:', token);
    try {
      const payload = this.jwtService.verify(token);
      request.user = payload; // payload ya contiene la propiedad sub
      console.log('req.usuario:', request.usuario);
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

