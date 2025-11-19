<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-black text-white shadow-lg">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold uppercase tracking-wider">Panel Administrativo</h1>
            <p class="text-gray-300 text-sm mt-1">Gestión de Cotizaciones</p>
          </div>
          <NuxtLink
            to="/"
            class="bg-white text-black px-6 py-3 font-medium uppercase hover:bg-gray-100 transition-colors"
          >
            Ver Tienda
          </NuxtLink>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-4 py-8">
      <div v-if="!isAuthenticated" class="max-w-md mx-auto mt-20">
        <div class="bg-white p-8 rounded-lg shadow-lg">
          <h2 class="text-2xl font-bold mb-6 text-center uppercase">Acceso Administrativo</h2>
          <form @submit.prevent="handleLogin">
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Email</label>
              <input
                v-model="loginForm.email"
                type="email"
                required
                class="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
              />
            </div>
            <div class="mb-6">
              <label class="block text-sm font-medium mb-2">Contraseña</label>
              <input
                v-model="loginForm.password"
                type="password"
                required
                class="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
              />
            </div>
            <button
              type="submit"
              :disabled="loggingIn"
              class="w-full bg-black text-white py-3 font-bold uppercase hover:bg-gray-800 transition-colors disabled:bg-gray-400"
            >
              {{ loggingIn ? 'Ingresando...' : 'Ingresar' }}
            </button>
            <p v-if="loginError" class="text-red-600 text-sm mt-4 text-center">{{ loginError }}</p>
          </form>
        </div>
      </div>

      <div v-else>
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl font-bold uppercase">Cotizaciones Recibidas</h2>
            <p class="text-gray-600 mt-1">Total: {{ quotations.length }} cotizaciones</p>
          </div>
          <div class="flex gap-4">
            <button
              @click="loadQuotations"
              :disabled="loading"
              class="bg-black text-white px-6 py-3 font-medium uppercase hover:bg-gray-800 transition-colors disabled:bg-gray-400"
            >
              {{ loading ? 'Actualizando...' : 'Actualizar' }}
            </button>
            <button
              @click="handleLogout"
              class="bg-red-600 text-white px-6 py-3 font-medium uppercase hover:bg-red-700 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        <div class="mb-6 flex gap-3">
          <button
            @click="statusFilter = null"
            :class="[
              'px-4 py-2 font-medium uppercase text-sm transition-colors',
              statusFilter === null ? 'bg-black text-white' : 'bg-white text-black border border-gray-300 hover:bg-gray-50'
            ]"
          >
            Todas
          </button>
          <button
            @click="statusFilter = 'pending'"
            :class="[
              'px-4 py-2 font-medium uppercase text-sm transition-colors',
              statusFilter === 'pending' ? 'bg-black text-white' : 'bg-white text-black border border-gray-300 hover:bg-gray-50'
            ]"
          >
            Pendientes
          </button>
          <button
            @click="statusFilter = 'sent'"
            :class="[
              'px-4 py-2 font-medium uppercase text-sm transition-colors',
              statusFilter === 'sent' ? 'bg-black text-white' : 'bg-white text-black border border-gray-300 hover:bg-gray-50'
            ]"
          >
            Enviadas
          </button>
          <button
            @click="statusFilter = 'completed'"
            :class="[
              'px-4 py-2 font-medium uppercase text-sm transition-colors',
              statusFilter === 'completed' ? 'bg-black text-white' : 'bg-white text-black border border-gray-300 hover:bg-gray-50'
            ]"
          >
            Completadas
          </button>
        </div>

        <div v-if="loading" class="text-center py-20">
          <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-black"></div>
          <p class="mt-4 text-gray-600">Cargando cotizaciones...</p>
        </div>

        <div v-else-if="filteredQuotations.length === 0" class="bg-white p-12 text-center">
          <p class="text-gray-600 text-lg">No hay cotizaciones {{ statusFilter ? `con estado "${statusFilter}"` : '' }}</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="quotation in filteredQuotations"
            :key="quotation.id"
            class="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div class="p-6">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <h3 class="text-xl font-bold uppercase">{{ quotation.customer_name }}</h3>
                  <p class="text-gray-600 text-sm mt-1">
                    {{ formatDate(quotation.created_at) }}
                  </p>
                </div>
                <select
                  :value="quotation.status"
                  @change="updateStatus(quotation.id, ($event.target as HTMLSelectElement).value)"
                  class="px-4 py-2 border border-gray-300 focus:border-black focus:outline-none font-medium"
                >
                  <option value="pending">Pendiente</option>
                  <option value="sent">Enviada</option>
                  <option value="completed">Completada</option>
                </select>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                <div>
                  <p class="text-gray-600 font-medium">Teléfono</p>
                  <p class="font-semibold">{{ quotation.customer_phone }}</p>
                </div>
                <div>
                  <p class="text-gray-600 font-medium">Email</p>
                  <p class="font-semibold">{{ quotation.customer_email || 'N/A' }}</p>
                </div>
                <div>
                  <p class="text-gray-600 font-medium">Forma de Pago</p>
                  <p class="font-semibold uppercase">{{ quotation.payment_method.replace('_', ' ') }}</p>
                </div>
              </div>

              <div class="border-t border-gray-200 pt-4 mt-4">
                <h4 class="font-bold mb-3 uppercase">Productos</h4>
                <div class="space-y-2">
                  <div
                    v-for="(item, index) in quotation.items"
                    :key="index"
                    class="flex justify-between items-start bg-gray-50 p-3"
                  >
                    <div class="flex-1">
                      <p class="font-medium">{{ item.name }}</p>
                      <p class="text-sm text-gray-600">
                        Talla: {{ item.size }} • Color: {{ item.color }} • Cantidad: {{ item.quantity }}
                      </p>
                    </div>
                    <p class="font-bold">${{ formatPrice(item.price) }}</p>
                  </div>
                </div>
              </div>

              <div class="border-t border-gray-200 pt-4 mt-4 flex justify-between items-center">
                <a
                  :href="`https://wa.me/${quotation.customer_phone}`"
                  target="_blank"
                  class="bg-green-600 text-white px-6 py-2 font-medium uppercase hover:bg-green-700 transition-colors inline-flex items-center gap-2"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Contactar
                </a>
                <p class="text-2xl font-bold">${{ formatPrice(quotation.total_amount) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();
const { fetchQuotations, updateQuotationStatus } = useQuotations();

const isAuthenticated = ref(false);
const quotations = ref<any[]>([]);
const loading = ref(false);
const statusFilter = ref<string | null>(null);

const loginForm = ref({
  email: '',
  password: ''
});
const loggingIn = ref(false);
const loginError = ref('');

const filteredQuotations = computed(() => {
  if (!statusFilter.value) return quotations.value;
  return quotations.value.filter(q => q.status === statusFilter.value);
});

onMounted(async () => {
  const { data } = await supabase.auth.getSession();
  if (data.session) {
    isAuthenticated.value = true;
    loadQuotations();
  }
});

const handleLogin = async () => {
  loggingIn.value = true;
  loginError.value = '';

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginForm.value.email,
      password: loginForm.value.password
    });

    if (error) throw error;

    if (data.session) {
      isAuthenticated.value = true;
      await loadQuotations();
    }
  } catch (error: any) {
    loginError.value = 'Credenciales incorrectas';
    console.error('Login error:', error);
  } finally {
    loggingIn.value = false;
  }
};

const handleLogout = async () => {
  await supabase.auth.signOut();
  isAuthenticated.value = false;
  quotations.value = [];
};

const loadQuotations = async () => {
  loading.value = true;
  const result = await fetchQuotations();

  if (result.success) {
    quotations.value = result.data || [];
  }

  loading.value = false;
};

const updateStatus = async (id: string, status: string) => {
  const result = await updateQuotationStatus(id, status);

  if (result.success) {
    const index = quotations.value.findIndex(q => q.id === id);
    if (index !== -1) {
      quotations.value[index].status = status;
    }
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatPrice = (price: number) => {
  return price.toLocaleString('es-CO');
};

useHead({
  title: 'Panel Administrativo - Di Store',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});
</script>
