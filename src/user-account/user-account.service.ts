import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
class UserAccountService {
  constructor(
    private readonly _dataBaseService: DatabaseService,
    private readonly _userAccountRepo,
  ) {}
  async create(userAccontData: ICreateUserAccount) {}
}

export { UserAccountService };
