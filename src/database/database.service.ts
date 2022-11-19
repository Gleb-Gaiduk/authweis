import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { CONNECTION_POOL } from './database.module-definition';

@Injectable()
export class DatabaseService {
  constructor(@Inject(CONNECTION_POOL) private readonly _pool: Pool) {}

  async runQuery(query: string, params: unknown[]) {
    return this._pool.query(query, params);
  }
}
