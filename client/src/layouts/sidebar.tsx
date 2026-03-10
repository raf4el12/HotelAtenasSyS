'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { sidebarItems } from './sidebar-items';
import { useAppSelector } from '@/redux-store/hooks';
import { selectUser } from '@/redux-store/slices/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import themeConfig from '@/configs/theme.config';

interface SidebarNavProps {
  collapsed: boolean;
}

function SidebarNav({ collapsed }: SidebarNavProps) {
  const pathname = usePathname();
  const user = useAppSelector(selectUser);

  const userRoles: string[] = user?.role ? [user.role] : [];

  const visibleItems = sidebarItems.filter(
    (item) => !item.roles || item.roles.some((r) => userRoles.includes(r as typeof userRoles[number])),
  );

  return (
    <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
      <TooltipProvider delayDuration={0}>
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary/12 text-primary'
                      : 'text-sidebar-muted-foreground hover:bg-sidebar-muted hover:text-sidebar-foreground',
                    collapsed && 'justify-center px-2',
                  )}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-primary" />
                  )}
                  <Icon
                    className={cn(
                      'shrink-0 transition-colors duration-200',
                      isActive ? 'text-primary' : 'text-sidebar-muted-foreground group-hover:text-sidebar-foreground',
                      collapsed ? 'h-5 w-5' : 'h-[18px] w-[18px]',
                    )}
                  />
                  {!collapsed && (
                    <span className="truncate">{item.title}</span>
                  )}
                </Link>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right" className="bg-card text-foreground border-border">
                  {item.title}
                </TooltipContent>
              )}
            </Tooltip>
          );
        })}
      </TooltipProvider>
    </nav>
  );
}

interface SidebarUserProps {
  collapsed: boolean;
}

function SidebarUser({ collapsed }: SidebarUserProps) {
  const user = useAppSelector(selectUser);

  const initials = user?.profile
    ? `${user.profile.firstName[0] ?? ''}${user.profile.lastName[0] ?? ''}`.toUpperCase()
    : user?.email[0]?.toUpperCase() ?? 'U';

  const fullName = user?.profile
    ? `${user.profile.firstName} ${user.profile.lastName}`
    : user?.email ?? '';

  return (
    <div
      className={cn(
        'flex items-center gap-3 border-t border-sidebar-border px-3 py-4',
        collapsed && 'justify-center',
      )}
    >
      <Avatar className="h-8 w-8 shrink-0 ring-2 ring-primary/20">
        <AvatarImage src={user?.profile?.avatarUrl} alt={fullName} />
        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>
      {!collapsed && (
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-sidebar-foreground">{fullName}</p>
          <p className="truncate text-[11px] text-sidebar-muted-foreground">{user?.role}</p>
        </div>
      )}
    </div>
  );
}

interface SidebarInnerProps {
  collapsed: boolean;
  onToggle?: () => void;
  showToggle?: boolean;
}

function SidebarInner({ collapsed, onToggle, showToggle = true }: SidebarInnerProps) {
  return (
    <div className="relative flex h-full flex-col bg-sidebar noise-bg">
      {/* Subtle top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div
        className={cn(
          'relative z-10 flex items-center border-b border-sidebar-border px-3 py-5',
          collapsed ? 'justify-center' : 'justify-between',
        )}
      >
        <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary glow-amber">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-[18px] w-[18px] text-primary-foreground"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
              />
            </svg>
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-bold text-sidebar-foreground leading-tight tracking-tight">
                {themeConfig.templateName}
              </p>
              <p className="text-[10px] text-primary font-semibold tracking-[0.2em] uppercase">
                PMS
              </p>
            </div>
          )}
        </div>
        {showToggle && onToggle && (
          <button
            onClick={onToggle}
            className="rounded-md p-1.5 text-sidebar-muted-foreground hover:bg-sidebar-muted hover:text-sidebar-foreground transition-colors"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        <SidebarNav collapsed={collapsed} />
        <SidebarUser collapsed={collapsed} />
      </div>
    </div>
  );
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col border-r border-sidebar-border transition-all duration-300 ease-in-out"
        style={{
          width: collapsed ? themeConfig.sidebarCollapsedWidth : themeConfig.sidebarWidth,
          minWidth: collapsed ? themeConfig.sidebarCollapsedWidth : themeConfig.sidebarWidth,
        }}
      >
        <SidebarInner
          collapsed={collapsed}
          onToggle={() => setCollapsed((prev) => !prev)}
          showToggle
        />
      </aside>

      {/* Mobile sidebar trigger */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open navigation</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[260px] bg-sidebar border-sidebar-border">
            <SidebarInner collapsed={false} showToggle={false} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
