import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello() {
    // res.status(302).redirect('auth/login');
    return 'Hello World';
  }
}
