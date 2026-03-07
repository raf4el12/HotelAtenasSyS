'use client';

import { LoginForm } from './login-form';

export function LoginView() {
  return (
    <div className="flex min-h-screen">
      {/* Left panel — branding */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col items-center justify-center overflow-hidden bg-sidebar">
        {/* Decorative gradient orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-amber-600/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-amber-500/5 blur-3xl" />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'linear-gradient(rgba(245,158,11,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10 flex flex-col items-center text-center px-12 max-w-lg">
          {/* Logo mark */}
          <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-500 shadow-2xl shadow-amber-500/40">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-10 w-10 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
              />
            </svg>
          </div>

          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Hotel Atenas</h1>
          <div className="mb-6 h-0.5 w-16 bg-amber-500 rounded-full" />
          <p className="text-lg text-slate-300 font-medium mb-2">
            Sistema de Gestion Hotelera
          </p>
          <p className="text-sm text-slate-500 leading-relaxed">
            Administra reservas, estancias, habitaciones, punto de venta y mucho mas desde un
            solo lugar.
          </p>

          {/* Feature pills */}
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {[
              'Reservas',
              'Check-in / Check-out',
              'Punto de Venta',
              'Reportes',
              'Multi-dispositivo',
            ].map((feature) => (
              <span
                key={feature}
                className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex w-full items-center justify-center bg-background px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 flex flex-col items-center lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500 shadow-lg shadow-amber-500/30 mb-3">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-6 w-6 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
                />
              </svg>
            </div>
            <p className="text-xl font-bold text-foreground">Hotel Atenas</p>
            <p className="text-xs text-amber-600 font-semibold tracking-wider uppercase mt-0.5">
              Property Management
            </p>
          </div>

          <LoginForm />

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Hotel Atenas PMS &copy; {new Date().getFullYear()}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
