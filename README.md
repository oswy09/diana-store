# Di Store - Tienda de Ropa Headless

Aplicación e-commerce headless con WordPress/WooCommerce como backend y Nuxt 3 como frontend. Los clientes pueden seleccionar productos, agregarlos al carrito y enviar cotizaciones directamente por WhatsApp.

## Características

- **Frontend con Nuxt 3 + Vue 3**: Interfaz moderna y responsive
- **Backend WooCommerce**: Gestión de productos desde WordPress
- **Carrito de compras**: Persistente con localStorage
- **Cotizaciones por WhatsApp**: Envío directo de pedidos
- **Panel administrativo**: Visualización y gestión de cotizaciones
- **Base de datos Supabase**: Almacenamiento de cotizaciones
- **Diseño responsivo**: Optimizado para móvil y escritorio

## Configuración

### 1. Variables de entorno

Edita el archivo `.env` con tus credenciales:

```env
# WordPress WooCommerce
NUXT_PUBLIC_WOOCOMMERCE_URL=https://tu-sitio-wordpress.com
NUXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY=tu_consumer_key
NUXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET=tu_consumer_secret

# WhatsApp
NUXT_PUBLIC_WHATSAPP_NUMBER=573001234567
```

### 2. Configurar WooCommerce

1. Instala WooCommerce en tu WordPress
2. Ve a WooCommerce > Settings > Advanced > REST API
3. Crea una nueva API Key con permisos de lectura
4. Copia el Consumer Key y Consumer Secret al archivo `.env`

### 3. Configurar productos en WooCommerce

Para que los productos aparezcan correctamente:

- **Nombre del producto**: Título visible en la tienda
- **Precio**: Precio en pesos colombianos
- **Imágenes**: Al menos una imagen del producto
- **Descripción corta**: Breve descripción del producto
- **Atributos**:
  - Talla/Size: S, M, L, XL
  - Color: Con nombres descriptivos

### 4. Instalar dependencias

```bash
npm install
```

### 5. Iniciar desarrollo

```bash
npm run dev
```

La tienda estará disponible en `http://localhost:3000`

## Estructura del proyecto

```
project/
├── components/
│   ├── ProductCard.vue      # Tarjeta de producto
│   ├── CartSidebar.vue      # Carrito lateral
│   └── CheckoutModal.vue    # Modal de checkout
├── composables/
│   ├── useProducts.ts       # Gestión de productos
│   └── useQuotations.ts     # Gestión de cotizaciones
├── pages/
│   ├── index.vue            # Tienda principal
│   └── admin.vue            # Panel administrativo
├── stores/
│   └── cart.ts              # Estado del carrito
├── server/
│   └── api/
│       └── woocommerce/     # APIs de WooCommerce
└── utils/
    └── supabase.ts          # Cliente Supabase
```

## Rutas

- `/` - Tienda principal
- `/admin` - Panel administrativo (requiere autenticación)

## Panel Administrativo

Para acceder al panel administrativo:

1. Crea un usuario en Supabase Authentication
2. Accede a `/admin`
3. Inicia sesión con tus credenciales
4. Visualiza y gestiona las cotizaciones recibidas

## Funcionalidades principales

### Tienda

- Visualización de productos desde WooCommerce
- Filtro por categorías (Todos, Dama, Hombre)
- Selección de tallas y colores
- Agregar productos al carrito
- Carrito persistente entre sesiones

### Checkout

- Formulario de datos del cliente
- Selección de forma de pago (1 cuota o 2 cuotas)
- Resumen del pedido
- Envío automático por WhatsApp

### Panel Admin

- Lista de todas las cotizaciones
- Filtro por estado (Pendiente, Enviada, Completada)
- Actualización de estado de cotizaciones
- Botón para contactar cliente por WhatsApp
- Visualización detallada de productos

## Datos necesarios desde WooCommerce

La aplicación consume los siguientes datos de WooCommerce:

- **Productos**: id, name, price, images, short_description
- **Atributos**: name, options (para tallas y colores)
- **Categorías**: id, name (para filtros)

## Build para producción

```bash
npm run build
npm run preview
```

## Notas importantes

- Asegúrate de que tu sitio WordPress tenga CORS habilitado
- Las credenciales de WooCommerce deben tener al menos permisos de lectura
- El número de WhatsApp debe incluir el código de país (ej: 573001234567)
- Las cotizaciones se almacenan en Supabase para su gestión
