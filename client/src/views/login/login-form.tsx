'use client';

import { useState } from 'react';
import { Eye, EyeOff, Hotel, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLoginForm } from './hooks/use-login-form';

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { form, isLoading, onSubmit } = useLoginForm();

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Card className="w-full max-w-md border-0 shadow-2xl shadow-black/10">
      <CardHeader className="space-y-4 pb-6">
        <div className="flex items-center justify-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 shadow-lg shadow-amber-500/30">
            <Hotel className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground leading-tight">Hotel Atenas</p>
            <p className="text-xs text-amber-600 font-semibold tracking-wider uppercase">
              Property Management
            </p>
          </div>
        </div>
        <div className="text-center">
          <CardTitle className="text-xl font-bold">Iniciar sesion</CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-1">
            Ingresa tus credenciales para acceder al sistema
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electronico</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@hotelatenas.com"
              autoComplete="email"
              disabled={isLoading}
              {...register('email')}
              className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contrasena</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={isLoading}
                {...register('password')}
                className={
                  errors.password
                    ? 'border-destructive focus-visible:ring-destructive pr-10'
                    : 'pr-10'
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full mt-2" disabled={isLoading} size="lg">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Iniciando sesion...
              </>
            ) : (
              'Iniciar sesion'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
