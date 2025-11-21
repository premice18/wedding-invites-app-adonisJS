// app/controllers/scanner_controller.js
import Guest from '#models/guest'
import QrcodeService from '#services/qrcode_service'
import BackupCodeService from '#services/backup_code_service'
import { HttpContext } from '@adonisjs/core/http'

export default class ScannerController {
  // Interface principale de scan
  async scanner({ view }: HttpContext) {
    return view.render('scanner/index')
  }

  // Validation par QR Code
  async processQRScan({ request, response }: HttpContext) {
    const { qrData } = request.only(['qrData'])

    try {
      const { weddingId, guestId } = QrcodeService.parseQRCode(qrData)

      const guest = await Guest.query()
        .where('id', guestId)
        .andWhere('wedding_id', weddingId)
        .firstOrFail()

      await guest.validateByQRCode()

      return response.json({
        success: true,
        message: `QR Code validé! ${guest.confirmedPeople} personne(s) présente(s)`,
        guest: guest.serialize(),
      })
    } catch (error) {
      return response.json({
        success: false,
        message: error.message,
      })
    }
  }

  // Interface de validation par code de secours
  async backupCodeInterface({ view }: HttpContext) {
    return view.render('backup/validate')
  }

  // Validation par code de secours
  async processBackupCode({ request, response }: HttpContext) {
    const { backupCode, weddingId } = request.only(['backupCode', 'weddingId'])

    try {
      const guest = await BackupCodeService.validateBackupCode(backupCode, weddingId)
      await guest.validateByBackupCode()

      return response.json({
        success: true,
        message: `Code validé! ${guest.confirmedPeople} personne(s) présente(s)`,
        guest: guest.serialize(),
      })
    } catch (error) {
      return response.json({
        success: false,
        message: error.message,
      })
    }
  }
}
