import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: 'postgres',
  connections: {
    // config/database.ts
    // config/database.ts
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
        max: 1, // On force une seule connexion pour stabiliser le démarrage
        acquireTimeoutMillis: 100000, // On laisse 100 secondes (très généreux)
        createTimeoutMillis: 100000,
        idleTimeoutMillis: 5000,
      },
    },
  },
})

export default dbConfig
