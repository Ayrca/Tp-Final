import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OficiosModule } from './oficios/oficios.module';
import { Oficio } from './oficios/oficios.entity'; // Importa la entidad "Oficio"
import { PublicidadModule } from './publicidad/publicidad.module';
import { Publicidad } from './publicidad/publicidad.entity'; 
import { ProfesionalModule} from './profesional/profesional.module';
import { Profesional } from './profesional/profesional.entity'; 
import { UsuarioModule} from './usuario/usuario.module';
import { Usuario } from './usuario/usuario.entity'; 
import { AuthModule } from './autenticación/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ImagenModule } from './imagen/imagen.module';
import { Imagen } from './imagen/imagen.entity';
import { TrabajoContratado} from './trabajosContratados/trabajosContr.entity';
import { TrabajoContratadoModule } from './trabajosContratados/trabajosContr.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';


@Module({
  
  imports: [
  
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client', 'public'),
    //  serveRoot: '/',
    }),
  
    TypeOrmModule.forRoot({
    
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'te5re6cabio7-',
      database: 'mydb',
      entities: [Oficio, Publicidad, Profesional,Usuario,Imagen,TrabajoContratado], // Agrega la entidad "Oficio" al arreglo de entidades
      synchronize: false,
      logging: true,
    }),
    TrabajoContratadoModule,
    OficiosModule,
    PublicidadModule,
    ProfesionalModule,
    UsuarioModule,
    ImagenModule,
    AuthModule,
    JwtModule.register({
      secret: 'mi-llave-secreta',
      signOptions: { expiresIn: '1h' },
    }),
  ],

  controllers: [AppController],
  providers: [AppService],
})


export class AppModule {}

