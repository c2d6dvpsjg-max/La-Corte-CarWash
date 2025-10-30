# La Corte CarWash - Aplicación Móvil

Aplicación móvil para iOS y Android construida con React Native y Expo para gestionar tu lavadero La Corte CarWash.

## Características

- **Autenticación segura** con el backend existente
- **Dashboard interactivo** con estadísticas en tiempo real
- **Gestión de Trabajos** - Registra servicios realizados con detalles de cliente y vehículo
- **Control de Finanzas** - Administra ingresos y gastos del negocio
- **Gestión de Trabajadores** - Control completo de empleados
- **Interfaz moderna** con Material Design (React Native Paper)
- **Sincronización automática** con el servidor
- **Soporte offline** básico con caché local

## Tecnologías

- **React Native** - Framework multiplataforma
- **Expo** - Herramientas de desarrollo y compilación
- **TypeScript** - Tipado estático
- **React Native Paper** - Componentes UI Material Design
- **Expo Router** - Navegación basada en archivos
- **Axios** - Cliente HTTP
- **date-fns** - Manejo de fechas

## Requisitos Previos

- Node.js 18+ instalado
- npm o yarn
- Expo CLI (se instala automáticamente)
- Para desarrollo:
  - iOS: Mac con Xcode o simulador iOS
  - Android: Android Studio o emulador Android
  - Dispositivo físico con la app Expo Go

## Instalación

### 1. Navegar al directorio de la app móvil

```bash
cd mobile-app
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

Edita el archivo `.env` y configura la URL de tu API:

```env
# Para desarrollo local en tu computadora
API_URL=http://localhost:3000

# Para desarrollo en dispositivo físico (usa tu IP local)
API_URL=http://192.168.1.X:3000

# Para producción (usa tu dominio de Vercel o servidor)
API_URL=https://tu-dominio.vercel.app
```

**IMPORTANTE:** Para obtener tu IP local:
- **Windows:** Ejecuta `ipconfig` en CMD y busca "Dirección IPv4"
- **Mac/Linux:** Ejecuta `ifconfig` o `ip addr` y busca tu IP local (generalmente 192.168.x.x)

## Ejecutar la Aplicación

### Iniciar el servidor de desarrollo

```bash
npm start
```

Esto abrirá Expo DevTools en tu navegador.

### Ejecutar en dispositivo físico

1. Instala **Expo Go** en tu dispositivo:
   - [iOS - App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Android - Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Escanea el código QR que aparece en la terminal o en Expo DevTools:
   - **iOS:** Abre la cámara y escanea el QR
   - **Android:** Abre Expo Go y escanea el QR

**Nota:** Tu computadora y dispositivo deben estar en la misma red WiFi.

### Ejecutar en emulador/simulador

#### iOS Simulator (solo Mac)

```bash
npm run ios
```

#### Android Emulator

```bash
npm run android
```

Asegúrate de tener un emulador Android ejecutándose antes de correr el comando.

## Credenciales de Acceso

Usa las mismas credenciales que en la versión web:

**Email:** admin@lacorte.com
**Contraseña:** admin123

**¡IMPORTANTE!** Cambia estas credenciales en producción.

## Estructura del Proyecto

```
mobile-app/
├── app/                      # Rutas de la aplicación (Expo Router)
│   ├── (tabs)/              # Navegación por pestañas
│   │   ├── dashboard.tsx    # Dashboard con estadísticas
│   │   ├── trabajos.tsx     # Gestión de trabajos
│   │   ├── finanzas.tsx     # Ingresos y gastos
│   │   ├── trabajadores.tsx # Gestión de empleados
│   │   └── perfil.tsx       # Perfil de usuario
│   ├── login.tsx            # Pantalla de login
│   ├── index.tsx            # Pantalla inicial (redirección)
│   └── _layout.tsx          # Layout principal
├── src/
│   ├── components/          # Componentes reutilizables
│   ├── contexts/            # Contextos de React (Auth)
│   ├── services/            # Servicios API
│   ├── types/               # Tipos TypeScript
│   └── utils/               # Utilidades
├── assets/                  # Imágenes y recursos
├── app.json                 # Configuración de Expo
└── package.json             # Dependencias
```

## Funcionalidades por Pantalla

### Dashboard
- Estadísticas generales (ingresos, gastos, ganancia)
- Trabajos realizados hoy
- Trabajadores activos
- Estadísticas del mes actual
- Pull-to-refresh para actualizar datos

### Trabajos
- Lista de todos los trabajos realizados
- Crear nuevo trabajo con:
  - Selección de servicio
  - Asignación de trabajador
  - Datos del cliente
  - Información del vehículo
  - Precio personalizable
- Eliminar trabajos
- Ver resumen del día

### Finanzas
- Pestaña de Ingresos y Gastos
- Agregar nuevos ingresos/gastos
- Categorización automática
- Total acumulado
- Eliminar registros
- Filtrado por tipo

### Trabajadores
- Lista de trabajadores activos e inactivos
- Crear/editar trabajadores
- Gestionar estado (activo/inactivo)
- Ver información de contacto y salario
- Eliminar trabajadores

### Perfil
- Información del usuario
- Cerrar sesión

## Compilar para Producción

### Crear build de desarrollo

```bash
# Android
eas build --platform android --profile development

# iOS
eas build --platform ios --profile development
```

### Crear build de producción

Primero, instala EAS CLI:

```bash
npm install -g eas-cli
```

Inicia sesión en Expo:

```bash
eas login
```

Configura tu proyecto:

```bash
eas build:configure
```

Crea el build:

```bash
# Para Android (APK o AAB)
eas build --platform android

# Para iOS
eas build --platform ios
```

### Publicar en tiendas

#### Google Play Store (Android)
1. Crea una cuenta de desarrollador en Google Play Console
2. Genera un build AAB: `eas build --platform android --profile production`
3. Sube el archivo AAB a Google Play Console
4. Completa la información de la app y publica

#### Apple App Store (iOS)
1. Crea una cuenta de desarrollador de Apple
2. Genera un build: `eas build --platform ios --profile production`
3. Sube usando EAS Submit: `eas submit --platform ios`
4. Completa la información en App Store Connect y publica

## Solución de Problemas

### No puedo conectarme al servidor

1. Verifica que el servidor backend esté corriendo (`npm run dev` en el directorio raíz)
2. Verifica que la URL en `.env` sea correcta
3. Si usas dispositivo físico, asegúrate de usar tu IP local, no `localhost`
4. Verifica que ambos dispositivos estén en la misma red

### Error "Network request failed"

- Verifica tu conexión a internet
- Verifica que el servidor backend esté accesible
- Revisa los logs del servidor para ver si hay errores

### La app se cierra inesperadamente

- Revisa los logs en Expo: `npx expo start`
- Verifica que todas las dependencias estén instaladas: `npm install`
- Limpia la caché: `npx expo start -c`

### Problemas con date-fns o locale español

Si tienes errores con las fechas en español, asegúrate de que date-fns esté instalado correctamente:

```bash
npm install date-fns@latest
```

## Personalización

### Cambiar colores

Edita los colores en los archivos de las pantallas:
- Color principal: `#1e40af` (azul)
- Color de éxito: `#10b981` (verde)
- Color de error: `#ef4444` (rojo)

### Cambiar logo

Reemplaza los archivos en `assets/`:
- `icon.png` - Icono de la app (1024x1024)
- `splash.png` - Pantalla de inicio (1242x2436)
- `adaptive-icon.png` - Icono adaptable Android (1024x1024)

### Modificar información de la app

Edita `app.json`:
```json
{
  "expo": {
    "name": "La Corte CarWash",
    "slug": "la-corte-carwash",
    "version": "1.0.0"
  }
}
```

## API Endpoints Utilizados

La app consume los siguientes endpoints del backend:

- `POST /api/auth/mobile` - Autenticación
- `GET /api/dashboard/stats` - Estadísticas del dashboard
- `GET /api/workers` - Listar trabajadores
- `POST /api/workers` - Crear trabajador
- `PUT /api/workers/:id` - Actualizar trabajador
- `DELETE /api/workers/:id` - Eliminar trabajador
- `GET /api/services` - Listar servicios
- `GET /api/jobs` - Listar trabajos
- `POST /api/jobs` - Crear trabajo
- `DELETE /api/jobs/:id` - Eliminar trabajo
- `GET /api/income` - Listar ingresos
- `POST /api/income` - Crear ingreso
- `DELETE /api/income/:id` - Eliminar ingreso
- `GET /api/expenses` - Listar gastos
- `POST /api/expenses` - Crear gasto
- `DELETE /api/expenses/:id` - Eliminar gasto

## Seguridad

- Las credenciales se almacenan de forma segura usando AsyncStorage
- El token de autenticación se envía en cada petición
- **Importante:** En producción, implementa JWT para mayor seguridad
- No almacenes información sensible en el código

## Actualizaciones OTA (Over-The-Air)

Expo permite actualizar la app sin pasar por las tiendas:

```bash
# Publicar actualización
eas update --branch production --message "Descripción del cambio"
```

Los usuarios recibirán la actualización automáticamente al abrir la app.

## Soporte y Contribuciones

Para reportar problemas o sugerir mejoras, contacta al equipo de desarrollo.

## Licencia

Este proyecto es de uso privado para La Corte CarWash.

---

Desarrollado con React Native + Expo para La Corte CarWash
