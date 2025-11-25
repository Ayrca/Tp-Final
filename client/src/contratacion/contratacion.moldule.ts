import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContratacionController } from './contratacion.controller';
import { ContratacionService } from './contratacion.service';
import { Contratacion } from './contratacion.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Contratacion])],
  controllers: [ContratacionController],
  providers: [ContratacionService],
   exports: [ContratacionService], // Exporta el servicio
})
export class ContratacionModule {}

