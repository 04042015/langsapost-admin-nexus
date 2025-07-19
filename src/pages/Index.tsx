import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="container">
      <h1>LangsaPost Admin</h1>
      <p>Portal administrasi untuk mengelola berita dan konten LangsaPost</p>

      <div className="card-grid">
        <div className="card">
          <div className="card-title">Sistem Keamanan</div>
          <div className="card-desc">Login aman & Role-based access</div>
        </div>
        <div className="card">
          <div className="card-title">Manajemen Konten</div>
          <div className="card-desc">Editor artikel, upload media, dsb.</div>
        </div>
        <div className="card">
          <div className="card-title">Dashboard Statistik</div>
          <div className="card-desc">Pantau performa dan aktivitas admin</div>
        </div>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <Link to="/auth">
          <button>Masuk ke Dashboard</button>
        </Link>
      </div>

      <div className="footer">
        © 2025 LangsaPost
      </div>
    </div>
  );
};

export default Index;
