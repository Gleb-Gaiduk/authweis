import { Module } from '@nestjs/common';
import { Argon2Password } from 'src/auth/password.service';
import { UserAccountModule } from 'src/user-account/user-account.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UserAccountModule],
  controllers: [AuthController],
  providers: [AuthService, Argon2Password],
})
class AuthModule {}

export { AuthModule };
