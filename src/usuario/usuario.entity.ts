import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('usuarioComun')
export class Usuario {
  @PrimaryGeneratedColumn('increment')
  idusuarioComun: number;

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

  @Column()
  telefono: string;

  @Column()
  direccion: string;

  @Column()
  estadoCuenta: boolean;

  @Column()
  avatar: string;

  @Column()
  fechaNacimiento: Date;

  async comparePassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2b$')) {
      // Evita re-hashear un hash existente
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}
