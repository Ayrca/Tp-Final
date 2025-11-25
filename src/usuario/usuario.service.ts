import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Like } from 'typeorm';
@Injectable()


export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}
  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find();
  }



async findOne(usuarioId: number): Promise<Usuario> {
  console.log('ID recibido en findOne:', usuarioId);
  if (typeof usuarioId !== 'number') {
    throw new Error(`El ID debe ser un número, pero se recibió ${usuarioId} de tipo ${typeof usuarioId}`);
  }
  const usuario = await this.usuarioRepository.findOneBy({ idusuarioComun: usuarioId });
  if (!usuario) {
    throw new Error(`Usuario con idusuarioComun ${usuarioId} no encontrado`);
  }
  return usuario;
}

async findByEmail(email: string): Promise<Usuario | null> {
  const usuario = await this.usuarioRepository.findOneBy({ email });
  if (!usuario) {
    return null;
  }
  return usuario;
}



async findOneByEmail(email: string) {
    return this.usuarioRepository.findOneBy({ email });
  }





  async create(usuario: Usuario): Promise<Usuario> {
    return this.usuarioRepository.save(usuario);
  }
  async update(id: number, usuario: Usuario): Promise<Usuario> {
    await this.usuarioRepository.update(id, usuario);
    return this.findOne(id);
  }
  async delete(id: number): Promise<void> {
    await this.usuarioRepository.delete(id);
  }



  async findByNombreLike(tituloLike: string): Promise<Usuario[]> {
    return this.usuarioRepository.find({
      where: { nombre: Like(`%${tituloLike}%`) },
    });
}

//para registrar los datos del usuario comun
  async registrar(datos: any) {
    const usuario = new Usuario();
    usuario.nombre = datos.nombre;
    usuario.apellido = datos.apellido;
    usuario.email = datos.email;
    usuario.password = datos.password;
    usuario.tipo = datos.tipo;
    usuario.telefono = datos.telefono;
    usuario.direccion = datos.direccion;
    usuario.estadoCuenta = datos.estadoCuenta || true;
    usuario.avatar = datos.avatar || '';
    usuario.fechaNacimiento = datos.fechaNacimiento;
    return this.usuarioRepository.save(usuario);
  }


  
}

  