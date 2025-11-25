import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfesionalController } from './profesional.controller';
import { ProfesionalService } from './profesional.service';
import { Profesional } from './profesional.entity';
import { OficiosModule } from '../oficios/oficios.module'; 
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [TypeOrmModule.forFeature([Profesional]),
   OficiosModule, // Agrega el módulo
     JwtModule.register({
      secret: 'mi-llave-secreta',
      signOptions: { expiresIn: '1h' },
    }),
],
  controllers: [ProfesionalController],
  providers: [ProfesionalService],
  exports: [ProfesionalService], // Exporta el UsuarioService
})
export class ProfesionalModule {}

