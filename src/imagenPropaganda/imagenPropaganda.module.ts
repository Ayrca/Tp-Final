
import { Module } from '@nestjs/common';
import { ImagenPropagandaController } from './imagenPropaganda.controller';
import { ImagenPropagandaService } from './imagenPropaganda.service';

@Module({
  controllers: [ImagenPropagandaController],
  providers: [ImagenPropagandaService],
})
export class ImagenPropagandaModule {}


