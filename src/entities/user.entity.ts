import { Entity, Column, BeforeInsert } from "typeorm";
import { IsEmail, IsNotEmpty, validateOrReject } from "class-validator";
import { genSaltSync, hashSync, compareSync } from 'bcrypt';
import { Base } from './base.entity';

@Entity()
export class User extends Base {
  @BeforeInsert()
  async beforeInsert() {
    await validateOrReject(this);
    this.hashPassword();
  }

  @Column({ nullable: true })
  firstName!: string;

  @Column({ nullable: true })
  lastName!: string;

  @Column()
  @IsEmail()
  email!: string;

  @Column()
  @IsNotEmpty()
  password!: string;

  comparePassword(password: string): boolean {
    return compareSync(password, this.password);
  }

  private hashPassword() {
    this.password = hashSync(this.password, genSaltSync());
  }
}
