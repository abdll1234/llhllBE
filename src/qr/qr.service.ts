import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class QrService {
  async generateQR(url: string): Promise<Buffer> {
    try {
      const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:4200').replace(/\/$/, '');
      const logoUrl = `${frontendUrl}/assets/NEWLOGO.png`;

      const response = await fetch('https://api.qrcode-monkey.com/qr/custom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: url,
          config: {
            body: 'round',
            eye: 'frame2',
            eyeBall: 'ball2',
            bodyColor: '#007437',
            bgColor: '#FFFFFF',
            eye1Color: '#007437',
            eye2Color: '#007437',
            eye3Color: '#007437',
          },
          size: 300,
          download: false,
          file: 'png',
          // Add logo from frontend assets
          logo: logoUrl,
          logoBackgroundTransparent: true,
          removeQrCodeBehindLogo: true,
          logoMode: 'default',
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate QR: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new InternalServerErrorException('Error generating QR code');
    }
  }
}
