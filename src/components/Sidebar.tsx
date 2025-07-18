import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  FileText,
  Users,
  FolderOpen,
  Settings,
  BarChart3,
  Tags,
  Calendar,
  Activity,
  Upload,
  Newspaper,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const menuItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
    roles: ['admin', 'editor', 'penulis'],
  },
  {
    title: 'Artikel',
    url: '/dashboard/articles',
    icon: FileText,
    roles: ['admin', 'editor', 'penulis'],
  },
  {
    title: 'Media',
    url: '/dashboard/media',
    icon: FolderOpen,
    roles: ['admin', 'editor', 'penulis'],
  },
  {
    title: 'Kategori',
    url: '/dashboard/categories',
    icon: Tags,
    roles: ['admin', 'editor'],
  },
  {
    title: 'Statistik',
    url: '/dashboard/statistics',
    icon: BarChart3,
    roles: ['admin', 'editor'],
  },
  {
    title: 'Pengguna',
    url: '/dashboard/users',
    icon: Users,
    roles: ['admin'],
  },
  {
    title: 'Log Aktivitas',
    url: '/dashboard/activity',
    icon: Activity,
    roles: ['admin'],
  },
  {
    title: 'Pengaturan',
    url: '/dashboard/settings',
    icon: Settings,
    roles: ['admin'],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === 'collapsed';

  const filteredItems = menuItems.filter(item => 
    profile?.role && item.roles.includes(profile.role)
  );

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent";

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-60"} collapsible="icon">
      <SidebarContent>
        <div className="flex items-center space-x-2 p-4 border-b">
          <Newspaper className="h-6 w-6 text-primary" />
          {!isCollapsed && (
            <span className="font-bold text-lg text-primary">LangsaPost</span>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4 border-t">
          {profile && (
            <div className="mb-4">
              {!isCollapsed && (
                <div className="text-sm">
                  <p className="font-medium">{profile.full_name}</p>
                  <p className="text-muted-foreground capitalize">{profile.role}</p>
                </div>
              )}
            </div>
          )}
          <Button
            variant="ghost"
            size={isCollapsed ? "icon" : "default"}
            onClick={signOut}
            className="w-full"
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">Keluar</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}