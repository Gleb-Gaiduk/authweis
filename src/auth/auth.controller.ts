import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { signUpSchema } from 'src/auth/schemas/validation/signUp.schema';
import { JoiValidationPipe } from 'src/pipes/joi-validation.pipe';
import { ISignUpReqDTO } from '../interfaces';
import { AuthService } from './auth.service';

@Controller('auth')
class AuthController {
  constructor(private readonly _authService: AuthService) {}
  @Post('signup')
  @UsePipes(
    new JoiValidationPipe(signUpSchema, {
      errorMessage: 'Incorrect email or password',
    }),
  )
  async signUp(@Body() signUpReqDTO: ISignUpReqDTO) {
    return this._authService.createAccount(signUpReqDTO);
  }

  @Post('login')
  async logIn() {}

  @Post('logout')
  async logOut() {}
}

export { AuthController };
