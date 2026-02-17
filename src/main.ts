// main.ts - KORRIGIERTE VERSION
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // CORS konfigurieren
  app.enableCors({
    origin: [
      'https://allhalals.vercel.app',
      'http://localhost:4200',
        'https://incandescent-beignet-8e69c2.netlify.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  logger.log(`✅ Backend running on port ${port} (0.0.0.0)`);
  
  // Graceful shutdown
  process.on('SIGTERM', async () => {
    logger.log('SIGTERM signal received: closing HTTP server');
    await app.close();
    logger.log('HTTP server closed');
    process.exit(0);
  });
  logger.log(`✅ CORS enabled for: https://allhalals.vercel.app`);
  logger.log(`✅ SUPABASE_URL: ${process.env.SUPABASE_URL ? 'SET' : 'NOT SET'}`);
  logger.log(`✅ SUPABASE_KEY: ${process.env.SUPABASE_KEY ? 'SET' : 'NOT SET'}`);
}

bootstrap().catch(err => {
  console.error('❌ Failed to start:', err);
  process.exit(1);
});