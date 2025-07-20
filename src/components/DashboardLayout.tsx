import { Navigate } from 'react-router-dom'; 
import { useAuth } from '@/hooks/useAuth'; 
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'; 
import { AppSidebar } from '@/components/Sidebar'; 
import { Button } from '@/components/ui/button'; 
import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom'; // ✅ Tambahkan ini

interface DashboardLayoutProps { 
  children: React.ReactNode; 
}

export function DashboardLayout({ children }: DashboardLayoutProps) { 
  const { user, profile, loading } = useAuth();

if (loading) { 
  return ( 
    <div className="min-h-screen flex items-center justify-center"> 
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div> 
    </div> 
  ); 
}

if (!user || !profile) { 
  return <Navigate to="/auth" replace />; 
}

if (!profile.is_active) { 
  return ( 
    <div className="min-h-screen flex items-center justify-center"> 
      <div className="text-center"> 
        <h1 className="text-2xl font-bold mb-2">Akun Tidak Aktif</h1> 
        <p className="text-muted-foreground"> 
          Akun Anda telah dinonaktifkan. Hubungi administrator untuk mengaktifkan kembali. 
        </p> 
      </div> 
    </div> 
  ); 
}

if (!['admin', 'editor', 'penulis'].includes(profile.role)) { 
  return ( 
    <div className="min-h-screen flex items-center justify-center"> 
      <div className="text-center"> 
        <h1 className="text-2xl font-bold mb-2">Akses Ditolak</h1> 
        <p className="text-muted-foreground"> 
          Anda tidak memiliki akses ke dashboard ini. 
        </p> 
        <Button asChild variant="outline" className="mt-4"> 
          <Link to="/auth">Kembali ke Login</Link> 
        </Button> 
      </div> 
    </div> 
  ); 
}

return ( 
  <SidebarProvider> 
    <div className="flex min-h-screen w-full"> 
      <AppSidebar /> 
      <main className="flex-1 flex flex-col"> 
        <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50"> 
          <div className="flex items-center h-full px-4"> 
            <SidebarTrigger className="mr-4" /> 
            <div className="flex items-center space-x-4 ml-auto"> 
              <span className="text-sm text-muted-foreground"> 
                Selamat datang, {profile.full_name} 
              </span> 
            </div> 
          </div> 
        </header> 
        <div className="flex-1 p-6">
          <Outlet /> {/* ✅ Ini akan render komponen nested seperti Dashboard & NewArticlePage */}
        </div>
      </main> 
    </div> 
  </SidebarProvider> 
); 
}

