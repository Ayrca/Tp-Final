import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OficiosController } from './oficios.controller';
import { OficiosService } from './oficios.service';
import { Oficio } from './oficios.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Oficio])],
  controllers: [OficiosController],
  providers: [OficiosService],
   exports: [OficiosService], // Exporta el servicio
})
export class OficiosModule {}


