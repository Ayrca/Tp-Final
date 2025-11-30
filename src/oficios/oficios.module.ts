import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OficiosController } from './oficios.controller';
import { OficiosService } from './oficios.service';
import { Oficio } from './oficios.entity';
import { ImagenOficiosModule } from '../imagenOficios/imagenOficios.module';

@Module({
  imports: [TypeOrmModule.forFeature([Oficio]), ImagenOficiosModule],
  controllers: [OficiosController],
  providers: [OficiosService],
  exports: [OficiosService], // Exporta el servicio
})
export class OficiosModule {}