<template>
  <div class="bg-white border border-gray-200 relative group">
    <div v-if="product.tags && product.tags.length > 0" class="absolute top-3 left-3 bg-black text-white px-3 py-1 text-xs font-bold uppercase z-10">
      {{ product.tags[0].name }}
    </div>

    <div class="aspect-square overflow-hidden bg-gray-100 relative">
      <img
        :key="currentImage"
        :src="currentImage"
        :alt="product.name"
        class="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
        @error="handleImageError"
      />
      
      <!-- Indicador de carga de imagen -->
      <div v-if="imageLoading" class="absolute inset-0 flex items-center justify-center bg-gray-100">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    </div>

    <div class="p-4">
      <h3 class="font-bold text-lg mb-1 uppercase">{{ product.name }}</h3>
      <p class="text-gray-600 text-sm mb-3">{{ getShortDescription(product.short_description) }}</p>

      <div class="text-2xl font-bold mb-4">
        ${{ formatPrice(product.price) }}
      </div>

      <div v-if="product.attributes" class="mb-4">
        <div v-for="attr in product.attributes" :key="attr.id" class="mb-3">
          <label class="block text-sm font-medium mb-2 uppercase">{{ attr.name }}:</label>

          <div v-if="attr.name.toLowerCase() === 'color'" class="flex flex-wrap gap-2">
            <button
              v-for="(option, index) in attr.options"
              :key="option"
              @click="selectColor(option)"
              :class="[
                'w-10 h-10 rounded-full border-2 transition-all relative',
                selectedOptions[attr.name] === option
                  ? 'ring-2 ring-black ring-offset-2 border-gray-400'
                  : 'border-gray-300 hover:border-gray-400'
              ]"
              :style="{ backgroundColor: getColorValue(option) }"
              :title="option"
            >
              <span v-if="option.toLowerCase() === 'blanco'" class="absolute inset-0 border border-gray-200 rounded-full"></span>
              <!-- Indicador de imagen disponible -->
              <span 
                v-if="hasImageForColor(option, index)" 
                class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white"
                title="Imagen disponible"
              ></span>
            </button>
          </div>

          <div v-else class="flex flex-wrap gap-2">
            <button
              v-for="option in attr.options"
              :key="option"
              @click="selectedOptions[attr.name] = option"
              :class="[
                'px-3 py-2 border transition-colors text-sm',
                selectedOptions[attr.name] === option
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-gray-300 hover:border-black'
              ]"
            >
              {{ option }}
            </button>
          </div>
        </div>
      </div>

      <button
        @click="addToCart"
        :disabled="!isFormComplete"
        :class="[
          'w-full py-3 font-medium uppercase transition-colors',
          isFormComplete
            ? 'bg-black text-white hover:bg-gray-800 cursor-pointer'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        ]"
      >
        Agregar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '@/stores/cart'

const props = defineProps({
  product: Object
})

const cartStore = useCartStore()
const selectedOptions = ref({})
const currentImage = ref(props.product.images?.[0]?.src || '/placeholder.jpg')
const productVariations = ref([])
const imageLoading = ref(false)

const isFormComplete = computed(() => {
  const hasColor = !!selectedOptions.value['Color']
  const hasSize = !!(selectedOptions.value['Talla'] || selectedOptions.value['Size'])
  return hasColor && hasSize
})

// Función para cargar variaciones del producto
const loadProductVariations = async (selectedColor) => {
  try {
    const wooUrl = import.meta.env.VITE_WOOCOMMERCE_URL || 'https://productdi.site'
    const wooKey = import.meta.env.VITE_WOOCOMMERCE_CONSUMER_KEY || 'ck_d1a11a415793897c8d984ad4f89d394ff132c303'
    const wooSecret = import.meta.env.VITE_WOOCOMMERCE_CONSUMER_SECRET || 'cs_d12e0364614bd6223b41f73657e7be443b120bde'

    let url
    if (import.meta.env.DEV) {
      url = `/api/wc/v3/products/${props.product.id}/variations?consumer_key=${wooKey}&consumer_secret=${wooSecret}`
    } else {
      url = `${wooUrl}/wp-json/wc/v3/products/${props.product.id}/variations?consumer_key=${wooKey}&consumer_secret=${wooSecret}`
    }

    console.log('🌐 Cargando variaciones desde API...')
    
    const response = await fetch(url)
    
    if (!response.ok) {
      console.error('❌ Error al cargar variaciones:', response.status)
      imageLoading.value = false
      return
    }
    
    const variations = await response.json()
    productVariations.value = variations
    
    console.log(`✅ ${variations.length} variaciones cargadas`)
    
    // Buscar la variación correspondiente al color seleccionado
    const matchingVariation = variations.find(v => {
      const colorAttr = v.attributes?.find(a => 
        a.name?.toLowerCase().includes('color') || 
        a.slug?.toLowerCase().includes('color') ||
        a.slug === 'pa_color'
      )
      
      if (colorAttr) {
        const optionNormalized = (colorAttr.option || '').toLowerCase().trim()
        const selectedNormalized = selectedColor.toLowerCase().trim()
        return optionNormalized === selectedNormalized
      }
      return false
    })
    
    if (matchingVariation) {
      console.log('✨ Variación encontrada:', matchingVariation.name)
      console.log('🖼️ Imagen:', matchingVariation.image?.src)
      
      if (matchingVariation.image?.src) {
        setTimeout(() => {
          currentImage.value = matchingVariation.image.src
          imageLoading.value = false
          console.log('✅ Imagen actualizada exitosamente')
        }, 200)
      } else {
        console.warn('⚠️ La variación no tiene imagen')
        imageLoading.value = false
      }
    } else {
      console.warn('⚠️ No se encontró variación para el color:', selectedColor)
      imageLoading.value = false
    }
  } catch (error) {
    console.error('❌ Error al cargar variaciones:', error)
    imageLoading.value = false
  }
}

const selectColor = async (color) => {
  selectedOptions.value['Color'] = color
  imageLoading.value = true
  
  console.log('🎨 Color seleccionado:', color)
  console.log('📦 Producto:', props.product.name, 'ID:', props.product.id)
  console.log('🖼️ Imágenes disponibles:', props.product.images?.length || 0)
  
  // Método 1: Si el producto tiene múltiples imágenes, rotar entre ellas
  if (props.product.images && props.product.images.length > 1) {
    const colorAttr = props.product.attributes?.find(attr => attr.name.toLowerCase() === 'color')
    const colorIndex = colorAttr?.options?.indexOf(color) || 0
    
    const imageIndex = Math.min(colorIndex, props.product.images.length - 1)
    const newImage = props.product.images[imageIndex]?.src || props.product.images[0]?.src
    
    console.log('📷 Método 1: Usando imagen del índice', imageIndex)
    
    setTimeout(() => {
      currentImage.value = newImage
      imageLoading.value = false
    }, 200)
    return
  }
  
  // Método 2: Si es un producto variable, cargar variaciones
  if (props.product.type === 'variable') {
    console.log('🔄 Producto variable detectado, cargando variaciones...')
    await loadProductVariations(color)
    return
  }
  
  // Si no hay imágenes múltiples ni variaciones, mantener imagen original
  console.log('⚠️ No se encontraron imágenes alternativas')
  imageLoading.value = false
}

// Manejar errores de carga de imagen
const handleImageError = () => {
  currentImage.value = props.product.images?.[0]?.src || '/placeholder.jpg'
  imageLoading.value = false
}

const addToCart = () => {
  const size = selectedOptions.value['Talla'] || selectedOptions.value['Size']
  const color = selectedOptions.value['Color']

  if (!size || !color) {
    alert('Por favor selecciona talla y color antes de agregar al carrito')
    return
  }

  cartStore.addItem(props.product, size, color)
}

const formatPrice = (price) => {
  return parseFloat(price).toLocaleString('es-CO')
}

const getShortDescription = (html) => {
  if (!html) return ''
  const text = html.replace(/<[^>]*>/g, '')
  return text.length > 60 ? text.substring(0, 60) + '...' : text
}

const colorMap = {
  'blanco': '#FFFFFF',
  'negro': '#000000', 
  'gris': '#808080',
  'verde': '#22C55E',
  'rojo': '#EF4444',
  'azul': '#3B82F6',
  'beige': '#F5F5DC',
  'morado': '#A855F7',
  'amarillo': '#FBBF24',
  'rosa': '#EC4899',
  'naranja': '#F97316',
  'cafe': '#92400E',
  'café': '#92400E'
}

const getColorValue = (colorName) => {
  const normalized = colorName.toLowerCase().trim()
  return colorMap[normalized] || '#CCCCCC'
}

// Verificar si hay imagen disponible para un color específico
const hasImageForColor = (colorName, colorIndex) => {
  // Si hay múltiples imágenes en el producto, asumimos que cada una corresponde a un color
  if (props.product.images && props.product.images.length > 1) {
    return colorIndex < props.product.images.length
  }
  
  // Si hay variaciones cargadas, verificar si alguna tiene imagen para este color
  if (productVariations.value.length > 0) {
    return productVariations.value.some(v => {
      const colorAttr = v.attributes?.find(a => 
        a.name?.toLowerCase().includes('color') || 
        a.slug?.toLowerCase().includes('color')
      )
      return colorAttr && 
             colorAttr.option?.toLowerCase() === colorName.toLowerCase() && 
             v.image?.src
    })
  }
  
  return false
}
</script>