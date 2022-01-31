import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTargetEntity1643377364415 implements MigrationInterface {
  name = 'CreateTargetEntity1643377364415';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "target" (
        "id" SERIAL NOT NULL, 
        "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
        "title" character varying NOT NULL, 
        "radius" integer NOT NULL, 
        "location" point NOT NULL, 
        "userId" integer, 
        CONSTRAINT "PK_9d962204b13c18851ea88fc72f3" PRIMARY KEY ("id")
      );
      ALTER TABLE "target" 
        ADD CONSTRAINT "FK_de25ee089655161469f630c63f0" FOREIGN KEY ("userId")
         REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        ALTER TABLE "target" DROP CONSTRAINT "FK_de25ee089655161469f630c63f0";
        DROP TABLE "target";`
    );
  }
}
