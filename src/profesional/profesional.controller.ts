/*
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request,Req } from '@nestjs/common';
import { ProfesionalService } from './profesional.service';
import { Profesional } from './profesional.entity';

import { AuthGuard } from '../autenticación/auth.guard';
import { JwtService } from '@nestjs/jwt';


@Controller('profesional')
export class ProfesionalController {
  constructor(private readonly profesionalService: ProfesionalService,
              private readonly jwtService: JwtService) {}


@Put()
@UseGuards(AuthGuard)
async actualizarProfesional(@Req() req: any, @Body() datosActualizados: any) {
  try {
    console.log('req.user:', req.user);
    const id = req.user?.sub;
    console.log('ID del usuario:', id);
    if (!id) {
      throw new Error('Usuario no autenticado');
    }
    const profesionalActualizado = await this.profesionalService.actualizarProfesional(id, datosActualizados);
    return profesionalActualizado;
  } catch (error) {
    console.error('Error al actualizar profesional:', error);
    throw error;
  }
}


@Get('oficio/:id')
async findByOficio(@Param('id') id: number): Promise<Profesional[]> {
  return this.profesionalService.findByOficio(id);
}



@Get(':id')
async findOne(@Param('id') id: number): Promise<any> {
  const profesional = await this.profesionalService.findOne(id);
  return {
    ...profesional,
    oficio: profesional.oficio,
  };
}

@Get('completo/:id')
async findProfesionalCompleto(@Param('id') id: number): Promise<any> {
  const profesional = await this.profesionalService.findProfesionalCompleto(id);
  return profesional;
}

@Get()
  async findAll(): Promise<Profesional[]> {
    return this.profesionalService.findAll();
  }
 
  @Post()
  async create(@Body() oficio: Profesional): Promise<Profesional> {
    return this.profesionalService.create(oficio);
  }


  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.profesionalService.delete(id);
  }


@Get('profesional/perfil')
@UseGuards(AuthGuard)
async getPerfilProfesional(@Request() req: any) {
  console.log('Entrando en getPerfilProfesional');
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = this.jwtService.verify(token);
   const id = decoded.sub;
   
    const profesional = await this.profesionalService.findOne(id);
    if (!profesional) {
      throw new Error('Profesional no encontrado');
    }
   const { idusuarioProfesional, nombre, apellido, email, tipo, oficio, empresa, telefono, direccion, avatar, estadoCuenta, descripcion, fechaNacimiento,valoracion } = profesional;
return {
  id: idusuarioProfesional,
  nombre,
  apellido,
  email,
  tipo,
  oficio: {nombre: oficio.nombre,},
  telefono,
  direccion,
  avatar,
  estadoCuenta,
  descripcion,
  fechaNacimiento,
  valoracion
};
   
  } catch (error) {
    console.error('Error en getPerfilProfesional:', error);
    throw error;
  }
}


//funcion para registrar usuarios profesionales
  @Post('registro')
  async registrar(@Body() datos: any) {
    return this.profesionalService.registrar(datos);
  }


@Put(':id/baneo')
async banearProfesional(@Param('id') id: number): Promise<Profesional> {
  return this.profesionalService.banearProfesional(id);
}

@Put(':id/desbloqueo')
async desbloquearProfesional(@Param('id') id: number): Promise<Profesional> {
  return this.profesionalService.desbloquearProfesional(id);
}




}
*/
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request, Req } from '@nestjs/common';
import { ProfesionalService } from './profesional.service';
import { Profesional } from './profesional.entity';
import { AuthGuard } from '../autenticación/auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('profesional')
export class ProfesionalController {
  constructor(private readonly profesionalService: ProfesionalService, private readonly jwtService: JwtService) {}

  @Put()
  @UseGuards(AuthGuard)
  async actualizarProfesional(@Req() req: any, @Body() datosActualizados: any) {
    try {
      console.log('req.user:', req.user);
      const id = req.user?.sub;
      console.log('ID del usuario:', id);
      if (!id) {
        throw new Error('Usuario no autenticado');
      }
      const profesionalActualizado = await this.profesionalService.actualizarProfesional(id, datosActualizados);
      return profesionalActualizado;
    } catch (error) {
      console.error('Error al actualizar profesional:', error);
      throw error;
    }
  }

  @Get('oficio/:id')
  async findByOficio(@Param('id') id: number): Promise<Profesional[]> {
    return this.profesionalService.findByOficio(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<any> {
    const profesional = await this.profesionalService.findOne(id);
    return {
      ...profesional,
      oficio: profesional.oficio,
      disponible: profesional.disponible,
    };
  }

  @Get('completo/:id')
  async findProfesionalCompleto(@Param('id') id: number): Promise<any> {
    const profesional = await this.profesionalService.findProfesionalCompleto(id);
    return {
      ...profesional,
      oficio: profesional.oficio,
      disponible: profesional.disponible,
    };
  }

  @Get()
  async findAll(): Promise<Profesional[]> {
    return this.profesionalService.findAll();
  }

  @Post()
  async create(@Body() oficio: Profesional): Promise<Profesional> {
    return this.profesionalService.create(oficio);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.profesionalService.delete(id);
  }

  @Get('profesional/perfil')
  @UseGuards(AuthGuard)
  async getPerfilProfesional(@Request() req: any) {
    console.log('Entrando en getPerfilProfesional');
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = this.jwtService.verify(token);
      const id = decoded.sub;
      const profesional = await this.profesionalService.findOne(id);
      if (!profesional) {
        throw new Error('Profesional no encontrado');
      }
      const {
        idusuarioProfesional,
        nombre,
        apellido,
        email,
        tipo,
        oficio,
        empresa,
        telefono,
        direccion,
        avatar,
        estadoCuenta,
        descripcion,
        fechaNacimiento,
        valoracion,
        disponible,
      } = profesional;
      return {
        id: idusuarioProfesional,
        nombre,
        apellido,
        email,
        tipo,
        oficio: { nombre: oficio.nombre },
        telefono,
        direccion,
        avatar,
        estadoCuenta,
        descripcion,
        fechaNacimiento,
        valoracion,
        disponible,
      };
    } catch (error) {
      console.error('Error en getPerfilProfesional:', error);
      throw error;
    }
  }

  //funcion para registrar usuarios profesionales
  @Post('registro')
  async registrar(@Body() datos: any) {
    return this.profesionalService.registrar(datos);
  }

  @Put(':id/baneo')
  async banearProfesional(@Param('id') id: number): Promise<Profesional> {
    return this.profesionalService.banearProfesional(id);
  }

  @Put(':id/desbloqueo')
  async desbloquearProfesional(@Param('id') id: number): Promise<Profesional> {
    return this.profesionalService.desbloquearProfesional(id);
  }
}