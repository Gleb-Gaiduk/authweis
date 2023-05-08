// export interface ICreateUserAccServiceArgs {
//   email: string;
//   passwordHash: string;
//   passwordSalt: string;
//   confirmationToken: string;
// }

import { UserAccountModel } from 'src/user-account/interfaces/user-account-model';

export type CreateUserAccServiceArgs = Omit<
  UserAccountModel,
  'createdOn' | 'updatedOn' | 'roleId'
> &
  'roleName';
