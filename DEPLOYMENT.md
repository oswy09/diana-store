# 📋 Guía de Despliegue en Hostinger

## 🚀 Pasos para Subir a Hostinger

### 1. Preparar Archivos

Los archivos que necesitas subir están en la carpeta `.output/public/`:

```bash
.output/public/
├── _nuxt/          # Archivos de JavaScript y CSS
├── admin/          # Página de administración
├── .htaccess       # Configuración de servidor
├── 200.html        # Página de respaldo
├── 404.html        # Página de error 404
├── favicon.ico     # Icono del sitio
├── index.html      # Página principal
├── index.php       # Archivo de respaldo PHP
└── robots.txt      # Archivo para buscadores
```

### 2. Acceder a Hostinger

1. **Inicia sesión** en tu panel de Hostinger
2. Ve a **"Administrador de archivos"** o usa **"File Manager"**
3. Navega a la carpeta **`public_html`**

### 3. Limpiar Carpeta Actual (si es necesario)

Si hay archivos existentes en `public_html`:
- Selecciona todos los archivos
- Elimínalos (excepto `.htaccess` si quieres conservar configuraciones previas)

### 4. Subir Archivos

**Opción A: Usando File Manager**
1. En `public_html`, haz clic en **"Subir"** o **"Upload"**
2. Arrastra todos los archivos de `.output/public/` 
3. Espera a que se complete la subida

**Opción B: Usando FTP**
```bash
# Usa un cliente FTP como FileZilla
Host: tu-dominio.com
Usuario: tu-usuario-ftp
Contraseña: tu-contraseña-ftp
Puerto: 21
```

### 5. Configurar Variables de Entorno

Crea un archivo `.env` en `public_html` con:

```env
# WooCommerce Configuration
NUXT_PUBLIC_WOOCOMMERCE_URL=https://tu-tienda-wordpress.com
NUXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY=ck_tu_consumer_key
NUXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET=cs_tu_consumer_secret

# WhatsApp Configuration
NUXT_PUBLIC_WHATSAPP_NUMBER=573172613957
```

### 6. Verificar el Sitio

1. Ve a tu dominio: `https://tu-sitio.com`
2. Verifica que:
   - ✅ La página principal carga correctamente
   - ✅ Los productos aparecen (si tienes WooCommerce configurado)
   - ✅ El carrito funciona
   - ✅ Los enlaces de WhatsApp funcionan

## 🔧 Solución de Problemas Comunes

### Error 403 - Forbidden

**Causa**: Permisos de archivo incorrectos

**Solución**:
1. Selecciona todos los archivos en `public_html`
2. Haz clic derecho → **"Permisos"** o **"Permissions"**
3. Establece permisos:
   - **Archivos**: 644
   - **Carpetas**: 755

### Página en Blanco

**Causa**: Archivo index no encontrado

**Solución**:
1. Verifica que `index.html` esté en la raíz de `public_html`
2. Si persiste, renombra `index.html` a `index.php`

### CSS/JS No Cargan

**Causa**: Problema de rutas o HTTPS

**Solución**:
1. Verifica que la carpeta `_nuxt` esté subida correctamente
2. Asegúrate de que el SSL esté activo en Hostinger
3. Forza HTTPS en el panel de Hostinger

### APIs No Funcionan

**Causa**: Variables de entorno no configuradas

**Solución**:
1. Verifica que el archivo `.env` esté en `public_html`
2. Contacta soporte de Hostinger si las variables no se leen

## 📞 URLs Importantes

- **Sitio web**: https://tu-dominio.com
- **Panel admin**: https://tu-dominio.com/admin
- **File Manager**: Panel de Hostinger → Administrador de archivos

## 🔄 Actualización Futura

Para actualizar el sitio:

1. **En tu computadora**:
   ```bash
   npm run generate
   ```

2. **En Hostinger**:
   - Elimina archivos actuales (excepto `.env`)
   - Sube nuevos archivos de `.output/public/`

## 💡 Consejos Adicionales

- **Backup**: Siempre haz backup antes de actualizar
- **Cache**: Limpia el cache del navegador si no ves cambios
- **SSL**: Asegúrate de que SSL esté activo para HTTPS
- **Dominio**: Configura el dominio principal en Hostinger

---

**¿Necesitas ayuda?** 
- Contacta soporte de Hostinger
- Revisa logs en Panel → Error Logs
- Verifica que PHP esté actualizado (7.4+)