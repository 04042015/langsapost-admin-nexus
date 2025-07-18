-- Create enum types
CREATE TYPE public.user_role AS ENUM ('admin', 'editor', 'penulis');
CREATE TYPE public.article_status AS ENUM ('draft', 'published', 'scheduled', 'archived');
CREATE TYPE public.activity_type AS ENUM ('login', 'create_article', 'edit_article', 'publish_article', 'delete_article', 'upload_media', 'delete_media', 'create_user', 'edit_user', 'suspend_user');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'penulis',
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tags table
CREATE TABLE public.tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create articles table
CREATE TABLE public.articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  author_id UUID NOT NULL,
  category_id UUID,
  status article_status NOT NULL DEFAULT 'draft',
  is_breaking_news BOOLEAN NOT NULL DEFAULT false,
  reading_time_minutes INTEGER,
  views_count INTEGER NOT NULL DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (author_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL
);

-- Create article_tags junction table
CREATE TABLE public.article_tags (
  article_id UUID NOT NULL,
  tag_id UUID NOT NULL,
  PRIMARY KEY (article_id, tag_id),
  FOREIGN KEY (article_id) REFERENCES public.articles(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE
);

-- Create article_revisions table
CREATE TABLE public.article_revisions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  revision_number INTEGER NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (article_id) REFERENCES public.articles(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES public.profiles(user_id) ON DELETE CASCADE
);

-- Create media_files table
CREATE TABLE public.media_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  folder_path TEXT,
  uploaded_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (uploaded_by) REFERENCES public.profiles(user_id) ON DELETE CASCADE
);

-- Create activity_logs table
CREATE TABLE public.activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  activity_type activity_type NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE
);

-- Create site_settings table
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  type TEXT NOT NULL DEFAULT 'text',
  description TEXT,
  updated_by UUID,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (updated_by) REFERENCES public.profiles(user_id) ON DELETE SET NULL
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create function to check user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM public.profiles WHERE user_id = _user_id;
$$;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all profiles" ON public.profiles
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- Create RLS policies for categories
CREATE POLICY "Anyone can view active categories" ON public.categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Editors and admins can manage categories" ON public.categories
  FOR ALL USING (public.get_user_role(auth.uid()) IN ('admin', 'editor'));

-- Create RLS policies for tags
CREATE POLICY "Anyone can view tags" ON public.tags
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create tags" ON public.tags
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Editors and admins can manage tags" ON public.tags
  FOR ALL USING (public.get_user_role(auth.uid()) IN ('admin', 'editor'));

-- Create RLS policies for articles
CREATE POLICY "Anyone can view published articles" ON public.articles
  FOR SELECT USING (status = 'published');

CREATE POLICY "Authors can view their own articles" ON public.articles
  FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Editors and admins can view all articles" ON public.articles
  FOR SELECT USING (public.get_user_role(auth.uid()) IN ('admin', 'editor'));

CREATE POLICY "Authenticated users can create articles" ON public.articles
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own draft articles" ON public.articles
  FOR UPDATE USING (auth.uid() = author_id AND status = 'draft');

CREATE POLICY "Editors and admins can update all articles" ON public.articles
  FOR UPDATE USING (public.get_user_role(auth.uid()) IN ('admin', 'editor'));

CREATE POLICY "Admins can delete articles" ON public.articles
  FOR DELETE USING (public.get_user_role(auth.uid()) = 'admin');

-- Create RLS policies for media files
CREATE POLICY "Anyone can view media files" ON public.media_files
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can upload media" ON public.media_files
  FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can manage their own media" ON public.media_files
  FOR ALL USING (auth.uid() = uploaded_by);

CREATE POLICY "Admins can manage all media" ON public.media_files
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- Create RLS policies for activity logs
CREATE POLICY "Users can view their own activity" ON public.activity_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all activities" ON public.activity_logs
  FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Authenticated users can create activity logs" ON public.activity_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for site settings
CREATE POLICY "Authenticated users can view settings" ON public.site_settings
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage settings" ON public.site_settings
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default site settings
INSERT INTO public.site_settings (key, value, type, description) VALUES
  ('site_name', 'LangsaPost', 'text', 'Nama website'),
  ('site_tagline', 'Portal Berita Terdepan', 'text', 'Tagline website'),
  ('site_logo_url', '', 'text', 'URL logo website'),
  ('site_favicon_url', '', 'text', 'URL favicon'),
  ('meta_description', 'Portal berita terpercaya yang menyajikan informasi terkini dan akurat', 'text', 'Meta description default'),
  ('google_analytics_id', '', 'text', 'Google Analytics ID'),
  ('facebook_page_url', '', 'text', 'URL halaman Facebook'),
  ('twitter_username', '', 'text', 'Username Twitter'),
  ('instagram_username', '', 'text', 'Username Instagram'),
  ('youtube_channel_url', '', 'text', 'URL channel YouTube');

-- Insert default categories
INSERT INTO public.categories (name, slug, description, order_index) VALUES
  ('Politik', 'politik', 'Berita politik dan pemerintahan', 1),
  ('Ekonomi', 'ekonomi', 'Berita ekonomi dan bisnis', 2),
  ('Olahraga', 'olahraga', 'Berita olahraga dan kompetisi', 3),
  ('Teknologi', 'teknologi', 'Berita teknologi dan inovasi', 4),
  ('Hiburan', 'hiburan', 'Berita hiburan dan selebriti', 5),
  ('Kesehatan', 'kesehatan', 'Berita kesehatan dan gaya hidup', 6),
  ('Pendidikan', 'pendidikan', 'Berita pendidikan dan pembelajaran', 7),
  ('Nasional', 'nasional', 'Berita nasional Indonesia', 8),
  ('Internasional', 'internasional', 'Berita internasional dunia', 9),
  ('Daerah', 'daerah', 'Berita daerah dan lokal', 10);