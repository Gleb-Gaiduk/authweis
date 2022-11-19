import { ConfigurableModuleBuilder } from '@nestjs/common';
import { IDatabaseConfig } from './database-config.interface';

export const CONNECTION_POOL = 'CONNECTION_POOL';

export const {
  ConfigurableModuleClass: ConfigurableDatabaseModule,
  MODULE_OPTIONS_TOKEN: DATABASE_CONFIG,
} = new ConfigurableModuleBuilder<IDatabaseConfig>()
  .setClassMethodName('forRoot')
  .build();
