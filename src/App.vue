<template>
  <div id="app">
    <router-view @checkout="handleCheckout" />
    <CartSidebar @checkout="handleCheckout" />
    <CheckoutModal
      :is-open="showCheckoutModal"
      :cart-items="cartStore.items"
      :total="cartStore.total"
      @close="closeCheckoutModal"
      @submit="submitCheckout"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCartStore } from './stores/cart'
import { useQuotations } from './composables/useQuotations'
import CartSidebar from './components/CartSidebar.vue'
import CheckoutModal from './components/CheckoutModal.vue'

// Cargar carrito desde localStorage al iniciar
const cartStore = useCartStore()
const { sendToWhatsApp } = useQuotations()
const showCheckoutModal = ref(false)

cartStore.loadFromStorage()

const handleCheckout = () => {
  cartStore.closeCart()
  showCheckoutModal.value = true
}

const closeCheckoutModal = () => {
  showCheckoutModal.value = false
}

const submitCheckout = (formData) => {
  const result = sendToWhatsApp(formData, cartStore.items, cartStore.total)
  
  if (result.success) {
    cartStore.clearCart()
    closeCheckoutModal()
  }
}
</script>

<style>
/* Reset básico */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

#app {
  min-height: 100vh;
}
</style>