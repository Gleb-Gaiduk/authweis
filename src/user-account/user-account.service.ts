import { Injectable } from '@nestjs/common';
import { CreateUserAccServiceArgs } from 'src/user-account/interfaces/create-user-account.interface';
import { DatabaseService } from '../database/database.service';

@Injectable()
class UserAccountService {
  constructor(
    private readonly _dataBaseService: DatabaseService, // private readonly _userAccountRepo,
  ) {}
  async create(userAccontData: CreateUserAccServiceArgs) {},

  async getIsExistedByEmail(email: string): Promise<boolean> {
    
  }
}

export { UserAccountService };
