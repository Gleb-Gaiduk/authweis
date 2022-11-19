import { Global, Module } from '@nestjs/common';
import { Pool } from 'pg';
import { IDatabaseConfig } from './database-config.interface';
import {
  ConfigurableDatabaseModule,
  CONNECTION_POOL,
  DATABASE_CONFIG,
} from './database.module-definition';
import { DatabaseService } from './database.service';

@Global()
@Module({
  exports: [DatabaseService],
  providers: [
    DatabaseService,
    {
      provide: CONNECTION_POOL,
      inject: [DATABASE_CONFIG],
      useFactory: (databaseConfig: IDatabaseConfig) => {
        const { user, port, host, password, database } = databaseConfig;

        return new Pool({
          user,
          port,
          host,
          password,
          database,
        });
      },
    },
  ],
})
export class DatabaseModule extends ConfigurableDatabaseModule {}
