// src/app.module.ts
import { Module } from '@nestjs/common';
import {seconds, ThrottlerModule} from '@nestjs/throttler';
import {FilesModule} from "./files/files.module";
import {InvitesModule} from "./invites/invites.module";

@Module({
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
  ],
})
export class AppModule {}