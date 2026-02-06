import {BadRequestException, Body, Controller, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {FilesService} from "./files.service";
import {InvitesService} from "../invites/invites.service";
import {FileInterceptor} from "@nestjs/platform-express";
import * as QRCode from 'qrcode';

@Controller('files')
export class FilesController {
    constructor(
        private readonly filesService: FilesService,
        private readonly invitesService: InvitesService,
    ) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Body('uploaderName') uploaderName?: string,
        @Body('inviteCode') inviteCode?: string,
    ) {
        // Validate required fields
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        // Validate invite code
        if (inviteCode) {
            const codeValidation = await this.invitesService.validateCode(inviteCode);
            if (!codeValidation.valid) {
                throw new BadRequestException(codeValidation.message);
            }
        } else {
            throw new BadRequestException('Invite code is required');
        }

        // Upload file
        const uploadResult = await this.filesService.uploadFile(
            file,
            uploaderName,
            inviteCode,
        );

        // Generate QR code
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
        const viewUrl = `${frontendUrl}/view/${uploadResult.fileId}`;
        const qrCode = await QRCode.toDataURL(viewUrl);

        return {
            success: true,
            message: 'File uploaded successfully',
            data: {
                fileId: uploadResult.fileId,
                fileName: uploadResult.fileName,
                fileUrl: uploadResult.fileUrl,
                viewUrl,
                qrCode,
                uploaderName,
            },
        };
    }
}
