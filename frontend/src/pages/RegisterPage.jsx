import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import MeshSphereScene from '../components/3d/MeshSphereScene';
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
    state: '',
    password: '',
    confirmPassword: '',
    role: 'citizen',
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
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        minHeight: 'calc(100vh - 12rem)',
        alignItems: 'center',
        gap: '3rem',
        padding: '2rem 0',
      }}
    >
      {/* Left 3D scene */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ width: '100%', maxWidth: '400px', height: '360px' }}>
          <MeshSphereScene />
        </div>
        <div style={{ textAlign: 'center', maxWidth: '380px', marginTop: '1rem' }}>
          <Badge variant="success" pill size="sm">
            Government of India Aligned
          </Badge>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text)', margin: '0.4rem 0 0.5rem' }}>
            Get Matched to ₹48,000+ Cr in Subsidies
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            Create your entrepreneur profile once. We continuously track new scheme circulars and notify you instantly.
          </p>
        </div>
      </div>

      {/* Right Form */}
      <div style={{ maxWidth: '500px', margin: '0 auto', width: '100%' }}>
        <Card
          variant="glass"
          style={{
            padding: '2.5rem 2rem',
            borderRadius: 'var(--radius-2xl)',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
          }}
        >
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
              Create Account
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: '0.35rem 0 0 0' }}>
              Free registration for businesses, self-employed, and students.
            </p>
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
              label="State / Union Territory"
              placeholder="Select your operational state"
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

            {/* Password strength bar */}
            {formData.password && (
              <div style={{ marginBottom: '1rem', marginTop: '-0.5rem' }}>
                <div style={{ height: '4px', width: '100%', backgroundColor: 'var(--color-border)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${strength}%`,
                      backgroundColor: getStrengthColor(),
                      transition: 'width 0.3s ease, background-color 0.3s ease',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '0.25rem', color: 'var(--color-text-muted)' }}>
                  <span>Password strength</span>
                  <span style={{ color: getStrengthColor(), fontWeight: 600 }}>
                    {strength <= 25 ? 'Weak' : strength <= 50 ? 'Fair' : strength <= 75 ? 'Good' : 'Strong'}
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
              style={{ marginTop: '0.5rem' }}
            >
              Create Account & Find Schemes
            </Button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none' }}>
              Log In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
