import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center p-4">
      <div className="space-y-6 text-center max-w-md">
        <h1 className="text-3xl font-bold text-red-500">LangsaPost Admin</h1>
        <p className="text-lg text-gray-600">Portal administrasi LangsaPost</p>

        <div className="space-y-3">
          <Link to="/auth">
            <button className="bg-red-500 text-white px-4 py-2 rounded-lg w-full">Masuk</button>
          </Link>
          <Link to="/dashboard">
            <button className="border border-red-500 text-red-500 px-4 py-2 rounded-lg w-full">Lihat Demo Dashboard</button>
          </Link>
        </div>

        <p className="text-xs text-gray-400">© 2024 LangsaPost. Admin Panel</p>
      </div>
    </div>
  );
};

export default Index;
