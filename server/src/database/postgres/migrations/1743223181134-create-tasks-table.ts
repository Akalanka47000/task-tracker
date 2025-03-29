import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTasksTable1743223181134 implements MigrationInterface {
  name = 'CreateTasksTable1743223181134';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_1c866e0c96d58ffc40f876934a4"`);
    await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "REL_1c866e0c96d58ffc40f876934a"`);
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_1c866e0c96d58ffc40f876934a4" FOREIGN KEY ("employee_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_1c866e0c96d58ffc40f876934a4"`);
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "REL_1c866e0c96d58ffc40f876934a" UNIQUE ("employee_id")`
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_1c866e0c96d58ffc40f876934a4" FOREIGN KEY ("employee_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
