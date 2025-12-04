import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Oficio } from '../oficios/oficios.entity';
import * as bcrypt from 'bcrypt';

@Entity('usuarioProfesional')
export class Profesional {
  @PrimaryGeneratedColumn()
  idusuarioProfesional: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  tipo: string;

  @ManyToOne(() => Oficio, (oficio) => oficio.profesionales)
  @JoinColumn({ name: 'Oficios_idOficios' })
  oficio: Oficio;

  @Column()
  empresa: string;

  @Column()
  telefono: string;

  @Column()
  direccion: string;

  @Column()
  avatar: string;

  @Column()
  estadoCuenta: boolean;

  @Column()
  descripcion: string;

  @Column()
  fechaNacimiento: Date;

  @Column()
  valoracion: number;

  @Column()
  disponible: boolean;

  async comparePassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2b$')) {
      // Evita rehashear si el password YA es un hash bcrypt
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}
