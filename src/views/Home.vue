<template>
  <div class="min-h-screen bg-white">
    <header class="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <h1 class="text-4xl font-bold tracking-wider">DI STORE</h1>
          <button
            @click="cartStore.toggleCart"
            class="bg-indigo-600 text-white px-6 py-3 hover:bg-indigo-700 transition-colors relative"
          >
            <svg class="w-6 h-6 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span v-if="cartStore.itemCount > 0" class="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">
              {{ cartStore.itemCount }}
            </span>
          </button>
        </div>
        <p class="text-sm text-gray-600 mt-2 uppercase tracking-wide">Premium Clothing Collection</p>
      </div>

      <div class="bg-gray-50 border-t border-b border-gray-200 py-4">
        <div class="container mx-auto px-4">
          <p class="text-center text-sm">
            Selecciona los productos que te gustan, agrégalos al carrito y envía tu cotización directamente por WhatsApp. ¡Es rápido y fácil!
          </p>
        </div>
      </div>
    </header>

    <nav class="bg-black text-white">
      <div class="container mx-auto px-4">
        <div class="flex justify-center space-x-8">
          <button
            @click="selectCategory(null)"
            :class="[
              'py-4 px-6 font-medium uppercase text-sm transition-colors',
              selectedCategory === null ? 'bg-gray-800' : 'hover:bg-gray-800'
            ]"
          >
            Todos
          </button>
          <button
            v-for="category in categories"
            :key="category.id"
            @click="selectCategory(category.slug)"
            :class="[
              'py-4 px-6 font-medium uppercase text-sm transition-colors',
              selectedCategory === category.slug ? 'bg-gray-800' : 'hover:bg-gray-800'
            ]"
          >
            {{ category.name }}
          </button>
        </div>
      </div>
    </nav>

    <main class="container mx-auto px-4 py-12">
      <div v-if="loading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-black"></div>
        <p class="mt-4 text-gray-600">Cargando productos...</p>
      </div>

      <div v-else-if="error" class="text-center py-20">
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button @click="loadProducts" class="bg-black text-white px-6 py-3 hover:bg-gray-800">
          Reintentar
        </button>
      </div>

      <div v-else-if="products.length === 0" class="text-center py-20">
        <p class="text-gray-600 text-lg">No hay productos disponibles</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
        />
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useProducts } from '@/composables/useProducts'
import { useQuotations } from '@/composables/useQuotations'
import ProductCard from '@/components/ProductCard.vue'
import Footer from '@/components/Footer.vue'

const cartStore = useCartStore()
const { products, loading, error, fetchProducts } = useProducts()
const { sendToWhatsApp } = useQuotations()

const selectedCategory = ref(null)
const categories = ref([])

const emit = defineEmits(['checkout'])

onMounted(() => {
  loadCategories()
  loadProducts()
})

const loadCategories = async () => {
  try {
    // Verificar configuración de WooCommerce
    const wooUrl = import.meta.env.VITE_WOOCOMMERCE_URL
    const wooKey = import.meta.env.VITE_WOOCOMMERCE_CONSUMER_KEY
    const wooSecret = import.meta.env.VITE_WOOCOMMERCE_CONSUMER_SECRET

    if (!wooUrl || !wooKey || !wooSecret || wooUrl.includes('tu-tienda.com')) {
      // Usar categorías de ejemplo
      categories.value = [
        { id: 1, name: 'Camisetas', slug: 'camisetas' },
        { id: 2, name: 'Pantalones', slug: 'pantalones' },
        { id: 3, name: 'Vestidos', slug: 'vestidos' }
      ]
      return
    }

    // Llamada real a WooCommerce
    const response = await fetch(`${wooUrl}/wp-json/wc/v3/products/categories?consumer_key=${wooKey}&consumer_secret=${wooSecret}`)
    
    if (!response.ok) {
      throw new Error('Error al cargar categorías')
    }
    
    const data = await response.json()
    
    // Filtrar categorías no deseadas
    categories.value = data.filter(cat => 
      cat.slug !== 'uncategorized' && 
      cat.slug !== 'sin-categorizar' &&
      cat.name.toLowerCase() !== 'uncategorized' &&
      cat.name.toLowerCase() !== 'sin categorizar'
    )
  } catch (error) {
    console.error('Error loading categories:', error)
    // Categorías de respaldo
    categories.value = [
      { id: 1, name: 'Camisetas', slug: 'camisetas' },
      { id: 2, name: 'Pantalones', slug: 'pantalones' },
      { id: 3, name: 'Vestidos', slug: 'vestidos' }
    ]
  }
}

const loadProducts = async () => {
  let categoryId = undefined

  if (selectedCategory.value) {
    const category = categories.value.find(cat =>
      cat.slug === selectedCategory.value ||
      cat.name.toLowerCase() === selectedCategory.value
    )
    if (category) {
      categoryId = category.id
    }
  }

  fetchProducts(categoryId)
}

const selectCategory = (category) => {
  selectedCategory.value = category
  loadProducts()
}
</script>