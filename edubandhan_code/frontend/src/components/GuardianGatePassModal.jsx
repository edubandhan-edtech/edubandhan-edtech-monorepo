import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  QrCode,
  Clock,
  User,
  Users,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  X,
  Share2,
  Phone,
  Send,
  Sparkles,
  ExternalLink,
  Car,
  BadgeCheck,
  AlertOctagon,
  Copy,
  Check,
  Megaphone
} from 'lucide-react';

export default function GuardianGatePassModal({ isOpen, onClose, currentUser, onOpenViewer }) {
  const childName = currentUser?.child_name || "Aarav Sharma";
  const childClass = currentUser?.child_class || "Class 8-B";
  const childRoll = currentUser?.child_roll || "02";
  const schoolName = currentUser?.school_name || "Delhi Public School";
  const parentName = currentUser?.full_name || "Mrs. Pooja Sharma";
  const parentPhone = currentUser?.phone || "+91 98765 43210";

  // MUTUAL EXCLUSIVITY: 'substitute' | 'freeze' (Parent can only choose ONE at a time)
  const [activeProtocol, setActiveProtocol] = useState('substitute');

  // Form state for Substitute Receiver
  const [receiverName, setReceiverName] = useState('');
  const [receiverRelation, setReceiverRelation] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [isQrGenerated, setIsQrGenerated] = useState(false);
  
  // State for Emergency Departure Freeze
  const [isFrozen, setIsFrozen] = useState(false);

  // Notification state
  const [isSchoolNotified, setIsSchoolNotified] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [copied, setCopied] = useState(false);

  // STATIC PASS ID (Never changes per second - completely static)
  const [staticPassId] = useState('EB-SURAKSHA-8492');

  // Mutually exclusive protocol switch handler
  const handleSelectProtocol = (mode) => {
    setActiveProtocol(mode);
    if (mode === 'freeze') {
      setIsFrozen(true);
      setIsQrGenerated(false); // Invalidate any substitute QR when departure is frozen
      showToast("Emergency Freeze protocol selected. Child departure will be blocked at the gate.");
    } else {
      setIsFrozen(false);
      showToast("Substitute Guardian protocol selected. Enter details to generate static QR.");
    }
  };

  // Construct the verified pass URL to encode in the QR and share (Completely STATIC)
  const buildPassUrl = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://edubandhan.in';
    const params = new URLSearchParams({
      child: childName,
      class: childClass,
      roll: childRoll,
      receiver: activeProtocol === 'substitute' ? receiverName : '',
      relation: activeProtocol === 'substitute' ? receiverRelation : '',
      mob: activeProtocol === 'substitute' ? receiverPhone : '',
      parent: parentName,
      parent_mob: parentPhone,
      status: activeProtocol === 'freeze' ? 'FROZEN' : 'ACTIVE',
      school: schoolName,
      id: staticPassId
    });
    return `${origin}/suraksha_pass?${params.toString()}`;
  };

  const passUrl = buildPassUrl();

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleGenerateQr = () => {
    if (activeProtocol !== 'substitute') {
      showToast("Cannot generate substitute pass while Departure Freeze is active!");
      return;
    }
    if (!receiverName.trim()) {
      showToast("Please enter the Substitute Receiver's Name first!");
      return;
    }
    if (!receiverPhone.trim()) {
      showToast("Please enter the Substitute Receiver's Mobile Number!");
      return;
    }
    setIsQrGenerated(true);
    setIsSchoolNotified(true);
    showToast(`✅ Static Suraksha Gate Pass QR generated for ${receiverName.trim()}!`);
  };

  const handleCopyLink = () => {
    if (activeProtocol === 'substitute' && (!isQrGenerated || !receiverName.trim())) {
      showToast("Please generate the Official Gate QR Code first!");
      return;
    }
    try {
      navigator.clipboard.writeText(passUrl);
      setCopied(true);
      showToast("Official pass link copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch (e) { }
  };

  const handleShareWhatsApp = () => {
    if (!isQrGenerated || !receiverName.trim()) {
      showToast("Please generate the Official Gate QR Code first!");
      return;
    }
    const shareText = `🛡️ Official EduBandhan Suraksha Pass for ${childName} (${childClass}):\n\nAuthorized Substitute Receiver: ${receiverName} (${receiverRelation || 'Authorized Pickup'}, Mob: ${receiverPhone || 'Not specified'})\nAuthorizing Parent: ${parentName} (${parentPhone})\n\nOpen & Scan Static Gate Pass:\n${passUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
    showToast(`Shared static QR pass with ${receiverName} via WhatsApp!`);
  };

  const handleNotifySchool = () => {
    if (activeProtocol === 'substitute' && !receiverName.trim()) {
      showToast("Please enter the Substitute Receiver's Name first!");
      return;
    }
    setIsSchoolNotified(true);
    showToast(activeProtocol === 'substitute'
      ? `School security notified: ${receiverName} authorized to pick up ${childName}`
      : `School security notified: Emergency Freeze active for ${childName}`);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(10, 25, 47, 0.78)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-surface, #FFFFFF)',
        width: '100%',
        maxWidth: '580px',
        maxHeight: '92vh',
        borderRadius: '20px',
        border: '1px solid var(--border-subtle, #E2E8F0)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative'
      }}>

        {/* Modal Top Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--border-subtle, #E2E8F0)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: activeProtocol === 'freeze'
            ? 'linear-gradient(135deg, #7F1D1D 0%, #991B1B 100%)'
            : 'linear-gradient(135deg, #102A56 0%, #0F172A 100%)',
          color: '#FFFFFF',
          transition: 'background 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: activeProtocol === 'freeze' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(21, 94, 239, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              {activeProtocol === 'freeze' ? <AlertOctagon size={20} /> : <ShieldCheck size={20} />}
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 900, margin: 0, fontFamily: 'var(--font-heading)' }}>
                {activeProtocol === 'freeze' ? 'CHILD DEPARTURE FROZEN' : 'EduBandhan Suraksha Pass™'}
              </h2>
              <span style={{ fontSize: '11px', opacity: 0.85 }}>
                {schoolName} &bull; {activeProtocol === 'freeze' ? 'Emergency Gate Security Hold' : 'Anti-Proxy Child Security System'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{
          padding: '20px 24px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px'
        }}>

          {/* MUTUALLY EXCLUSIVE ACTION SWITCHER: Parent can only pick ONE at a time */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            padding: '5px',
            backgroundColor: 'var(--bg-secondary, #F1F5F9)',
            borderRadius: '14px',
            border: '1px solid var(--border-subtle, #CBD5E1)'
          }}>
            <button
              type="button"
              onClick={() => handleSelectProtocol('substitute')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '11px 14px',
                borderRadius: '10px',
                border: 'none',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                backgroundColor: activeProtocol === 'substitute' ? '#155EEF' : 'transparent',
                color: activeProtocol === 'substitute' ? '#FFFFFF' : 'var(--text-muted, #64748B)',
                boxShadow: activeProtocol === 'substitute' ? '0 2px 8px rgba(21, 94, 239, 0.3)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <User size={15} />
              <span>Send Substitute Guardian</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectProtocol('freeze')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '11px 14px',
                borderRadius: '10px',
                border: 'none',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                backgroundColor: activeProtocol === 'freeze' ? '#DC2626' : 'transparent',
                color: activeProtocol === 'freeze' ? '#FFFFFF' : 'var(--text-muted, #64748B)',
                boxShadow: activeProtocol === 'freeze' ? '0 2px 8px rgba(220, 38, 38, 0.3)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Lock size={15} />
              <span>Freeze Child Departure</span>
            </button>
          </div>

          {/* PROTOCOL A: SEND SUBSTITUTE GUARDIAN (Exclusive to 'substitute' mode) */}
          {activeProtocol === 'substitute' && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(21, 94, 239, 0.04) 0%, rgba(2, 132, 199, 0.08) 100%)',
              border: '2px solid #155EEF',
              borderRadius: '16px',
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#155EEF',
                  backgroundColor: 'rgba(21, 94, 239, 0.12)',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                  SUBSTITUTE GUARDIAN PROTOCOL
                </span>

                <span style={{ fontSize: '11px', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                  <BadgeCheck size={13} color="#059669" />
                  <span>Static Official Pass ({staticPassId})</span>
                </span>
              </div>

              {/* Child & Parent Meta (x, xx, and Parent details) */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                padding: '12px',
                backgroundColor: 'var(--bg-surface, #FFFFFF)',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle, #E2E8F0)'
              }}>
                <div>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', display: 'block' }}>Child To Pick</span>
                  <strong style={{ fontSize: '13.5px', color: 'var(--text-main)' }}>{childName}</strong>
                  <span style={{ fontSize: '11px', color: '#155EEF', display: 'block' }}>{childClass} &bull; Roll #{childRoll}</span>
                </div>
                <div>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', display: 'block' }}>Authorizing Parent</span>
                  <strong style={{ fontSize: '13.5px', color: 'var(--text-main)' }}>{parentName}</strong>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>{parentPhone}</span>
                </div>
              </div>

              {/* Input Form for Substitute Receiver */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={15} color="#155EEF" />
                  <span>Depute Substitute Receiver Details:</span>
                </span>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '3px' }}>
                      Receiver Name <span style={{ color: '#EF4444' }}>*</span>:
                    </label>
                    <input
                      type="text"
                      value={receiverName}
                      onChange={e => {
                        setReceiverName(e.target.value);
                        setIsQrGenerated(false);
                      }}
                      placeholder="Enter substitute's full name"
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: `1.5px solid ${!receiverName.trim() ? '#93C5FD' : '#10B981'}`,
                        backgroundColor: '#FFFFFF',
                        fontSize: '13px',
                        fontWeight: 600,
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '3px' }}>
                      Relation to Child:
                    </label>
                    <input
                      type="text"
                      value={receiverRelation}
                      onChange={e => {
                        setReceiverRelation(e.target.value);
                        setIsQrGenerated(false);
                      }}
                      placeholder="e.g. Neighbor / Uncle / Driver"
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: '1.5px solid var(--border-subtle, #CBD5E1)',
                        backgroundColor: '#FFFFFF',
                        fontSize: '13px',
                        fontWeight: 600,
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '3px' }}>
                    Receiver Mobile Number <span style={{ color: '#EF4444' }}>*</span>:
                  </label>
                  <input
                    type="tel"
                    value={receiverPhone}
                    onChange={e => {
                      setReceiverPhone(e.target.value);
                      setIsQrGenerated(false);
                    }}
                    placeholder="Enter 10-digit mobile number"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: `1.5px solid ${!receiverPhone.trim() ? '#93C5FD' : '#10B981'}`,
                      backgroundColor: '#FFFFFF',
                      fontSize: '13px',
                      fontWeight: 600,
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Notify Org Button */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                backgroundColor: '#FFFFFF',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle, #CBD5E1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Megaphone size={16} color="#0284C7" />
                  <span style={{ fontSize: '12px', color: 'var(--text-main)', fontWeight: 600 }}>
                    Notify School &amp; Gate Security:
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleNotifySchool}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    backgroundColor: isSchoolNotified ? '#ECFDF3' : '#155EEF',
                    color: isSchoolNotified ? '#027A48' : '#FFFFFF',
                    border: isSchoolNotified ? '1px solid #A6F4C5' : 'none',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {isSchoolNotified ? '✓ School Notified' : 'Notify School'}
                </button>
              </div>

              {/* GENERATE OFFICIAL GATE QR CODE BUTTON */}
              <button
                type="button"
                onClick={handleGenerateQr}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 18px',
                  backgroundColor: isQrGenerated ? '#027A48' : '#155EEF',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '13.5px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: isQrGenerated
                    ? '0 4px 14px rgba(2, 122, 72, 0.35)'
                    : '0 4px 14px rgba(21, 94, 239, 0.35)',
                  transition: 'all 0.2s ease'
                }}
              >
                <QrCode size={18} />
                <span>{isQrGenerated ? '✓ Static QR Code Generated (Click to Re-generate)' : '⚡ Generate Static Gate QR Code'}</span>
              </button>

              {/* CONDITIONAL STATIC QR CODE DISPLAY */}
              {!isQrGenerated ? (
                <div style={{
                  padding: '24px 20px',
                  backgroundColor: '#F8FAFC',
                  border: '2px dashed #CBD5E1',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: '#EFF6FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#155EEF'
                  }}>
                    <QrCode size={26} />
                  </div>
                  <strong style={{ fontSize: '13.5px', color: '#1E293B' }}>
                    Static QR Code Will Appear Here
                  </strong>
                  <span style={{ fontSize: '11.5px', color: '#64748B', maxWidth: '340px', lineHeight: 1.4 }}>
                    Fill in the substitute receiver details above and tap <strong>"Generate Static Gate QR Code"</strong>.
                  </span>
                </div>
              ) : (
                <div style={{
                  backgroundColor: '#FFFFFF',
                  padding: '16px 20px',
                  borderRadius: '16px',
                  border: '2px solid #10B981',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  boxShadow: '0 8px 24px rgba(16, 185, 129, 0.15)',
                  gap: '12px'
                }}>
                  {/* Dedicated Status Badge Header: Safely Above the QR Code */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%'
                  }}>
                    <span style={{
                      backgroundColor: '#ECFDF3',
                      color: '#027A48',
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '4px 12px',
                      borderRadius: '999px',
                      border: '1px solid #A6F4C5',
                      letterSpacing: '0.3px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                      STATIC QR • VALID FOR DISMISSAL
                    </span>
                  </div>

                  {/* 100% Unobstructed Scannable QR Code */}
                  <div style={{
                    padding: '8px',
                    borderRadius: '12px',
                    border: '1.5px solid #E2E8F0',
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=6&data=${encodeURIComponent(passUrl)}`}
                      alt="EduBandhan Static Suraksha Gate Pass QR"
                      style={{
                        width: '180px',
                        height: '180px',
                        borderRadius: '6px',
                        display: 'block'
                      }}
                    />
                  </div>

                  <div style={{
                    fontSize: '13.5px',
                    fontWeight: 800,
                    color: '#0F172A',
                    textAlign: 'center'
                  }}>
                    PASS AUTHORIZED FOR: <span style={{ color: '#155EEF' }}>{receiverName.toUpperCase()}</span>
                  </div>
                  <span style={{ fontSize: '11.5px', color: '#64748B', textAlign: 'center' }}>
                    {receiverRelation ? `Relation: ${receiverRelation} • ` : ''}Mobile: {receiverPhone}
                  </span>
                  <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700, textAlign: 'center' }}>
                    ✓ 100% Clear &amp; Scannable • Static Gate Verification Pass
                  </span>
                </div>
              )}

              {/* Action Buttons: WhatsApp Share & Preview Scanned Pass */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '11px 14px',
                    backgroundColor: isQrGenerated ? '#25D366' : '#94A3B8',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: isQrGenerated ? 'pointer' : 'not-allowed',
                    boxShadow: isQrGenerated ? '0 2px 8px rgba(37, 211, 102, 0.35)' : 'none'
                  }}
                >
                  <Share2 size={14} />
                  <span>Send QR via WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!isQrGenerated || !receiverName.trim()) {
                      showToast("Please generate the Official Gate QR Code first!");
                      return;
                    }
                    if (onOpenViewer) {
                      onOpenViewer(passUrl);
                    } else {
                      window.open(passUrl, '_blank');
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '11px 14px',
                    backgroundColor: isQrGenerated ? '#155EEF' : '#94A3B8',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: isQrGenerated ? 'pointer' : 'not-allowed',
                    boxShadow: isQrGenerated ? '0 2px 8px rgba(21, 94, 239, 0.35)' : 'none'
                  }}
                >
                  <ExternalLink size={14} />
                  <span>Preview Scanned Pass</span>
                </button>
              </div>

            </div>
          )}

          {/* PROTOCOL B: EMERGENCY DEPARTURE FREEZE (Exclusive to 'freeze' mode) */}
          {activeProtocol === 'freeze' && (
            <div style={{
              backgroundColor: '#FEF2F2',
              border: '2px solid #EF4444',
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: '0 8px 24px rgba(239, 68, 68, 0.12)'
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
                    fontSize: '10.5px',
                    fontWeight: 900,
                    letterSpacing: '1px',
                    color: '#991B1B',
                    textTransform: 'uppercase'
                  }}>
                    • SECURITY PROTOCOL HOLD ACTIVE •
                  </span>
                  <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#991B1B', margin: '2px 0 0' }}>
                    DO NOT RELEASE CHILD AT MAIN GATE
                  </h3>
                </div>
              </div>

              <p style={{ fontSize: '13px', color: '#7F1D1D', margin: 0, lineHeight: 1.5 }}>
                You have issued an <strong>Emergency Departure Freeze</strong> for <strong>{childName}</strong> ({childClass}). 
                School security and faculty are instructed to escort student immediately to the <strong>Main Reception Desk</strong>. 
                No person (including previous substitutes) will be permitted to take the child until you arrive.
              </p>

              {/* Student & Emergency Contact Card */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1.5px solid #FCA5A5',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#991B1B', fontWeight: 700 }}>Emergency Contact Parent</span>
                  <strong style={{ fontSize: '14px', color: '#111827', display: 'block' }}>{parentName}</strong>
                  <span style={{ fontSize: '12px', color: '#4B5563' }}>{parentPhone}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Designated Desk</span>
                  <strong style={{ fontSize: '13px', color: '#991B1B' }}>Reception &bull; Gate 1</strong>
                </div>
              </div>

              {/* Actions for Departure Freeze */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    handleSelectProtocol('substitute');
                    showToast("Departure freeze cancelled. Normal dismissal re-authorized.");
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '12px 14px',
                    backgroundColor: '#10B981',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '12.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <Unlock size={15} />
                  <span>Unfreeze Departure</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (onOpenViewer) {
                      onOpenViewer(passUrl);
                    } else {
                      window.open(passUrl, '_blank');
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '12px 14px',
                    backgroundColor: '#DC2626',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '12.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)'
                  }}
                >
                  <ExternalLink size={15} />
                  <span>Preview Gate Hold Screen</span>
                </button>
              </div>

              <div style={{
                fontSize: '11px',
                color: '#991B1B',
                textAlign: 'center',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                padding: '6px 10px',
                borderRadius: '8px'
              }}>
                🔒 Mutual Exclusivity: Substitute pickup passes are disabled while Departure Freeze is active.
              </div>

            </div>
          )}

          {/* Copy Link & Close Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              onClick={handleCopyLink}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-secondary, #F1F5F9)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-main)',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {copied ? <Check size={13} color="#10B981" /> : <Copy size={13} />}
              <span>{copied ? 'Link Copied' : 'Copy Direct QR URL'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '6px 16px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-secondary, #F1F5F9)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-main)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>

        </div>

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#1E293B',
            color: '#FFFFFF',
            padding: '8px 16px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: 600,
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 10
          }}>
            <Sparkles size={14} color="#38BDF8" />
            <span>{toastMessage}</span>
          </div>
        )}

      </div>
    </div>
  );
}
