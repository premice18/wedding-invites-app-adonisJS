import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: 'postgres',
  connections: {
    // config/database.ts
    postgres: {
      client: 'pg',
      connection: {
        connectionString: env.get('DATABASE_URL'),
        // On force ces paramètres en plus de la string
        port: 28168,
        host: 'premice18-database-postgres-premicek1-database-postgres.k.aivencloud.com',
        ssl: { rejectUnauthorized: false },
      },
      pool: { min: 0, max: 2, acquireTimeoutMillis: 90000 },
    },
  },
})

export default dbConfig
