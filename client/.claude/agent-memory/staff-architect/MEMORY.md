# Staff Architect Memory — Hotel Atenas PMS

## Client Frontend (Next.js 15)

### Tech Stack
- Next.js 15 + App Router + Turbopack (`next dev --turbopack`)
- Tailwind CSS v4 — NO tailwind.config.ts. Config is CSS-only via `@theme {}` in `globals.css`. PostCSS plugin is `@tailwindcss/postcss` (not `tailwindcss`).
- shadcn/ui — installed MANUALLY (no CLI). Components live in `src/components/ui/`. Sheet is built on `@radix-ui/react-dialog` (there is no `@radix-ui/react-sheet` package).
- Redux Toolkit + redux-persist (auth slice only, whitelist: `user`, `isAuthenticated`). Persist key: `persist:auth`.
- TanStack React Query v5
- Axios with refresh interceptor (`src/lib/axios.ts`)
- React Hook Form + Zod
- Sonner for toasts

### Directory Structure
```
client/src/
  app/
    globals.css              # Tailwind v4 @theme{} variables + @layer base
    layout.tsx               # Root layout, Inter font, Providers wrapper
    (auth)/layout.tsx        # Blank layout for auth pages
    (auth)/login/page.tsx
    (dashboard)/layout.tsx   # Sidebar + Navbar layout
    (dashboard)/page.tsx     # Redirects to /dashboard
    (dashboard)/dashboard/page.tsx
  components/
    providers.tsx            # QueryProvider > StoreProvider > SessionValidator > Toaster
    query-provider.tsx
    session-validator.tsx
    ui/                      # shadcn components (button, input, label, card, avatar,
                             #   dropdown-menu, separator, sheet, tooltip, sonner,
                             #   badge, select, table, dialog, skeleton)
  layouts/
    sidebar.tsx              # Collapsible dark sidebar with amber accents
    navbar.tsx               # Top navbar with user dropdown
    sidebar-items.ts         # Navigation config (sidebarItems array)
  lib/
    utils.ts                 # cn() — clsx + tailwind-merge
    axios.ts                 # Axios instance, baseURL=NEXT_PUBLIC_API_URL, refresh interceptor
  redux-store/
    index.ts                 # store + persistor exports, RootState + AppDispatch types
    hooks.ts                 # useAppDispatch, useAppSelector
    store-provider.tsx       # Provider + PersistGate
    slices/auth.ts           # AuthState, selectUser, selectIsAuthenticated, selectIsLoading, selectAuthError
    thunks/auth.thunks.ts    # loginThunk, logoutThunk
  services/auth.service.ts   # authService — login, refresh, logout, logoutAll, getProfile, updateProfile
  types/
    auth.types.ts            # UserRole enum, AuthUser, LoginRequest, AuthResponse, ApiErrorResponse
    pagination.types.ts      # PaginationParams, PaginatedResponse<T>
    index.ts                 # re-exports both
  utils/device-id.ts         # getDeviceId() — localStorage key: hotel_atenas_device_id
  hooks/use-session-validator.ts
  configs/theme.config.ts    # templateName, sidebarWidth: 260, sidebarCollapsedWidth: 70
  middleware.ts              # Auth routing: /login public, rest protected via accessToken cookie
  views/login/
    index.tsx                # Split layout (dark branding left, form right)
    login-form.tsx           # Card form with show/hide password
    hooks/use-login-form.ts  # RHF + zodResolver + loginThunk dispatch
    functions/login.schema.ts # Zod schema
```

### Key Conventions
- `'use client'` only on components with hooks or browser APIs
- `@/` alias maps to `src/`
- Auth API endpoints: POST `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/logout-all`, GET/PATCH `/auth/profile`
- DI token for device: `hotel_atenas_device_id` in localStorage
- Middleware checks `accessToken` cookie (httpOnly from server)
- `noUncheckedIndexedAccess: true` in tsconfig — array/string index returns `T | undefined`, always use `??` fallback
- Design: dark sidebar (`bg-sidebar` = hsl(222 47% 11%)), amber/gold accent (`hsl(36 100% 50%)`), white content area
- No MUI anywhere — pure Tailwind + Radix UI primitives

### Server API (NestJS on port 5100)
- Roles: ADMIN, RECEPTIONIST, HOUSEKEEPING
- JWT via httpOnly cookies + Authorization header
- Multi-device session support via deviceId
- Swagger at http://localhost:5100/api/docs
