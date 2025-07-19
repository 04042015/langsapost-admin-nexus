import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Users, 
  Eye, 
  TrendingUp, 
  AlertTriangle,
  Plus,
  Calendar,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalViews: number;
  breakingNews: number;
  totalUsers: number;
}

interface RecentActivity {
  id: string;
  description: string;
  created_at: string;
  user_name: string;
}

export default function Dashboard() {
  const { profile, logActivity } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    totalViews: 0,
    breakingNews: 0,
    totalUsers: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [recentArticles, setRecentArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    logActivity('login', 'User logged into dashboard');
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load articles stats
      const { data: articles } = await supabase
        .from('articles')
        .select('status, views_count, is_breaking_news');

      if (articles) {
        const totalArticles = articles.length;
        const publishedArticles = articles.filter(a => a.status === 'published').length;
        const draftArticles = articles.filter(a => a.status === 'draft').length;
        const totalViews = articles.reduce((sum, a) => sum + (a.views_count || 0), 0);
        const breakingNews = articles.filter(a => a.is_breaking_news).length;

        setStats(prev => ({
          ...prev,
          totalArticles,
          publishedArticles,
          draftArticles,
          totalViews,
          breakingNews,
        }));
      }

      // Load users count (admin only)
      if (profile?.role === 'admin') {
        const { count } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        setStats(prev => ({ ...prev, totalUsers: count || 0 }));
      }

      // Load recent articles
      const { data: recent } = await supabase
        .from('articles')
        .select(`
          *,
          profiles!articles_author_id_fkey(full_name),
          categories(name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentArticles(recent || []);

      // Load recent activity (admin only)
      if (profile?.role === 'admin') {
        const { data: activity } = await supabase
          .from('activity_logs')
          .select(`
            id,
            description,
            created_at,
            profiles!activity_logs_user_id_fkey(full_name)
          `)
          .order('created_at', { ascending: false })
          .limit(10);

        if (activity) {
          const formattedActivity = activity.map(a => ({
            id: a.id,
            description: a.description,
            created_at: a.created_at,
            user_name: (a.profiles as any)?.full_name || 'Unknown',
          }));
          setRecentActivity(formattedActivity);
        }
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Selamat datang di admin panel LangsaPost
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard/articles/new">
            <Plus className="mr-2 h-4 w-4" />
            Artikel Baru
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Artikel</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalArticles}</div>
            <p className="text-xs text-muted-foreground">
              {stats.publishedArticles} terbit, {stats.draftArticles} draft
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Dari semua artikel
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Breaking News</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.breakingNews}</div>
            <p className="text-xs text-muted-foreground">
              Artikel urgent
            </p>
          </CardContent>
        </Card>

        {profile?.role === 'admin' && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Admin, editor, penulis
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Articles */}
        <Card>
          <CardHeader>
            <CardTitle>Artikel Terbaru</CardTitle>
            <CardDescription>
              5 artikel yang baru dibuat
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentArticles.map((article) => (
              <div key={article.id} className="flex items-center space-x-4">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{article.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {(article.profiles as any)?.full_name} • {(article.categories as any)?.name}
                  </p>
                </div>
                <Badge variant={
                  article.status === 'published' ? 'default' : 
                  article.status === 'draft' ? 'secondary' : 'outline'
                }>
                  {article.status}
                </Badge>
              </div>
            ))}
            {recentArticles.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Belum ada artikel
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity - Admin only */}
        {profile?.role === 'admin' && (
          <Card>
            <CardHeader>
              <CardTitle>Aktivitas Terbaru</CardTitle>
              <CardDescription>
                Log aktivitas sistem
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4">
                  <Activity className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.user_name} • {new Date(activity.created_at).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              ))}
              {recentActivity.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Belum ada aktivitas
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
  }
