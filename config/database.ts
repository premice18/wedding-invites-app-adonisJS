import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: 'postgres',
  connections: {
    postgres: {
      client: 'pg',
      connection: {
        // Utilisation de env.get pour la cohérence avec AdonisJS 6
        connectionString: env.get('DATABASE_URL'),
        ssl: {
          rejectUnauthorized: false,
        },
      }, // <-- La connexion doit se fermer ici
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
      // config/database.ts
      pool: {
        min: 0,
        max: 10,
        acquireTimeoutMillis: 90000, // On donne 90 secondes à Knex pour se connecter
        createTimeoutMillis: 30000,
        idleTimeoutMillis: 30000,
      },
    },
  },
})

export default dbConfig
