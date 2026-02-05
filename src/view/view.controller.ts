import {Controller, Get, HttpStatus, Param, Res} from '@nestjs/common';
import {FilesService} from "../files/files.service";
import express from 'express';

@Controller('view')
export class ViewController {
    constructor(private readonly filesService: FilesService) {
    }

    @Get(':id')
    async getFile(@Param('id') id: string, @Res() res: express.Response) {
        const file = await this.filesService.getFileInfo(id);

        if (!file) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: 'File not found',
            });
        }

        return res.json({
            success: true,
            data: {
                id: file.id,
                name: file.file_name,
                url: file.file_url,
                type: file.mime_type,
                size: file.size,
                uploader: file.uploader_name,
                uploadedAt: file.created_at,
                views: file.view_count,
                inviteCodeUsed: file.invite_code_used,
            },
        });
    }
}
