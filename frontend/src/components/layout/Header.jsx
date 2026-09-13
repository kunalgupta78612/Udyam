import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Globe, 
  Compass, 
  BookmarkCheck, 
  ShieldCheck, 
  User, 
  LogOut, 
  Menu, 
  X,
  Mic
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../../api/hooks/useAuth';
import Button from '../ui/Button';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, setLanguage, t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(lang === 'en' ? 'hi' : 'en');
  };

  const navLinks = [
    { to: '/', label: t('nav_home') || 'Home', icon: null },
    { to: '/intake', label: t('nav_find_schemes') || 'Find Schemes', icon: Sparkles, highlight: true },
    { to: '/tracker', label: t('nav_tracker') || 'My Tracker', icon: BookmarkCheck },
    { to: '/admin', label: t('nav_admin') || 'Admin Portal', icon: ShieldCheck },
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--color-border)',
        transition: 'background-color 0.3s ease',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '4.25rem',
          padding: '0 1.5rem',
          maxWidth: '1280px',
          margin: '0 auto',
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '0.75rem',
              background: 'linear-gradient(135deg, #4F46E5 0%, #FF6F00 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '1.25rem',
            }}
          >
            उ
          </div>
          <div>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.4rem',
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #1E1B4B 0%, #4F46E5 60%, #FF6F00 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'block',
                lineHeight: 1.1,
              }}
            >
              Udyam.AI
            </span>
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 600,
                color: 'var(--color-text-muted)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              National Scheme Engine
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '1.75rem',
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.925rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  textDecoration: 'none',
                  padding: '0.4rem 0.8rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isActive ? 'var(--color-primary-50)' : 'transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                {Icon && <Icon size={16} color={isActive ? 'var(--color-primary)' : 'inherit'} />}
                <span>{link.label}</span>
                {link.highlight && (
                  <span
                    style={{
                      fontSize: '0.65rem',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '999px',
                      backgroundColor: 'var(--color-accent)',
                      color: '#FFF',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}
                  >
                    AI
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Language Toggle Button */}
          <button
            onClick={toggleLanguage}
            title={lang === 'en' ? 'Switch to Hindi (हिन्दी)' : 'Switch to English'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.75rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              color: 'var(--color-text)',
              boxShadow: 'var(--shadow-xs)',
              transition: 'all 0.2s ease',
            }}
          >
            <Globe size={15} color="var(--color-primary)" />
            <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>

          {/* User Auth state */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link
                to="/profile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.4rem 0.8rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-primary-50)',
                  border: '1px solid var(--color-primary-100)',
                  textDecoration: 'none',
                  color: 'var(--color-primary)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
              >
                <User size={15} />
                <span>{user?.name?.split(' ')[0] || 'My Profile'}</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                title="Logout"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-muted)',
                  padding: '0.4rem',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Button variant="ghost" size="sm">
                  {t('login') || 'Sign In'}
                </Button>
              </Link>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <Button variant="primary" size="sm">
                  {t('register') || 'Get Started'}
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-hamburger"
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.4rem',
              color: 'var(--color-text)',
            }}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            borderBottom: '1px solid var(--color-border)',
            padding: '1rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                color: location.pathname === link.to ? 'var(--color-primary)' : 'var(--color-text)',
                backgroundColor: location.pathname === link.to ? 'var(--color-primary-50)' : 'transparent',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <span>{link.label}</span>
              {link.highlight && (
                <span style={{ fontSize: '0.7rem', background: 'var(--color-accent)', color: '#fff', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                  AI
                </span>
              )}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (min-width: 769px) {
          .desktop-nav { display: flex !important; }
        }
        @media (max-width: 768px) {
          .mobile-hamburger { display: block !important; }
        }
      `}</style>
    </header>
  );
}
