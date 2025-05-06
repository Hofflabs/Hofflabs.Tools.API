export default defineNuxtConfig({
  css: ['@/assets/css/tailwind.css'],
  modules: ['shadcn-nuxt', '@nuxtjs/color-mode'],
  colorMode: {
    classSuffix: ''
  },
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    }
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true }
})
