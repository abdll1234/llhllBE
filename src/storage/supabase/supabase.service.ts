import {Injectable, Logger} from '@nestjs/common';
import {createClient, SupabaseClient} from "@supabase/supabase-js";

@Injectable()
export class SupabaseService {
    private readonly logger = new Logger(SupabaseService.name);
    private supabase: SupabaseClient;

    constructor() {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Missing Supabase credentials');
        }

        this.supabase = createClient(supabaseUrl, supabaseKey);
        this.logger.log('Supabase client initialized');
    }


    async uploadFile(file: Express.Multer.File): Promise<{ url: string; path: string }> {
        try {
            const fileExt = file.originalname.split('.').pop();
            const fileName = `${Date.now()}-${Math.random()
                .toString(36)
                .substring(2, 15)}.${fileExt}`;
            const filePath = `uploads/${fileName}`;

            this.logger.log(`Uploading file: ${fileName}`);

            const { data, error } = await this.supabase.storage
                .from('uploads')
                .upload(filePath, file.buffer, {
                    contentType: file.mimetype,
                    cacheControl: '3600',
                    upsert: false,
                });

            if (error) {
                this.logger.error('Upload error:', error);
                throw new Error(`Upload failed: ${error.message}`);
            }

            // Get public URL
            const { data: urlData } = this.supabase.storage
                .from('uploads')
                .getPublicUrl(filePath);

            return { url: urlData.publicUrl, path: filePath };
        } catch (error) {
            this.logger.error('Upload file error:', error);
            throw error;
        }
    }

    async saveFileMetadata(data: {
        id: string;
        file_name: string;
        file_url: string;
        mime_type: string;
        size: number;
        uploader_name?: string;
        invite_code_used?: string;
    }) {
        try {
            const { error } = await this.supabase.from('files').insert([data]);

            if (error) {
                this.logger.error('Save metadata error:', error);
                throw new Error(`Database error: ${error.message}`);
            }

            return { success: true };
        } catch (error) {
            this.logger.error('Save metadata error:', error);
            throw error;
        }
    }

    async getFileById(id: string) {
        try {
            const { data, error } = await this.supabase
                .from('files')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                this.logger.error('Get file error:', error);
                return null;
            }

            return data;
        } catch (error) {
            this.logger.error('Get file error:', error);
            return null;
        }
    }

    async incrementViewCount(id: string) {
        try {
            const file = await this.getFileById(id);
            if (file) {
                await this.supabase
                    .from('files')
                    .update({ view_count: (file.view_count || 0) + 1 })
                    .eq('id', id);
            }
        } catch (error) {
            this.logger.error('Increment view error:', error);
        }
    }

    async validateInviteCode(code: string): Promise<{
        valid: boolean;
        code?: string;
        usesLeft?: number;
        message?: string;
    }> {
        try {
            const { data, error } = await this.supabase
                .from('invite_codes')
                .select('*')
                .eq('code', code)
                .eq('is_active', true)
                .single();

            if (error || !data) {
                return { valid: false, message: 'Invalid invite code' };
            }

            // Check expiration
            if (data.expires_at && new Date(data.expires_at) < new Date()) {
                return { valid: false, message: 'Invite code has expired' };
            }

            // Check uses
            if (data.uses_left <= 0) {
                return { valid: false, message: 'Invite code has no uses left' };
            }

            // Decrement uses
            await this.supabase
                .from('invite_codes')
                .update({ uses_left: data.uses_left - 1 })
                .eq('code', code);

            return {
                valid: true,
                code: data.code,
                usesLeft: data.uses_left - 1,
            };
        } catch (error) {
            this.logger.error('Validate invite code error:', error);
            return { valid: false, message: 'Error validating code' };
        }
    }
}
