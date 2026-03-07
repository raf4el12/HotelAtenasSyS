import {
  LayoutDashboard,
  BedDouble,
  Users,
  CalendarCheck,
  DoorOpen,
  Building2,
  Package,
  ShoppingCart,
  CreditCard,
  Settings,
  Layers,
  type LucideIcon,
} from 'lucide-react';

export interface SidebarItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles?: string[];
  children?: SidebarItem[];
}

export const sidebarItems: SidebarItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Recepcion', href: '/stays', icon: DoorOpen },
  { title: 'Reservas', href: '/reservations', icon: CalendarCheck },
  { title: 'Huespedes', href: '/guests', icon: Users },
  { title: 'Habitaciones', href: '/rooms', icon: BedDouble },
  { title: 'Pisos', href: '/floors', icon: Building2 },
  { title: 'Punto de Venta', href: '/pos', icon: ShoppingCart },
  { title: 'Productos', href: '/products', icon: Package },
  { title: 'Paquetes', href: '/packages', icon: Layers },
  { title: 'Pagos', href: '/payments', icon: CreditCard },
  { title: 'Tarifas', href: '/rate-rules', icon: Settings, roles: ['ADMIN'] },
  { title: 'Usuarios', href: '/users', icon: Users, roles: ['ADMIN'] },
];
