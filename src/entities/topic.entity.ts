import { Column, Entity } from 'typeorm';
import { Base } from './base.entity';

@Entity()
export class Topic extends Base {
  constructor(name: string, image: string) {
    super();
    this.name = name;
    this.image = image;
  }

  @Column()
  name: string;

  @Column()
  image: string;
}
