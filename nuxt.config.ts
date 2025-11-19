// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  nitro: {
    preset: 'static'
  },
  ssr: false, // Disable server-side rendering for static hosting
  generate: {
    fallback: true // Generate 404.html for better compatibility
  },
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY,
      woocommerceUrl: process.env.NUXT_PUBLIC_WOOCOMMERCE_URL,
      woocommerceConsumerKey: process.env.NUXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY,
      woocommerceConsumerSecret: process.env.NUXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET,
      whatsappNumber: process.env.NUXT_PUBLIC_WHATSAPP_NUMBER
    }
  }
})
