export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  try {
    // Crear la orden en WooCommerce
    const orderData = {
      payment_method: 'whatsapp',
      payment_method_title: 'WhatsApp Order',
      set_paid: false, // La orden no está pagada aún
      status: 'pending', // Estado pendiente
      currency: 'COP',
      customer_note: `Pedido realizado vía WhatsApp por ${body.customer.name} (${body.customer.phone})`,
      
      // Información de facturación
      billing: {
        first_name: body.customer.name.split(' ')[0] || body.customer.name,
        last_name: body.customer.name.split(' ').slice(1).join(' ') || '',
        email: body.customer.email && body.customer.email.includes('@') ? body.customer.email : 'sin-email@distore.com',
        phone: body.customer.phone || '',
        country: 'CO',
        city: body.customer.city || 'No especificada',
        address_1: body.customer.address || 'No especificada'
      },

      // Información de envío (igual que facturación si no se especifica)
      shipping: {
        first_name: body.customer.name.split(' ')[0] || body.customer.name,
        last_name: body.customer.name.split(' ').slice(1).join(' ') || '',
        country: 'CO',
        city: body.customer.city || 'No especificada',
        address_1: body.customer.address || 'No especificada'
      },

      // Productos de la orden
      line_items: body.items.map((item: any) => ({
        product_id: item.id,
        quantity: item.quantity,
        name: item.name,
        price: item.price,
        meta_data: [
          {
            key: 'Talla',
            value: item.size || 'No especificada'
          },
          {
            key: 'Color',
            value: item.color || 'No especificado'
          }
        ]
      })),

      // Metadatos adicionales
      meta_data: [
        {
          key: '_whatsapp_order',
          value: 'true'
        },
        {
          key: '_payment_method_selected',
          value: body.customer.paymentMethod === '1_cuota' ? '1 Cuota' : '2 Cuotas'
        },
        {
          key: '_order_source',
          value: 'nuxt_frontend'
        },
        {
          key: '_order_timestamp',
          value: new Date().toISOString()
        }
      ]
    };

    const params = new URLSearchParams({
      consumer_key: config.public.woocommerceConsumerKey,
      consumer_secret: config.public.woocommerceConsumerSecret
    });

    const url = `${config.public.woocommerceUrl}/wp-json/wc/v3/orders?${params.toString()}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`WooCommerce API Error: ${response.status} - ${errorData}`);
    }

    const order = await response.json();

    return {
      success: true,
      order: {
        id: order.id,
        order_number: order.number,
        status: order.status,
        total: order.total,
        date_created: order.date_created,
        payment_url: order.payment_url
      },
      message: 'Orden creada exitosamente en WooCommerce'
    };

  } catch (error: any) {
    console.error('Error creating WooCommerce order:', error);
    
    return {
      success: false,
      error: error.message || 'Error al crear la orden en WooCommerce',
      details: error
    };
  }
});