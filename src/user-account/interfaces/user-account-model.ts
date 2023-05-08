export interface UserAccountModel {
  firstName: string;
  lastName: string;
  gender: 'm' | 'f';
  birthDate: Date;
  roleId: string;
  //
  passwordHash: string;
  passwordSalt: string;
  email: string;
  emailValidationStatusId: string;
  confirmationToken?: string;
  confirmationTokenCreatedOn?: Date;
  passwordRecoveryToken?: string;
  passwordRecoveryTokenCreatedOn?: Date;
  createdOn: Date;
  updatedOn: Date;
}
