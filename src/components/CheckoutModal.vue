<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
        @click.self="close"
      >
        <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="sticky top-0 bg-black text-white p-6 flex items-center justify-between">
            <h2 class="text-2xl font-bold uppercase">Finalizar Pedido</h2>
            <button
              @click="close"
              class="text-white hover:text-gray-300 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-8">
            <form @submit.prevent="submitOrder">
              <div class="mb-6">
                <label class="block text-sm font-bold mb-2 uppercase">Nombre Completo *</label>
                <input
                  v-model="formData.name"
                  type="text"
                  required
                  placeholder="Ingresa tu nombre"
                  class="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
                />
              </div>

              <div class="mb-6">
                <label class="block text-sm font-bold mb-2 uppercase">Celular *</label>
                <input
                  v-model="formData.phone"
                  type="tel"
                  required
                  placeholder="3001234567"
                  class="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
                />
              </div>

              <div class="mb-6">
                <label class="block text-sm font-bold mb-2 uppercase">Correo (Opcional)</label>
                <input
                  v-model="formData.email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  class="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
                />
              </div>

              <div class="mb-6">
                <label class="block text-sm font-bold mb-2 uppercase">Ciudad (Opcional)</label>
                <input
                  v-model="formData.city"
                  type="text"
                  placeholder="Tu ciudad"
                  class="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
                />
              </div>

              <div class="mb-6">
                <label class="block text-sm font-bold mb-2 uppercase">Dirección (Opcional)</label>
                <input
                  v-model="formData.address"
                  type="text"
                  placeholder="Tu dirección"
                  class="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
                />
              </div>

              <div class="mb-8">
                <label class="block text-sm font-bold mb-2 uppercase">Forma de Pago *</label>
                <div class="grid grid-cols-2 gap-4">
                  <label class="cursor-pointer">
                    <input
                      v-model="formData.paymentMethod"
                      type="radio"
                      value="1_cuota"
                      required
                      class="sr-only"
                    />
                    <div :class="[
                      'p-4 border-2 text-center transition-all',
                      formData.paymentMethod === '1_cuota'
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-black'
                    ]">
                      <div class="font-bold">1 CUOTA</div>
                      <div class="text-sm">Pago completo</div>
                    </div>
                  </label>

                  <label class="cursor-pointer">
                    <input
                      v-model="formData.paymentMethod"
                      type="radio"
                      value="2_cuotas"
                      required
                      class="sr-only"
                    />
                    <div :class="[
                      'p-4 border-2 text-center transition-all',
                      formData.paymentMethod === '2_cuotas'
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-black'
                    ]">
                      <div class="font-bold">2 CUOTAS</div>
                      <div class="text-sm">50% ahora + 50%</div>
                    </div>
                  </label>
                </div>
              </div>

              <div class="bg-gray-50 p-6 mb-8">
                <h3 class="text-lg font-bold mb-4 uppercase">Resumen del Pedido</h3>
                <div class="space-y-2">
                  <div v-for="item in cartItems" :key="`${item.id}-${item.size}-${item.color}`" class="flex justify-between text-sm">
                    <span>{{ item.name }} ({{ item.size }}, {{ item.color }})</span>
                    <span>${{ formatPrice(item.price) }}</span>
                  </div>
                </div>
                <div class="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
                  <span>TOTAL:</span>
                  <span>${{ formatPrice(total) }}</span>
                </div>
              </div>

              <button
                type="submit"
                class="w-full bg-green-600 text-white py-4 font-bold text-lg uppercase hover:bg-green-700 transition-colors"
              >
                📱 Enviar por WhatsApp
              </button>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  cartItems: Array,
  total: Number
})

const emit = defineEmits(['close', 'submit'])

const formData = ref({
  name: '',
  phone: '',
  email: '',
  city: '',
  address: '',
  paymentMethod: ''
})

const close = () => {
  emit('close')
}

const submitOrder = () => {
  emit('submit', formData.value)
  
  // Reset form
  formData.value = {
    name: '',
    phone: '',
    email: '',
    city: '',
    address: '',
    paymentMethod: ''
  }
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
</style>