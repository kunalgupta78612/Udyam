import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  KeyRound, 
  Smartphone, 
  UserCheck, 
  Fingerprint,
  Building2,
  CheckCircle2
} from 'lucide-react';
import AuthSecurity3DScene from '../components/3d/AuthSecurity3DScene';
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

  const [authMethod, setAuthMethod] = useState('password'); // 'password' | 'otp'
  const [email, setEmail] = useState('demo@udyam.gov.in');
  const [password, setPassword] = useState('password123');
  const [mobileOtp, setMobileOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [role, setRole] = useState('citizen'); // 'citizen' | 'admin'
  const [errors, setErrors] = useState({});

  const from = location.state?.from?.pathname || (role === 'admin' ? '/admin' : '/intake');

  const handleQuickFill = (targetRole) => {
    if (targetRole === 'citizen') {
      setRole('citizen');
      setEmail('ramesh.kumar@udyam.in');
      setPassword('password123');
      showToast('Loaded Demo Citizen / MSME Owner Credentials', 'info');
    } else if (targetRole === 'admin') {
      setRole('admin');
      setEmail('officer.sharma@msme.gov.in');
      setPassword('adminPass2026!');
      showToast('Loaded Demo Ministry Officer Credentials', 'info');
    } else if (targetRole === 'women_founder') {
      setRole('citizen');
      setEmail('anita.rao@udyam.in');
      setPassword('standupIndia2026');
      showToast('Loaded Demo Women Entrepreneur Credentials', 'info');
    }
  };

  const handleSendOtp = () => {
    if (!email) {
      setErrors({ email: 'Please enter registered mobile or email' });
      return;
    }
    setOtpSent(true);
    setMobileOtp('492015');
    showToast('Demo OTP 492015 dispatched to your mobile!', 'success');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email) newErrors.email = 'Email or mobile is required';
    if (authMethod === 'password' && !password) newErrors.password = 'Password is required';
    if (authMethod === 'otp' && !mobileOtp) newErrors.mobileOtp = '6-Digit OTP is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await login(email, password, role);
      showToast(`Welcome back to Udyam.AI (${role === 'admin' ? 'Ministry Admin' : 'Citizen'})!`, 'success');
      navigate(from, { replace: true });
    } catch (err) {
      showToast(err.message || 'Login failed', 'error');
    }
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        minHeight: 'calc(100vh - 12rem)',
        alignItems: 'center',
        gap: '3.5rem',
        padding: '2.5rem 0 4rem',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      {/* Left Column: 3D Interactive Security Vault */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <div style={{ width: '100%', maxWidth: '440px', height: '380px', position: 'relative' }}>
          <AuthSecurity3DScene height="380px" />
          <div
            style={{
              textAlign: 'center',
              marginTop: '-1rem',
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
              fontWeight: 600,
            }}
          >
            Rotate 3D Security Vault & Key in 360° Space
          </div>
        </div>

        <div style={{ textAlign: 'center', maxWidth: '420px', marginTop: '1.25rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
            <Badge variant="accent" pill size="sm">
              <ShieldCheck size={14} /> 256-Bit Hardware Encrypted SSO
            </Badge>
          </div>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-text)', margin: '0.2rem 0 0.5rem', lineHeight: 1.25 }}>
            Direct Gateway to ₹48,000+ Cr in Subsidies
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>
            Access bookmarked schemes, live bank nodal tracking, and DPIIT startup grants with official Government of India SSO compliance.
          </p>

          {/* Security Features Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              marginTop: '1.25rem',
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Fingerprint size={14} color="var(--color-primary)" /> Biometric Ready
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <ShieldCheck size={14} color="var(--color-success)" /> DigiLocker Verified
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <KeyRound size={14} color="var(--color-accent)" /> Zero-Knowledge Proofs
            </span>
          </div>
        </div>
      </div>

      {/* Right Column: Interactive Login Card */}
      <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%' }}>
        <Card
          variant="glass"
          tiltEffect
          glare
          style={{
            padding: '2.5rem 2.25rem',
            borderRadius: 'var(--radius-2xl)',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid rgba(255, 255, 255, 0.85)',
          }}
        >
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <div
                style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '0.5rem',
                  background: 'linear-gradient(135deg, #4F46E5, #FF6F00)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                }}
              >
                उ
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
                Sign In
              </h2>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: '0.2rem 0 0 0' }}>
              Enter your enterprise credentials or click a quick-fill demo persona.
            </p>
          </div>

          {/* Quick Demo Fill Buttons */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Quick Demo Auto-Fill:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem' }}>
              <button
                type="button"
                onClick={() => handleQuickFill('citizen')}
                style={{
                  padding: '0.45rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: role === 'citizen' && email.includes('ramesh') ? 'var(--color-primary-50)' : 'var(--color-bg)',
                  color: 'var(--color-text)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.15s ease',
                }}
              >
                Citizen
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('women_founder')}
                style={{
                  padding: '0.45rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: email.includes('anita') ? '#FDF2F8' : 'var(--color-bg)',
                  color: '#BE185D',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                Women MSME
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('admin')}
                style={{
                  padding: '0.45rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: role === 'admin' ? '#FFF7ED' : 'var(--color-bg)',
                  color: 'var(--color-accent-dark)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                Director MSME
              </button>
            </div>
          </div>

          {/* Auth Method Toggle: Password vs OTP */}
          <div
            style={{
              display: 'flex',
              backgroundColor: 'var(--color-bg)',
              padding: '0.25rem',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '1.25rem',
              border: '1px solid var(--color-border)',
            }}
          >
            <button
              type="button"
              onClick={() => setAuthMethod('password')}
              style={{
                flex: 1,
                padding: '0.5rem',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.825rem',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: authMethod === 'password' ? 'var(--color-surface)' : 'transparent',
                color: authMethod === 'password' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                boxShadow: authMethod === 'password' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              Password Login
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod('otp')}
              style={{
                flex: 1,
                padding: '0.5rem',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.825rem',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: authMethod === 'otp' ? 'var(--color-surface)' : 'transparent',
                color: authMethod === 'otp' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                boxShadow: authMethod === 'otp' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              Mobile OTP / DigiLocker
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <Input
              label="Email Address or Mobile Number"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. yourname@example.com"
              error={errors.email}
              required
            />

            {authMethod === 'password' ? (
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
            ) : (
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                  6-Digit Verification OTP
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="e.g. 492015"
                    value={mobileOtp}
                    onChange={(e) => setMobileOtp(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '0.625rem 0.875rem',
                      borderRadius: 'var(--radius-md)',
                      border: errors.mobileOtp ? '1.5px solid var(--color-danger)' : '1px solid var(--color-border)',
                      fontSize: '1.1rem',
                      letterSpacing: '0.2em',
                      fontFamily: 'monospace',
                      fontWeight: 700,
                    }}
                  />
                  <Button
                    variant="outline"
                    size="md"
                    onClick={handleSendOtp}
                  >
                    {otpSent ? 'Resend OTP' : 'Send OTP'}
                  </Button>
                </div>
                {errors.mobileOtp && (
                  <p style={{ margin: '-0.75rem 0 0.75rem', fontSize: '0.8rem', color: 'var(--color-danger)' }}>
                    {errors.mobileOtp}
                  </p>
                )}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: 'var(--color-text-secondary)' }}>
                <input type="checkbox" defaultChecked />
                <span>Keep me signed in</span>
              </label>
              <a href="#forgot" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>
                Need Help?
              </a>
            </div>

            <Button
              type="submit"
              variant="accent"
              fullWidth
              size="lg"
              loading={loginMutation.isPending}
              icon={ArrowRight}
              iconPosition="right"
              style={{
                boxShadow: '0 8px 20px rgba(255, 111, 0, 0.35)',
              }}
            >
              Verify & Enter Portal
            </Button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            New to Udyam.AI?{' '}
            <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none' }}>
              Create Account Free
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
