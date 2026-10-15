import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Phone,
  User,
  Users,
  CheckCircle2,
  Clock,
  Car,
  BadgeCheck,
  AlertOctagon,
  ArrowLeft,
  Building,
  School,
  Sparkles,
  Lock,
  Unlock,
  QrCode,
  Share2,
  Check
} from 'lucide-react';

export default function SurakshaPassViewer({ onBack, onSwitchTab }) {
  const [params, setParams] = useState({
    child: 'Aarav Sharma',
    classGrade: 'Class 8 - Section B',
    roll: '02',
    receiver: '',
    relation: '',
    receiverMob: '',
    parent: 'Mrs. Pooja Sharma (Mother)',
    parentMob: '+91 98765 43210',
    status: 'ACTIVE', // 'ACTIVE' | 'FROZEN'
    school: 'Delhi Public School',
    gate: 'Gate 1 (North Main Wing)',
    passId: 'EB-SURAKSHA-8492'
  });

  const [isApproved, setIsApproved] = useState(false);
  const [approvalTime, setApprovalTime] = useState(null);
  const [copied, setCopied] = useState(false);

  // Read URL query parameters if present (e.g. ?child=...&receiver=...&status=...)
  useEffect(() => {
    try {
      const search = window.location.search;
      if (search) {
        const q = new URLSearchParams(search);
        setParams(prev => ({
          child: q.get('child') || prev.child,
          classGrade: q.get('class') || prev.classGrade,
          roll: q.get('roll') || prev.roll,
          receiver: q.get('receiver') || prev.receiver,
          relation: q.get('relation') || prev.relation,
          receiverMob: q.get('mob') || prev.receiverMob,
          parent: q.get('parent') || prev.parent,
          parentMob: q.get('parent_mob') || prev.parentMob,
          status: q.get('status') ? q.get('status').toUpperCase() : prev.status,
          school: q.get('school') || prev.school,
          gate: q.get('gate') || prev.gate,
          passId: q.get('id') || prev.passId
        }));
      }
    } catch (e) {
      console.warn('Error reading query params in SurakshaPassViewer:', e);
    }
  }, []);

  const isFrozen = params.status === 'FROZEN';

  const handleGuardApproval = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    setIsApproved(true);
    setApprovalTime(timeStr);
  };

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) { }
  };

  return (
    <div style={{
      maxWidth: '680px',
      margin: '0 auto',
      padding: '20px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      fontFamily: 'var(--font-body, system-ui, sans-serif)'
    }}>

      {/* Top Navigation & App Branding */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '12px',
        borderBottom: '1px solid var(--border-subtle, #E2E8F0)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-secondary, #F1F5F9)',
                border: '1px solid var(--border-subtle, #CBD5E1)',
                color: 'var(--text-main, #0F172A)',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>
          )}
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#155EEF', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              EduBandhan Suraksha™
            </span>
            <h1 style={{ fontSize: '18px', fontWeight: 900, margin: 0, color: 'var(--text-main, #0F172A)' }}>
              Official Gate Verification Pass
            </h1>
          </div>
        </div>

        <button
          onClick={handleCopyLink}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 12px',
            borderRadius: '8px',
            backgroundColor: 'var(--bg-surface, #FFFFFF)',
            border: '1px solid var(--border-subtle, #CBD5E1)',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-main, #0F172A)',
            cursor: 'pointer'
          }}
        >
          {copied ? <Check size={14} color="#10B981" /> : <Share2 size={14} />}
          <span>{copied ? 'Link Copied!' : 'Share Pass'}</span>
        </button>
      </div>

      {/* CASE B: EMERGENCY FREEZE ACTIVE (DO NOT RELEASE) */}
      {isFrozen && (
        <div style={{
          backgroundColor: '#FEF2F2',
          border: '2px solid #EF4444',
          borderRadius: '16px',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxShadow: '0 10px 25px rgba(239, 68, 68, 0.15)',
          animation: 'pulse 2s infinite'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: '#EF4444',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <AlertOctagon size={26} />
            </div>
            <div>
              <span style={{
                fontSize: '11px',
                fontWeight: 900,
                letterSpacing: '1px',
                color: '#991B1B',
                textTransform: 'uppercase'
              }}>
                • SECURITY PROTOCOL HOLD •
              </span>
              <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#991B1B', margin: '2px 0 0' }}>
                DO NOT RELEASE CHILD
              </h2>
            </div>
          </div>

          <p style={{ fontSize: '13.5px', color: '#7F1D1D', margin: 0, lineHeight: 1.5 }}>
            The registered parent has issued an <strong>Emergency Departure Freeze</strong> for {params.child}. 
            Please accompany student to the Main Reception desk immediately.
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            backgroundColor: '#FFFFFF',
            borderRadius: '10px',
            border: '1px solid #FCA5A5'
          }}>
            <div>
              <span style={{ fontSize: '11px', color: '#991B1B', fontWeight: 600 }}>Emergency Contact Parent</span>
              <strong style={{ fontSize: '14px', color: '#111827', display: 'block' }}>{params.parent}</strong>
              <span style={{ fontSize: '12px', color: '#4B5563' }}>{params.parentMob}</span>
            </div>
            <a
              href={`tel:${params.parentMob.replace(/\s+/g, '')}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 16px',
                backgroundColor: '#DC2626',
                color: '#FFFFFF',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: 800,
                boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)'
              }}
            >
              <Phone size={15} />
              <span>Call Parent Now</span>
            </a>
          </div>
        </div>
      )}

      {/* CASE A: ACTIVE & AUTHORIZED PASS */}
      <div style={{
        backgroundColor: 'var(--bg-surface, #FFFFFF)',
        borderRadius: '20px',
        border: `2px solid ${isFrozen ? '#F87171' : isApproved ? '#10B981' : '#155EEF'}`,
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
        position: 'relative'
      }}>

        {/* Header Ribbon */}
        <div style={{
          padding: '16px 24px',
          background: isFrozen
            ? 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)'
            : isApproved
            ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
            : 'linear-gradient(135deg, #102A56 0%, #155EEF 100%)',
          color: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              {isFrozen ? <Lock size={18} /> : <ShieldCheck size={20} />}
            </div>
            <div>
              <span style={{ fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '0.8px', opacity: 0.85 }}>
                {params.school} &bull; Security Audit Log
              </span>
              <h2 style={{ fontSize: '16px', fontWeight: 900, margin: 0 }}>
                {isFrozen ? 'Release Blocked (Freeze Active)' : isApproved ? 'Departure Verified & Logged' : 'Authorized Dismissal Clearance'}
              </h2>
            </div>
          </div>

          <span style={{
            fontSize: '11px',
            fontWeight: 800,
            padding: '4px 10px',
            borderRadius: '999px',
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            letterSpacing: '0.5px'
          }}>
            {params.passId}
          </span>
        </div>

        {/* Pass Details Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* 1. CHILD TO PICK (x) & CLASS (xx) */}
          <div style={{
            padding: '16px 18px',
            backgroundColor: 'var(--bg-secondary, #F8FAFC)',
            borderRadius: '14px',
            border: '1px solid var(--border-subtle, #E2E8F0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: '#102A56',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                fontWeight: 900,
                border: '3px solid #155EEF',
                flexShrink: 0
              }}>
                {params.child.charAt(0)}
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted, #64748B)', textTransform: 'uppercase' }}>
                  Child to Pick
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 900, color: 'var(--text-main, #0F172A)', margin: '2px 0 0' }}>
                  {params.child}
                </h3>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted, #64748B)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{params.classGrade}</span>
                  <span>&bull;</span>
                  <span>Roll #{params.roll}</span>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted, #64748B)', display: 'block' }}>Designated Gate</span>
              <strong style={{ fontSize: '13px', color: '#155EEF' }}>{params.gate}</strong>
            </div>
          </div>

          {/* 2. RECEIVER NAME (y), RELATION (yy), MOBILE (xxx) */}
          <div style={{
            padding: '16px 18px',
            backgroundColor: 'rgba(21, 94, 239, 0.04)',
            borderRadius: '14px',
            border: '1.5px solid rgba(21, 94, 239, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                fontSize: '11px',
                fontWeight: 800,
                color: '#155EEF',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <BadgeCheck size={14} color="#155EEF" />
                Authorized Substitute Receiver
              </span>
              <span style={{ fontSize: '11px', color: '#0284C7', fontWeight: 700 }}>
                Matched via Parent Pass
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '2px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted, #64748B)', display: 'block' }}>
                  Receiver Name (y)
                </span>
                <strong style={{ fontSize: '16px', color: params.receiver ? 'var(--text-main, #0F172A)' : '#DC2626' }}>
                  {params.receiver || 'Pending Parent Designation'}
                </strong>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted, #64748B)', display: 'block' }}>
                  Relationship to Child (yy)
                </span>
                <strong style={{ fontSize: '15px', color: '#155EEF' }}>
                  {params.relation || 'Substitute Pickup'}
                </strong>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '8px',
              borderTop: '1px dashed rgba(21, 94, 239, 0.2)',
              marginTop: '4px'
            }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted, #64748B)' }}>Receiver Mobile (xxx):</span>
                <strong style={{ fontSize: '13.5px', color: 'var(--text-main, #0F172A)', marginLeft: '6px' }}>
                  {params.receiverMob || 'Awaiting entry'}
                </strong>
              </div>
              {params.receiverMob && (
                <a
                  href={`tel:${params.receiverMob.replace(/\s+/g, '')}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    color: '#155EEF',
                    textDecoration: 'none'
                  }}
                >
                  <Phone size={12} />
                  <span>Call Receiver</span>
                </a>
              )}
            </div>
          </div>

          {/* 3. AUTHORIZING PARENT NAME & NUMBER (Added as requested) */}
          <div style={{
            padding: '14px 18px',
            backgroundColor: '#F8FAFC',
            borderRadius: '14px',
            border: '1px solid var(--border-subtle, #E2E8F0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted, #64748B)', fontWeight: 600 }}>
                Authorized By Registered Parent:
              </span>
              <h4 style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--text-main, #0F172A)', margin: '2px 0 0' }}>
                {params.parent}
              </h4>
              <span style={{ fontSize: '12px', color: 'var(--text-muted, #64748B)' }}>
                Registered Phone: {params.parentMob}
              </span>
            </div>

            <a
              href={`tel:${params.parentMob.replace(/\s+/g, '')}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                backgroundColor: 'rgba(21, 94, 239, 0.1)',
                border: '1px solid rgba(21, 94, 239, 0.3)',
                borderRadius: '8px',
                color: '#155EEF',
                fontSize: '12.5px',
                fontWeight: 800,
                textDecoration: 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <Phone size={14} />
              <span>Call Parent to Verify</span>
            </a>
          </div>

          {/* 4. GUARD VERIFICATION ACTION BUTTON */}
          <div style={{
            borderTop: '1px solid var(--border-subtle, #E2E8F0)',
            paddingTop: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            {isApproved ? (
              <div style={{
                backgroundColor: '#ECFDF3',
                border: '1.5px solid #A6F4C5',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: '#027A48'
              }}>
                <CheckCircle2 size={24} style={{ flexShrink: 0 }} />
                <div>
                  <strong style={{ fontSize: '14px', display: 'block' }}>
                    Child Released &amp; Departure Logged at {approvalTime}
                  </strong>
                  <span style={{ fontSize: '12px', opacity: 0.9 }}>
                    Instant confirmation notification dispatched to {params.parent}. Gate ledger synchronized.
                  </span>
                </div>
              </div>
            ) : isFrozen ? (
              <div style={{
                textAlign: 'center',
                padding: '12px',
                backgroundColor: '#FEF2F2',
                borderRadius: '10px',
                color: '#991B1B',
                fontSize: '13px',
                fontWeight: 700
              }}>
                Action Disabled: Departure is Frozen by Parent
              </div>
            ) : (
              <button
                onClick={handleGuardApproval}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '14px 20px',
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14.5px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}
              >
                <CheckCircle2 size={18} />
                <span>Security Guard: Confirm &amp; Release Child</span>
              </button>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted, #64748B)', padding: '0 4px' }}>
              <span>DPDP 2023 Encrypted Verification</span>
              <span>EduBandhan Sovereign Smart Campus</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
