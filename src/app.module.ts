// src/app.module.ts
import { Module } from '@nestjs/common';
import {seconds, ThrottlerModule} from '@nestjs/throttler';
import configuration from './config/configuration';
import {FilesModule} from "./files/files.module";
import {InvitesModule} from "./invites/invites.module";
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
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