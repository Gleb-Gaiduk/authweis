import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import * as crypto from 'node:crypto';

interface IPasswordService {
  hash(plainPassword: string, salt: Buffer): Promise<string>;
  isValid(hash: string, plainPassword: string): Promise<boolean>;
}

@Injectable()
class Argon2Password implements IPasswordService {
  generateSalt(): Buffer {
    return crypto.randomBytes(16);
  }

  async hash(plainPassword: string, salt: Buffer): Promise<string> {
    return await argon2.hash(plainPassword, { salt });
  }

  async isValid(hash: string, plainPassword: string): Promise<boolean> {
    return await argon2.verify(hash, plainPassword);
  }
}

export { Argon2Password };
