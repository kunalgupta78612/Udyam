import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Heart, ExternalLink, HelpCircle, PhoneCall } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer
      style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid var(--color-border)',
        paddingTop: '3.5rem',
        paddingBottom: '2.5rem',
        marginTop: 'auto',
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1.5rem',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem',
          }}
        >
          {/* Col 1: Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '0.5rem',
                  background: 'linear-gradient(135deg, #4F46E5 0%, #FF6F00 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '1rem',
                }}
              >
                उ
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  color: 'var(--color-text)',
                }}
              >
                Udyam.AI
              </span>
            </div>
            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6,
                marginBottom: '1.25rem',
              }}
            >
              India's intelligent subsidy & government scheme matching engine. Powered by precision eligibility rules and multilingual natural language understanding.
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-success-bg)',
                color: 'var(--color-success)',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              <ShieldCheck size={14} />
              <span>Verifiable Eligibility Rules Engine</span>
            </div>
          </div>

          {/* Col 2: Fast Navigation */}
          <div>
            <h4 style={{ fontSize: '0.925rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--color-text)' }}>
              Scheme Navigator
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>
                <Link to="/intake" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Smart Eligibility Intake
                </Link>
              </li>
              <li>
                <Link to="/results" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Live Matched Schemes
                </Link>
              </li>
              <li>
                <Link to="/tracker" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Application Tracker (Kanban)
                </Link>
              </li>
              <li>
                <Link to="/admin" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Admin Control Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Key National Initiatives */}
          <div>
            <h4 style={{ fontSize: '0.925rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--color-text)' }}>
              Featured Programs
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                • PMEGP (Prime Minister's Employment Gen.)
              </li>
              <li style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                • Stand-Up India for SC/ST & Women
              </li>
              <li style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                • CGTMSE Collateral-Free Credit Guarantee
              </li>
              <li style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                • PM-SVANidhi Micro-Credit Scheme
              </li>
            </ul>
          </div>

          {/* Col 4: Multilingual & Support */}
          <div>
            <h4 style={{ fontSize: '0.925rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--color-text)' }}>
              Bharat Support
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              Designed for 22 scheduled Indian languages with full voice input support for Hindi, Tamil, Telugu, Marathi, and more.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 600 }}>
              <HelpCircle size={15} />
              <span>National Toll-Free: 1800-180-6763</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div
          style={{
            borderTop: '1px solid var(--color-border)',
            paddingTop: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.825rem',
            color: 'var(--color-text-muted)',
          }}
        >
          <div>
            © {new Date().getFullYear()} Udyam.AI Scheme Intelligence. Built for Indian Entrepreneurs & Citizens.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>Crafted with</span>
            <Heart size={14} color="var(--color-danger)" fill="var(--color-danger)" />
            <span>in Light Theme with Precision 3D Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
