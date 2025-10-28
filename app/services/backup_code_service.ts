import {
  ChainableContract,
  RawQuery,
  ReferenceBuilderContract,
} from '@adonisjs/lucid/types/querybuilder'

// app/services/backup_code_service.js
export default class BackupCodeService {
  // Générer un code de secours unique (6 chiffres)
  static generateBackupCode() {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  // Valider un code de secours
  static async validateBackupCode(
    backupCode:
      | string
      | number
      | boolean
      | ChainableContract
      | Date
      | string[]
      | number[]
      | Date[]
      | boolean[]
      | Buffer<ArrayBufferLike>
      | RawQuery
      | ReferenceBuilderContract,
    weddingId:
      | string
      | number
      | boolean
      | ChainableContract
      | Date
      | string[]
      | number[]
      | Date[]
      | boolean[]
      | Buffer<ArrayBufferLike>
      | RawQuery
      | ReferenceBuilderContract
  ) {
    const guest = await import('#models/guest').then((module) =>
      module.default
        .query()
        .where('backup_code', backupCode)
        .andWhere('wedding_id', weddingId)
        .first()
    )

    if (!guest) {
      throw new Error('Code de secours invalide')
    }

    if (guest.isVerified) {
      throw new Error('Cette invitation a déjà été validée')
    }

    return guest
  }
}
