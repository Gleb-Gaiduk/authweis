import { Body, Controller, Get, Param, Post, Redirect } from '@nestjs/common';
import { IRegisterReqDTO } from '../interfaces';
import { AuthService } from './auth.service';

@Controller('auth')
class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Get('test/:id')
  test(@Param('id') param: string) {
    return `OK: ${param}`;
  }

  @Post('register')
  async register(@Body() registerReqDTO: IRegisterReqDTO) {
    return registerReqDTO;
  }

  @Post('login')
  async logIn() {}

  @Post('logout')
  async logOut() {}
}

export { AuthController };
