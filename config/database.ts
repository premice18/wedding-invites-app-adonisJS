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
      pool: {
        min: 0, // Mis à 0 pour éviter de bloquer des connexions sur Aiven/Render
        max: 10,
        acquireTimeoutMillis: 30000,
      },
    },
  },
})

export default dbConfig
