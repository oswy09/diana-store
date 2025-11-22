<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <h1 class="text-3xl font-bold text-gray-900">Panel Administrativo</h1>
          <router-link 
            to="/" 
            class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Volver a la tienda
          </router-link>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-6 px-4">
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-6">Estadísticas de la Tienda</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="text-lg font-medium text-blue-900">Productos Activos</h3>
            <p class="text-2xl font-bold text-blue-600">{{ stats.products }}</p>
          </div>
          
          <div class="bg-green-50 p-4 rounded-lg">
            <h3 class="text-lg font-medium text-green-900">Pedidos Hoy</h3>
            <p class="text-2xl font-bold text-green-600">{{ stats.ordersToday }}</p>
          </div>
          
          <div class="bg-purple-50 p-4 rounded-lg">
            <h3 class="text-lg font-medium text-purple-900">Total Ventas</h3>
            <p class="text-2xl font-bold text-purple-600">${{ stats.totalSales }}</p>
          </div>
        </div>

        <div class="text-center py-12">
          <div class="text-6xl mb-4">🛍️</div>
          <h3 class="text-xl font-medium text-gray-700 mb-2">Panel Administrativo</h3>
          <p class="text-gray-500 mb-6">
            Aquí podrás gestionar tu tienda cuando implementes las funciones administrativas
          </p>
          
          <div class="space-y-3">
            <p class="text-sm text-gray-600">✅ Productos se cargan desde WooCommerce</p>
            <p class="text-sm text-gray-600">✅ Pedidos van directo a WhatsApp</p>
            <p class="text-sm text-gray-600">📱 WhatsApp: 317 261 3957</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const stats = ref({
  products: 0,
  ordersToday: 0,
  totalSales: 0
})

onMounted(() => {
  // Aquí podrías cargar estadísticas reales
  stats.value = {
    products: '12',
    ordersToday: '3',
    totalSales: '450,000'
  }
})
</script>