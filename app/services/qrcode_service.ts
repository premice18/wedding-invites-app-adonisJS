// app/services/qrcode_service.js
import QRCode from 'qrcode'
import { randomBytes } from 'node:crypto'

export default class QrcodeService {
  static async generateQRCode(guestId: any, weddingId: any) {
    const uniqueToken = randomBytes(16).toString('hex')
    const qrData = `wedding:${weddingId}:guest:${guestId}:${uniqueToken}`

    // Générer l'image QR Code
    const qrImagePath = `qrcodes/${guestId}_${Date.now()}.png`
    const fullPath = `public/${qrImagePath}`

    await QRCode.toFile(fullPath, qrData, {
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      width: 300,
      margin: 2,
    })

    return {
      data: qrData,
      image: qrImagePath,
    }
  }

  static parseQRCode(qrData: string) {
    const parts = qrData.split(':')
    if (parts.length !== 5 || parts[0] !== 'wedding') {
      throw new Error('QR Code invalide')
    }

    return {
      weddingId: Number.parseInt(parts[1]),
      guestId: Number.parseInt(parts[3]),
      token: parts[4],
    }
  }
}
