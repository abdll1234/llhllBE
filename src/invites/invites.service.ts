import { Injectable } from '@nestjs/common';
import {SupabaseService} from "../storage/supabase/supabase.service";

@Injectable()
export class InvitesService {
    constructor(private readonly supabaseService: SupabaseService) {}

    async validateCode(code: string) {
        return await this.supabaseService.validateInviteCode(code);
    }
}
