// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as dotenv from 'dotenv';
import path from 'path';
import { ConnectionOptions } from 'typeorm';

// https://awesomeopensource.com/project/ambroiseRabier/typeorm-nestjs-migration-example
/**
 * 
  Usage
  npm run typeorm:migrate <myEntity-migration>
  Check your migration queries in src/migrations
  npm run start:dev or npm run start:prod or npm run typeorm:run
  If everything went well, you have up to date entites and a migrations table listing applied migrations.

  Additionnal information
  If you set migrationsRun to false in ormconfig.ts, you will have to use npm run typeorm:run to apply the migration, otherwise all migrations are applied automatically at application start.
  If you do not set --config parameter typeorm seek a valid configuration file at the root of the project.
  You do not want ormconfig.ts at the root of the project, otherwise it change /dist structure, you would have to change start:prod: node dist/main.js to start:prod: node dist/src/main.js.
 * 
 * */

dotenv.config();

const ENVIRONMENT = process.env.NODE_ENV || 'development';
const POSTGRES_HOST = process.env.POSTGRES_HOST || '';
const POSTGRES_DB = process.env.POSTGRES_DB || '';
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || '';
const POSTGRES_PORT = process.env.POSTGRES_PORT || 5432;
const POSTGRES_USER = process.env.POSTGRES_USER || '';
// const data: any = dotenv.parse(fs.readFileSync(`${environment}.env`));
// You can also make a singleton service that load and expose the .env file content.
// ...

// Check typeORM documentation for more information.
const config: ConnectionOptions = {
  type: 'postgres',
  host: POSTGRES_HOST,
  port: POSTGRES_PORT as number,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  entities: [path.resolve(__dirname + '/**/*.entity{.ts,.js}')],

  // We are using migrations, synchronize should be set to false.
  synchronize: false,

  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  // migrationsRun: true,
  logging: true,
  logger: 'file',

  // Allow both start:prod and start:dev to use migrations
  // __dirname is either dist or src folder, meaning either
  // the compiled js in prod or the ts in dev.
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    // Location of migration should be inside src folder
    // to be compiled into dist/ folder.
    migrationsDir: 'src/migrations',
  },

  ssl: ENVIRONMENT === 'production' ? { rejectUnauthorized: false } : false,
};

export = config;
