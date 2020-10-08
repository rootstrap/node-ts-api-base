import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddConfirmationToUsers1602107443079 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'confirmation_token',
        type: 'varchar',
        isNullable: true
      })
    );
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'confirmed_at',
        type: 'timestamp',
        isNullable: true
      })
    );
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'confirmation_sent_at',
        type: 'timestamp',
        isNullable: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user', 'confirmation_token');
    await queryRunner.dropColumn('user', 'confirmed_at');
    await queryRunner.dropColumn('user', 'confirmation_sent_at');
  }
}
