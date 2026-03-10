# 🏨 Hotel Atenas SyS - Property Management System (PMS)

¡Bienvenido al repositorio del Sistema de Gestión (PMS) del Hotel Atenas! Este documento tiene como objetivo proporcionar todo el contexto necesario, detallar el core del negocio, explicar la arquitectura empleada y detallar los diferentes módulos, para que cualquier nuevo desarrollador pueda integrarse rápidamente al equipo.

---

## 🏢 Core del Negocio

**Hotel Atenas SyS** es un sistema integral de gestión hotelera diseñado para manejar toda la operativa del hotel de inicio a fin. El core se centra en la administración del inventario de habitaciones, control de reservaciones, registro de estadías (check-in / check-out), facturación y punto de venta (POS) de productos adicionales. 

El modelo de negocio está construido para soportar:
- **Tarifas Dinámicas**: Diferentes modos de estadía (por horas, pernocte) y categorías de habitación.
- **Venta de Servicios y Productos**: Un minisistema de POS para vender snacks, bebidas o servicios a los huéspedes durante su estadía.
- **Multimoneda y Diferentes Métodos de Pago**: Registro detallado de la caja del hotel.

---

## 🧩 Módulos del Sistema

El sistema está dividido lógicamente en los siguientes dominios (reflejados tanto en la base de datos como en la estructura del backend):

1. **🧑‍💻 Usuarios y Autenticación (Auth / Users)**
   - Gestión de empleados del hotel con roles definidos (`ADMIN`, `RECEPTIONIST`, `HOUSEKEEPING`).
   - Autenticación segura usando JWT (Access Tokens y Refresh Tokens en Redis).

2. **🏨 Infraestructura (Rooms / Floors)**
   - Control del inventario físico: Pisos (`Floors`) y Habitaciones (`Rooms`).
   - Seguimiento del estado de las habitaciones (`AVAILABLE`, `OCCUPIED`, `CLEANING`, `MAINTENANCE`) y auditoría (Logs de cambios de estados).

3. **🧳 Huéspedes (Guests)**
   - Registro de perfiles de clientes, incluyendo documentos de identidad (DNI, Pasaporte) y datos de facturación para seguimiento e historial.

4. **💰 Tarifas y Paquetes (Rates / Packages)**
   - **Rate Rules**: Motor de reglas para calcular costos dinámicamente según la duración (horas o noche completa), tipo de habitación y rangos de fecha.
   - **Packages**: Opciones de promoción (ej. paquetes románticos que incluyen habitación + productos).

5. **🛒 Punto de Venta e Inventario (POS)**
   - Control de inventario de `Products` (Bebidas, Snacks).
   - `Sales`: Ventas anexadas a la cuenta (Estadía) del huésped o ventas canceladas en efectivo directamente.

6. **📅 Reservaciones y Estadías (Reservations / Stays)**
   - **Reservations**: Control de disponibilidad futura, estados (Pendiente, Confirmada, Check-in, No-Show).
   - **Stays**: La operación principal. Controla el momento exacto en que un huésped entra (Check-in) y sale (Check-out), sus cargos acumulados y su asignación de habitación.

7. **💳 Pagos y Caja (Payments)**
   - Registro minucioso de todo el flujo de ingreso de dinero (`CASH`, `YAPE`, `PLIN`, `CARD`, `TRANSFER`) asociado a las estadías o punto de venta.

---

## 🏗 Arquitectura y Stack Tecnológico

El proyecto es un **Monorepo** gestionado con `pnpm workspaces`. Se divide en dos piezas fundamentales: `client/` y `server/`.

### 💻 Stack Frontend (`client/`)
- **Framework:** Next.js (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS / CSS Modules
- **Estado Global:** Redux Toolkit (`redux-store/`)
- **Organización:** Las páginas se ubican en `src/app`, utilizando componentes reutilizables (`src/components`), vistas modulares (`src/views`) y servicios para conexión a la API (`src/services`).

### ⚙️ Stack Backend (`server/`)
- **Framework:** NestJS
- **Lenguaje:** TypeScript
- **Base de Datos:** PostgreSQL 17 (gestionado e iterado con Prisma ORM)
- **Caché y Sesiones:** Redis
- **Containerización:** Docker & Docker Compose (para los servicios locales como DB y Redis).

### 🏛 Clean Architecture (Arquitectura Limpia)
El backend está estructurado rigurosamente bajo los principios de Clean Architecture y Domain-Driven Design (DDD). Cada módulo dentro de `server/src/modules/<nombre_modulo>/` cuenta con:
- `domain/`: Entidades de negocio, interfaces de repositorios, y reglas core.
- `application/`: Casos de uso e interactores, y los DTOs de comunicación.
- `infrastructure/`: Implementaciones reales de base de datos (repositorios de Prisma), servicios de terceros, etc.
- `interfaces/`: Controladores HTTP de NestJS orientados a REST.

Esto asegura que las reglas de negocio (Dominio) no dependan de la web, ni de la base de datos (Infraestructura).

---

## 📂 Estructura del Repositorio

```text
HotelAtenasSyS/
├── client/                     # Aplicación Frontend (Next.js)
│   ├── src/app/                # Rutas y páginas de Next.js
│   ├── src/components/         # Componentes UI reutilizables
│   ├── src/views/              # Componentes contenedores o vistas complejas de cada dominio
│   ├── src/redux-store/        # Manejo del estado global de la app
│   └── src/services/           # Cliente HTTP y consumo de la API REST
│
├── server/                     # Aplicación Backend (NestJS)
│   ├── prisma/                 # Schema de la BD (schema.prisma) y seeds
│   ├── src/modules/            # Módulos del sistema usando Clean Architecture
│   ├── src/shared/             # Decoradores (@Auth, @CurrentUser), Guards y utilerias globales
│   └── .env.example            # Variables de entorno
│
├── package.json                # Scripts y configuración raíz
└── pnpm-workspace.yaml         # Configuración del monorepo
```

---

## 🚀 Guía de Inicio Rápido

Sigue estos pasos para levantar el entorno de desarrollo en tu máquina:

### 1. Prerrequisitos
- Node.js (v18 o v20+ recomendado)
- Docker Desktop y Docker Compose (para levantar la Base de Datos y Redis)
- pnpm instalado globalmente (`npm install -g pnpm`)

### 2. Instalación
En la raíz del proyecto, instala las dependencias de todo el monorepo:
```bash
pnpm install
```

### 3. Configuración de Variables de Entorno
Copia los archivos de ejemplo para tener tus `.env` locales:
- Entrar a la carpeta `server/` y crear un archivo `.env` basado en `.env.example`.
- Asegurar de agregar puertos disponibles o variables base (ej. `DATABASE_URL`, `JWT_SECRET`, credenciales locales).
- Hacer lo propio en la carpeta `client/` si es necesario (`.env.local`).

### 4. Base de Datos Local
Levanta la BD PostgreSQL y Redis con Docker y aplica las migraciones:
```bash
# Levantar contenedores Docker
cd server
docker-compose up -d

# Empujar los esquemas a la base de datos y generar al cliente de Prisma
pnpm prisma:generate
pnpm db:setup
```
*💡 Puedes entrar a la interfaz visual de la DB usando: `pnpm --filter server prisma:studio`*

### 5. Iniciar la Aplicación en Modo Desarrollo
Desde la raíz del monorepo, puedes abrir dos terminales:

**Terminal 1 (Backend):**
```bash
pnpm dev:server
```
*(El backend inicia en watch-mode, por defecto en el puerto 5100. Ver API Docs: http://localhost:5100/api/docs)*

**Terminal 2 (Frontend):**
```bash
pnpm dev:client
```
*(El servidor de Next.js arrancará en localhost:3000)*

---

## 📜 Flujo de Trabajo y Buenas Prácticas

1. **Inyección de Dependencias (DI):** En el backend, usa TDD y abstrae con interfaces. En la carpeta `infrastructure` van las implementaciones verdaderas. Para inyectarlas, ocupa los custom tokens de NestJS (`@Inject('TOKEN_NAME')`).
2. **Seguridad:** Utiliza los decoradores comunes en Nest (`@Auth()`, y `@Roles()`). Estos fusionan la autenticación y el control de acceso en una sola llamada.
3. **Estado del Frontend:** Para interacciones locales usa los `hooks` de React o vistas simples, reserva `redux-store` para estados compartidos globales o complejos de la UI.

¡Bienvenido al equipo de **Hotel Atenas SyS**! 🚀 Todo listo para empezar a programar.
