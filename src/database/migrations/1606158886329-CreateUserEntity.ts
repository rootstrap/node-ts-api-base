import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserEntity1606158886329 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TABLE "user" (firstName varchar(255),
    lastName varchar(255), email varchar(255), password varchar(255))`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
