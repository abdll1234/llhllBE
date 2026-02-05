import { Module } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { SupabaseService } from '../storage/supabase/supabase.service';

@Module({
    providers: [InvitesService, SupabaseService],
    exports: [InvitesService],
})
export class InvitesModule {}
