import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'weddings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('couple_name').notNullable()
      table.dateTime('wedding_date').notNullable()
      table.string('location').notNullable()
      table.time('start_time').notNullable()
      table.text('program').nullable()
      table.string('couple_photo').nullable()
      table.text('welcome_message').nullable()

      // Statistiques
      table.integer('total_invitations').defaultTo(0)
      table.integer('total_guests_expected').defaultTo(0)
      table.integer('total_guests_confirmed').defaultTo(0)
      table.integer('total_verified').defaultTo(0)

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
