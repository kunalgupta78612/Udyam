import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Building2, 
  CheckCircle2, 
  Rocket 
} from 'lucide-react';
import SignupGrowth3DScene from '../components/3d/SignupGrowth3DScene';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useAuth } from '../api/hooks/useAuth';
import { useToast } from '../components/ui/Toast';
import { INDIAN_STATES } from '../utils/constants';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, registerMutation } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    state: 'Maharashtra',
    password: '',
    confirmPassword: '',
    role: 'citizen',
    entityType: 'proprietorship',
  });

  const [errors, setErrors] = useState({});

  const calculateStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass)) score += 25;
    return score;
  };

  const strength = calculateStrength(formData.password);

  const getStrengthColor = () => {
    if (strength <= 25) return 'var(--color-danger)';
    if (strength <= 50) return 'var(--color-warning)';
    if (strength <= 75) return 'var(--color-accent)';
    return 'var(--color-success)';
  };

  const handleQuickDemo = () => {
    setFormData({
      name: 'Ramesh Kumar',
      email: 'ramesh.kumar@udyam.in',
      phone: '+91 98765 43210',
      state: 'Maharashtra',
      password: 'SecurePassword2026!',
      confirmPassword: 'SecurePassword2026!',
      role: 'citizen',
      entityType: 'proprietorship',
    });
    showToast('Demo enterprise registration data auto-filled!', 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Valid email is required';
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await register(formData);
      showToast('Registration successful! Redirecting to eligibility test...', 'success');
      navigate('/intake');
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
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
      {/* Left 3D Growth Scene */}
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
          <SignupGrowth3DScene height="380px" strengthLevel={strength} />
          <div
            style={{
              textAlign: 'center',
              marginTop: '-1rem',
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
              fontWeight: 600,
            }}
          >
            Rotate 3D Growth Rocket & Orbiting Subsidy Coins
          </div>
        </div>

        <div style={{ textAlign: 'center', maxWidth: '420px', marginTop: '1.25rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
            <Badge variant="success" pill size="sm">
              <Rocket size={14} /> Empowering Indian MSMEs & Startups
            </Badge>
          </div>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-text)', margin: '0.2rem 0 0.5rem', lineHeight: 1.25 }}>
            Launch Your Enterprise with Verified Capital Grants
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>
            Register once to generate your verified MSME profile. Our AI engine scans 1,450+ central & state circulars to notify you whenever subsidies match.
          </p>

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
              <CheckCircle2 size={14} color="var(--color-success)" /> 100% Free Forever
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <CheckCircle2 size={14} color="var(--color-success)" /> Zero Spam / Ads
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <CheckCircle2 size={14} color="var(--color-success)" /> Gazette Rule Aligned
            </span>
          </div>
        </div>
      </div>

      {/* Right Form Card */}
      <div style={{ maxWidth: '520px', margin: '0 auto', width: '100%' }}>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
                Create Account
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: '0.25rem 0 0 0' }}>
                Join 2.8M entrepreneurs finding government grants.
              </p>
            </div>

            <button
              type="button"
              onClick={handleQuickDemo}
              style={{
                background: 'var(--color-primary-50)',
                border: '1px solid var(--color-primary-100)',
                borderRadius: 'var(--radius-md)',
                padding: '0.35rem 0.65rem',
                fontSize: '0.75rem',
                color: 'var(--color-primary)',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              ⚡ Fill Demo
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <Input
              label="Full Name / Authorized Signatory"
              icon={User}
              placeholder="e.g. Ramesh Kumar"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
              required
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input
                label="Email Address"
                type="email"
                icon={Mail}
                placeholder="you@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
                required
              />

              <Input
                label="Mobile Number"
                type="tel"
                icon={Phone}
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <Select
              label="Operational State / Union Territory"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              options={INDIAN_STATES.map((s) => ({ value: s, label: s }))}
            />

            <Input
              label="Create Password"
              type="password"
              icon={Lock}
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
              required
            />

            {/* Password strength bar synced with 3D scene */}
            {formData.password && (
              <div style={{ marginBottom: '1.25rem', marginTop: '-0.5rem' }}>
                <div style={{ height: '5px', width: '100%', backgroundColor: 'var(--color-border)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${strength}%`,
                      backgroundColor: getStrengthColor(),
                      transition: 'width 0.3s ease, background-color 0.3s ease',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '0.35rem', color: 'var(--color-text-muted)' }}>
                  <span>3D Thruster Reactivity:</span>
                  <span style={{ color: getStrengthColor(), fontWeight: 700 }}>
                    {strength <= 25 ? 'Low (Red)' : strength <= 50 ? 'Fair (Amber)' : strength <= 75 ? 'Good (Saffron)' : 'Optimal Security (Emerald)'}
                  </span>
                </div>
              </div>
            )}

            <Input
              label="Confirm Password"
              type="password"
              icon={Lock}
              placeholder="Repeat password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
              required
            />

            <Button
              type="submit"
              variant="accent"
              fullWidth
              size="lg"
              loading={registerMutation.isPending}
              icon={ArrowRight}
              iconPosition="right"
              style={{
                marginTop: '0.5rem',
                boxShadow: '0 8px 20px rgba(255, 111, 0, 0.35)',
              }}
            >
              Create Account & Launch Intake
            </Button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            Already registered?{' '}
            <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none' }}>
              Sign In Here
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
