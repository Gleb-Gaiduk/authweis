import { Injectable } from '@nestjs/common';
import { Argon2Password } from 'src/auth/password.service';
import { ISignUpReqDTO } from 'src/interfaces';
import { UserAccountService } from 'src/user-account/user-account.service';
@Injectable()
class AuthService {
  constructor(
    private readonly _passwordService: Argon2Password,
    private readonly _userAccountService: UserAccountService,
  ) {}

  public async createAccount({ password }: ISignUpReqDTO) {
    const salt = this._passwordService.generateSalt();
    const passwordHash = await this._passwordService.hash(password, salt);

    console.log(passwordHash);
  }
}

export { AuthService };
