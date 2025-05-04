// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt', '@nuxtjs/tailwindcss', 'shadcn-nuxt','@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode'
  ],
  colorMode: {
    classSuffix: ''
  },
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true }
})