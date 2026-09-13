import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, Home, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import MeshSphereScene from '../components/3d/MeshSphereScene';

export default function NotFoundPage() {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '4rem 1rem',
        maxWidth: '600px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div style={{ width: '280px', height: '240px', marginBottom: '1rem' }}>
        <MeshSphereScene />
      </div>

      <div
        style={{
          fontSize: '4.5rem',
          fontWeight: 900,
          fontFamily: 'var(--font-display)',
          lineHeight: 1,
          background: 'linear-gradient(135deg, #4F46E5, #FF6F00)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.5rem',
        }}
      >
        404
      </div>

      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.75rem' }}>
        Scheme Page Not Found
      </h1>

      <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
        The circular or portal directory you requested could not be located. But don't worry—hundreds of central and state grants are ready for matching.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Button variant="outline" icon={Home}>
            Back to Home
          </Button>
        </Link>
        <Link to="/intake" style={{ textDecoration: 'none' }}>
          <Button variant="accent" icon={Sparkles}>
            Find Eligible Schemes
          </Button>
        </Link>
      </div>
    </div>
  );
}
