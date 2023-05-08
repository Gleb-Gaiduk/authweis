import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
class UserAccountRepository {
  constructor(private readonly _dbService: DatabaseService) {}

  async create() {
    try {
    } catch (error) {}
  }
}

export { UserAccountRepository };
