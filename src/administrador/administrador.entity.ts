import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
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

  // 🔹 Hashea automáticamente antes de insertar y antes de actualizar
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2b$')) { 
      // Evita rehashear si ya está hasheada
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  async comparePassword(password: string) {
    return bcrypt.compare(password, this.password);
  }
}
