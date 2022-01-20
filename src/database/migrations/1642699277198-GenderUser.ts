import { MigrationInterface, QueryRunner } from 'typeorm';

export class GenderUser1642699277198 implements MigrationInterface {
  name = 'GenderUser1642699277198';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      // eslint-disable-next-line quotes, max-len
      `CREATE TYPE "public"."user_gender_enum" AS ENUM('male', 'female', 'other');`
    );
    await queryRunner.query(
      // eslint-disable-next-line quotes, max-len
      `ALTER TABLE "user" ADD "gender" "public"."user_gender_enum" NOT NULL DEFAULT 'other'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "user" DROP COLUMN "gender"');
    await queryRunner.query('DROP TYPE "public"."user_gender_enum"');
  }
}
