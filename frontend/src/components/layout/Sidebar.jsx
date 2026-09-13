import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Sparkles, 
  CheckSquare, 
  Layers, 
  Bookmark, 
  Sliders, 
  Database, 
  BarChart3, 
  HelpCircle 
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

export default function Sidebar({ isOpen, onClose }) {
  const { t } = useTranslation();

  const links = [
    { to: '/', label: t('nav_home') || 'Home', icon: Home },
    { to: '/intake', label: t('nav_find_schemes') || 'Find Schemes', icon: Sparkles, badge: 'AI' },
    { to: '/results', label: t('nav_results') || 'Matched Schemes', icon: CheckSquare },
    { to: '/tracker', label: t('nav_tracker') || 'Application Tracker', icon: Bookmark },
    { to: '/admin', label: t('nav_admin') || 'Admin Management', icon: Sliders },
  ];

  return (
    <aside
      className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}
      style={{
        width: '260px',
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 4.25rem)',
        position: 'sticky',
        top: '4.25rem',
        padding: '1.25rem 0.75rem',
        flexShrink: 0,
      }}
    >
      <div style={{ padding: '0 0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Navigation
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
                backgroundColor: isActive ? 'var(--color-primary-50)' : 'transparent',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.9rem',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              })}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Icon size={18} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '0.1rem 0.45rem',
                    borderRadius: '999px',
                    backgroundColor: 'var(--color-accent)',
                    color: '#FFF',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar mini card */}
      <div
        style={{
          marginTop: 'auto',
          padding: '1rem',
          borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(135deg, var(--color-primary-50), #FFF7ED)',
          border: '1px solid var(--color-primary-100)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <Sparkles size={16} color="var(--color-accent)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
            Need Assistance?
          </span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.4 }}>
          Speak in Hindi or your local language to match schemes in seconds.
        </p>
      </div>
    </aside>
  );
}
