export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);

  const params = new URLSearchParams({
    consumer_key: config.public.woocommerceConsumerKey,
    consumer_secret: config.public.woocommerceConsumerSecret,
    per_page: String(query.per_page || 20),
    page: String(query.page || 1),
    orderby: String(query.orderby || 'date'),
    order: String(query.order || 'desc')
  });

  if (query.category) {
    params.append('category', String(query.category));
  }

  const url = `${config.public.woocommerceUrl}/wp-json/wc/v3/products?${params.toString()}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const products = await response.json();
    const totalPages = parseInt(response.headers.get('x-wp-totalpages') || '1');
    const total = parseInt(response.headers.get('x-wp-total') || '0');

    const productsWithVariations = await Promise.all(
      products.map(async (product: any) => {
        if (product.type === 'variable' && product.variations && product.variations.length > 0) {
          const variationIds = product.variations;
          const variationsData = await Promise.all(
            variationIds.map(async (varId: number) => {
              const varParams = new URLSearchParams({
                consumer_key: config.public.woocommerceConsumerKey,
                consumer_secret: config.public.woocommerceConsumerSecret
              });
              const varUrl = `${config.public.woocommerceUrl}/wp-json/wc/v3/products/${product.id}/variations/${varId}?${varParams.toString()}`;

              try {
                const varResponse = await fetch(varUrl);
                if (varResponse.ok) {
                  return await varResponse.json();
                }
              } catch (err) {
                console.error(`Error fetching variation ${varId}:`, err);
              }
              return null;
            })
          );

          product.variations = variationsData.filter((v: any) => v !== null);
        }

        return product;
      })
    );

    return {
      success: true,
      products: productsWithVariations,
      totalPages,
      total
    };
  } catch (error: any) {
    console.error('WooCommerce API Error:', error);
    console.error('URL:', url);
    return {
      success: false,
      error: error.message || 'No se puede conectar con la tienda WordPress',
      details: {
        url: config.public.woocommerceUrl
      }
    };
  }
});
