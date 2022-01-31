import { Column, Entity, Generated, Index, OneToMany } from 'typeorm';
import { Base } from './base.entity';
import { Gender } from '@constants/users/attributes.constants';
import { Target } from './target.entity';

@Entity()
export class User extends Base {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'enum', enum: Gender, default: 'other' })
  gender: Gender;

  @Column()
  @Index({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ nullable: true })
  @Generated('uuid')
  verifyHash: string | null;

  // eslint-disable-next-line quotes
  @Column({ nullable: true, type: 'timestamp', default: () => `NOW() +INTERVAL '1 day'` })
  hashExpiresAt: Date | null;

  @OneToMany(() => Target, target => target.user )
    targets: Target[];
}
