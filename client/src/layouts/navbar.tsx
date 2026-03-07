'use client';

import { usePathname, useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux-store/hooks';
import { selectUser } from '@/redux-store/slices/auth';
import { logoutThunk } from '@/redux-store/thunks/auth.thunks';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

function getPageTitle(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const last = segments[segments.length - 1] ?? 'Dashboard';
  const titles: Record<string, string> = {
    dashboard: 'Dashboard',
    stays: 'Recepcion',
    reservations: 'Reservas',
    guests: 'Huespedes',
    rooms: 'Habitaciones',
    floors: 'Pisos',
    pos: 'Punto de Venta',
    products: 'Productos',
    packages: 'Paquetes',
    payments: 'Pagos',
    'rate-rules': 'Tarifas',
    users: 'Usuarios',
  };
  return titles[last] ?? last.charAt(0).toUpperCase() + last.slice(1);
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const pageTitle = getPageTitle(pathname);

  const initials = user?.profile
    ? `${user.profile.firstName[0] ?? ''}${user.profile.lastName[0] ?? ''}`.toUpperCase()
    : user?.email[0]?.toUpperCase() ?? 'U';

  const fullName = user?.profile
    ? `${user.profile.firstName} ${user.profile.lastName}`
    : user?.email ?? '';

  async function handleLogout() {
    try {
      await dispatch(logoutThunk()).unwrap();
      router.push('/login');
    } catch {
      toast.error('Error al cerrar sesion');
    }
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-foreground">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
              <Avatar className="h-9 w-9 ring-2 ring-amber-500/20">
                <AvatarImage src={user?.profile?.avatarUrl} alt={fullName} />
                <AvatarFallback className="bg-amber-500/10 text-amber-600 text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{fullName}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar sesion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
