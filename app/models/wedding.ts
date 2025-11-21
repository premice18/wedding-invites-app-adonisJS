import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, afterSave, afterDelete } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'
import Guest from './guest.js'

export default class Wedding extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare coupleName: string

  @column()
  declare weddingDate: string

  @column()
  declare location: string

  @column()
  declare startTime: string

  @column()
  declare program: string | null

  @column()
  declare couplePhoto: string | null

  @column()
  declare welcomeMessage: string | null

  // Statistiques
  @column()
  declare totalInvitations: number

  @column()
  declare totalGuestsExpected: number

  @column()
  declare totalGuestsConfirmed: number

  @column()
  declare totalVerified: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
  // Relation guests avec callback pour éviter ReferenceError
  @hasMany(() => Guest)
  declare guests: relations.HasMany<typeof Guest>

  // Méthode pour mettre à jour les statistiques
  async updateStats() {
    // eslint-disable-next-line @typescript-eslint/no-shadow, @unicorn/no-await-expression-member
    const Guest = (await import('./guest.js')).default

    const stats = await Guest.query()
      .where('wedding_id', this.id)
      .select('COUNT(*) as total_invitations')
      .select('SUM(number_of_people) as total_guests_expected')
      .select('SUM(confirmed_people) as total_guests_confirmed')
      .select('SUM(CASE WHEN is_verified THEN 1 ELSE 0 END) as total_verified')
      .first()

    if (!stats || !stats.$extras) {
      this.totalInvitations = 0
      this.totalGuestsExpected = 0
      this.totalGuestsConfirmed = 0
      this.totalVerified = 0
      await this.save()
      return
    }

    this.totalInvitations = Number(stats.$extras.total_invitations) || 0
    this.totalGuestsExpected = Number(stats.$extras.total_guests_expected) || 0
    this.totalGuestsConfirmed = Number(stats.$extras.total_guests_confirmed) || 0
    this.totalVerified = Number(stats.$extras.total_verified) || 0

    await this.save()
  }

  // Hook après sauvegarde d'un invité
  @afterSave()
  static async updateWeddingStats(guest: any) {
    if (!guest.weddingId) return

    const WeddingModel = this
    const wedding = await WeddingModel.find(guest.weddingId)
    if (wedding) {
      await wedding.updateStats()
    }
  }

  // Hook après suppression d'un invité
  @afterDelete()
  static async updateWeddingStatsAfterDelete(guest: any) {
    if (!guest.weddingId) return

    const WeddingModel = this
    const wedding = await WeddingModel.find(guest.weddingId)
    if (wedding) {
      await wedding.updateStats()
    }
  }
}
