# Inicio Rápido - La Corte CarWash Mobile

Guía rápida para poner en marcha la aplicación móvil en menos de 5 minutos.

## Paso 1: Asegúrate de tener el backend corriendo

La app móvil necesita conectarse a tu servidor backend. Asegúrate de que esté corriendo:

```bash
# En el directorio raíz del proyecto
npm run dev
```

El servidor debe estar corriendo en `http://localhost:3000`

## Paso 2: Instala las dependencias

```bash
cd mobile-app
npm install
```

## Paso 3: Configura la URL de tu API

Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

Abre `.env` y configura según tu situación:

**Opción A: Prueba en tu computadora (iOS Simulator / Android Emulator)**
```env
API_URL=http://localhost:3000
```

**Opción B: Prueba en dispositivo físico**
```env
# Reemplaza X.X con tu IP local (ver abajo cómo obtenerla)
API_URL=http://192.168.1.X:3000
```

**Opción C: Servidor en producción**
```env
API_URL=https://tu-dominio.vercel.app
```

### Cómo obtener tu IP local:

**Windows:**
```bash
ipconfig
# Busca "Dirección IPv4" en la sección de tu adaptador WiFi
```

**Mac/Linux:**
```bash
ifconfig
# Busca tu IP (generalmente empieza con 192.168)
```

## Paso 4: Inicia la aplicación

```bash
npm start
```

Esto abrirá Expo DevTools en tu navegador.

## Paso 5: Abre la app en tu dispositivo

### Opción A: Dispositivo físico (Recomendado)

1. Instala **Expo Go** en tu celular:
   - [iPhone - App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Android - Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Escanea el código QR que aparece en la terminal:
   - **iPhone:** Abre la cámara nativa
   - **Android:** Abre Expo Go y usa el escáner

**IMPORTANTE:** Tu celular y computadora deben estar en la misma red WiFi.

### Opción B: Emulador (Solo para desarrollo)

**iOS Simulator (solo Mac):**
```bash
npm run ios
```

**Android Emulator:**
```bash
npm run android
```

Asegúrate de tener un emulador corriendo antes.

## Paso 6: Inicia sesión

Usa las credenciales por defecto:

- **Email:** admin@lacorte.com
- **Contraseña:** admin123

¡Listo! Ya puedes usar la app.

## Solución de Problemas Comunes

### "Network request failed"

**Problema:** La app no puede conectarse al servidor.

**Solución:**
1. Verifica que el backend esté corriendo (`npm run dev` en la raíz)
2. Si usas dispositivo físico, usa tu IP local, NO `localhost`
3. Verifica que ambos dispositivos estén en la misma red WiFi
4. Desactiva VPNs o firewalls que puedan bloquear la conexión

### "Unable to connect to development server"

**Problema:** Expo no puede conectarse.

**Solución:**
1. Limpia la caché: `npx expo start -c`
2. Verifica tu firewall
3. Reinicia el servidor: Ctrl+C y luego `npm start`

### La app se ve bien pero no carga datos

**Problema:** La UI funciona pero no hay datos.

**Solución:**
1. Verifica la URL en `.env`
2. Revisa los logs del servidor backend
3. Asegúrate de que la base de datos tenga datos (corre `npm run db:seed` en la raíz)

### Errores de instalación

**Problema:** Errores al correr `npm install`

**Solución:**
```bash
# Elimina node_modules y reinstala
rm -rf node_modules
npm install
```

## Próximos Pasos

- Lee el [README completo](README.md) para más detalles
- Personaliza los colores y el logo
- Compila para producción cuando estés listo

## Características Disponibles

✅ Dashboard con estadísticas en tiempo real
✅ Gestión de trabajos (crear, ver, eliminar)
✅ Control de finanzas (ingresos y gastos)
✅ Administración de trabajadores
✅ Perfil de usuario
✅ Pull-to-refresh en todas las pantallas

## Necesitas Ayuda?

Revisa la documentación completa en `README.md` o el README del proyecto principal.

---

¡Feliz desarrollo! 🚀
