export interface ICreateUserAccount {
  email: string;
  passwordHash: string;
  passwordSalt: string;
  confirmationToken: string;
}
