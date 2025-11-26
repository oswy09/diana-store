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
      // Configuración de WooCommerce
      const wooUrl = import.meta.env.VITE_WOOCOMMERCE_URL || 'https://productdi.site'
      const wooKey = import.meta.env.VITE_WOOCOMMERCE_CONSUMER_KEY || 'ck_d1a11a415793897c8d984ad4f89d394ff132c303'
      const wooSecret = import.meta.env.VITE_WOOCOMMERCE_CONSUMER_SECRET || 'cs_d12e0364614bd6223b41f73657e7be443b120bde'

      // Construir URL para WooCommerce
      let url
      
      if (import.meta.env.DEV) {
        // En desarrollo, usar el proxy de Vite
        url = `/api/wc/v3/products?consumer_key=${wooKey}&consumer_secret=${wooSecret}&page=${page}&per_page=12`
      } else {
        // En producción, usar URL directa
        url = `${wooUrl}/wp-json/wc/v3/products?consumer_key=${wooKey}&consumer_secret=${wooSecret}&page=${page}&per_page=12`
      }
      
      if (category) {
        url += `&category=${category}`
      }

      console.log('Llamando a WooCommerce API:', url.replace(wooKey, '***').replace(wooSecret, '***'))

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      })
      
      console.log('Respuesta de WooCommerce:', response.status, response.statusText)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response:', errorText)
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('Productos obtenidos:', data.length)

      if (Array.isArray(data) && data.length > 0) {
        products.value = data
        currentPage.value = page
        
        // Obtener total de páginas de los headers
        const totalProducts = parseInt(response.headers.get('X-WP-Total') || data.length.toString())
        totalPages.value = Math.ceil(totalProducts / 12)
        
        console.log(`Cargados ${data.length} productos de ${totalProducts} totales`)
      } else {
        console.warn('API devolvió datos vacíos, usando productos de ejemplo')
        products.value = sampleProducts
        totalPages.value = 1
        currentPage.value = 1
      }
    } catch (err) {
      console.error('Error detallado fetching products:', err)
      error.value = `Error de conexión con WooCommerce: ${err.message}`
      
      // Mostrar productos de ejemplo en caso de error
      console.log('Usando productos de ejemplo debido al error')
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