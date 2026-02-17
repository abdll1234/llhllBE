import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { QrService } from './qr.service';

@Controller('qr')
export class QrController {
  constructor(private readonly qrService: QrService) {}

  @Post('generate')
  async generateQR(@Body() body: { url: string }, @Res() res: Response) {
    const buffer = await this.qrService.generateQR(body.url);
    res.setHeader('Content-Type', 'image/png');
    res.send(buffer);
  }
}
