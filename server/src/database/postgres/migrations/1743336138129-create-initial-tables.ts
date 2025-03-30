import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialTables1743336138129 implements MigrationInterface {
  name = 'CreateInitialTables1743336138129';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('Administrator', 'Employee')`);
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'Employee', "details" jsonb NOT NULL DEFAULT '{}', "last_login_time" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")); COMMENT ON COLUMN "users"."details" IS 'Stores role specific fields'`
    );
    await queryRunner.query(`COMMENT ON TABLE "users" IS 'Stores all users within the system'`);
    await queryRunner.query(`CREATE TYPE "public"."tasks_priority_enum" AS ENUM('1', '2', '3')`);
    await queryRunner.query(
      `CREATE TABLE "tasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "priority" "public"."tasks_priority_enum" NOT NULL DEFAULT '1', "due_date" TIMESTAMP NOT NULL, "employee_id" uuid NOT NULL, "completed" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE INDEX "idx_priority" ON "tasks" ("priority") `);
    await queryRunner.query(`CREATE INDEX "idx_employee_id" ON "tasks" ("employee_id") `);
    await queryRunner.query(`CREATE INDEX "idx_completed" ON "tasks" ("completed") `);
    await queryRunner.query(`COMMENT ON TABLE "tasks" IS 'Stores all tasks assigned to employees'`);
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_1c866e0c96d58ffc40f876934a4" FOREIGN KEY ("employee_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(`CREATE INDEX idx_users_department ON users((details->>'department'))`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_1c866e0c96d58ffc40f876934a4"`);
    await queryRunner.query(`COMMENT ON TABLE "tasks" IS NULL`);
    await queryRunner.query(`DROP INDEX "public"."idx_completed"`);
    await queryRunner.query(`DROP INDEX "public"."idx_employee_id"`);
    await queryRunner.query(`DROP INDEX "public"."idx_priority"`);
    await queryRunner.query(`DROP TABLE "tasks"`);
    await queryRunner.query(`DROP TYPE "public"."tasks_priority_enum"`);
    await queryRunner.query(`COMMENT ON TABLE "users" IS NULL`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(`DROP INDEX idx_users_department`);
  }
}
