#!/bin/bash

# 🚀 Script de Actualización Automática para Di Store
# Este script automatiza el proceso de build, commit y push

echo "🔄 Iniciando actualización de Di Store..."

# 1. Limpiar builds anteriores
echo "🧹 Limpiando builds anteriores..."
rm -rf .nuxt .output

# 2. Instalar/actualizar dependencias
echo "📦 Instalando dependencias..."
npm install

# 3. Generar build estático para Hostinger
echo "🏗️ Generando build estático..."
npm run generate

# 4. Copiar archivos de configuración al build
echo "📋 Copiando archivos de configuración..."
cp .htaccess .output/public/ 2>/dev/null || echo "ℹ️ .htaccess no encontrado"

# 5. Crear nuevo archivo comprimido para Hostinger
echo "📦 Creando archivo comprimido para despliegue..."
tar -czf diana-store-hostinger.tar.gz -C .output/public .

# 6. Agregar todos los cambios a Git
echo "📝 Agregando cambios a Git..."
git add .

# 7. Verificar si hay cambios para commitear
if git diff --staged --quiet; then
    echo "✅ No hay cambios nuevos para actualizar"
else
    # 8. Pedir mensaje de commit
    echo "💬 Ingresa un mensaje para el commit (o presiona Enter para usar mensaje automático):"
    read commit_message
    
    if [ -z "$commit_message" ]; then
        commit_message="🔄 Actualización automática - $(date '+%Y-%m-%d %H:%M:%S')"
    fi
    
    # 9. Hacer commit
    echo "💾 Haciendo commit..."
    git commit -m "$commit_message"
    
    # 10. Push a GitHub
    echo "🚀 Subiendo a GitHub..."
    git push origin master
    
    echo "✅ Proyecto actualizado exitosamente!"
    echo "📁 Archivos para Hostinger: diana-store-hostinger.tar.gz"
    echo "🌐 Repositorio: https://github.com/oswy09/diana-store"
fi

echo "🎉 Proceso completado!"