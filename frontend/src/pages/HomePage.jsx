import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Mic, 
  Search, 
  Award, 
  CheckCircle2, 
  Zap, 
  TrendingUp, 
  Users, 
  FileText, 
  ChevronDown, 
  ChevronUp,
  Building2,
  Cpu
} from 'lucide-react';
import HeroScene from '../components/3d/HeroScene';
import RupeeCoinScene from '../components/3d/RupeeCoinScene';
import NetworkGlobeScene from '../components/3d/NetworkGlobeScene';
import AudioVisualizer from '../components/ui/AudioVisualizer';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useTranslation } from '../hooks/useTranslation';

export default function HomePage() {
  const { t, lang } = useTranslation();
  const [activeFaq, setActiveFaq] = useState(null);
  const [isVoiceDemoActive, setIsVoiceDemoActive] = useState(true);

  const stats = [
    { label: 'Central & State Schemes', value: '1,450+', icon: Award },
    { label: 'Direct Subsidies Mapped', value: '₹48,200 Cr', icon: TrendingUp },
    { label: 'Entrepreneurs Matched', value: '2.8 Million', icon: Users },
    { label: 'Rule Precision Score', value: '99.4%', icon: ShieldCheck },
  ];

  const features = [
    {
      icon: Cpu,
      title: 'Deterministic Rule Engine',
      description: 'Zero hallucination. Checks exact turnover limits, investment brackets, category reservations, and geographic mandates.',
      tag: 'Accuracy',
      color: '#4F46E5',
    },
    {
      icon: Mic,
      title: 'Bharat Voice Recognition',
      description: 'Speak in Hindi, Tamil, Telugu, or 19 other regional dialects. Our speech parsing automatically extracts financial profiles.',
      tag: '22 Languages',
      color: '#FF6F00',
    },
    {
      icon: FileText,
      title: 'Doc Readiness Checklist',
      description: 'Get an exact, personalized checklist of Udyam registration, ITR, caste, or project reports required for 100% approval.',
      tag: 'Zero Friction',
      color: '#059669',
    },
    {
      icon: Zap,
      title: 'Near-Miss Advisor',
      description: 'Did not match a 35% capital subsidy? Our engine explains the exact parameter missing and how to adjust to qualify.',
      tag: 'AI Insights',
      color: '#D97706',
    },
  ];

  const popularSchemes = [
    {
      id: 'pmegp',
      name: "Prime Minister's Employment Generation Programme (PMEGP)",
      ministry: 'Ministry of MSME',
      subsidy: 'Up to 35% Capital Subsidy',
      maxLoan: '₹50 Lakhs (Manufacturing)',
      category: 'Manufacturing / Service',
      badge: 'Popular',
    },
    {
      id: 'stand-up-india',
      name: 'Stand-Up India Scheme for SC/ST & Women',
      ministry: 'Ministry of Finance',
      subsidy: 'Composite Loan (Term Loan + Working Capital)',
      maxLoan: '₹10 Lakhs to ₹1 Crore',
      category: 'Greenfield Enterprise',
      badge: 'High Impact',
    },
    {
      id: 'cgtmse',
      name: 'Credit Guarantee Scheme (CGTMSE)',
      ministry: 'Credit Guarantee Trust',
      subsidy: 'Collateral-Free Credit Guarantee up to 85%',
      maxLoan: 'Up to ₹5 Crore',
      category: 'Credit Access',
      badge: 'Collateral-Free',
    },
  ];

  const faqs = [
    {
      q: 'How does Udyam.AI verify my eligibility?',
      a: 'We use a multi-tiered matching engine. We cross-reference your turnover, investment in plant & machinery, enterprise type, social category, location, and operational age against official gazette rules without making any arbitrary assumptions.',
    },
    {
      q: 'Can I apply directly using my mobile phone and voice in Hindi?',
      a: 'Yes! Simply tap the microphone icon during the intake wizard and describe your business (e.g., "मेरी लखनऊ में टेक्सटाइल की दुकान है और 10 लाख का लोन चाहिए"). The AI extracts your key parameters instantly.',
    },
    {
      q: 'Is this service free for small businesses and self-help groups?',
      a: 'Yes, searching and finding eligible schemes is 100% free and open to all citizens, MSMEs, farmers, and women entrepreneurs across India.',
    },
    {
      q: 'What is the "Near-Miss" explanation feature?',
      a: 'If your enterprise falls slightly short of a high-value subsidy (for instance, being 1 employee short or having an investment slightly above the micro ceiling), the system informs you of what would make you eligible.',
    },
  ];

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* 3D Background */}
      <HeroScene />

      {/* HERO SECTION */}
      <section
        style={{
          position: 'relative',
          zIndex: 1,
          paddingTop: '3.5rem',
          paddingBottom: '5rem',
          textAlign: 'center',
          maxWidth: '920px',
          margin: '0 auto',
        }}
      >
        {/* Pill banner */}
        <div
          className="animate-fade-in"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1.1rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            marginBottom: '1.75rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--color-text)',
          }}
        >
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#059669', animation: 'pulse 2s infinite' }} />
          <span>India’s 1st Multilingual AI Scheme Matching Engine</span>
          <span style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center' }}>
            <Sparkles size={14} />
          </span>
        </div>

        {/* Hero Title */}
        <h1
          className="animate-slide-up"
          style={{
            fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            color: 'var(--color-text)',
            marginBottom: '1.5rem',
          }}
        >
          Unlock Every Government{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #FF6F00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Subsidy & Grant
          </span>{' '}
          Your Enterprise Deserves.
        </h1>

        {/* Hero Subtitle */}
        <p
          className="animate-slide-up"
          style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            lineHeight: 1.6,
            color: 'var(--color-text-secondary)',
            maxWidth: '720px',
            margin: '0 auto 2.5rem',
          }}
        >
          Stop losing millions to bureaucratic confusion. Answer simple questions—or simply speak in your mother tongue—and let our precision rule engine match you to verified Central & State initiatives.
        </p>

        {/* Hero CTA Buttons */}
        <div
          className="animate-slide-up"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <Link to="/intake" style={{ textDecoration: 'none' }}>
            <Button
              variant="accent"
              size="lg"
              icon={Sparkles}
              iconPosition="right"
              style={{
                fontSize: '1.05rem',
                padding: '0.9rem 2rem',
                boxShadow: '0 10px 25px rgba(255, 111, 0, 0.35)',
              }}
            >
              Start AI Eligibility Test (Free)
            </Button>
          </Link>

          <Link to="/results" style={{ textDecoration: 'none' }}>
            <Button
              variant="outline"
              size="lg"
              icon={Search}
              iconPosition="left"
              style={{
                fontSize: '1.05rem',
                padding: '0.9rem 1.8rem',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              Browse 1,450+ Schemes
            </Button>
          </Link>
        </div>

        {/* 3D Interactive Coin Showcase */}
        <div style={{ margin: '2rem auto 0', maxWidth: '320px', position: 'relative' }}>
          <div style={{ height: '200px', width: '100%' }}>
            <RupeeCoinScene height="200px" interactive={true} />
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.3rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: '#FEF3C7',
              color: '#92400E',
              fontSize: '0.75rem',
              fontWeight: 700,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <span>Interactive 3D Subsidy Vault • Click & Spin</span>
          </div>
        </div>

        {/* Micro Guarantee */}
        <div
          style={{
            marginTop: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.5rem',
            fontSize: '0.8rem',
            color: 'var(--color-text-muted)',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <CheckCircle2 size={15} color="var(--color-success)" /> No Aadhaar or OTP required for preview
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <CheckCircle2 size={15} color="var(--color-success)" /> Instant 10-second calculation
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <CheckCircle2 size={15} color="var(--color-success)" /> Official Gazette rules
          </span>
        </div>
      </section>

      {/* STATS COUNTER STRIP */}
      <section
        style={{
          position: 'relative',
          zIndex: 2,
          marginBottom: '5rem',
        }}
      >
        <div
          className="card card-glass"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            padding: '2rem',
            borderRadius: 'var(--radius-2xl)',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
          }}
        >
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.5rem',
                }}
              >
                <div
                  style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'var(--color-primary-50)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-primary)',
                  }}
                >
                  <Icon size={24} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '1.6rem',
                      fontWeight: 800,
                      fontFamily: 'var(--font-display)',
                      color: 'var(--color-text)',
                      lineHeight: 1.1,
                    }}
                  >
                    {item.value}
                  </div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                    {item.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3D INTERACTIVE FEATURE CARDS */}
      <section style={{ marginBottom: '5.5rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem' }}>
          <Badge variant="primary" pill style={{ marginBottom: '0.75rem' }}>
            State-of-the-Art Architecture
          </Badge>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.75rem' }}>
            Built Specifically for Bharat's Diverse Economy
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem' }}>
            From street vendors under PM-SVANidhi to multi-crore greenfield export manufacturers under Stand-Up India.
          </p>
        </div>

        {/* Interactive 3D Bharat Network Globe */}
        <div
          className="card card-glass"
          style={{
            padding: '2rem',
            borderRadius: 'var(--radius-2xl)',
            marginBottom: '2.5rem',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: 'var(--shadow-xl)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            alignItems: 'center',
            gap: '2rem',
          }}
        >
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
              <Badge variant="accent" pill size="sm">
                Pan-India Spatial Mesh
              </Badge>
            </div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text)', margin: '0.3rem 0 0.75rem' }}>
              Real-Time Subsidy Disbursal Across 28 States & 8 UTs
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Our 3D spatial network actively bridges rural District Industries Centres (DICs) with nationalized commercial banks and SIDBI nodal branches in real time.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.825rem', color: 'var(--color-text-muted)' }}>
              <div><strong style={{ color: 'var(--color-primary)', display: 'block', fontSize: '1.3rem' }}>766</strong> Districts Mapped</div>
              <div><strong style={{ color: 'var(--color-accent)', display: 'block', fontSize: '1.3rem' }}>2,400+</strong> Nodal DIC Banks</div>
              <div><strong style={{ color: 'var(--color-success)', display: 'block', fontSize: '1.3rem' }}>100%</strong> DBT Compliance</div>
            </div>
          </div>

          <div style={{ minHeight: '340px', position: 'relative' }}>
            <NetworkGlobeScene height="340px" />
            <div style={{ textAlign: 'center', marginTop: '-0.5rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              Rotate 3D Bharat Mesh to inspect live state nodal hubs
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.75rem',
          }}
        >
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Card
                key={idx}
                variant="elevated"
                tiltEffect
                style={{
                  padding: '2rem 1.5rem',
                  borderRadius: 'var(--radius-xl)',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.25rem',
                  }}
                >
                  <div
                    style={{
                      width: '3rem',
                      height: '3rem',
                      borderRadius: 'var(--radius-lg)',
                      backgroundColor: `${feat.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: feat.color,
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <Badge variant="neutral" size="sm">
                    {feat.tag}
                  </Badge>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.6rem', color: 'var(--color-text)' }}>
                  {feat.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {feat.description}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* VOICE ASSISTANT INTERACTIVE PROMO */}
      <section
        style={{
          marginBottom: '5.5rem',
          position: 'relative',
        }}
      >
        <div
          className="card"
          style={{
            background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)',
            borderRadius: 'var(--radius-2xl)',
            padding: '3rem 2.5rem',
            color: '#FFFFFF',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2.5rem',
            alignItems: 'center',
            boxShadow: '0 20px 40px rgba(30, 27, 75, 0.25)',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.85rem',
                borderRadius: '999px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '1.25rem',
              }}
            >
              <Mic size={14} color="#FF9800" />
              <span>Voice AI in 22 Official Languages</span>
            </div>

            <h2 style={{ fontSize: '2.1rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '1rem', color: '#FFF' }}>
              "मेरी 5 लाख की सिलाई दुकान है, क्या सरकारी सब्सिडी मिलेगी?"
            </h2>

            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
              You don't need complicated legal terminology. Our natural voice recognition maps your colloquial speech directly into formal MSME investment tiers and ministry guidelines.
            </p>

            <Link to="/intake" style={{ textDecoration: 'none' }}>
              <Button
                variant="accent"
                size="lg"
                icon={Mic}
                style={{
                  boxShadow: '0 8px 20px rgba(255, 111, 0, 0.4)',
                }}
              >
                Try Voice Intake Now
              </Button>
            </Link>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(12px)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.75rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#FFB74D', marginBottom: '0.75rem' }}>
              Live Voice Parser Simulation
            </div>

            <div
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                marginBottom: '1rem',
                lineHeight: 1.5,
              }}
            >
              <div style={{ color: '#94A3B8' }}>&gt; Audio Input received (Hindi / Devnagari)</div>
              <div style={{ color: '#34D399' }}>✓ Sector: Textile & Tailoring (Services)</div>
              <div style={{ color: '#34D399' }}>✓ Investment: ₹5,00,000 (Micro Tier)</div>
              <div style={{ color: '#34D399' }}>✓ Candidate Match: PMEGP 25-35% subsidy</div>
            </div>

            {/* 3D Audio Frequency Waveform */}
            <div style={{ marginBottom: '1.25rem' }}>
              <AudioVisualizer isListening={isVoiceDemoActive} barCount={28} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '50%',
                    backgroundColor: isVoiceDemoActive ? '#FF6F00' : 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isVoiceDemoActive ? '0 0 12px rgba(255, 111, 0, 0.6)' : 'none',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Mic size={20} color="#FFF" />
                </div>
                <div style={{ fontSize: '0.85rem' }}>
                  <div style={{ fontWeight: 700 }}>
                    {isVoiceDemoActive ? 'Frequency Wave Active' : 'Microphone Inactive'}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>Chrome, Safari, Edge Speech Engine</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsVoiceDemoActive(!isVoiceDemoActive)}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  backgroundColor: isVoiceDemoActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  color: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {isVoiceDemoActive ? 'Pause Visualizer' : 'Play Visualizer'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR SCHEMES HIGHLIGHT */}
      <section style={{ marginBottom: '5.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
              Flagship National Schemes
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', margin: '0.4rem 0 0 0', fontSize: '0.95rem' }}>
              High-value subsidies currently active for Indian enterprises.
            </p>
          </div>
          <Link to="/results" style={{ textDecoration: 'none' }}>
            <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
              View All 1,450+ Schemes
            </Button>
          </Link>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.75rem',
          }}
        >
          {popularSchemes.map((sc) => (
            <Card
              key={sc.id}
              variant="elevated"
              tiltEffect
              style={{
                padding: '1.75rem',
                borderRadius: 'var(--radius-xl)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <Badge variant="accent" size="sm">
                    {sc.badge}
                  </Badge>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                    {sc.ministry}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '0.75rem', color: 'var(--color-text)' }}>
                  {sc.name}
                </h3>

                <div
                  style={{
                    backgroundColor: 'var(--color-bg)',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1rem',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Financial Benefit
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-success)', marginTop: '0.2rem' }}>
                    {sc.subsidy}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.2rem' }}>
                    Max Limit: {sc.maxLoan}
                  </div>
                </div>
              </div>

              <Link to={`/intake?prefScheme=${sc.id}`} style={{ textDecoration: 'none' }}>
                <Button variant="primary" fullWidth size="md">
                  Check If You Qualify
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQS ACCORDION */}
      <section style={{ maxWidth: '800px', margin: '0 auto 6rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
            Frequently Asked Questions
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            Everything you need to know about navigating subsidies with Udyam.AI.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div
                key={index}
                className="card card-flat"
                style={{
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)',
                  overflow: 'hidden',
                }}
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  style={{
                    width: '100%',
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: 'var(--color-text)',
                  }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={20} color="var(--color-primary)" /> : <ChevronDown size={20} color="var(--color-text-muted)" />}
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: '0 1.5rem 1.25rem',
                      color: 'var(--color-text-secondary)',
                      fontSize: '0.925rem',
                      lineHeight: 1.6,
                      borderTop: '1px solid var(--color-border-light)',
                      backgroundColor: 'var(--color-bg-warm)',
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section
        style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          borderRadius: 'var(--radius-2xl)',
          background: 'linear-gradient(135deg, var(--color-primary-50) 0%, #FFF7ED 100%)',
          border: '1px solid var(--color-primary-100)',
          marginBottom: '4rem',
        }}
      >
        <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '1rem' }}>
          Ready to Claim Your Scheme Benefits?
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
          Join over 2.8 million entrepreneurs and citizens who found matching capital subsidies, credit guarantees, and business grants.
        </p>
        <Link to="/intake" style={{ textDecoration: 'none' }}>
          <Button
            variant="accent"
            size="lg"
            icon={Sparkles}
            style={{
              fontSize: '1.1rem',
              padding: '1rem 2.5rem',
              boxShadow: '0 12px 30px rgba(255, 111, 0, 0.35)',
            }}
          >
            Launch Eligibility Test Now
          </Button>
        </Link>
      </section>
    </div>
  );
}
