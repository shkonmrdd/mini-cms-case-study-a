import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ 
      background: 'var(--bg)', 
      borderTop: '1px solid var(--border)',
      marginTop: 'var(--spacing-xl)'
    }}>
      <div className="main" style={{ paddingTop: 'var(--spacing-l)', paddingBottom: 'var(--spacing-l)' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--spacing-m)'
        }}>
          {/* Left side - Logo and tagline */}
          <div>
            <Link 
              to="/" 
              style={{ 
                fontSize: '18px',
                fontWeight: '700',
                color: 'var(--primary)',
                textDecoration: 'none',
                marginBottom: 'var(--spacing-xs)',
                display: 'block'
              }}
            >
              News
            </Link>
            <p style={{ 
              fontSize: '14px',
              color: 'var(--muted)',
              margin: 0
            }}>
              Stay informed with the latest updates
            </p>
          </div>

          {/* Right side - Links and copyright */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ 
              display: 'flex', 
              gap: 'var(--spacing-l)',
              marginBottom: 'var(--spacing-xs)'
            }}>
              <Link 
                to="/" 
                style={{ 
                  fontSize: '14px',
                  color: 'var(--muted)',
                  textDecoration: 'none'
                }}
              >
                Home
              </Link>
              <Link 
                to="/search" 
                style={{ 
                  fontSize: '14px',
                  color: 'var(--muted)',
                  textDecoration: 'none'
                }}
              >
                Search
              </Link>
            </div>
            <p style={{ 
              fontSize: '12px',
              color: 'var(--muted)',
              margin: 0
            }}>
              © {currentYear} News Platform. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 