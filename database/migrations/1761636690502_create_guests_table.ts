// database/migrations/XXXX_guests.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'guests'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table.string('phone').notNullable()
      table.integer('table_number').nullable()
      table.text('dietary_restrictions').nullable()

      // Nombre de personnes
      table.integer('number_of_people').defaultTo(1)
      table.integer('confirmed_people').defaultTo(0)

      // QR Code
      table.text('qrcode_data').notNullable().unique()
      table.string('qrcode_image').nullable()

      // Code de secours
      table.string('backup_code').nullable().unique()

      // Verification
      table.boolean('is_verified').defaultTo(false)
      table.timestamp('verified_at').nullable()
      table.string('verification_method').nullable() // 'qr_code', 'manual', 'backup_code'

      // WhatsApp
      table.boolean('whatsapp_sent').defaultTo(false)
      table.timestamp('whatsapp_sent_at').nullable()

      // Relations
      table.integer('wedding_id').unsigned().references('id').inTable('weddings')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
