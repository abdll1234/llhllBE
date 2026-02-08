import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {

  @Get()
  getHello(): { status: string; timestamp: string } {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health')
  getHealth(): { status: string; message: string } {
    return {
      status: 'healthy',
      message: 'Server is running',
    };
  }
}
