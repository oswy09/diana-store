<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="cartStore.isOpen"
        class="fixed inset-0 bg-black bg-opacity-50 z-50"
        @click="cartStore.closeCart"
      />
    </Transition>

    <Transition name="slide">
      <div
        v-if="cartStore.isOpen"
        class="fixed top-0 right-0 h-full w-full md:w-96 bg-indigo-600 shadow-2xl z-50 flex flex-col"
      >
        <div class="flex items-center justify-between p-6 border-b border-indigo-500">
          <h2 class="text-2xl font-bold text-white uppercase">Carrito</h2>
          <button
            @click="cartStore.closeCart"
            class="text-white hover:text-gray-200 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-6">
          <div v-if="cartStore.items.length === 0" class="text-center text-white mt-10">
            <p class="text-lg">Tu carrito está vacío</p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="(item, index) in cartStore.items"
              :key="`${item.id}-${item.size}-${item.color}`"
              class="bg-white p-4 rounded-lg shadow flex gap-4"
            >
              <img
                :src="item.image"
                :alt="item.name"
                class="w-20 h-20 object-cover rounded"
              />

              <div class="flex-1">
                <h3 class="font-bold uppercase text-sm mb-1">{{ item.name }}</h3>
                <p class="text-xs text-gray-600 mb-1">Talla: {{ item.size }}</p>
                <p class="text-xs text-gray-600 mb-2">Color: {{ item.color }}</p>
                <p class="font-bold text-lg">${{ formatPrice(item.price) }}</p>
              </div>

              <button
                @click="cartStore.removeItem(index)"
                class="text-gray-400 hover:text-red-600 transition-colors self-start"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div v-if="cartStore.items.length > 0" class="border-t border-indigo-500 p-6 bg-indigo-700">
          <div class="flex justify-between items-center mb-4 text-white">
            <span class="text-xl font-bold uppercase">Total:</span>
            <span class="text-3xl font-bold">${{ formatPrice(cartStore.total) }}</span>
          </div>

          <button
            @click="checkout"
            class="w-full bg-white text-indigo-700 py-4 font-bold text-lg uppercase hover:bg-gray-100 transition-colors rounded"
          >
            Hacer pedido por WhatsApp
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
const emit = defineEmits(['checkout'])

const checkout = () => {
  emit('checkout')
}

const formatPrice = (price) => {
  return price.toLocaleString('es-CO')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>