import { Controller, Post, UploadedFile, UseInterceptors, Param, BadRequestException, Get } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagenService } from './imagen.service';
import { UsuarioService } from '../usuario/usuario.service';
import { ProfesionalService } from '../profesional/profesional.service';
import cloudinary from '../cloudinary.config';

@Controller('imagen')
export class ImagenController {
  constructor(
    private readonly imagenService: ImagenService,
    private readonly usuarioService: UsuarioService,
    private readonly profesionalService: ProfesionalService,
  ) {}

  // -----------------------------------
  // Subir imagen de trabajos anteriores
  // -----------------------------------
  @Post('upload/:idProfesional')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File, 
    @Param('idProfesional') idProfesional: number
  ) {
    if (!file) throw new BadRequestException('Archivo requerido');
    return await this.imagenService.guardarImagen(file, idProfesional);
  }

  // -----------------------------------
  // Obtener todas las imágenes de un profesional
  // -----------------------------------
  @Get(':id')
  async getImage(@Param('id') id: number) {
    const imagenes = await this.imagenService.findById(id);
    if (!imagenes || imagenes.length === 0) {
      return [];
    }
    // Ahora cada imagen ya tiene URL de Cloudinary
    return imagenes.map((imagen) => ({
      url: imagen.url,
    }));
  }

  // -----------------------------------
  // Cambiar avatar de usuario o profesional
  // -----------------------------------
  @Post('cambiar-avatar/:idUsuario/:tipoUsuario')
  @UseInterceptors(FileInterceptor('avatar'))
  async cambiarAvatar(
    @UploadedFile() file: Express.Multer.File, 
    @Param('idUsuario') idUsuario: number, 
    @Param('tipoUsuario') tipoUsuario: 'comun' | 'profesional'
  ) {
    if (!file) throw new BadRequestException('Archivo requerido');

    // Subida a Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: `avatars/${tipoUsuario}/${idUsuario}`,
    });

    const avatarUrl = result.secure_url;

    if (tipoUsuario === 'comun') {
      const usuario = await this.usuarioService.findOne(idUsuario);
      if (!usuario) throw new BadRequestException('Usuario comun no encontrado');
      usuario.avatar = avatarUrl;
      await this.usuarioService.update(idUsuario, usuario);
    } else {
      const usuario = await this.profesionalService.findOne(idUsuario);
      if (!usuario) throw new BadRequestException('Usuario profesional no encontrado');
      usuario.avatar = avatarUrl;
      await this.profesionalService.update(idUsuario, usuario);
    }

    return { avatar: avatarUrl };
  }
}