import {BadRequestException, Injectable} from '@nestjs/common';
import {SupabaseService} from "../storage/supabase/supabase.service";

@Injectable()
export class FilesService {
    constructor(
        private readonly supabaseService: SupabaseService,
    ) {}

    async uploadFile(
        file: Express.Multer.File,
        uploaderName?: string,
        inviteCode?: string,
    ) {
        // Validate file type
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'application/pdf',
        ];
        if (!allowedTypes.includes(file.mimetype)) {
            throw new BadRequestException(
                `File type not allowed. Allowed: ${allowedTypes.join(', ')}`,
            );
        }

        // Validate file size
        const maxSize = parseInt(process.env.MAX_FILE_SIZE!) || 50 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new BadRequestException(
                `File too large. Max size: ${maxSize / 1024 / 1024}MB`,
            );
        }

        // Generate unique ID
        const fileId = this.generateFileId();

        // Upload to Supabase
        const uploadResult = await this.supabaseService.uploadFile(file);

        // Save metadata
        await this.supabaseService.saveFileMetadata({
            id: fileId,
            file_name: file.originalname,
            file_url: uploadResult.url,
            mime_type: file.mimetype,
            size: file.size,
            uploader_name: uploaderName,
            invite_code_used: inviteCode,
        });

        return {
            fileId,
            fileUrl: uploadResult.url,
            fileName: file.originalname,
        };
    }

    async getFileInfo(id: string) {
        const file = await this.supabaseService.getFileById(id);
        if (file) {
            // Increment view count asynchronously
            this.supabaseService.incrementViewCount(id);
        }
        return file;
    }

    private generateFileId(): string {
        return (
            Date.now().toString(36) + Math.random().toString(36).substring(2, 9)
        );
    }
}
