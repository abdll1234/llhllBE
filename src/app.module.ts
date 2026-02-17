// src/app.module.ts
import { Module } from '@nestjs/common';
import {seconds, ThrottlerModule} from '@nestjs/throttler';
import {FilesModule} from "./files/files.module";
import {InvitesModule} from "./invites/invites.module";
import {QrModule} from "./qr/qr.module";
import {AppController} from "./app.controller";

@Module({
  controllers: [AppController],
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: seconds(60),
          limit: 100,
        },
      ],
    }),

    FilesModule,
    InvitesModule,
    QrModule,
  ],
})
export class AppModule {}