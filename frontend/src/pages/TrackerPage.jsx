import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bookmark, 
  Clock, 
  CheckCircle2, 
  Send, 
  FileText, 
  ChevronRight, 
  Sparkles, 
  Award,
  ExternalLink,
  Plus
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';
import { formatRupees } from '../utils/formatCurrency';

export default function TrackerPage() {
  const { showToast } = useToast();

  const [applications, setApplications] = useState([
    {
      id: 'app-1',
      schemeName: "Prime Minister's Employment Generation Programme (PMEGP)",
      schemeId: 'pmegp',
      ministry: 'Ministry of MSME',
      subsidy: '₹12,50,000 (35% Margin)',
      status: 'applied', // 'saved' | 'applied' | 'under_review' | 'approved'
      ackNumber: 'KVIC-MH-2026-98124',
      appliedDate: '12 Sep 2026',
      notes: 'Submitted via District Industries Centre (DIC) Pune.',
    },
    {
      id: 'app-2',
      schemeName: 'Stand-Up India Scheme',
      schemeId: 'stand-up-india',
      ministry: 'Ministry of Finance',
      subsidy: '₹75,00,000 Composite Loan',
      status: 'saved',
      ackNumber: '',
      appliedDate: '-',
      notes: 'Need to finalize partnership deed with majority woman shareholding.',
    },
    {
      id: 'app-3',
      schemeName: 'Credit Guarantee Scheme (CGTMSE)',
      schemeId: 'cgtmse',
      ministry: 'SIDBI',
      subsidy: '85% Collateral Guarantee',
      status: 'under_review',
      ackNumber: 'CGTMSE-APP-5510',
      appliedDate: '01 Aug 2026',
      notes: 'Bank of Baroda zonal committee verification in progress.',
    },
  ]);

  const [editModalApp, setEditModalApp] = useState(null);
  const [modalAck, setModalAck] = useState('');
  const [modalNotes, setModalNotes] = useState('');
  const [modalStatus, setModalStatus] = useState('saved');

  const columns = [
    { key: 'saved', label: 'Bookmarked / Saved', count: applications.filter((a) => a.status === 'saved').length, color: '#64748B' },
    { key: 'applied', label: 'Application Submitted', count: applications.filter((a) => a.status === 'applied').length, color: '#4F46E5' },
    { key: 'under_review', label: 'Under Verification', count: applications.filter((a) => a.status === 'under_review').length, color: '#D97706' },
    { key: 'approved', label: 'Sanctioned & Disbursed', count: applications.filter((a) => a.status === 'approved').length, color: '#059669' },
  ];

  const handleOpenEdit = (app) => {
    setEditModalApp(app);
    setModalAck(app.ackNumber || '');
    setModalNotes(app.notes || '');
    setModalStatus(app.status);
  };

  const handleSaveModal = () => {
    if (!editModalApp) return;
    setApplications((prev) =>
      prev.map((a) =>
        a.id === editModalApp.id
          ? { ...a, status: modalStatus, ackNumber: modalAck, notes: modalNotes }
          : a
      )
    );
    showToast('Application record updated successfully!', 'success');
    setEditModalApp(null);
  };

  const moveStatus = (appId, nextStatus) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: nextStatus } : a))
    );
    showToast(`Status updated to ${nextStatus.replace('_', ' ')}!`, 'success');
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '1rem 0 4rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '2.5rem',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, color: 'var(--color-text)' }}>
            Application Pipeline Tracker
          </h1>
          <p style={{ margin: '0.35rem 0 0', color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            Track progress from initial bookmarking through bank nodal verification and subsidy disbursement.
          </p>
        </div>

        <Link to="/intake" style={{ textDecoration: 'none' }}>
          <Button variant="accent" icon={Plus}>
            Find New Schemes
          </Button>
        </Link>
      </div>

      {/* Kanban Pipeline Board */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
          alignItems: 'flex-start',
        }}
      >
        {columns.map((col) => {
          const colApps = applications.filter((a) => a.status === col.key);

          return (
            <div
              key={col.key}
              style={{
                backgroundColor: 'var(--color-bg)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--color-border)',
                padding: '1.25rem',
                minHeight: '400px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Column Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1rem',
                  paddingBottom: '0.75rem',
                  borderBottom: `2px solid ${col.color}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-text)' }}>
                    {col.label}
                  </span>
                </div>
                <Badge variant="neutral" pill size="sm">
                  {col.count}
                </Badge>
              </div>

              {/* Cards in Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                {colApps.length === 0 ? (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '2.5rem 1rem',
                      color: 'var(--color-text-muted)',
                      fontSize: '0.85rem',
                      fontStyle: 'italic',
                    }}
                  >
                    No schemes in this stage.
                  </div>
                ) : (
                  colApps.map((app) => (
                    <Card
                      key={app.id}
                      variant="elevated"
                      style={{
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-lg)',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid var(--color-border)',
                        boxShadow: 'var(--shadow-sm)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                          {app.ministry}
                        </div>
                        <h4 style={{ fontSize: '0.975rem', fontWeight: 700, margin: '0 0 0.5rem', color: 'var(--color-text)', lineHeight: 1.3 }}>
                          {app.schemeName}
                        </h4>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-success)', marginBottom: '0.6rem' }}>
                          {app.subsidy}
                        </div>

                        {app.ackNumber && (
                          <div style={{ fontSize: '0.75rem', backgroundColor: 'var(--color-bg)', padding: '0.35rem 0.5rem', borderRadius: '4px', marginBottom: '0.6rem', color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>
                            Ref: {app.ackNumber}
                          </div>
                        )}

                        {app.notes && (
                          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: '0 0 0.75rem', lineHeight: 1.4 }}>
                            {app.notes}
                          </p>
                        )}
                      </div>

                      {/* Card Action footer */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderTop: '1px solid var(--color-border-light)',
                          paddingTop: '0.75rem',
                          marginTop: '0.5rem',
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(app)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-primary)',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            padding: 0,
                          }}
                        >
                          Edit / Notes
                        </button>

                        {/* Quick progress button */}
                        {app.status === 'saved' && (
                          <button
                            type="button"
                            onClick={() => moveStatus(app.id, 'applied')}
                            style={{
                              padding: '0.3rem 0.6rem',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--color-primary)',
                              backgroundColor: 'var(--color-primary-50)',
                              color: 'var(--color-primary)',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            Mark Applied →
                          </button>
                        )}

                        {app.status === 'applied' && (
                          <button
                            type="button"
                            onClick={() => moveStatus(app.id, 'under_review')}
                            style={{
                              padding: '0.3rem 0.6rem',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--color-warning)',
                              backgroundColor: 'var(--color-warning-bg)',
                              color: 'var(--color-warning)',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            In Review →
                          </button>
                        )}

                        {app.status === 'under_review' && (
                          <button
                            type="button"
                            onClick={() => moveStatus(app.id, 'approved')}
                            style={{
                              padding: '0.3rem 0.6rem',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--color-success)',
                              backgroundColor: 'var(--color-success-bg)',
                              color: 'var(--color-success)',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            Mark Sanctioned ✓
                          </button>
                        )}
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* EDIT MODAL */}
      {editModalApp && (
        <Modal
          isOpen={!!editModalApp}
          onClose={() => setEditModalApp(null)}
          title="Update Application Details"
          subtitle={editModalApp.schemeName}
          footer={
            <>
              <Button variant="ghost" onClick={() => setEditModalApp(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveModal}>
                Save Changes
              </Button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Stage / Status
              </label>
              <select
                value={modalStatus}
                onChange={(e) => setModalStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.9rem',
                }}
              >
                <option value="saved">Bookmarked / Saved</option>
                <option value="applied">Application Submitted</option>
                <option value="under_review">Under Verification</option>
                <option value="approved">Sanctioned & Disbursed</option>
              </select>
            </div>

            <Input
              label="Govt Portal Acknowledgment / Ref No."
              placeholder="e.g. KVIC-2026-XXXX"
              value={modalAck}
              onChange={(e) => setModalAck(e.target.value)}
            />

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Bank Officer or Nodal Notes
              </label>
              <textarea
                value={modalNotes}
                onChange={(e) => setModalNotes(e.target.value)}
                placeholder="Notes on document submissions, bank branch visits, or queries raised..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.9rem',
                }}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
