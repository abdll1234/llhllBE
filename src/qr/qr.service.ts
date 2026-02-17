import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class QrService {
  async generateQR(url: string): Promise<Buffer> {
    try {
      const response = await fetch('https://api.qrcode-monkey.com/qr/custom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: url,
          config: {
            body: 'round',
            eye: 'frame13',
            eyeBall: 'ball14',
            bodyColor: '#00a550',
            bgColor: '#FFFFFF',
            eye1Color: '#00a550',
            eye2Color: '#00a550',
            eye3Color: '#00a550',
          },
          size: 300,
          download: false,
          file: 'png',
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
