import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {

  @Get()
  getRoot() {
    return {
      status: 'OK',
      service: 'llhll-backend',
      timestamp: new Date().toISOString(),
      environment: {
        supabase: process.env.SUPABASE_URL ? 'configured' : 'missing',
        frontend: process.env.FRONTEND_URL || 'not set'
      }
    };
  }

@Get('health')
getHealth() {
  return {
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: Date.now()
  };
}
}