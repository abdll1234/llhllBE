// main.ts - KORRIGIERT
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // ✅ CORS für ALLES erlauben
  app.enableCors({
    origin: [
      'https://allhalals.vercel.app',  // Dein Frontend
      'http://localhost:4200',          // Lokal
      '*',                               // Backup - für Tests
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization'
    ],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // ✅ Health Check Route NICHT manuell erstellen!
  // NestJS hat automatisch eine Root-Route?

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`✅ Backend running on port ${port}`);
  console.log(`✅ CORS enabled for: https://allhalals.vercel.app`);
  console.log(`✅ Frontend URL: ${process.env.FRONTEND_URL || 'Not set'}`);

  // Teste ob alle Routes funktionieren
  const server = app.getHttpServer();
  const router = server._events.request._router;
  console.log('\n📋 Verfügbare Routen:');
  router.stack
      .filter((r: any) => r.route)
      .forEach((r: any) => {
        console.log(`   ${Object.keys(r.route.methods)} ${r.route.path}`);
      });
}

bootstrap().catch(err => {
  console.error('Failed to start:', err);
  process.exit(1);
});