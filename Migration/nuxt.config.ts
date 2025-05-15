import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },

  css: ['~/assets/css/tailwind.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  modules: [
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@nuxt/fonts',
    '@nuxt/eslint',
    '@nuxt/content',
    'shadcn-nuxt',
  ],

  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },

  runtimeConfig: {
    appVersion: '0.0.0.1',
    key: process.env.ENCRYPTION_KEY,

    vaultEnabled: process.env.VAULT_ENABLED === 'true',
    vaultAddr: process.env.VAULT_ADDR,
    vaultPass: process.env.VAULT_PASS,

    database: process.env.DATABASE || 'sqlite',

    sqliteConnectionUrl: process.env.SQLITE_CONNECTION_URL || '',

    postgres: {
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
    },

    mysql: {
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    },

    rds: {
      endpoint: process.env.RDS_ENDPOINT,
      user: process.env.RDS_USER,
      password: process.env.RDS_PASSWORD,
      database: process.env.RDS_DATABASE,
    },

    gcloud: {
      instanceConnectionName: process.env.GCLOUD_INSTANCE_CONNECTION_NAME,
      user: process.env.GCLOUD_USER,
      password: process.env.GCLOUD_PASSWORD,
      database: process.env.GCLOUD_DATABASE,
    },

    smtp: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
      from: process.env.SMTP_FROM,
    },

    public: {
      appName: process.env.APP_NAME || 'Hofflabs API',
      host: process.env.HOST || 'localhost',
      port: process.env.PORT ?? '3000',
      apiUrl: process.env.API_URL || '',
    }
  },
})
