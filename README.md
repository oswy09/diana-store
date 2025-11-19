# 🛍️ Di Store

Una tienda en línea moderna desarrollada con Nuxt.js 3 que se integra con WooCommerce y permite realizar pedidos directamente a través de WhatsApp.

## ✨ Características

- **🛒 Carrito de Compras**: Sistema completo de carrito con persistencia local
- **📱 Pedidos por WhatsApp**: Envío directo de cotizaciones al WhatsApp de la tienda
- **🎯 Categorías Dinámicas**: Menú que se actualiza automáticamente desde WooCommerce
- **📦 Integración WooCommerce**: Productos y categorías cargados desde tu tienda WooCommerce
- **🎨 Diseño Responsivo**: Interfaz moderna con Tailwind CSS
- **⚡ Alto Rendimiento**: Construido con Nuxt.js 3 y Vite

## 🚀 Tecnologías Utilizadas

- **Frontend**: Nuxt.js 3, Vue 3, Tailwind CSS
- **Backend**: Nitro Server, WooCommerce REST API
- **Estado**: Pinia Store Management
- **Base de Datos**: Supabase (configurado pero no usado actualmente)
- **Mensajería**: WhatsApp Business API

## 📦 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/oswy09/diana-store.git
   cd diana-store
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crea un archivo `.env` en la raíz del proyecto:
   ```env
   # WooCommerce Configuration
   WOOCOMMERCE_URL=https://tu-tienda.com
   WOOCOMMERCE_CONSUMER_KEY=ck_tu_consumer_key
   WOOCOMMERCE_CONSUMER_SECRET=cs_tu_consumer_secret
   
   # WhatsApp Configuration
   NUXT_PUBLIC_WHATSAPP_NUMBER=573172613957
   
   # Supabase Configuration (opcional)
   SUPABASE_URL=tu_supabase_url
   SUPABASE_ANON_KEY=tu_supabase_anon_key
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

## ⚙️ Configuración de WooCommerce

1. **Habilitar API REST**:
   - Ve a WooCommerce > Ajustes > Avanzado > API REST
   - Habilita la API REST

2. **Crear claves de API**:
   - Ve a WooCommerce > Ajustes > Avanzado > Claves API REST
   - Crea una nueva clave con permisos de "Lectura"
   - Copia el Consumer Key y Consumer Secret al archivo `.env`

3. **Configurar productos y categorías**:
   - Crea tus productos en WooCommerce
   - Organiza en categorías (evita usar "Sin categorizar")

## 📱 Configuración de WhatsApp

1. **Número de WhatsApp**:
   - Actualiza `NUXT_PUBLIC_WHATSAPP_NUMBER` con tu número
   - Formato: Código país + número (ejemplo: 573172613957)

2. **Mensaje personalizado**:
   - Los mensajes se formatean automáticamente
   - Incluyen datos del cliente y productos seleccionados

## 🏗️ Estructura del Proyecto

```
project/
├── components/          # Componentes Vue reutilizables
│   ├── CartSidebar.vue
│   ├── CheckoutModal.vue
│   ├── Footer.vue
│   └── ProductCard.vue
├── composables/         # Lógica de negocio reutilizable
│   ├── useProducts.ts
│   └── useQuotations.ts
├── pages/              # Rutas de la aplicación
│   ├── admin.vue
│   └── index.vue
├── server/             # API server-side
│   └── api/
│       └── woocommerce/
├── stores/             # Estado global con Pinia
│   └── cart.ts
└── utils/              # Utilidades
    └── supabase.ts
```

## 🎨 Personalización

### Cambiar Nombre de la Tienda
```vue
<!-- En pages/index.vue -->
<h1 class="text-4xl font-bold tracking-wider">TU NOMBRE</h1>
```

### Modificar Colores
```css
/* Los colores principales están en Tailwind classes */
/* Busca: bg-indigo-600, bg-black, text-white, etc. */
```

### Agregar Nuevas Categorías
- Las categorías se cargan automáticamente desde WooCommerce
- Solo crea nuevas categorías en tu panel de WooCommerce

## 🚀 Despliegue

### Vercel (Recomendado)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Sube la carpeta .output/public
```

### Servidor VPS
```bash
npm run build
pm2 start ecosystem.config.js
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - mira el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

- **WhatsApp**: +57 317 261 3957
- **Issues**: [GitHub Issues](https://github.com/oswy09/diana-store/issues)

---

### 🎯 Próximas Funcionalidades

- [ ] Panel de administración completo
- [ ] Integración con pagos en línea
- [ ] Sistema de inventario en tiempo real
- [ ] Notificaciones push
- [ ] Multi-idioma
- [ ] Sistema de descuentos

---

**Hecho con ❤️ para pequeños emprendedores que quieren vender online de manera simple y efectiva.**

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
