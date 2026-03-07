'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, Hotel, Menu } from 'lucide-react';
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
    <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
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
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100',
                    collapsed && 'justify-center px-2',
                  )}
                >
                  <Icon
                    className={cn(
                      'shrink-0 transition-colors',
                      isActive ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-300',
                      collapsed ? 'h-5 w-5' : 'h-4 w-4',
                    )}
                  />
                  {!collapsed && (
                    <span className="truncate">{item.title}</span>
                  )}
                  {isActive && !collapsed && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-400" />
                  )}
                </Link>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right" className="bg-slate-800 text-slate-100 border-slate-700">
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
      <Avatar className="h-8 w-8 shrink-0 ring-2 ring-amber-500/30">
        <AvatarImage src={user?.profile?.avatarUrl} alt={fullName} />
        <AvatarFallback className="bg-amber-500/20 text-amber-400 text-xs font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>
      {!collapsed && (
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-slate-100">{fullName}</p>
          <p className="truncate text-xs text-slate-500">{user?.role}</p>
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
    <div className="flex h-full flex-col bg-sidebar">
      <div
        className={cn(
          'flex items-center border-b border-sidebar-border px-3 py-4',
          collapsed ? 'justify-center' : 'justify-between',
        )}
      >
        <div className={cn('flex items-center gap-2.5', collapsed && 'justify-center')}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500 shadow-lg shadow-amber-500/30">
            <Hotel className="h-4 w-4 text-white" />
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-bold text-slate-100 leading-tight">
                {themeConfig.templateName}
              </p>
              <p className="text-[10px] text-amber-500 font-medium tracking-wider uppercase">
                PMS
              </p>
            </div>
          )}
        </div>
        {showToggle && onToggle && (
          <button
            onClick={onToggle}
            className="rounded-md p-1 text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition-colors"
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

      <SidebarNav collapsed={collapsed} />
      <SidebarUser collapsed={collapsed} />
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
