import { Module } from '@nestjs/common';
import {FilesController} from "./files.controller";
import {ViewController} from "../view/view.controller";
import {FilesService} from "./files.service";
import {SupabaseService} from "../storage/supabase/supabase.service";
import {InvitesModule} from "../invites/invites.module";

@Module({
    imports: [InvitesModule],
    controllers: [FilesController, ViewController],
    providers: [FilesService, SupabaseService],
    exports: [SupabaseService],
})
export class FilesModule {}
