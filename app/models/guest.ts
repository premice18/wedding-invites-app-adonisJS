// app/models/guest.js
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Wedding from './wedding.js'
import BackupCodeService from '../services/backup_code_service.js'

export default class Guest extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column()
  declare phone: string

  @column()
  declare tableNumber: number | null

  @column()
  declare dietaryRestrictions: string | null

  // Nombre de personnes
  @column()
  declare numberOfPeople: number

  @column()
  declare confirmedPeople: number

  // QR Code
  @column()
  declare qrcodeData: string

  @column()
  declare qrcodeImage: string | null

  // Code de secours
  @column()
  declare backupCode: string | null

  // Verification
  @column()
  declare isVerified: boolean

  @column.dateTime()
  declare verifiedAt: DateTime | null

  @column()
  declare verificationMethod: string | null

  // WhatsApp
  @column()
  declare whatsappSent: boolean

  @column.dateTime()
  declare whatsappSentAt: DateTime | null

  // Relations
  @column()
  declare weddingId: number

  @belongsTo(() => Wedding)
  declare wedding: BelongsTo<typeof Wedding>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Générer le code de secours avant création
  @beforeCreate()
  static async generateBackupCode(guest: Guest) {
    guest.backupCode = BackupCodeService.generateBackupCode()
  }

  // Méthode pour valider via QR Code
  async validateByQRCode() {
    if (this.isVerified) {
      throw new Error('Invitation déjà vérifiée')
    }

    this.isVerified = true
    this.verifiedAt = DateTime.now()
    this.verificationMethod = 'qr_code'
    this.confirmedPeople = this.numberOfPeople
    await this.save()
  }

  // Méthode pour valider manuellement
  async validateManually() {
    if (this.isVerified) {
      throw new Error('Invitation déjà vérifiée')
    }

    this.isVerified = true
    this.verifiedAt = DateTime.now()
    this.verificationMethod = 'manual'
    this.confirmedPeople = this.numberOfPeople
    await this.save()
  }

  // Méthode pour valider via code de secours
  async validateByBackupCode() {
    if (this.isVerified) {
      throw new Error('Invitation déjà vérifiée')
    }

    this.isVerified = true
    this.verifiedAt = DateTime.now()
    this.verificationMethod = 'backup_code'
    this.confirmedPeople = this.numberOfPeople
    await this.save()
  }

  // Méthode pour confirmer un nombre spécifique de personnes
  async confirmPeople(count: number) {
    if (count > this.numberOfPeople) {
      throw new Error('Le nombre de personnes confirmées ne peut pas dépasser le nombre attendu')
    }

    this.confirmedPeople = count
    await this.save()
  }
}
