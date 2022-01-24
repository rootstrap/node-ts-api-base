import { MigrationInterface, QueryRunner } from 'typeorm';

export class EmailVerificationUser1642781136073 implements MigrationInterface {
  name = 'EmailVerificationUser1642781136073';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "user" ADD "verified" boolean NOT NULL DEFAULT false'
    );
    await queryRunner.query(
      'ALTER TABLE "user" ADD "verifyHash" uuid DEFAULT uuid_generate_v4()'
    );
    await queryRunner.query(
      // eslint-disable-next-line quotes
      `ALTER TABLE "user" ADD "hashExpiresAt" TIMESTAMP DEFAULT NOW() +INTERVAL '1 day'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "user" DROP COLUMN "hashExpiresAt"');
    await queryRunner.query('ALTER TABLE "user" DROP COLUMN "verifyHash"');
    await queryRunner.query('ALTER TABLE "user" DROP COLUMN "verified"');
  }
}
