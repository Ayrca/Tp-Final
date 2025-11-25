import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity('publicidad') // Especifica el nombre de la tabla
export class Publicidad {
  @PrimaryGeneratedColumn()
  idpublicidad: number;
  @Column() // Agrega el decorador @Column() para urlPagina y titulo
  urlImagen: string;
  @Column()
  urlPagina: string;
  @Column()
  titulo: string;
  }