import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsEmail } from 'class-validator';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  @IsEmail()
  email!: string;

  @Column()
  age!: number;
}
