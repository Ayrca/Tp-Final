import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('contratacion')
export class Contratacion {
  @PrimaryGeneratedColumn()
  idcontratacion: number;
  @Column()
  usuarioComun_idusuarioComun: number;
  @Column()
  usuarioProfesional_idusuarioProfesional: number;
  @Column()
  rubro: string;
  @Column()
  telefonoProfesional: string;
  @Column()
  telefonoCliente: string;
  @Column()
  estado: string;
  @Column()
  valoracion: number;
  @Column()
  comentario: string;
  @Column()
  fechaContratacion: Date;



}