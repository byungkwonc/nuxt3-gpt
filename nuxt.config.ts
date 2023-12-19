// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/tailwindcss',
  ],
  css: [
    '@/assets/css/app.css',
  ],
  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  }
})