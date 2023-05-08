import { Injectable } from '@nestjs/common';
import { Argon2Password } from 'src/auth/password.service';
import { ISignUpReqDTO } from 'src/interfaces';
import { UserAccountService } from 'src/user-account/user-account.service';
import { promisify } from 'node:util';
import crypto from 'node:crypto';

@Injectable()
class AuthService {
  constructor(
    private readonly _passwordService: Argon2Password,
    private readonly _userAccountService: UserAccountService,
  ) {}

  public async createAccount({
    email,
    password,
  }: ISignUpReqDTO): Promise<void> {
    // Reach DB and check if user account exists by email
    // If yes throw error;

    // If no - generate password hash, confirmation tokens and pass further
    const salt = this._passwordService.generateSalt();
    const passwordHash = await this._passwordService.hash(password, salt);

    // Retrieve to a separate service
    const getRandomBytes = promisify(crypto.randomBytes);
    const emailConfirmationToken = (await getRandomBytes(64)).toString();

    try {
      const newAccount = await this._userAccountService.create({
        email,
        passwordHash,
        passwordSalt: salt.toString('utf-8'),
        confirmationToken: emailConfirmationToken,
        firstName,
        lastName,
        gender,
        birthDate,
        roleName,
        emailValidationStatusId,
      });

      return;
    } catch (error) {}
  }
}

export { AuthService };
