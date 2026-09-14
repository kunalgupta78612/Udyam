import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Shield,
  Calendar,
  Building,
  MapPin,
  Briefcase,
  TrendingUp,
  FileCheck2,
  Sparkles,
  Edit3,
  BookmarkCheck,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Clock
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useAuth } from '../api/hooks/useAuth';
import { useProfile } from '../api/hooks/useProfile';
import { formatRupees } from '../utils/formatCurrency';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const { data: profile, isLoading: isProfileLoading } = useProfile();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', {
        month: 'short',
        year: 'numeric',
      })
    : 'Recent Member';

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
      {/* Top Profile Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          marginBottom: '2.5rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: '4.5rem',
              height: '4.5rem',
              borderRadius: '1.25rem',
              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              fontWeight: 800,
              boxShadow: '0 8px 20px rgba(79, 70, 229, 0.25)',
            }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
                {user?.name || 'Entrepreneur Profile'}
              </h1>
              <Badge variant={isAdmin ? 'accent' : 'primary'} pill size="sm">
                {isAdmin ? 'Ministry Officer' : 'Verified Citizen'}
              </Badge>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                marginTop: '0.35rem',
                color: 'var(--color-text-secondary)',
                fontSize: '0.875rem',
                flexWrap: 'wrap',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Mail size={14} />
                {user?.email}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={14} />
                Joined {memberSince}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link to="/intake" style={{ textDecoration: 'none' }}>
            <Button variant="primary" icon={Edit3} iconPosition="left">
              {profile ? 'Update Intake Data' : 'Complete Intake'}
            </Button>
          </Link>
          <Button variant="outline" icon={LogOut} iconPosition="left" onClick={handleLogout}>
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
        }}
      >
        {/* Left Column: Enterprise & Intake Profile */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card
            header={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Building size={18} color="var(--color-primary)" />
                  <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>Enterprise Profile</span>
                </div>
                <Badge variant={profile ? 'success' : 'warning'} pill size="sm">
                  {profile ? 'Intake Completed' : 'Pending Intake'}
                </Badge>
              </div>
            }
          >
            {profile ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                    STATE / REGION
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '0.2rem', color: 'var(--color-text)' }}>
                    {profile.state || 'National'} ({profile.ruralOrUrban || 'Urban'})
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                    SECTOR
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '0.2rem', color: 'var(--color-text)' }}>
                    {profile.sector || 'General Business'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                    BUSINESS STAGE
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '0.2rem', color: 'var(--color-text)' }}>
                    {profile.businessStage || 'Early Stage'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                    ANNUAL INCOME / TURNOVER
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '0.2rem', color: 'var(--color-text)' }}>
                    {profile.annualIncome ? formatRupees(profile.annualIncome) : 'Not Specified'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                    SOCIAL CATEGORY
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '0.2rem', color: 'var(--color-text)', textTransform: 'uppercase' }}>
                    {profile.category || 'General'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                    SPECIAL RESERVATIONS
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '0.2rem', color: 'var(--color-text)' }}>
                    {profile.isPwD ? 'PwD Beneficiary' : profile.isTransgender ? 'Transgender Category' : 'Standard'}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <AlertCircle size={36} color="var(--color-warning)" style={{ margin: '0 auto 0.75rem' }} />
                <h4 style={{ fontWeight: 700, margin: '0 0 0.4rem', color: 'var(--color-text)' }}>
                  Intake Profile Not Yet Saved
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
                  Complete the 5-step intake wizard to calculate verified scheme matches.
                </p>
                <Link to="/intake" style={{ textDecoration: 'none' }}>
                  <Button variant="primary" size="sm" icon={Sparkles}>
                    Start Intake Wizard
                  </Button>
                </Link>
              </div>
            )}
          </Card>

          {/* Quick Shortcuts */}
          <Card
            header={
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Briefcase size={18} color="var(--color-primary)" />
                <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>Quick Navigation</span>
              </div>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link
                to="/results"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-background-subtle, #F8FAFC)',
                  textDecoration: 'none',
                  color: 'var(--color-text)',
                  border: '1px solid var(--color-border)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Sparkles size={16} color="var(--color-accent, #FF6F00)" />
                  <span>View Matched Government Schemes</span>
                </div>
                <Badge variant="accent" size="sm" pill>
                  Rules Engine
                </Badge>
              </Link>

              <Link
                to="/tracker"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-background-subtle, #F8FAFC)',
                  textDecoration: 'none',
                  color: 'var(--color-text)',
                  border: '1px solid var(--color-border)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <BookmarkCheck size={16} color="var(--color-primary)" />
                  <span>Application Status & Saved Schemes</span>
                </div>
                <Badge variant="primary" size="sm" pill>
                  Tracker
                </Badge>
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(79, 70, 229, 0.05)',
                    textDecoration: 'none',
                    color: 'var(--color-primary)',
                    border: '1px solid var(--color-primary-100)',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Shield size={16} />
                    <span>Open Ministry Admin Dashboard</span>
                  </div>
                  <Badge variant="success" size="sm" pill>
                    Officer
                  </Badge>
                </Link>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Account Security & Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card
            header={
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={18} color="var(--color-primary)" />
                <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>Security & Credentials</span>
              </div>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--color-border)' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)' }}>Account ID</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                    {user?._id || 'UID-LOCAL-AUTH'}
                  </div>
                </div>
                <Badge variant="neutral" size="sm">Active</Badge>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--color-border)' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)' }}>Access Privilege</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {isAdmin ? 'Administrator (Gazette & Policy Management)' : 'Citizen Entrepreneur'}
                  </div>
                </div>
                <Badge variant={isAdmin ? 'accent' : 'primary'} size="sm">
                  {user?.role || 'user'}
                </Badge>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)' }}>2FA / Session Authentication</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>JWT Bearer Token Encrypted</div>
                </div>
                <CheckCircle2 size={18} color="var(--color-success)" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
