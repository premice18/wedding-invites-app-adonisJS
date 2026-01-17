import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: 'postgres',
  connections: {
    postgres: {
      client: 'pg',
      connection: {
        connectionString: env.get('DATABASE_URL'),
        ssl: {
          rejectUnauthorized: false,
        },
      },
      pool: {
        min: 0,
        max: 1, // Gardez à 1 pour le plan Free d'Aiven qui limite à 20 connexions
        acquireTimeoutMillis: 90000,
      },
    },
  },
})

export default dbConfig
