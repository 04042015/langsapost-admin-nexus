import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper, Shield, Users, Settings } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Newspaper className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold text-primary">LangsaPost</h1>
          </div>
          <h2 className="text-3xl font-bold">Admin Dashboard</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Portal administrasi untuk mengelola berita, konten, dan pengguna LangsaPost
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <Shield className="h-8 w-8 text-primary" />
              <CardTitle>Sistem Keamanan</CardTitle>
              <CardDescription>
                Login aman dengan role-based access control
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Role Admin, Editor, Penulis</li>
                <li>• Autentikasi email & password</li>
                <li>• Log aktivitas sistem</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <Newspaper className="h-8 w-8 text-primary" />
              <CardTitle>Manajemen Konten</CardTitle>
              <CardDescription>
                Editor lengkap untuk menulis dan menerbitkan artikel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Rich text editor</li>
                <li>• Upload media</li>
                <li>• Breaking news system</li>
                <li>• Auto-save & versioning</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <Settings className="h-8 w-8 text-primary" />
              <CardTitle>Dashboard Analytics</CardTitle>
              <CardDescription>
                Statistik dan monitoring real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Statistik artikel & views</li>
                <li>• Media manager</li>
                <li>• Pengaturan situs</li>
                <li>• User management</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-y-4">
          <Button asChild size="lg" className="mr-4">
            <Link to="/auth">
              Masuk ke Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/dashboard">
              Lihat Demo Dashboard
            </Link>
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>© 2024 LangsaPost. Admin panel untuk manajemen berita profesional.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
