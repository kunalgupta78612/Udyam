import React from 'react';
import Header from './Header';
import Footer from './Footer';
import MobileNav from './MobileNav';
import OfflineBanner from '../ui/OfflineBanner';

export default function Layout({ children, showFooter = true, fullWidth = false }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--color-bg)',
        color: 'var(--color-text)',
        position: 'relative',
      }}
    >
      <OfflineBanner />
      <Header />
      
      <main
        style={{
          flex: 1,
          width: '100%',
          maxWidth: fullWidth ? '100%' : '1280px',
          margin: '0 auto',
          padding: fullWidth ? '0' : '2rem 1.5rem',
        }}
      >
        {children}
      </main>

      {showFooter && <Footer />}
      <MobileNav />
    </div>
  );
}
