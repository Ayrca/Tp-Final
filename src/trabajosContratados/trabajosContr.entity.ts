import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Profesional } from '../profesional/profesional.entity';
import { Usuario } from '../usuario/usuario.entity';

@Entity('contratacion')
export class TrabajoContratado {
  @PrimaryGeneratedColumn()
  idcontratacion: number;
  

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuarioComun_idusuarioComun' })
  usuarioComun: Usuario;
  @ManyToOne(() => Profesional)
  @JoinColumn({ name: 'usuarioProfesional_idusuarioProfesional' })
  profesional: Profesional;

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
