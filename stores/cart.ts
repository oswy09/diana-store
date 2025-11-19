import { defineStore } from 'pinia';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    isOpen: false
  }),

  getters: {
    itemCount: (state) => state.items.reduce((total, item) => total + item.quantity, 0),

    subtotal: (state) => state.items.reduce((total, item) => total + (item.price * item.quantity), 0),

    total: (state) => state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  },

  actions: {
    addItem(product: any, size: string, color: string) {
      const existingItem = this.items.find(
        item => item.id === product.id && item.size === size && item.color === color
      );

      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          price: parseFloat(product.price),
          image: product.images?.[0]?.src || '',
          size,
          color,
          quantity: 1
        });
      }

      this.isOpen = true;

      if (typeof window !== 'undefined') {
        localStorage.setItem('cart-items', JSON.stringify(this.items));
      }
    },

    removeItem(index: number) {
      this.items.splice(index, 1);

      if (typeof window !== 'undefined') {
        localStorage.setItem('cart-items', JSON.stringify(this.items));
      }
    },

    updateQuantity(index: number, quantity: number) {
      if (quantity <= 0) {
        this.removeItem(index);
      } else {
        this.items[index].quantity = quantity;

        if (typeof window !== 'undefined') {
          localStorage.setItem('cart-items', JSON.stringify(this.items));
        }
      }
    },

    clearCart() {
      this.items = [];

      if (typeof window !== 'undefined') {
        localStorage.removeItem('cart-items');
      }
    },

    toggleCart() {
      this.isOpen = !this.isOpen;
    },

    closeCart() {
      this.isOpen = false;
    },

    openCart() {
      this.isOpen = true;
    },

    loadFromStorage() {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('cart-items');
        if (stored) {
          this.items = JSON.parse(stored);
        }
      }
    }
  }
});
