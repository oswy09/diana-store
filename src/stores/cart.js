import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    isOpen: false
  }),

  getters: {
    itemCount: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    subtotal: (state) => state.items.reduce((total, item) => total + (item.price * item.quantity), 0),
    total: (state) => state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  },

  actions: {
    addItem(product, size, color) {
      const existingItem = this.items.find(
        item => item.id === product.id && item.size === size && item.color === color
      )

      if (existingItem) {
        existingItem.quantity++
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          price: parseFloat(product.price),
          image: product.images?.[0]?.src || '',
          size,
          color,
          quantity: 1
        })
      }

      this.isOpen = true
      this.saveToStorage()
    },

    removeItem(index) {
      this.items.splice(index, 1)
      this.saveToStorage()
    },

    updateQuantity(index, quantity) {
      if (quantity <= 0) {
        this.removeItem(index)
      } else {
        this.items[index].quantity = quantity
        this.saveToStorage()
      }
    },

    clearCart() {
      this.items = []
      this.saveToStorage()
    },

    toggleCart() {
      this.isOpen = !this.isOpen
    },

    closeCart() {
      this.isOpen = false
    },

    openCart() {
      this.isOpen = true
    },

    saveToStorage() {
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart-items', JSON.stringify(this.items))
      }
    },

    loadFromStorage() {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('cart-items')
        if (stored) {
          this.items = JSON.parse(stored)
        }
      }
    }
  }
})