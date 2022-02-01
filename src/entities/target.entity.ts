import { Column, Entity, ManyToOne } from 'typeorm';
import { Base } from './base.entity';
import { User } from './user.entity';

@Entity()
export class Target extends Base {
  constructor(latitude: string, longitude: string) {
    super();
    this.location = `${latitude},${longitude}`;
  }
  @Column()
  title: string;

  @Column()
  radius: number;

  @Column({ type: 'point' })
  location: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, user => user.targets,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
  )
  user: User;
}
