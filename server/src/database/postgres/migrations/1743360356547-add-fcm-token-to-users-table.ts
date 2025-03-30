import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFcmTokenToUsersTable1743360356547 implements MigrationInterface {
  name = 'AddFcmTokenToUsersTable1743360356547';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "fcm_token" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "fcm_token"`);
  }
}
