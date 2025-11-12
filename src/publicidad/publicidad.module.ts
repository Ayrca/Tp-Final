import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicidadController } from './publicidad.controller';
import { PublicidadService } from './publicidad.service';
import { Publicidad } from './publicidad.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Publicidad])],
  controllers: [PublicidadController],
  providers: [PublicidadService],
})
export class PublicidadModule {}