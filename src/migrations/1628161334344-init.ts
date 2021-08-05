import {MigrationInterface, QueryRunner} from "typeorm";

export class init1628161334344 implements MigrationInterface {
    name = 'init1628161334344'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "refresh_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying NOT NULL, "is_revoked" boolean NOT NULL, "expires" TIMESTAMP NOT NULL, "createdDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isActive" boolean NOT NULL DEFAULT true, "isArchived" boolean NOT NULL DEFAULT false, "internalComment" character varying(300), "url" character varying NOT NULL, "thumbnailUrl" character varying NOT NULL, "name" character varying NOT NULL, "fileId" character varying NOT NULL, "productId" uuid, "datedCreateddatetime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "datedUpdateddatetime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isActive" boolean NOT NULL DEFAULT true, "isArchived" boolean NOT NULL DEFAULT false, "internalComment" character varying(300), "name" character varying NOT NULL, "price" integer NOT NULL, "description" character varying(300) NOT NULL, "createdById" uuid, "updatedById" uuid, "datedCreateddatetime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "datedUpdateddatetime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "user_roles_enum" AS ENUM('admin', 'user')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isActive" boolean NOT NULL DEFAULT true, "isArchived" boolean NOT NULL DEFAULT false, "internalComment" character varying(300), "name" character varying(300) NOT NULL, "password" character varying(300) NOT NULL, "roles" "user_roles_enum" array NOT NULL DEFAULT '{user}', "datedCreateddatetime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "datedUpdateddatetime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isActive" boolean NOT NULL DEFAULT true, "isArchived" boolean NOT NULL DEFAULT false, "internalComment" character varying(300), "name" character varying(300) NOT NULL, "description" character varying(300) NOT NULL, "createdById" uuid, "updatedById" uuid, "datedCreateddatetime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "datedUpdateddatetime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "image" ADD CONSTRAINT "FK_c6eb61588205e25a848ba6105cd" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_806302f2d4da2a0c27eedbf34fe" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_9c29670ff9dd3fd43cf20733c19" FOREIGN KEY ("updatedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_50c69cdc9b3e7494784a2fa2db4" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_a5d7b5b0fc1f7358541b14b242d" FOREIGN KEY ("updatedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_a5d7b5b0fc1f7358541b14b242d"`);
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_50c69cdc9b3e7494784a2fa2db4"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_9c29670ff9dd3fd43cf20733c19"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_806302f2d4da2a0c27eedbf34fe"`);
        await queryRunner.query(`ALTER TABLE "image" DROP CONSTRAINT "FK_c6eb61588205e25a848ba6105cd"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "user_roles_enum"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "image"`);
        await queryRunner.query(`DROP TABLE "refresh_token"`);
    }

}
