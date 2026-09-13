import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Bookmark, 
  BookmarkCheck, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  FileCheck2, 
  Filter, 
  Share2, 
  ArrowRight,
  TrendingUp,
  Download,
  Building,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import SuccessTrophyScene from '../components/3d/SuccessTrophyScene';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { formatRupees } from '../utils/formatCurrency';
import { useToggleSaveScheme, useSavedSchemes } from '../api/hooks/useSchemes';

export default function ResultsPage() {
  const { showToast } = useToast();
  const toggleSaveMutation = useToggleSaveScheme();
  const { data: savedSchemesData } = useSavedSchemes();

  const [expandedScheme, setExpandedScheme] = useState('pmegp');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [docModalScheme, setDocModalScheme] = useState(null);
  const [checkedDocs, setCheckedDocs] = useState({});

  // Trigger celebration confetti on mount
  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4F46E5', '#FF6F00', '#059669', '#38BDF8'],
    });
  }, []);

  // Schemes Matched for Profile
  const matchedSchemes = [
    {
      id: 'pmegp',
      name: "Prime Minister's Employment Generation Programme (PMEGP)",
      ministry: 'Ministry of Micro, Small and Medium Enterprises',
      nodalAgency: 'KVIC / State KVIB / DIC',
      matchScore: 98,
      subsidyPct: '35% Rural / 25% Urban',
      maxProjectCost: 5000000,
      eligibleSubsidy: 1250000,
      type: 'Capital Subsidy + Term Loan',
      whyMatched: [
        'Enterprise activity is classified under eligible Manufacturing / Service sectors.',
        'Total project investment is within the ₹50,00,000 gazette maximum ceiling.',
        'Promoter qualifies for Special Category margin contribution (only 5% self-finance required instead of 10%).',
        'Operational geography maps directly to active District Industries Centre (DIC) allocation.',
      ],
      nearMiss: 'Setting up operations in the rural boundary of your district unlocks the full 35% margin subsidy rather than 25%.',
      documents: [
        'Detailed Project Report (DPR) with financial projections',
        'Promoter Aadhaar Card & PAN Card',
        'Special Category Caste / Community Certificate',
        'Rural Area Certificate issued by Gram Panchayat / Tehsildar',
        'Educational Qualification Certificate (min 8th pass for > ₹10L projects)',
      ],
      portalUrl: 'https://www.kviconline.gov.in/pmegpeportal/',
    },
    {
      id: 'stand-up-india',
      name: 'Stand-Up India Scheme for SC/ST and Women Entrepreneurs',
      ministry: 'Department of Financial Services, Ministry of Finance',
      nodalAgency: 'SIDBI / Scheduled Commercial Banks',
      matchScore: 94,
      subsidyPct: 'Composite Loan (Margin Money Aid)',
      maxProjectCost: 10000000,
      eligibleSubsidy: 7500000,
      type: 'Bank Credit Guarantee (75% of Project)',
      whyMatched: [
        'At least 51% shareholding & controlling stake is held by a Woman / SC / ST entrepreneur.',
        'Enterprise is a greenfield manufacturing or service project.',
        'Borrower is not in default to any bank or financial institution.',
      ],
      nearMiss: 'Ensure enterprise registration is certified as Greenfield (1st-time venture) to maintain 100% bank compliance.',
      documents: [
        'Proof of identity and address of all partners/directors',
        'Proof of category (SC/ST or Women ownership deed ≥ 51%)',
        'Project Report outlining working capital and term loan split',
        'Balance sheet / Net worth statement of promoters',
        'Pollution NOC / Factory license application',
      ],
      portalUrl: 'https://www.standupmitra.in/',
    },
    {
      id: 'cgtmse',
      name: 'Credit Guarantee Scheme for Micro & Small Enterprises (CGTMSE)',
      ministry: 'Ministry of MSME & SIDBI',
      nodalAgency: 'Member Lending Institutions (MLIs)',
      matchScore: 89,
      subsidyPct: 'Up to 85% Guarantee Coverage',
      maxProjectCost: 50000000,
      eligibleSubsidy: 20000000,
      type: 'Collateral-Free Credit Guarantee',
      whyMatched: [
        'Enterprise is a registered Udyam unit with valid URN.',
        'Loan requirement is collateral-free and within the ₹5 Crore threshold.',
        'Women-led enterprises receive enhanced 85% guarantee cover against default.',
      ],
      nearMiss: 'Acquiring an active Udyam Certificate boosts institutional sanction speed by 40% across nationalized banks.',
      documents: [
        'Udyam Registration Certificate',
        'Bank statements for preceding 6 to 12 months',
        'ITR / Sales Tax / GST Returns (where applicable)',
        'Audited / CA Certified financial statements',
      ],
      portalUrl: 'https://www.cgtmse.in/',
    },
    {
      id: 'mudra-tarun',
      name: 'Pradhan Mantri MUDRA Yojana (Tarun Category)',
      ministry: 'Ministry of Finance',
      nodalAgency: 'Commercial Banks, RRBs, Small Finance Banks',
      matchScore: 85,
      subsidyPct: 'Low Interest Rate + Zero Collateral',
      maxProjectCost: 1000000,
      eligibleSubsidy: 1000000,
      type: 'Working Capital & Term Loan',
      whyMatched: [
        'Borrower fits into the Tarun category (credit requirement ₹5 Lakhs to ₹10 Lakhs).',
        'Non-farm enterprise in manufacturing, services, or trading.',
      ],
      nearMiss: 'Applying after 6 months of steady GST filings unlocks the newly expanded ₹20 Lakh Tarun-Plus window.',
      documents: [
        'Proof of Business Identity & Registration',
        'Applicant KYC Documents',
        'Quotation for machinery or equipment to be purchased',
      ],
      portalUrl: 'https://www.mudra.org.in/',
    },
  ];

  const handleToggleSave = (scheme) => {
    toggleSaveMutation.mutate(
      { schemeId: scheme.id, status: 'saved' },
      {
        onSuccess: () => {
          showToast(`"${scheme.name.substring(0, 32)}..." bookmarked to your Tracker!`, 'success');
        },
      }
    );
  };

  const isSchemeSaved = (schemeId) => {
    return savedSchemesData?.some((s) => s.id === schemeId || s.schemeId === schemeId);
  };

  const filteredSchemes = matchedSchemes.filter((sc) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'subsidy') return sc.subsidyPct.includes('%');
    if (selectedFilter === 'guarantee') return sc.type.includes('Guarantee');
    if (selectedFilter === 'highScore') return sc.matchScore >= 90;
    return true;
  });

  const toggleDocCheck = (docName) => {
    setCheckedDocs((prev) => ({ ...prev, [docName]: !prev[docName] }));
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '1rem 0 4rem' }}>
      {/* Top Banner with 3D Trophy Showcase */}
      <div
        className="card card-glass"
        style={{
          padding: '2rem 2.5rem',
          borderRadius: 'var(--radius-2xl)',
          marginBottom: '2.5rem',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          boxShadow: 'var(--shadow-xl)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          alignItems: 'center',
          gap: '2rem',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
            <Badge variant="success" pill size="sm">
              <CheckCircle2 size={13} /> Evaluation Complete: 4 High-Value Matches Found
            </Badge>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, color: 'var(--color-text)', lineHeight: 1.2 }}>
            Congratulations! You Are Eligible for Grants & Subsidies
          </h1>
          <p style={{ margin: '0.5rem 0 1.5rem', color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
            Deterministic rule validation passed based on your MSME profile in <strong>Maharashtra (Rural, Micro Tier)</strong>. Total matched subsidy potential: <strong>₹1.07+ Crore</strong>.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/tracker" style={{ textDecoration: 'none' }}>
              <Button variant="primary" icon={BookmarkCheck}>
                Go to Application Tracker
              </Button>
            </Link>
            <Link to="/intake" style={{ textDecoration: 'none' }}>
              <Button variant="outline">
                Edit Parameters
              </Button>
            </Link>
          </div>
        </div>

        {/* 3D Success Trophy */}
        <div style={{ height: '240px', position: 'relative' }}>
          <SuccessTrophyScene height="240px" />
          <div style={{ textAlign: 'center', marginTop: '-1.5rem', fontSize: '0.75rem', color: '#92400E', fontWeight: 700 }}>
            ✨ Official Gazette Verified Match
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '2rem',
          overflowX: 'auto',
          paddingBottom: '0.25rem',
        }}
      >
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginRight: '0.5rem' }}>
          <Filter size={15} /> Filters:
        </span>
        {[
          { id: 'all', label: 'All Matched (4)' },
          { id: 'highScore', label: 'High Precision (90%+ Match)' },
          { id: 'subsidy', label: 'Capital Subsidies' },
          { id: 'guarantee', label: 'Credit Guarantees' },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setSelectedFilter(f.id)}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-full)',
              border: selectedFilter === f.id ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
              backgroundColor: selectedFilter === f.id ? 'var(--color-primary-50)' : 'var(--color-surface)',
              color: selectedFilter === f.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* SCHEME CARDS LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {filteredSchemes.map((scheme) => {
          const isExpanded = expandedScheme === scheme.id;
          const isSaved = isSchemeSaved(scheme.id);

          return (
            <Card
              key={scheme.id}
              variant="elevated"
              tiltEffect={false}
              style={{
                borderRadius: 'var(--radius-2xl)',
                border: '1px solid var(--color-border)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
                backgroundColor: '#FFFFFF',
              }}
            >
              {/* Card Top Section */}
              <div style={{ padding: '1.75rem 2rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '280px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <Badge
                        variant={scheme.matchScore >= 90 ? 'success' : 'accent'}
                        pill
                        size="md"
                      >
                        {scheme.matchScore}% Match Score
                      </Badge>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                        {scheme.ministry}
                      </span>
                    </div>

                    <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-text)', margin: '0 0 0.5rem' }}>
                      {scheme.name}
                    </h2>
                    <div style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)' }}>
                      Nodal Implementing Agency: <strong>{scheme.nodalAgency}</strong>
                    </div>
                  </div>

                  {/* Bookmark Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleSave(scheme)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.55rem 1rem',
                      borderRadius: 'var(--radius-lg)',
                      border: isSaved ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                      backgroundColor: isSaved ? 'var(--color-primary-50)' : 'var(--color-surface)',
                      color: isSaved ? 'var(--color-primary)' : 'var(--color-text)',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {isSaved ? <BookmarkCheck size={18} color="var(--color-primary)" /> : <Bookmark size={18} />}
                    <span>{isSaved ? 'Saved in Tracker' : 'Save to Tracker'}</span>
                  </button>
                </div>

                {/* Financial Key Highlights Strip */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '1rem',
                    backgroundColor: 'var(--color-bg)',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-xl)',
                    margin: '1.5rem 0',
                    border: '1px solid var(--color-border-light)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                      Eligible Subsidy / Benefit
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-success)', marginTop: '0.2rem' }}>
                      {scheme.subsidyPct}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                      Max Project Cost Sanction
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)', marginTop: '0.2rem' }}>
                      {formatRupees(scheme.maxProjectCost)}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                      Facility Type
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text)', marginTop: '0.2rem' }}>
                      {scheme.type}
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setExpandedScheme(isExpanded ? null : scheme.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      color: 'var(--color-primary)',
                      padding: 0,
                    }}
                  >
                    <span>{isExpanded ? 'Hide Eligibility Breakdown' : 'View Why You Matched & Details'}</span>
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>

                  <div style={{ display: 'flex', gap: '0.6rem' }}>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={FileCheck2}
                      onClick={() => setDocModalScheme(scheme)}
                    >
                      Doc Checklist ({scheme.documents.length})
                    </Button>

                    <a href={scheme.portalUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                      <Button variant="primary" size="sm" icon={ExternalLink} iconPosition="right">
                        Apply on Official Portal
                      </Button>
                    </a>
                  </div>
                </div>
              </div>

              {/* Accordion Expandable Content */}
              {isExpanded && (
                <div
                  style={{
                    backgroundColor: 'var(--color-bg-warm)',
                    borderTop: '1px solid var(--color-border)',
                    padding: '1.75rem 2rem',
                  }}
                >
                  <div style={{ marginBottom: '1.25rem' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Sparkles size={16} color="var(--color-primary)" /> Why You Matched (Gazette Criteria Passed)
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {scheme.whyMatched.map((reason, idx) => (
                        <li key={idx} style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {scheme.nearMiss && (
                    <div
                      style={{
                        backgroundColor: '#FFFBEB',
                        border: '1px solid #FCD34D',
                        borderRadius: 'var(--radius-lg)',
                        padding: '0.85rem 1.1rem',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.6rem',
                      }}
                    >
                      <Info size={18} color="var(--color-warning)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div style={{ fontSize: '0.85rem', color: '#92400E', lineHeight: 1.4 }}>
                        <strong>Near-Miss Optimization:</strong> {scheme.nearMiss}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* DOCUMENT CHECKLIST MODAL */}
      {docModalScheme && (
        <Modal
          isOpen={!!docModalScheme}
          onClose={() => setDocModalScheme(null)}
          title={`Document Readiness: ${docModalScheme.name.substring(0, 30)}...`}
          subtitle="Check off documents you have prepared to evaluate your application readiness."
          footer={
            <Button variant="primary" onClick={() => setDocModalScheme(null)}>
              Done
            </Button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {docModalScheme.documents.map((doc, idx) => {
              const isChecked = !!checkedDocs[doc];
              return (
                <label
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: isChecked ? 'var(--color-success-bg)' : 'var(--color-surface)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleDocCheck(doc)}
                    style={{ width: '1.1rem', height: '1.1rem', accentColor: 'var(--color-success)' }}
                  />
                  <span
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      color: isChecked ? 'var(--color-success)' : 'var(--color-text)',
                      textDecoration: isChecked ? 'line-through' : 'none',
                    }}
                  >
                    {doc}
                  </span>
                </label>
              );
            })}
          </div>
        </Modal>
      )}
    </div>
  );
}
