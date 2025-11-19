<template>
  <div class="bg-white border border-gray-200 relative group">
    <div v-if="product.tags && product.tags.length > 0" class="absolute top-3 left-3 bg-black text-white px-3 py-1 text-xs font-bold uppercase z-10">
      {{ product.tags[0].name }}
    </div>

    <div class="aspect-square overflow-hidden">
      <img
        :src="currentImage"
        :alt="product.name"
        class="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
      />
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
              v-for="option in attr.options"
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

      <div v-if="product.colors && product.colors.length > 0" class="mb-4">
        <label class="block text-sm font-medium mb-2 uppercase">Color:</label>
        <div class="flex gap-2">
          <button
            v-for="color in product.colors"
            :key="color.value"
            @click="selectedOptions['Color'] = color.label"
            :class="[
              'w-10 h-10 rounded-full border-2 transition-all',
              selectedOptions['Color'] === color.label
                ? 'ring-2 ring-black ring-offset-2'
                : 'border-gray-300'
            ]"
            :style="{ backgroundColor: color.value }"
            :title="color.label"
          />
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

<script setup lang="ts">
import { useCartStore } from '~/stores/cart';

const props = defineProps<{
  product: any
}>();

const cartStore = useCartStore();

const selectedOptions = ref<Record<string, string>>({});
const currentImage = ref(props.product.images?.[0]?.src || '/placeholder.jpg');

const isFormComplete = computed(() => {
  const hasColor = !!selectedOptions.value['Color'];
  const hasSize = !!(selectedOptions.value['Talla'] || selectedOptions.value['Size']);
  return hasColor && hasSize;
});

const selectColor = async (color: string) => {
  selectedOptions.value['Color'] = color;

  console.log('Selected color:', color);
  console.log('Product variations:', props.product.variations);

  if (props.product.variations && props.product.variations.length > 0) {
    const variation = props.product.variations.find((v: any) => {
      console.log('Checking variation:', v);
      const colorAttr = v.attributes?.find((a: any) => {
        const attrName = a.name?.toLowerCase() || '';
        return attrName.includes('color');
      });

      if (colorAttr) {
        const optionValue = (colorAttr.option || '').toLowerCase().trim();
        const selectedColor = color.toLowerCase().trim();
        console.log(`Comparing: ${optionValue} === ${selectedColor}`);
        return optionValue === selectedColor;
      }
      return false;
    });

    console.log('Found variation:', variation);

    if (variation && variation.image?.src) {
      currentImage.value = variation.image.src;
      console.log('Changed image to:', variation.image.src);
    } else {
      currentImage.value = props.product.images?.[0]?.src || '/placeholder.jpg';
      console.log('Using default image');
    }
  }
};

const addToCart = () => {
  const tallaAttr = props.product.attributes?.find((a: any) => a.name.toLowerCase() === 'talla' || a.name.toLowerCase() === 'size');
  const colorAttr = props.product.attributes?.find((a: any) => a.name.toLowerCase() === 'color');

  const size = selectedOptions.value['Talla'] || selectedOptions.value['Size'];
  const color = selectedOptions.value['Color'];

  if (!size || !color) {
    alert('Por favor selecciona talla y color antes de agregar al carrito');
    return;
  }

  cartStore.addItem(props.product, size, color);
};

const formatPrice = (price: string) => {
  return parseFloat(price).toLocaleString('es-CO');
};

const getShortDescription = (html: string) => {
  if (!html) return '';
  const text = html.replace(/<[^>]*>/g, '');
  return text.length > 60 ? text.substring(0, 60) + '...' : text;
};

const colorMap: Record<string, string> = {
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
};

const getColorValue = (colorName: string): string => {
  const normalized = colorName.toLowerCase().trim();
  return colorMap[normalized] || '#CCCCCC';
};
</script>
