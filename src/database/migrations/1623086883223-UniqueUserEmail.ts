import { MigrationInterface, QueryRunner } from 'typeorm';

export class UniqueUserEmail1623086883223 implements MigrationInterface {
  name = 'UniqueUserEmail1623086883223';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "user" ALTER COLUMN "firstName" DROP NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE "user" ALTER COLUMN "lastName" DROP NOT NULL'
    );
    await queryRunner.query(
      // eslint-disable-next-line max-len
      'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") '
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_e12875dfb3b1d92d7d7c5377e2"');
    await queryRunner.query(
      'ALTER TABLE "user" ALTER COLUMN "lastName" SET NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE "user" ALTER COLUMN "firstName" SET NOT NULL'
    );
  }
}
