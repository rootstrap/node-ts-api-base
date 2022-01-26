import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTopicEntity1643214110749 implements MigrationInterface {
  name = 'CreateTopicEntity1643214110749';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "topic" (
        "id" SERIAL NOT NULL, 
        "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
        "name" character varying NOT NULL, 
        "image" character varying NOT NULL, 
        CONSTRAINT "PK_33aa4ecb4e4f20aa0157ea7ef61" PRIMARY KEY ("id"))
      `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "topic"');
  }
}
