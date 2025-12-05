import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Profesional } from '../profesional/profesional.entity';
@Entity()
export class Imagen {
  @PrimaryGeneratedColumn()
  idImagen: number;
  @Column()
  url: string;
  @Column()
  idProfesional: number;
  @ManyToOne(() => Profesional)
  @JoinColumn({ name: 'idProfesional' })
  profesional: Profesional;
}