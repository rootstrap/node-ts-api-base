import { Column, Entity, Index } from 'typeorm';
import { Base } from './base.entity';
import { Gender } from '@constants/users/attributes.constants';

@Entity()
export class User extends Base {
  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ type: 'enum', enum: Gender, default: 'other' })
  gender!: Gender;

  @Column()
  @Index({ unique: true })
  email!: string;

  @Column({ select: false })
  password!: string;
}
