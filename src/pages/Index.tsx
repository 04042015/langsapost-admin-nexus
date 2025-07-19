import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold text-primary">LangsaPost Admin</h1>
        <p className="text-muted-foreground">Versi ringan untuk uji komponen</p>
        <Button asChild>
          <Link to="/auth">Masuk</Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;
