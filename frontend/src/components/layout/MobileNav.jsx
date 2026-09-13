import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Sparkles, CheckSquare, Bookmark, ShieldCheck } from 'lucide-react';

export default function MobileNav() {
  const items = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/intake', label: 'Match AI', icon: Sparkles, highlight: true },
    { to: '/results', label: 'Schemes', icon: CheckSquare },
    { to: '/tracker', label: 'Tracker', icon: Bookmark },
    { to: '/admin', label: 'Admin', icon: ShieldCheck },
  ];

  return (
    <div
      className="mobile-bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '4rem',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--color-border)',
        display: 'none',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 990,
        padding: '0 0.5rem',
      }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.2rem',
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
              textDecoration: 'none',
              fontSize: '0.7rem',
              fontWeight: isActive ? 700 : 500,
              padding: '0.3rem 0.6rem',
              borderRadius: 'var(--radius-md)',
              position: 'relative',
            })}
          >
            {item.highlight ? (
              <div
                style={{
                  width: '2.2rem',
                  height: '2.2rem',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-accent)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '-1rem',
                  boxShadow: '0 4px 10px rgba(255, 111, 0, 0.35)',
                }}
              >
                <Icon size={18} />
              </div>
            ) : (
              <Icon size={20} />
            )}
            <span>{item.label}</span>
          </NavLink>
        );
      })}

      <style>{`
        @media (max-width: 768px) {
          .mobile-bottom-nav {
            display: flex !important;
          }
          body {
            padding-bottom: 4rem;
          }
        }
      `}</style>
    </div>
  );
}
