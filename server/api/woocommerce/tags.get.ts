export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const params = new URLSearchParams({
    consumer_key: config.public.woocommerceConsumerKey,
    consumer_secret: config.public.woocommerceConsumerSecret,
    per_page: '100',
    orderby: 'name',
    order: 'asc'
  });

  const url = `${config.public.woocommerceUrl}/wp-json/wc/v3/products/tags?${params.toString()}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const tags = await response.json();

    return {
      success: true,
      tags
    };
  } catch (error: any) {
    console.error('WooCommerce API Error:', error);
    return {
      success: false,
      error: error.message || 'Error fetching tags'
    };
  }
});
