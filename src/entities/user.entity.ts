import { Entity, Column, BeforeInsert } from 'typeorm';
import { IsEmail, validateOrReject, IsNotEmpty } from 'class-validator';
import { compareSync, hashSync, genSaltSync } from 'bcrypt';
import TokenGenerator from 'uuid-token-generator';
import { Base } from './base.entity';
import { Mailer } from '@services/mailer.service';

@Entity()
export class User extends Base {
  @BeforeInsert()
  async beforeInsert() {
    await validateOrReject(this);
    this.hashPassword();
    this.createConfirmationToken();
    this.sendConfirmationEmail();
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

  @Column({ name: 'confirmation_token', nullable: true })
  confirmationToken!: string;

  @Column({ name: 'confirmed_at', nullable: true, type: 'timestamp' })
  confirmedAt!: Date;

  @Column({ name: 'confirmation_sent_at', nullable: true, type: 'timestamp' })
  confirmationSentAt!: Date;

  comparePassword(password: string): boolean {
    return compareSync(password, this.password);
  }

  isConfirmed(): boolean {
    return this.confirmedAt !== null;
  }

  private hashPassword() {
    this.password = hashSync(this.password, genSaltSync());
  }

  private createConfirmationToken() {
    this.confirmationToken = new TokenGenerator(
      256,
      TokenGenerator.BASE62
    ).generate();
  }

  private sendConfirmationEmail() {
    const mailer = new Mailer();
    const payload = {
      name: `${this.firstName} ${this.lastName}`,
      link: `http://localhost:3000/api/v1/auth/confirm/${this.confirmationToken}`
    };
    mailer.sendMail(this.email, 'Confirm your email', Mailer.WELCOME, payload);
    this.confirmationSentAt = new Date();
  }
}
