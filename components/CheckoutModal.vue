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
                <label class="block text-sm font-bold mb-2 uppercase">Correo Electrónico (Opcional)</label>
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
                <textarea
                  v-model="formData.address"
                  placeholder="Tu dirección de entrega"
                  rows="2"
                  class="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none resize-none"
                ></textarea>
              </div>

              <div class="mb-8">
                <label class="block text-sm font-bold mb-3 uppercase">Forma de Pago</label>
                <div class="grid grid-cols-2 gap-4">
                  <label class="flex items-center justify-center p-4 border-2 cursor-pointer transition-all"
                    :class="formData.paymentMethod === '1_cuota' ? 'border-black bg-gray-50' : 'border-gray-300'"
                  >
                    <input
                      type="radio"
                      v-model="formData.paymentMethod"
                      value="1_cuota"
                      class="mr-3"
                    />
                    <span class="font-medium">1 Cuota</span>
                  </label>

                  <label class="flex items-center justify-center p-4 border-2 cursor-pointer transition-all"
                    :class="formData.paymentMethod === '2_cuotas' ? 'border-black bg-gray-50' : 'border-gray-300'"
                  >
                    <input
                      type="radio"
                      v-model="formData.paymentMethod"
                      value="2_cuotas"
                      class="mr-3"
                    />
                    <span class="font-medium">2 Cuotas</span>
                  </label>
                </div>
              </div>

              <div class="bg-gray-50 p-6 mb-6 border border-gray-200">
                <h3 class="font-bold text-lg mb-4 uppercase">Resumen del Pedido</h3>

                <div class="space-y-3 mb-4">
                  <div
                    v-for="item in cartItems"
                    :key="`${item.id}-${item.size}-${item.color}`"
                    class="flex justify-between text-sm"
                  >
                    <div class="flex-1">
                      <p class="font-medium">{{ item.name }}</p>
                      <p class="text-gray-600 text-xs">Talla: {{ item.size }} • Color: {{ item.color }}</p>
                    </div>
                    <p class="font-bold">${{ formatPrice(item.price) }}</p>
                  </div>
                </div>

                <div class="border-t border-gray-300 pt-4 mt-4">
                  <div class="flex justify-between items-center">
                    <span class="text-xl font-bold uppercase">Total:</span>
                    <span class="text-2xl font-bold">${{ formatPrice(total) }}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                :disabled="loading"
                class="w-full bg-black text-white py-4 font-bold text-lg uppercase hover:bg-gray-800 transition-colors disabled:bg-gray-400"
              >
                {{ loading ? 'Enviando...' : 'Enviar Pedido por WhatsApp' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean;
  cartItems: any[];
  total: number;
}>();

const emit = defineEmits(['close', 'submit']);

const formData = ref({
  name: '',
  phone: '',
  email: '',
  city: '',
  address: '',
  paymentMethod: '1_cuota'
});

const loading = ref(false);

const close = () => {
  emit('close');
};

const submitOrder = async () => {
  loading.value = true;

  try {
    await emit('submit', formData.value);
  } finally {
    loading.value = false;
  }
};

const formatPrice = (price: number) => {
  return price.toLocaleString('es-CO');
};
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
