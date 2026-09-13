import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Sparkles, ArrowRight, Shield, CheckCircle2 } from 'lucide-react';
import MeshSphereScene from '../components/3d/MeshSphereScene';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useAuth } from '../api/hooks/useAuth';
import { useToast } from '../components/ui/Toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginMutation } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('demo@udyam.gov.in');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState('citizen'); // 'citizen' | 'admin'
  const [errors, setErrors] = useState({});

  const from = location.state?.from?.pathname || (role === 'admin' ? '/admin' : '/intake');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email) newErrors.email = 'Email or mobile is required';
    if (!password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await login(email, password, role);
      showToast(`Welcome back to Udyam.AI (${role === 'admin' ? 'Admin Officer' : 'Citizen'})!`, 'success');
      navigate(from, { replace: true });
    } catch (err) {
      showToast(err.message || 'Login failed', 'error');
    }
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        minHeight: 'calc(100vh - 12rem)',
        alignItems: 'center',
        gap: '3rem',
        padding: '2rem 0',
      }}
    >
      {/* Left visual column */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <div style={{ width: '100%', maxWidth: '400px', height: '360px', position: 'relative' }}>
          <MeshSphereScene />
        </div>

        <div style={{ textAlign: 'center', maxWidth: '380px', marginTop: '1rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
            <Badge variant="accent" pill size="sm">
              Single Sign-On & DigiLocker Ready
            </Badge>
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text)', margin: '0.2rem 0 0.5rem' }}>
            Instant Access to Central & State Grants
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            Access saved schemes, live application tracker, and direct submission pipelines securely.
          </p>
        </div>
      </div>

      {/* Right Login Card */}
      <div style={{ maxWidth: '460px', margin: '0 auto', width: '100%' }}>
        <Card
          variant="glass"
          style={{
            padding: '2.5rem 2rem',
            borderRadius: 'var(--radius-2xl)',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
          }}
        >
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
              Welcome back
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', margin: '0.35rem 0 0 0' }}>
              Sign in to manage your applications and eligibility profile.
            </p>
          </div>

          {/* Role selector pill */}
          <div
            style={{
              display: 'flex',
              backgroundColor: 'var(--color-bg)',
              padding: '0.25rem',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '1.5rem',
              border: '1px solid var(--color-border)',
            }}
          >
            <button
              type="button"
              onClick={() => { setRole('citizen'); setEmail('demo@udyam.gov.in'); }}
              style={{
                flex: 1,
                padding: '0.5rem',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: role === 'citizen' ? 'var(--color-surface)' : 'transparent',
                color: role === 'citizen' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                boxShadow: role === 'citizen' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              Citizen / MSME
            </button>
            <button
              type="button"
              onClick={() => { setRole('admin'); setEmail('officer@msme.gov.in'); }}
              style={{
                flex: 1,
                padding: '0.5rem',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: role === 'admin' ? 'var(--color-surface)' : 'transparent',
                color: role === 'admin' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                boxShadow: role === 'admin' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              Ministry Admin
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <Input
              label="Email Address or Mobile"
              type="email"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. yourname@example.com"
              error={errors.email}
              required
            />

            <Input
              label="Password"
              type="password"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              error={errors.password}
              required
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: 'var(--color-text-secondary)' }}>
                <input type="checkbox" defaultChecked />
                <span>Remember this device</span>
              </label>
              <a href="#forgot" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>
                Forgot?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              loading={loginMutation.isPending}
              icon={ArrowRight}
              iconPosition="right"
            >
              Sign In to Account
            </Button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            Don't have an account yet?{' '}
            <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none' }}>
              Register for Free
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
