import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Database, 
  Layers, 
  Plus, 
  Search, 
  Filter, 
  Check, 
  X, 
  Clock, 
  Globe, 
  TrendingUp, 
  AlertCircle, 
  Edit3, 
  History, 
  Sparkles, 
  Download, 
  RefreshCw,
  Cpu,
  Trash2
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import NetworkGlobeScene from '../components/3d/NetworkGlobeScene';
import { useToast } from '../components/ui/Toast';
import { formatRupees } from '../utils/formatCurrency';

export default function AdminPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'schemes' | 'rule_builder' | 'review_queue' | 'ingest'

  // Admin Mock Schemes State
  const [schemes, setSchemes] = useState([
    {
      id: 'SCH-001',
      name: "Prime Minister's Employment Generation Programme (PMEGP)",
      ministry: 'MSME',
      rulesCount: 6,
      status: 'published',
      version: 'v2.4',
      lastModified: '10 Sep 2026',
    },
    {
      id: 'SCH-002',
      name: 'Stand-Up India Greenfield Scheme',
      ministry: 'Finance',
      rulesCount: 5,
      status: 'published',
      version: 'v1.8',
      lastModified: '02 Sep 2026',
    },
    {
      id: 'SCH-003',
      name: 'Credit Guarantee Scheme (CGTMSE)',
      ministry: 'MSME / SIDBI',
      rulesCount: 8,
      status: 'published',
      version: 'v3.1',
      lastModified: '15 Aug 2026',
    },
    {
      id: 'SCH-004',
      name: 'PM Formalisation of Micro food processing (PMFME)',
      ministry: 'Food Processing',
      rulesCount: 4,
      status: 'draft',
      version: 'v1.0',
      lastModified: '12 Sep 2026',
    },
  ]);

  // Review Queue (AI-parsed from gazette crawl)
  const [reviewQueue, setReviewQueue] = useState([
    {
      id: 'RQ-101',
      sourceUrl: 'https://msme.gov.in/gazette-circular-2026-09-ramping-up-msme.pdf',
      schemeName: 'RAMP Technology Upgradation Sub-Grant 2026',
      ministry: 'MSME',
      aiConfidence: 96,
      extractedRules: [
        { field: 'investment', op: '<=', val: '50000000', logic: 'AND' },
        { field: 'has_zed_certification', op: '==', val: 'true', logic: 'AND' },
        { field: 'min_years_operational', op: '>=', val: '2', logic: 'AND' },
      ],
      subsidyOffered: '50% reimbursement up to ₹25 Lakhs for digital audit',
      status: 'pending',
    },
    {
      id: 'RQ-102',
      sourceUrl: 'https://commerce.gov.in/schemes/trade-enablement-shg.html',
      schemeName: 'Niryat Bandhu Women SHG Export Assistance',
      ministry: 'Commerce & Industry',
      aiConfidence: 92,
      extractedRules: [
        { field: 'entity_type', op: 'in', val: '["shg", "fpo"]', logic: 'AND' },
        { field: 'gender', op: '==', val: 'female', logic: 'AND' },
      ],
      subsidyOffered: '100% air freight subsidy on certified handicraft export',
      status: 'pending',
    },
  ]);

  // Dynamic Rule Builder State
  const [selectedSchemeForRule, setSelectedSchemeForRule] = useState('SCH-001');
  const [rules, setRules] = useState([
    { id: 1, field: 'investment_in_plant_machinery', operator: '<=', value: '50000000', type: 'number', logic: 'AND' },
    { id: 2, field: 'sector', operator: 'in', value: 'manufacturing, services', type: 'text', logic: 'AND' },
    { id: 3, field: 'promoter_age', operator: '>=', value: '18', type: 'number', logic: 'AND' },
    { id: 4, field: 'min_education', operator: '>=', value: '8th_pass', type: 'select', logic: 'AND' },
  ]);

  // Ingest Form State
  const [ingestUrl, setIngestUrl] = useState('');
  const [isIngesting, setIsIngesting] = useState(false);

  // Modals
  const [versionModalScheme, setVersionModalScheme] = useState(null);

  const addRuleRow = () => {
    const newId = rules.length > 0 ? Math.max(...rules.map((r) => r.id)) + 1 : 1;
    setRules((prev) => [
      ...prev,
      { id: newId, field: 'annual_turnover', operator: '<=', value: '5000000', type: 'number', logic: 'AND' },
    ]);
  };

  const removeRuleRow = (id) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const updateRuleField = (id, key, val) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, [key]: val } : r)));
  };

  const handleApproveQueueItem = (item) => {
    setReviewQueue((prev) => prev.filter((q) => q.id !== item.id));
    setSchemes((prev) => [
      ...prev,
      {
        id: `SCH-00${schemes.length + 1}`,
        name: item.schemeName,
        ministry: item.ministry,
        rulesCount: item.extractedRules.length,
        status: 'published',
        version: 'v1.0',
        lastModified: 'Just now',
      },
    ]);
    showToast(`Approved "${item.schemeName}"! Published to public catalog.`, 'success');
  };

  const handleRejectQueueItem = (item) => {
    setReviewQueue((prev) => prev.filter((q) => q.id !== item.id));
    showToast(`Rejected item ${item.id} from queue.`, 'info');
  };

  const handleTriggerIngest = (e) => {
    e.preventDefault();
    if (!ingestUrl) return;
    setIsIngesting(true);
    setTimeout(() => {
      setIsIngesting(false);
      const newQueueItem = {
        id: `RQ-${Math.floor(100 + Math.random() * 900)}`,
        sourceUrl: ingestUrl,
        schemeName: 'Extracted National Initiative (' + new URL(ingestUrl).hostname + ')',
        ministry: 'NITI Aayog / MSME',
        aiConfidence: 94,
        extractedRules: [
          { field: 'investment', op: '<=', val: '10000000', logic: 'AND' },
          { field: 'state', op: '!=', val: 'exempt', logic: 'AND' },
        ],
        subsidyOffered: 'Financial reimbursement and seed fund',
        status: 'pending',
      };
      setReviewQueue((prev) => [newQueueItem, ...prev]);
      setIngestUrl('');
      showToast('Document ingested & AI rules extracted! Added to Review Queue.', 'success');
      setActiveTab('review_queue');
    }, 1500);
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '1rem 0 4rem' }}>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
            <Badge variant="primary" pill size="sm">
              <ShieldCheck size={14} /> Ministry Administration Console
            </Badge>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, color: 'var(--color-text)' }}>
            Scheme Intelligence & Rules Studio
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button
            variant="outline"
            icon={Download}
            onClick={() => showToast('Exporting active scheme ruleset (JSON)...', 'info')}
          >
            Export Rules
          </Button>
          <Button
            variant="accent"
            icon={Plus}
            onClick={() => setActiveTab('rule_builder')}
          >
            Create New Scheme
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--color-border)',
          marginBottom: '2rem',
          overflowX: 'auto',
        }}
      >
        {[
          { id: 'analytics', label: 'Dashboard & Analytics' },
          { id: 'schemes', label: `Scheme Master Catalog (${schemes.length})` },
          { id: 'rule_builder', label: 'Deterministic Rule Builder' },
          { id: 'review_queue', label: `AI Review Queue (${reviewQueue.length})`, badge: reviewQueue.length > 0 },
          { id: 'ingest', label: 'Crawl & Ingest Pipeline' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.75rem 1.25rem',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid var(--color-primary)' : '2px solid transparent',
              backgroundColor: 'transparent',
              color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              fontWeight: activeTab === tab.id ? 700 : 500,
              fontSize: '0.925rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
          >
            <span>{tab.label}</span>
            {tab.badge && (
              <span
                style={{
                  backgroundColor: 'var(--color-accent)',
                  color: '#fff',
                  fontSize: '0.7rem',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '999px',
                }}
              >
                {reviewQueue.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2.5rem',
            }}
          >
            {[
              { label: 'Total Cataloged Schemes', val: '1,452', icon: Database, color: '#4F46E5', sub: '+12 added this week' },
              { label: 'Pending AI Extracted Queue', val: `${reviewQueue.length}`, icon: Cpu, color: '#FF6F00', sub: 'Awaiting gazette verification' },
              { label: 'Citizen Rule Matches', val: '2,840,119', icon: TrendingUp, color: '#059669', sub: '99.4% verification rate' },
              { label: 'System Rule Precision', val: '100.0%', icon: ShieldCheck, color: '#7C3AED', sub: 'Deterministic verification' },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={idx}
                  variant="elevated"
                  style={{
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                      {stat.label}
                    </span>
                    <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-md)', backgroundColor: `${stat.color}15`, color: stat.color }}>
                      <Icon size={20} />
                    </div>
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--color-text)', lineHeight: 1.1 }}>
                    {stat.val}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.4rem' }}>
                    {stat.sub}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* 3D Telemetry Spatial Node Monitoring */}
          <div
            className="card card-elevated"
            style={{
              padding: '2rem',
              borderRadius: 'var(--radius-xl)',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
              marginBottom: '2rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              alignItems: 'center',
              gap: '2rem',
            }}
          >
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <Badge variant="accent" pill size="sm">
                  Live Spatial Telemetry
                </Badge>
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text)', margin: '0 0 0.5rem' }}>
                State Node Synchronization Matrix
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: '0 0 1.25rem' }}>
                Real-time heartbeat across all 28 State Nodal DIC Gateways and SIDBI credit rating nodes. Click and spin the 3D mesh to inspect regional latency.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.8rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Average Latency:</span>
                  <div style={{ fontWeight: 800, color: 'var(--color-success)', fontSize: '1.1rem' }}>14ms (Optimal)</div>
                </div>
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Gazette Sync Rate:</span>
                  <div style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: '1.1rem' }}>99.98%</div>
                </div>
              </div>
            </div>

            <div style={{ minHeight: '300px', position: 'relative' }}>
              <NetworkGlobeScene height="300px" />
              <div style={{ textAlign: 'center', marginTop: '-0.5rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                Interactive 3D Nodal Mesh (Rotate to inspect)
              </div>
            </div>
          </div>

          {/* Quick Queue Callout */}
          <div
            className="card card-elevated"
            style={{
              padding: '1.75rem 2rem',
              borderRadius: 'var(--radius-xl)',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.3rem' }}>
                AI Ingestion Pipeline Active
              </h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                {reviewQueue.length} schemes extracted from official press releases are awaiting manual gazette verification.
              </p>
            </div>
            <Button variant="primary" onClick={() => setActiveTab('review_queue')}>
              Open Review Queue ({reviewQueue.length})
            </Button>
          </div>
        </div>
      )}

      {/* TAB 2: SCHEME CATALOG TABLE */}
      {activeTab === 'schemes' && (
        <Card variant="elevated" style={{ padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', maxWidth: '350px', width: '100%' }}>
              <Input
                placeholder="Search scheme name or ministry..."
                icon={Search}
                style={{ marginBottom: 0 }}
              />
            </div>
            <Badge variant="neutral">Showing {schemes.length} Schemes</Badge>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                  <th style={{ padding: '0.75rem' }}>Code</th>
                  <th style={{ padding: '0.75rem' }}>Scheme Title</th>
                  <th style={{ padding: '0.75rem' }}>Ministry</th>
                  <th style={{ padding: '0.75rem' }}>Rules</th>
                  <th style={{ padding: '0.75rem' }}>Status</th>
                  <th style={{ padding: '0.75rem' }}>Version</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {schemes.map((sc) => (
                  <tr key={sc.id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                    <td style={{ padding: '1rem 0.75rem', fontFamily: 'monospace', fontWeight: 600 }}>{sc.id}</td>
                    <td style={{ padding: '1rem 0.75rem', fontWeight: 700, color: 'var(--color-text)' }}>{sc.name}</td>
                    <td style={{ padding: '1rem 0.75rem', color: 'var(--color-text-secondary)' }}>{sc.ministry}</td>
                    <td style={{ padding: '1rem 0.75rem' }}>
                      <Badge variant="primary" size="sm">{sc.rulesCount} Rules</Badge>
                    </td>
                    <td style={{ padding: '1rem 0.75rem' }}>
                      <Badge variant={sc.status === 'published' ? 'success' : 'warning'} size="sm">
                        {sc.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td style={{ padding: '1rem 0.75rem', color: 'var(--color-text-muted)' }}>{sc.version}</td>
                    <td style={{ padding: '1rem 0.75rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSchemeForRule(sc.id);
                            setActiveTab('rule_builder');
                          }}
                          style={{
                            background: 'none',
                            border: '1px solid var(--color-border)',
                            borderRadius: '4px',
                            padding: '0.35rem 0.6rem',
                            cursor: 'pointer',
                            color: 'var(--color-primary)',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                          }}
                        >
                          Rules
                        </button>
                        <button
                          type="button"
                          onClick={() => setVersionModalScheme(sc)}
                          style={{
                            background: 'none',
                            border: '1px solid var(--color-border)',
                            borderRadius: '4px',
                            padding: '0.35rem 0.6rem',
                            cursor: 'pointer',
                            color: 'var(--color-text-secondary)',
                            fontSize: '0.8rem',
                          }}
                        >
                          History
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 3: DYNAMIC RULE BUILDER */}
      {activeTab === 'rule_builder' && (
        <Card variant="elevated" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                Deterministic Eligibility Logic Studio
              </h2>
              <p style={{ margin: '0.25rem 0 0', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                Every clause is evaluated strictly as a Boolean condition in our matching pipeline.
              </p>
            </div>

            <Button variant="primary" icon={Plus} size="sm" onClick={addRuleRow}>
              Add Rule Clause
            </Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
            {rules.map((rule, idx) => (
              <div
                key={rule.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '70px 1.5fr 110px 1.5fr 40px',
                  gap: '0.75rem',
                  alignItems: 'center',
                  backgroundColor: 'var(--color-bg)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  {idx === 0 ? 'IF' : 'AND'}
                </span>

                <select
                  value={rule.field}
                  onChange={(e) => updateRuleField(rule.id, 'field', e.target.value)}
                  style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.85rem' }}
                >
                  <option value="investment_in_plant_machinery">Investment in Plant & Machinery (₹)</option>
                  <option value="annual_turnover">Annual Turnover (₹)</option>
                  <option value="sector">Sector</option>
                  <option value="entity_type">Entity Structure</option>
                  <option value="social_category">Social Category</option>
                  <option value="gender">Founder Gender</option>
                  <option value="area_type">Area Type (Rural/Urban)</option>
                  <option value="state">State / UT</option>
                </select>

                <select
                  value={rule.operator}
                  onChange={(e) => updateRuleField(rule.id, 'operator', e.target.value)}
                  style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.85rem' }}
                >
                  <option value="<=">&le; (Less/Equal)</option>
                  <option value=">=">&ge; (Greater/Equal)</option>
                  <option value="==">== (Exact Match)</option>
                  <option value="in">IN (List of values)</option>
                  <option value="!=">!= (Not Equal)</option>
                </select>

                <input
                  type="text"
                  value={rule.value}
                  onChange={(e) => updateRuleField(rule.id, 'value', e.target.value)}
                  placeholder="Value e.g. 50000000"
                  style={{ padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.85rem' }}
                />

                <button
                  type="button"
                  onClick={() => removeRuleRow(rule.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-danger)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title="Remove clause"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <Button variant="ghost" onClick={() => showToast('Testing rules on test profile...', 'info')}>
              Dry-Run Rules Test
            </Button>
            <Button
              variant="accent"
              onClick={() => showToast('Rule schema compiled and deployed to matcher engine!', 'success')}
            >
              Publish & Increment Version
            </Button>
          </div>
        </Card>
      )}

      {/* TAB 4: AI REVIEW QUEUE */}
      {activeTab === 'review_queue' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
              Verify AI-extracted eligibility rules before publishing to the public citizen portal.
            </p>
            <Badge variant="accent">{reviewQueue.length} Pending Review</Badge>
          </div>

          {reviewQueue.length === 0 ? (
            <Card style={{ padding: '3rem', textAlign: 'center', borderRadius: 'var(--radius-xl)' }}>
              <Check size={40} color="var(--color-success)" style={{ margin: '0 auto 1rem' }} />
              <h3>All Caught Up!</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                No pending scheme drafts in the ingestion queue.
              </p>
            </Card>
          ) : (
            reviewQueue.map((item) => (
              <Card
                key={item.id}
                variant="elevated"
                style={{
                  padding: '2rem',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                      <Badge variant="primary" size="sm">{item.ministry}</Badge>
                      <Badge variant="success" size="sm">{item.aiConfidence}% AI Confidence</Badge>
                    </div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: 'var(--color-text)' }}>
                      {item.schemeName}
                    </h3>
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.8rem', color: 'var(--color-primary)', textDecoration: 'none', display: 'inline-block', marginTop: '0.2rem' }}
                    >
                      Official Source Gazette URL ↗
                    </a>
                  </div>

                  <div style={{ display: 'flex', gap: '0.6rem' }}>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={X}
                      onClick={() => handleRejectQueueItem(item)}
                    >
                      Reject Draft
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={Check}
                      onClick={() => handleApproveQueueItem(item)}
                    >
                      Approve & Publish
                    </Button>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--color-bg)',
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    marginBottom: '1rem',
                  }}
                >
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    Parsed Financial Subsidy Benefit
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-success)' }}>
                    {item.subsidyOffered}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Extracted Rule Conditions
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {item.extractedRules.map((r, i) => (
                      <span
                        key={i}
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid var(--color-border)',
                          padding: '0.35rem 0.75rem',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.8rem',
                          fontFamily: 'monospace',
                        }}
                      >
                        {r.field} {r.op} {r.val}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* TAB 5: INGESTION PIPELINE */}
      {activeTab === 'ingest' && (
        <Card variant="elevated" style={{ padding: '2.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', maxWidth: '800px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
            Trigger AI Gazette Web Crawler
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
            Provide a direct PDF link or official ministry press portal. Our crawler parses headings, eligibility bullets, and financial schedules into JSON rule trees.
          </p>

          <form onSubmit={handleTriggerIngest}>
            <Input
              label="Gazette Circular or Press Notification URL"
              placeholder="https://msme.gov.in/sites/default/files/notification-2026.pdf"
              value={ingestUrl}
              onChange={(e) => setIngestUrl(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="accent"
              loading={isIngesting}
              icon={RefreshCw}
              style={{ marginTop: '0.5rem' }}
            >
              Crawl & Extract Rules
            </Button>
          </form>
        </Card>
      )}

      {/* VERSION HISTORY MODAL */}
      {versionModalScheme && (
        <Modal
          isOpen={!!versionModalScheme}
          onClose={() => setVersionModalScheme(null)}
          title={`Version History: ${versionModalScheme.name.substring(0, 30)}...`}
          subtitle="Audit trail of eligibility modifications made by ministry officials."
          footer={
            <Button variant="primary" onClick={() => setVersionModalScheme(null)}>
              Close
            </Button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { ver: 'v2.4 (Current)', date: '10 Sep 2026', by: 'Officer R. Sharma (Director MSME)', note: 'Expanded project ceiling for manufacturing units from ₹25L to ₹50L.' },
              { ver: 'v2.3', date: '14 Jan 2026', by: 'Tech Ops Team', note: 'Added transgender affirmative category 35% margin subsidy parity.' },
              { ver: 'v2.0', date: '01 Jun 2025', by: 'System Migration', note: 'Initial gazette rule synchronization.' },
            ].map((entry, idx) => (
              <div
                key={idx}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-primary)' }}>{entry.ver}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{entry.date}</span>
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
                  By: {entry.by}
                </div>
                <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--color-text)' }}>
                  {entry.note}
                </p>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
