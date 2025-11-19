# 🔧 Scripts de Automatización

## 📱 Para Windows
```bash
# Ejecuta el script de actualización
./update.bat
```

## 🐧 Para Linux/Mac
```bash
# Hacer ejecutable y correr
chmod +x update.sh
./update.sh
```

## 📋 Comandos Manuales

### Desarrollo Local
```bash
npm run dev          # Iniciar servidor de desarrollo
npm run build        # Build para producción
npm run generate     # Generar archivos estáticos
npm run preview      # Vista previa del build
```

### Git y GitHub
```bash
git status           # Ver estado de cambios
git add .            # Agregar todos los cambios
git commit -m "mensaje"  # Hacer commit
git push            # Subir a GitHub
```

### Despliegue a Hostinger
```bash
npm run generate    # Generar archivos estáticos
# Subir contenido de .output/public/ a public_html en Hostinger
```

## 🌐 Enlaces Importantes

- **Repositorio GitHub**: https://github.com/oswy09/diana-store
- **Documentación de Despliegue**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Archivos Comprimidos**: diana-store-hostinger.tar.gz

## ⚡ Flujo de Trabajo Recomendado

1. **Hacer cambios** en el código
2. **Probar localmente** con `npm run dev`
3. **Ejecutar script de actualización** (`update.bat` o `update.sh`)
4. **Descargar** `diana-store-hostinger.tar.gz`
5. **Subir a Hostinger** y extraer en `public_html`