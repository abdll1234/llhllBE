// main.ts - GANZ NEU
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

async function bootstrap() {
  const server = express();

  // Root route für Health Check
  server.get('/', (req, res) => {
    res.json({
      status: 'OK',
      service: 'llhll-backend',
      timestamp: new Date().toISOString()
    });
  });

  server.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
  });

  const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(server)
  );

  // CORS für alles erlauben
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`✅ Backend running on port ${port}`);
  console.log(`✅ Health check available at: http://localhost:${port}/`);
  console.log(`✅ Frontend URL: ${process.env.FRONTEND_URL || 'Not set'}`);
}

bootstrap().catch(err => {
  console.error('Failed to start:', err);
  process.exit(1);
});