import { Controller, Get, Post } from '@nestjs/common';

@Controller('users ')
export class AppController {
  @Post('login')
  login() {
    return {};
  }
}
