import { MigrationInterface, QueryRunner } from 'typeorm';

export class NamesUser1642699316195 implements MigrationInterface {
  name = 'NamesUser1642699316195';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        ALTER TABLE "user" ALTER COLUMN "firstName" SET NOT NULL;
        ALTER TABLE "user" ALTER COLUMN "lastName" SET NOT NULL;
      `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        ALTER TABLE "user" ALTER COLUMN "firstName" DROP NOT NULL;
        ALTER TABLE "user" ALTER COLUMN "lastName" DROP NOT NULL;
      `
    );
  }
}
