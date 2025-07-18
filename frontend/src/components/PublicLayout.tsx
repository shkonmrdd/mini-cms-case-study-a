import { Outlet, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { User, Pencil } from 'lucide-react';
import { useState, useEffect } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import Footer from './Footer';

const PublicLayout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header */}
      <header className="header">
        <Link to="/" className="label">
          News
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <form onSubmit={handleSearch}>
            <input
              style={{
                backgroundColor: '#fff8e6',
              }}
              type="text"
              placeholder="Search…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search"
            />
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <SignedOut>
              <SignInButton mode="modal">
                <button style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  color: 'var(--primary)',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>
                  <User size={20} />
                  <span>Admin</span>
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Link
                  to="/admin"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    color: 'var(--primary)',
                    borderRadius: 'var(--radius-s)',
                    textDecoration: 'none',
                  }}
                  title="Admin Panel"
                >
                  <Pencil size={20} />
                </Link>
                <UserButton />
              </div>
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PublicLayout; 