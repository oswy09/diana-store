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
    const wooUrl = import.meta.env.VITE_WOOCOMMERCE_URL
    const wooKey = import.meta.env.VITE_WOOCOMMERCE_CONSUMER_KEY
    const wooSecret = import.meta.env.VITE_WOOCOMMERCE_CONSUMER_SECRET

    if (!wooUrl || !wooKey || !wooSecret) {
      imageLoading.value = false
      return
    }

    let url
    if (import.meta.env.DEV) {
      // En desarrollo, usar proxy
      url = `/api/wc/v3/products/${props.product.id}/variations?consumer_key=${wooKey}&consumer_secret=${wooSecret}`
    } else {
      // En producción, usar URL directa
      url = `${wooUrl}/wp-json/wc/v3/products/${props.product.id}/variations?consumer_key=${wooKey}&consumer_secret=${wooSecret}`
    }

    const response = await fetch(url)
    if (response.ok) {
      const variations = await response.json()
      productVariations.value = variations
      
      // Buscar la variación correspondiente al color seleccionado
      const matchingVariation = variations.find(v => {
        const colorAttr = v.attributes?.find(a => 
          a.name?.toLowerCase().includes('color') || 
          a.slug?.toLowerCase().includes('color')
        )
        return colorAttr && colorAttr.option?.toLowerCase() === selectedColor.toLowerCase()
      })
      
      if (matchingVariation && matchingVariation.image?.src) {
        setTimeout(() => {
          currentImage.value = matchingVariation.image.src
          imageLoading.value = false
        }, 200)
      } else {
        imageLoading.value = false
      }
    } else {
      imageLoading.value = false
    }
  } catch (error) {
    console.warn('No se pudieron cargar las variaciones:', error)
    imageLoading.value = false
  }
}

const selectColor = (color) => {
  selectedOptions.value['Color'] = color
  imageLoading.value = true
  
  // Método 1: Si el producto tiene múltiples imágenes, rotar entre ellas
  if (props.product.images && props.product.images.length > 1) {
    const colorIndex = props.product.attributes
      ?.find(attr => attr.name.toLowerCase() === 'color')
      ?.options?.indexOf(color) || 0
    
    const imageIndex = Math.min(colorIndex, props.product.images.length - 1)
    const newImage = props.product.images[imageIndex]?.src || props.product.images[0]?.src
    
    // Cambiar imagen con un pequeño delay para el efecto visual
    setTimeout(() => {
      currentImage.value = newImage
      imageLoading.value = false
    }, 200)
  }
  
  // Método 2: Si tiene variaciones cargadas, usar la imagen de la variación
  else if (props.product.variations && props.product.variations.length > 0) {
    const variation = props.product.variations.find(v => {
      const colorAttr = v.attributes?.find(a => {
        const attrName = a.name?.toLowerCase() || ''
        return attrName.includes('color') || attrName.includes('pa_color')
      })
      
      if (colorAttr) {
        const optionValue = (colorAttr.option || '').toLowerCase().trim()
        const selectedColor = color.toLowerCase().trim()
        return optionValue === selectedColor
      }
      return false
    })
    
    if (variation && variation.image?.src) {
      setTimeout(() => {
        currentImage.value = variation.image.src
        imageLoading.value = false
      }, 200)
    } else {
      imageLoading.value = false
    }
  }
  
  // Método 3: Cargar variaciones dinámicamente si es necesario
  else if (props.product.type === 'variable' && !props.product.variationsLoaded) {
    loadProductVariations(color)
  } else {
    imageLoading.value = false
  }
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