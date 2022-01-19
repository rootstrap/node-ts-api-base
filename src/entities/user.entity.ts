import { Column, Entity, Index } from 'typeorm';
import { Base } from './base.entity';
@Entity()
export class User extends Base {
  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ nullable: true })
  gender?: string;

  @Column()
  @Index({ unique: true })
  email!: string;

  @Column({ select: false })
  password!: string;
}
