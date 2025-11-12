import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrabajoContratado } from './trabajosContr.entity';
import { TrabajoContratadoService } from './trabajosContr.service';
import { TrabajoContratadoController } from './trabajosContr.controller';
@Module({
  imports: [TypeOrmModule.forFeature([TrabajoContratado])],
  providers: [TrabajoContratadoService],
  controllers: [TrabajoContratadoController],
})
export class TrabajoContratadoModule {}