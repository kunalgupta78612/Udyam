import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Mic, 
  MicOff, 
  CheckCircle2, 
  Building2, 
  Briefcase, 
  Coins, 
  TrendingUp, 
  Clock, 
  Users, 
  UserCheck, 
  MapPin, 
  Trees, 
  ShieldAlert, 
  FileCheck,
  HelpCircle,
  Volume2
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import RupeeCoinScene from '../components/3d/RupeeCoinScene';
import AudioVisualizer from '../components/ui/AudioVisualizer';
import { useTranslation } from '../hooks/useTranslation';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { useToast } from '../components/ui/Toast';
import { formatRupees } from '../utils/formatCurrency';
import { INDIAN_STATES } from '../utils/constants';

export default function IntakeWizard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t, lang } = useTranslation();
  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 12;

  // Form State
  const [formData, setFormData] = useState({
    entityType: 'proprietorship',
    sector: 'manufacturing',
    activityDescription: '',
    investment: 1500000, // 15 Lakhs
    turnover: 3500000,   // 35 Lakhs
    stage: 'operational_1_to_3',
    socialCategory: 'general',
    gender: 'female',
    state: 'Maharashtra',
    district: '',
    areaType: 'rural',
    specialCategory: 'none',
  });

  // Voice Input Hook
  const {
    isListening,
    transcript,
    parsedParams,
    startListening,
    stopListening,
    isSupported,
  } = useVoiceInput(lang);

  // When speech gives parsed params, merge into form
  useEffect(() => {
    if (parsedParams && Object.keys(parsedParams).length > 0) {
      setFormData((prev) => ({ ...prev, ...parsedParams }));
      showToast('Speech parameters recognized and auto-filled!', 'success');
    }
  }, [parsedParams, showToast]);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } else {
      // Complete intake
      sessionStorage.setItem('udyam_intake_profile', JSON.stringify(formData));
      showToast('Running AI Deterministic Rules Engine...', 'info');
      navigate('/results');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  // Steps Definition
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <Building2 size={24} color="var(--color-primary)" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                What type of entity or enterprise are you registering?
              </h2>
            </div>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Legal structure influences which credit guarantees and ministry grants apply.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              {[
                { id: 'individual', title: 'Individual / Aspiring Entrepreneur', desc: 'Planning a greenfield business, no formal entity yet.' },
                { id: 'proprietorship', title: 'Sole Proprietorship', desc: 'Single business owner with GST or Udyam Aadhaar.' },
                { id: 'partnership_llp', title: 'Partnership / LLP', desc: 'Registered under Indian Partnership Act or LLP Act.' },
                { id: 'pvt_ltd', title: 'Private Limited / Startup', desc: 'DPIIT recognized or incorporated company.' },
                { id: 'shg', title: 'Self-Help Group (SHG)', desc: 'Women or rural mutual assistance collective.' },
                { id: 'fpo', title: 'Farmer Producer Org (FPO)', desc: 'Farmer collective or agricultural producer co-op.' },
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => updateField('entityType', opt.id)}
                  className={`card ${formData.entityType === opt.id ? 'card-primary' : 'card-flat'}`}
                  style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-lg)',
                    cursor: 'pointer',
                    border: formData.entityType === opt.id ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    backgroundColor: formData.entityType === opt.id ? 'var(--color-primary-50)' : 'var(--color-surface)',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: formData.entityType === opt.id ? 'scale(1.02)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text)' }}>{opt.title}</span>
                    {formData.entityType === opt.id && <CheckCircle2 size={18} color="var(--color-primary)" />}
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>{opt.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <Briefcase size={24} color="var(--color-accent)" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                Which broad sector does your primary business operate in?
              </h2>
            </div>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Certain schemes like PMEGP offer higher loan caps for manufacturing vs. services.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {[
                { id: 'manufacturing', title: 'Manufacturing', badge: 'Up to ₹50L cap', desc: 'Producing physical goods, agro-processing, machinery, textiles.' },
                { id: 'services', title: 'Services & Consultancy', badge: 'Up to ₹20L cap', desc: 'Logistics, repair, hospitality, IT, clinics, education.' },
                { id: 'trading', title: 'Trading & Retail', badge: 'Mudra / Retail', desc: 'Wholesale, grocery, e-commerce, consumer distribution.' },
                { id: 'agri', title: 'Agriculture & Allied', badge: 'NABARD / AIF', desc: 'Dairy, horticulture, poultry, fisheries, cold storage.' },
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => updateField('sector', opt.id)}
                  className="card"
                  style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-lg)',
                    cursor: 'pointer',
                    border: formData.sector === opt.id ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                    backgroundColor: formData.sector === opt.id ? '#FFF7ED' : 'var(--color-surface)',
                    transform: formData.sector === opt.id ? 'scale(1.02)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <Badge variant="accent" size="sm">{opt.badge}</Badge>
                    {formData.sector === opt.id && <CheckCircle2 size={18} color="var(--color-accent)" />}
                  </div>
                  <h4 style={{ margin: '0.5rem 0 0.3rem 0', fontSize: '1rem', fontWeight: 700 }}>{opt.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{opt.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <Mic size={24} color="var(--color-primary)" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                Tell us about your specific business activity
              </h2>
            </div>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              You can type in English/Hinglish or tap the mic to speak in Hindi or your mother tongue.
            </p>

            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <textarea
                value={formData.activityDescription}
                onChange={(e) => updateField('activityDescription', e.target.value)}
                placeholder="e.g. हम अगरबत्ती और हर्बल साबुन बनाने का काम करते हैं या 5 लेथ मशीन का वर्कशॉप खोलना चाहते हैं..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1.5px solid var(--color-border)',
                  fontSize: '0.95rem',
                  outline: 'none',
                  color: 'var(--color-text)',
                  backgroundColor: 'var(--color-surface)',
                }}
              />
            </div>

            {/* Mic control */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                backgroundColor: 'var(--color-bg)',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                marginBottom: isListening ? '1rem' : '0',
              }}
            >
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                style={{
                  width: '3.2rem',
                  height: '3.2rem',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: isListening ? 'var(--color-danger)' : 'var(--color-accent)',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(255, 111, 0, 0.3)',
                  animation: isListening ? 'pulse 1.5s infinite' : 'none',
                }}
              >
                {isListening ? <MicOff size={22} /> : <Mic size={22} />}
              </button>

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text)' }}>
                  {isListening ? 'Listening now... Speak your business details' : 'Voice Input in 22 Languages'}
                </div>
                <div style={{ fontSize: '0.785rem', color: 'var(--color-text-secondary)' }}>
                  {transcript || 'Try saying: "हस्तशिल्प और खादी उत्पाद का निर्माण, 15 लाख का बजट"'}
                </div>
              </div>
            </div>

            {/* Live 3D Sound Frequency Waves */}
            {isListening && (
              <div style={{ marginTop: '0.75rem' }}>
                <AudioVisualizer isListening={isListening} barCount={26} />
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <Coins size={24} color="var(--color-success)" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                Total Investment in Plant & Machinery / Equipment
              </h2>
            </div>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Exclude land and building cost. This defines your official MSME Gazette tier.
            </p>

            <div
              className="card card-elevated"
              style={{
                padding: '2rem',
                borderRadius: 'var(--radius-xl)',
                textAlign: 'center',
                marginBottom: '1.5rem',
                position: 'relative',
              }}
            >
              {/* 3D Floating Coin */}
              <div style={{ height: '130px', maxWidth: '200px', margin: '-0.75rem auto 0.25rem' }}>
                <RupeeCoinScene height="130px" interactive={true} />
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Selected Investment Amount
              </div>
              <div
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-primary)',
                  margin: '0.4rem 0',
                }}
              >
                {formatRupees(formData.investment)}
              </div>
              <Badge variant={formData.investment <= 10000000 ? 'success' : 'primary'} pill>
                {formData.investment <= 10000000 ? 'MICRO ENTERPRISE (≤ ₹1 Crore)' : formData.investment <= 100000000 ? 'SMALL ENTERPRISE (≤ ₹10 Crore)' : 'MEDIUM ENTERPRISE'}
              </Badge>

              <div style={{ marginTop: '2rem' }}>
                <input
                  type="range"
                  min={100000}
                  max={50000000}
                  step={100000}
                  value={formData.investment}
                  onChange={(e) => updateField('investment', Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                  <span>₹1 Lakh (Micro)</span>
                  <span>₹25 Lakh (PMEGP max)</span>
                  <span>₹1 Crore</span>
                  <span>₹5 Crore</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
              {[500000, 1500000, 2500000, 5000000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => updateField('investment', val)}
                  style={{
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: formData.investment === val ? 'var(--color-primary-100)' : 'var(--color-surface)',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                  }}
                >
                  {formatRupees(val)}
                </button>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <TrendingUp size={24} color="var(--color-primary)" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                Estimated Annual Turnover
              </h2>
            </div>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              For new greenfield units, enter expected 1st year projected revenue.
            </p>

            <div
              className="card card-elevated"
              style={{
                padding: '2rem',
                borderRadius: 'var(--radius-xl)',
                textAlign: 'center',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Annual Turnover / Gross Revenue
              </div>
              <div
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-accent)',
                  margin: '0.4rem 0',
                }}
              >
                {formatRupees(formData.turnover)}
              </div>

              <div style={{ marginTop: '2rem' }}>
                <input
                  type="range"
                  min={500000}
                  max={250000000}
                  step={500000}
                  value={formData.turnover}
                  onChange={(e) => updateField('turnover', Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--color-accent)', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                  <span>₹5 Lakhs</span>
                  <span>₹5 Crore (Micro ceiling)</span>
                  <span>₹50 Crore</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <Clock size={24} color="var(--color-warning)" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                Operational Stage of the Enterprise
              </h2>
            </div>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Certain grants fund only new setups (Greenfield), while others fund expansion (Brownfield).
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              {[
                { id: 'greenfield', title: 'New Setup / Greenfield', desc: 'Starting from scratch. Eligible for PMEGP, Stand-Up India, Mudra Shishu.' },
                { id: 'operational_less_1', title: 'Operational (< 1 Year)', desc: 'Early stage with basic GST or trading license.' },
                { id: 'operational_1_to_3', title: 'Established (1 – 3 Years)', desc: 'Stable operations seeking working capital or machinery upgrade.' },
                { id: 'mature_over_3', title: 'Mature (> 3 Years)', desc: 'Has filed 2-3 years ITR. Qualifies for high-tier CGTMSE guarantees.' },
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => updateField('stage', opt.id)}
                  className="card"
                  style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-lg)',
                    cursor: 'pointer',
                    border: formData.stage === opt.id ? '2px solid var(--color-warning)' : '1px solid var(--color-border)',
                    backgroundColor: formData.stage === opt.id ? 'var(--color-warning-bg)' : 'var(--color-surface)',
                    transform: formData.stage === opt.id ? 'scale(1.02)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{opt.title}</span>
                    {formData.stage === opt.id && <CheckCircle2 size={18} color="var(--color-warning)" />}
                  </div>
                  <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>{opt.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 7:
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <Users size={24} color="var(--color-primary)" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                Social / Demographic Category
              </h2>
            </div>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Government offers up to 10% higher margin subsidy for affirmative categories (e.g. SC/ST/OBC/Minority).
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              {[
                { id: 'general', label: 'General Category', bonus: 'Standard Subsidy (15-25%)' },
                { id: 'sc', label: 'Scheduled Caste (SC)', bonus: 'Special Subsidy (25-35%)' },
                { id: 'st', label: 'Scheduled Tribe (ST)', bonus: 'Special Subsidy (25-35%)' },
                { id: 'obc', label: 'Other Backward Class (OBC)', bonus: 'Special Subsidy (25-35%)' },
                { id: 'minority', label: 'Notified Minority', bonus: 'Special Subsidy (25-35%)' },
                { id: 'pwd', label: 'Differently Abled (PwD)', bonus: 'Special Subsidy (25-35%)' },
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => updateField('socialCategory', opt.id)}
                  className="card"
                  style={{
                    padding: '1.1rem',
                    borderRadius: 'var(--radius-lg)',
                    cursor: 'pointer',
                    border: formData.socialCategory === opt.id ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    backgroundColor: formData.socialCategory === opt.id ? 'var(--color-primary-50)' : 'var(--color-surface)',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text)' }}>{opt.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 600, marginTop: '0.3rem' }}>{opt.bonus}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 8:
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <UserCheck size={24} color="#E11D48" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                Gender of Lead Promoter / Founder
              </h2>
            </div>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Crucial: Stand-Up India and Mahila Udyam Nidhi require at least 51% female shareholding.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
              {[
                { id: 'female', label: 'Female Founder / Majority Partner', badge: 'Eligible for Stand-Up India & 35% PMEGP', color: '#E11D48' },
                { id: 'male', label: 'Male Founder', badge: 'Standard Criteria Applicable', color: '#4F46E5' },
                { id: 'transgender', label: 'Transgender / Other', badge: 'Special Affirmative Inclusion', color: '#059669' },
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => updateField('gender', opt.id)}
                  className="card"
                  style={{
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-xl)',
                    cursor: 'pointer',
                    border: formData.gender === opt.id ? `2px solid ${opt.color}` : '1px solid var(--color-border)',
                    backgroundColor: formData.gender === opt.id ? `${opt.color}10` : 'var(--color-surface)',
                    transform: formData.gender === opt.id ? 'scale(1.02)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                    {opt.label}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: opt.color, fontWeight: 600 }}>
                    {opt.badge}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 9:
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <MapPin size={24} color="var(--color-primary)" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                Operational State & Territory
              </h2>
            </div>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Select where the project unit will be established to match State Industrial Policy packages.
            </p>

            <div style={{ maxWidth: '450px' }}>
              <Select
                label="State or Union Territory"
                value={formData.state}
                onChange={(e) => updateField('state', e.target.value)}
                options={INDIAN_STATES.map((s) => ({ value: s, label: s }))}
              />

              <Input
                label="District (Optional)"
                placeholder="e.g. Pune, Lucknow, Coimbatore"
                value={formData.district}
                onChange={(e) => updateField('district', e.target.value)}
                helperText="District headquarters assist in local DIC nodal office mapping"
              />
            </div>
          </div>
        );

      case 10:
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <Trees size={24} color="var(--color-success)" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                Area Classification (Rural vs. Urban)
              </h2>
            </div>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Rural enterprises receive an additional 10% capital subsidy under KVIC guidelines!
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div
                onClick={() => updateField('areaType', 'rural')}
                className="card"
                style={{
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-xl)',
                  cursor: 'pointer',
                  border: formData.areaType === 'rural' ? '2px solid var(--color-success)' : '1px solid var(--color-border)',
                  backgroundColor: formData.areaType === 'rural' ? 'var(--color-success-bg)' : 'var(--color-surface)',
                  transform: formData.areaType === 'rural' ? 'scale(1.02)' : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <Badge variant="success" size="sm">35% Subsidy Cap</Badge>
                  {formData.areaType === 'rural' && <CheckCircle2 size={18} color="var(--color-success)" />}
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.4rem' }}>Rural Area</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                  Gram Panchayat, village council jurisdiction, or designated rural township.
                </p>
              </div>

              <div
                onClick={() => updateField('areaType', 'urban')}
                className="card"
                style={{
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-xl)',
                  cursor: 'pointer',
                  border: formData.areaType === 'urban' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                  backgroundColor: formData.areaType === 'urban' ? 'var(--color-primary-50)' : 'var(--color-surface)',
                  transform: formData.areaType === 'urban' ? 'scale(1.02)' : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <Badge variant="primary" size="sm">25% Subsidy Cap</Badge>
                  {formData.areaType === 'urban' && <CheckCircle2 size={18} color="var(--color-primary)" />}
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.4rem' }}>Urban / Semi-Urban</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                  Municipal Corporation, Municipal Board, or Cantonment board limits.
                </p>
              </div>
            </div>
          </div>
        );

      case 11:
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <ShieldAlert size={24} color="var(--color-accent)" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                Special Focus Group or Geographic Mandate
              </h2>
            </div>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Does any promoter qualify under special Central Government affirmative packages?
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {[
                { id: 'none', label: 'None of the Below', desc: 'Standard central criteria apply.' },
                { id: 'aspirational_district', label: 'Aspirational District', desc: 'NITI Aayog prioritized development district.' },
                { id: 'ex_servicemen', label: 'Ex-Servicemen / Defense', desc: 'Special DGR defense entrepreneur quota.' },
                { id: 'border_area', label: 'Border / Hill Area', desc: 'Himalayan, island, or international border region.' },
                { id: 'ner', label: 'North-Eastern Region (NER)', desc: 'Special NER development fund (UNNATI scheme).' },
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => updateField('specialCategory', opt.id)}
                  className="card"
                  style={{
                    padding: '1.1rem',
                    borderRadius: 'var(--radius-lg)',
                    cursor: 'pointer',
                    border: formData.specialCategory === opt.id ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                    backgroundColor: formData.specialCategory === opt.id ? '#FFF7ED' : 'var(--color-surface)',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text)' }}>{opt.label}</div>
                  <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.785rem', color: 'var(--color-text-secondary)' }}>{opt.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 12:
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <FileCheck size={24} color="var(--color-success)" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                Profile Summary & Ready for Match Engine
              </h2>
            </div>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Review your parameters before our deterministic rule engine scans 1,450+ central and state schemes.
            </p>

            <div
              className="card card-elevated"
              style={{
                padding: '1.75rem',
                borderRadius: 'var(--radius-xl)',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Legal Structure</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text)' }}>{formData.entityType}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Sector</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text)' }}>{formData.sector}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Machinery Investment</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary)' }}>{formatRupees(formData.investment)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Projected Turnover</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-accent)' }}>{formatRupees(formData.turnover)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Location & Area</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text)' }}>{formData.state} ({formData.areaType})</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Category & Gender</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text)' }}>{formData.socialCategory.toUpperCase()} / {formData.gender}</div>
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'var(--color-success-bg)',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-success-light)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <CheckCircle2 size={22} color="var(--color-success)" />
              <div style={{ fontSize: '0.875rem', color: 'var(--color-success)' }}>
                <strong>Zero Hallucination Guaranteed:</strong> All criteria will be evaluated against active ministry Gazette notifications.
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', padding: '1rem 0 3rem' }}>
      {/* Progress Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Step {currentStep} of {totalSteps}
            </span>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0.2rem 0 0', color: 'var(--color-text)' }}>
              AI Scheme Eligibility Intake
            </h1>
          </div>
          <Badge variant="primary" size="md">
            {progressPercent}% Completed
          </Badge>
        </div>

        {/* Visual Progress Bar */}
        <div
          style={{
            height: '8px',
            backgroundColor: 'var(--color-border)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, #4F46E5, #FF6F00)',
              borderRadius: 'var(--radius-full)',
              transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </div>
      </div>

      {/* Step Container Card */}
      <Card
        variant="elevated"
        style={{
          padding: '2.5rem',
          borderRadius: 'var(--radius-2xl)',
          minHeight: '420px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--color-border)',
          backgroundColor: '#FFFFFF',
        }}
      >
        <div>{renderStepContent()}</div>

        {/* Navigation Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '2.5rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--color-border-light)',
          }}
        >
          {currentStep > 1 ? (
            <Button
              variant="outline"
              size="md"
              icon={ArrowLeft}
              iconPosition="left"
              onClick={handleBack}
            >
              Back
            </Button>
          ) : (
            <div />
          )}

          <Button
            variant={currentStep === totalSteps ? 'accent' : 'primary'}
            size="md"
            icon={currentStep === totalSteps ? Sparkles : ArrowRight}
            iconPosition="right"
            onClick={handleNext}
            style={{
              boxShadow: currentStep === totalSteps ? '0 8px 20px rgba(255, 111, 0, 0.35)' : undefined,
            }}
          >
            {currentStep === totalSteps ? 'Calculate Eligible Schemes' : 'Continue'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
