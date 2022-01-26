import { IsUrl, MinLength } from 'class-validator';
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
  @MinLength(4)
  name: string;

  @Column()
  @IsUrl()
  image: string;
}
