import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Profesional } from '../profesional/profesional.entity';
@Entity('oficios')
export class Oficio {
  @PrimaryGeneratedColumn()
  idOficios: number;
  @Column()
  nombre: string;
  @Column()
  urlImagen: string;
  @OneToMany(() => Profesional, (profesional) => profesional.oficio)
  profesionales: Profesional[];
}