
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('usuarioadm')
export class Administrador {
  @PrimaryGeneratedColumn()
  idusuarioAdm: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column()
  tipo: string;

  @Column()
  email: string;

  @Column()
  password: string;

  async comparePassword(password: string) {
    return bcrypt.compare(password, this.password);
  }
}
