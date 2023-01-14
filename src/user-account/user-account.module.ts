import { Module } from '@nestjs/common';
import { UserAccountController } from './user-account.controller';
import { UserAccountRepository } from './user-account.repository';
import { UserAccountService } from './user-account.service';

@Module({
  controllers: [UserAccountController],
  providers: [UserAccountService, UserAccountRepository],
  exports: [UserAccountService],
})
class UserAccountModule {}

export { UserAccountModule };
