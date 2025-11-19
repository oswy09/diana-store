export const useProducts = () => {
  const products = ref([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const currentPage = ref(1);
  const totalPages = ref(1);

  const fetchProducts = async (category?: number, page: number = 1) => {
    loading.value = true;
    error.value = null;

    try {
      const query: any = { page };
      if (category) query.category = category;

      const data = await $fetch('/api/woocommerce/products', {
        query
      });

      if (data.success) {
        products.value = data.products;
        totalPages.value = data.totalPages;
        currentPage.value = page;
      } else {
        error.value = data.error;
      }
    } catch (err: any) {
      error.value = err.message || 'Error loading products';
      console.error('Error fetching products:', err);
    } finally {
      loading.value = false;
    }
  };

  return {
    products,
    loading,
    error,
    currentPage,
    totalPages,
    fetchProducts
  };
};
