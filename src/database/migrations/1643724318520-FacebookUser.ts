/* eslint-disable max-len */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class FacebookUser1643724318520 implements MigrationInterface {
  name = 'FacebookUser1643724318520';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      ALTER TABLE "user" ADD "facebookID" character varying;
      ALTER TABLE "user" ADD CONSTRAINT "UQ_23bab3db6375b09acfa083d8ee4" UNIQUE ("facebookID");
      ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL;
      `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL;
      ALTER TABLE "user" DROP CONSTRAINT "UQ_23bab3db6375b09acfa083d8ee4";
      ALTER TABLE "user" DROP COLUMN "facebookID";

      `
    );
  }
}
