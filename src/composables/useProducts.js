import { ref } from 'vue'

export const useProducts = () => {
  const products = ref([])
  const loading = ref(false)
  const error = ref(null)
  const currentPage = ref(1)
  const totalPages = ref(1)

  // Productos de ejemplo para desarrollo
  const sampleProducts = [
    {
      id: 1,
      name: 'Camiseta Premium',
      price: '89000',
      short_description: 'Camiseta de alta calidad en algodón 100%',
      images: [{ src: 'https://via.placeholder.com/400x400/4F46E5/white?text=Camiseta' }],
      attributes: [
        { id: 1, name: 'Talla', options: ['S', 'M', 'L', 'XL'] },
        { id: 2, name: 'Color', options: ['Negro', 'Blanco', 'Azul'] }
      ],
      tags: [{ name: 'NUEVO' }]
    },
    {
      id: 2,
      name: 'Pantalón Casual',
      price: '125000',
      short_description: 'Pantalón cómodo para uso diario',
      images: [{ src: 'https://via.placeholder.com/400x400/1F2937/white?text=Pantalón' }],
      attributes: [
        { id: 1, name: 'Talla', options: ['28', '30', '32', '34', '36'] },
        { id: 2, name: 'Color', options: ['Azul', 'Negro', 'Café'] }
      ],
      tags: [{ name: 'POPULAR' }]
    },
    {
      id: 3,
      name: 'Vestido Elegante',
      price: '150000',
      short_description: 'Vestido perfecto para ocasiones especiales',
      images: [{ src: 'https://via.placeholder.com/400x400/EC4899/white?text=Vestido' }],
      attributes: [
        { id: 1, name: 'Talla', options: ['XS', 'S', 'M', 'L'] },
        { id: 2, name: 'Color', options: ['Rojo', 'Negro', 'Azul Marino'] }
      ],
      tags: [{ name: 'ELEGANTE' }]
    }
  ]

  const fetchProducts = async (category, page = 1) => {
    loading.value = true
    error.value = null

    try {
      // Verificar si tenemos configuración de WooCommerce
      const wooUrl = import.meta.env.VITE_WOOCOMMERCE_URL
      const wooKey = import.meta.env.VITE_WOOCOMMERCE_CONSUMER_KEY
      const wooSecret = import.meta.env.VITE_WOOCOMMERCE_CONSUMER_SECRET

      if (!wooUrl || !wooKey || !wooSecret || wooUrl.includes('tu-tienda.com')) {
        // Usar productos de ejemplo
        console.log('Usando productos de ejemplo - configura WooCommerce en .env para productos reales')
        await new Promise(resolve => setTimeout(resolve, 500)) // Simular carga
        products.value = sampleProducts
        totalPages.value = 1
        currentPage.value = 1
        return
      }

      // Construir URL para WooCommerce
      let url = `${wooUrl}/wp-json/wc/v3/products?consumer_key=${wooKey}&consumer_secret=${wooSecret}&page=${page}&per_page=12`
      
      if (category) {
        url += `&category=${category}`
      }

      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()

      if (Array.isArray(data)) {
        products.value = data
        currentPage.value = page
        
        // Obtener total de páginas de los headers
        const totalProducts = parseInt(response.headers.get('X-WP-Total') || '0')
        totalPages.value = Math.ceil(totalProducts / 12)
      } else {
        throw new Error('Formato de respuesta inválido')
      }
    } catch (err) {
      console.error('Error fetching products:', err)
      error.value = 'Error al cargar productos. Usando productos de ejemplo.'
      
      // Mostrar productos de ejemplo en caso de error
      products.value = sampleProducts
      totalPages.value = 1
      currentPage.value = 1
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    loading,
    error,
    currentPage,
    totalPages,
    fetchProducts
  }
}