import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
class UserAccountService {
  constructor(private readonly _dataBaseService: DatabaseService) {}
  async getAll() {}
}

export { UserAccountService };
