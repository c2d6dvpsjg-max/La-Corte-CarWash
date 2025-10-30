# La Corte CarWash - Sistema de Gestión

Sistema interno de gestión para lavadero de autos. Permite llevar control de gastos, ingresos, trabajadores, servicios y trabajos realizados.

## Características

- **Dashboard** con estadísticas en tiempo real
- **Gestión de Servicios** (Básico, Detallado, Encerado, Porcelanizado)
- **Gestión de Trabajadores** y seguimiento de pagos
- **Registro de Trabajos** realizados con detalle de cliente y vehículo
- **Control de Ingresos** adicionales
- **Control de Gastos** categorizados
- **Autenticación** con NextAuth
- **Base de datos PostgreSQL** con Prisma ORM
- **Interfaz moderna** con TailwindCSS

## Tecnologías

- Next.js 14 (App Router)
- TypeScript
- Prisma ORM
- PostgreSQL
- NextAuth.js
- TailwindCSS
- date-fns

## Requisitos Previos

- Node.js 18+ instalado
- PostgreSQL instalado (o acceso a una base de datos PostgreSQL)
- npm o yarn

## Instalación Local

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd La-Corte-CarWash
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

Edita el archivo `.env` y configura tus variables:

```env
# Database
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/lavanderiadb?schema=public"

# NextAuth
NEXTAUTH_SECRET="genera-un-secreto-aleatorio-aqui"
NEXTAUTH_URL="http://localhost:3000"
```

**Para generar un NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 4. Configurar la base de datos

```bash
# Crear las tablas en la base de datos
npm run db:push

# Poblar con datos iniciales (usuario admin, servicios, etc.)
npm run db:seed
```

### 5. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Credenciales de Acceso por Defecto

**Email:** admin@lacorte.com
**Contraseña:** admin123

**¡IMPORTANTE!** Cambia estas credenciales en producción.

## Comandos Disponibles

```bash
npm run dev          # Iniciar servidor de desarrollo
npm run build        # Compilar para producción
npm run start        # Iniciar servidor de producción
npm run lint         # Ejecutar linter
npm run db:push      # Sincronizar schema de Prisma con la base de datos
npm run db:seed      # Poblar base de datos con datos iniciales
npm run db:studio    # Abrir Prisma Studio (visualizador de BD)
```

## Despliegue en Vercel

### Preparación

1. Crea una cuenta en [Vercel](https://vercel.com)
2. Crea una base de datos PostgreSQL (opciones recomendadas):
   - [Neon](https://neon.tech) - Gratis hasta 500MB
   - [Supabase](https://supabase.com) - Gratis con límites generosos
   - [Railway](https://railway.app) - Gratis con $5 de crédito mensual

### Pasos para Desplegar

1. **Conecta tu repositorio a Vercel:**
   - Ve a [vercel.com/new](https://vercel.com/new)
   - Importa tu repositorio de GitHub
   - Selecciona el framework: Next.js

2. **Configura las variables de entorno en Vercel:**
   - En la configuración del proyecto, ve a "Environment Variables"
   - Agrega las siguientes variables:
     ```
     DATABASE_URL=tu_connection_string_de_postgresql
     NEXTAUTH_SECRET=tu_secreto_aleatorio
     NEXTAUTH_URL=https://tu-dominio.vercel.app
     ```

3. **Despliega:**
   - Click en "Deploy"
   - Vercel automáticamente compilará y desplegará tu aplicación

4. **Inicializa la base de datos:**
   - Una vez desplegado, ve a la terminal de Vercel o ejecuta localmente:
   ```bash
   # Con la DATABASE_URL de producción en tu .env
   npx prisma db push
   npx prisma db seed
   ```

### Configurar Dominio Personalizado

1. Compra un dominio en [Namecheap](https://www.namecheap.com), [GoDaddy](https://www.godaddy.com), etc.
2. En Vercel, ve a tu proyecto → Settings → Domains
3. Agrega tu dominio personalizado
4. Sigue las instrucciones para configurar los registros DNS
5. Actualiza `NEXTAUTH_URL` en las variables de entorno

## Estructura del Proyecto

```
La-Corte-CarWash/
├── app/                    # App Router de Next.js
│   ├── api/               # API Routes
│   │   ├── auth/         # Autenticación
│   │   ├── services/     # CRUD Servicios
│   │   ├── workers/      # CRUD Trabajadores
│   │   ├── jobs/         # CRUD Trabajos
│   │   ├── income/       # CRUD Ingresos
│   │   └── expenses/     # CRUD Gastos
│   ├── dashboard/        # Página principal
│   ├── servicios/        # Gestión de servicios
│   ├── trabajadores/     # Gestión de trabajadores
│   ├── trabajos/         # Registro de trabajos
│   ├── ingresos/         # Gestión de ingresos
│   ├── gastos/           # Gestión de gastos
│   └── login/            # Página de login
├── components/           # Componentes reutilizables
├── lib/                  # Utilidades y configuración
├── prisma/              # Schema y migraciones
└── types/               # Tipos de TypeScript
```

## Modelos de Base de Datos

- **User**: Usuarios del sistema (autenticación)
- **Worker**: Trabajadores del lavadero
- **Service**: Servicios ofrecidos (Básico, Detallado, etc.)
- **Job**: Trabajos realizados
- **Income**: Ingresos adicionales
- **Expense**: Gastos del negocio
- **Payment**: Pagos a trabajadores

## Características Futuras Sugeridas

- [ ] Reportes en PDF
- [ ] Gráficas de tendencias con Recharts
- [ ] Sistema de citas/reservas
- [ ] Notificaciones por WhatsApp
- [ ] Múltiples usuarios con roles
- [ ] Historial de clientes frecuentes
- [ ] Sistema de membresías
- [ ] Inventario de productos

## Soporte

Si tienes problemas o preguntas:

1. Revisa que todas las variables de entorno estén configuradas
2. Verifica que la base de datos esté accesible
3. Revisa los logs en la consola del navegador y terminal

## Licencia

Este proyecto es de uso privado para La Corte CarWash.

---

Desarrollado con Next.js + Prisma + PostgreSQL
