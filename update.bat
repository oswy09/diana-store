@echo off
REM 🚀 Script de Actualización para Windows - Di Store
REM Este script automatiza el proceso de build, commit y push

echo 🔄 Iniciando actualización de Di Store...

REM 1. Limpiar builds anteriores
echo 🧹 Limpiando builds anteriores...
if exist .nuxt rmdir /s /q .nuxt
if exist .output rmdir /s /q .output

REM 2. Instalar/actualizar dependencias
echo 📦 Instalando dependencias...
npm install

REM 3. Generar build estático para Hostinger
echo 🏗️ Generando build estático...
npm run generate

REM 4. Copiar archivos de configuración al build
echo 📋 Copiando archivos de configuración...
if exist .htaccess copy .htaccess .output\public\ >nul

REM 5. Crear nuevo archivo comprimido para Hostinger
echo 📦 Creando archivo comprimido para despliegue...
tar -czf diana-store-hostinger.tar.gz -C .output/public .

REM 6. Agregar todos los cambios a Git
echo 📝 Agregando cambios a Git...
git add .

REM 7. Verificar si hay cambios para commitear
git diff --staged --quiet
if %ERRORLEVEL% EQU 0 (
    echo ✅ No hay cambios nuevos para actualizar
) else (
    REM 8. Usar mensaje de commit automático
    set commit_message=🔄 Actualización automática - %date% %time%
    
    REM 9. Hacer commit
    echo 💾 Haciendo commit...
    git commit -m "!commit_message!"
    
    REM 10. Push a GitHub
    echo 🚀 Subiendo a GitHub...
    git push origin master
    
    echo ✅ Proyecto actualizado exitosamente!
    echo 📁 Archivos para Hostinger: diana-store-hostinger.tar.gz
    echo 🌐 Repositorio: https://github.com/oswy09/diana-store
)

echo 🎉 Proceso completado!
pause