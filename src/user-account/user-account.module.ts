import { Module } from '@nestjs/common';
import { UserAccountController } from './user-account.controller';
import { UserAccountRepository } from './user-account.repository';
import { UserAccountService } from './user-account.service';
import { UserLoginDataService } from './user-login-data.service';

@Module({
  controllers: [UserAccountController],
  providers: [UserAccountService, UserAccountRepository, UserLoginDataService],
  exports: [UserAccountService],
})
class UserAccountModule {}

export { UserAccountModule };
