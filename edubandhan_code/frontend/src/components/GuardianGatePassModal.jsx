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

  // Form state for Branch 1 (Deputing Substitute Receiver) - Blank for parent creation
  const [receiverName, setReceiverName] = useState('');
  const [receiverRelation, setReceiverRelation] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [isQrGenerated, setIsQrGenerated] = useState(false);
  
  // State for Branch 2 (Emergency Departure Freeze)
  const [isFrozen, setIsFrozen] = useState(false);

  // Notification state
  const [isSchoolNotified, setIsSchoolNotified] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [copied, setCopied] = useState(false);

  // Auto-refresh countdown for dynamic QR
  const [secondsRemaining, setSecondsRemaining] = useState(180);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setSecondsRemaining(prev => (prev <= 1 ? 180 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  // Construct the verified pass URL to encode in the QR and share
  const buildPassUrl = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://edubandhan.in';
    const params = new URLSearchParams({
      child: childName,
      class: childClass,
      roll: childRoll,
      receiver: receiverName,
      relation: receiverRelation,
      mob: receiverPhone,
      parent: parentName,
      parent_mob: parentPhone,
      status: isFrozen ? 'FROZEN' : 'ACTIVE',
      school: schoolName,
      id: `EB-SURAKSHA-${secondsRemaining}`
    });
    return `${origin}/suraksha_pass?${params.toString()}`;
  };

  const passUrl = buildPassUrl();

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleGenerateQr = () => {
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
    showToast(`✅ Official Suraksha Gate Pass QR generated for ${receiverName.trim()}!`);
  };

  const handleCopyLink = () => {
    if (!isQrGenerated || !receiverName.trim()) {
      showToast("Please generate the Official Gate QR Code first!");
      return;
    }
    try {
      navigator.clipboard.writeText(passUrl);
      setCopied(true);
      showToast("Pass link copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch (e) { }
  };

  const handleShareWhatsApp = () => {
    if (!isQrGenerated || !receiverName.trim()) {
      showToast("Please generate the Official Gate QR Code first!");
      return;
    }
    const shareText = `🛡️ Official EduBandhan Suraksha Pass for ${childName} (${childClass}):\n\nAuthorized Substitute Receiver: ${receiverName} (${receiverRelation || 'Authorized Pickup'}, Mob: ${receiverPhone || 'Not specified'})\nAuthorizing Parent: ${parentName} (${parentPhone})\n\nOpen & Scan Live Pass:\n${passUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
    showToast(`Shared substitute QR pass with ${receiverName} via WhatsApp!`);
  };

  const handleNotifySchool = () => {
    if (!receiverName.trim()) {
      showToast("Please enter the Substitute Receiver's Name first!");
      return;
    }
    setIsSchoolNotified(true);
    showToast(`School administration & Main Gate notified: ${receiverName} authorized to pick up ${childName}`);
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
          background: isFrozen
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
              backgroundColor: isFrozen ? 'rgba(255, 255, 255, 0.2)' : 'rgba(21, 94, 239, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              {isFrozen ? <AlertOctagon size={20} /> : <ShieldCheck size={20} />}
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 900, margin: 0, fontFamily: 'var(--font-heading)' }}>
                {isFrozen ? 'CHILD DEPARTURE FROZEN' : 'EduBandhan Suraksha Pass™'}
              </h2>
              <span style={{ fontSize: '11px', opacity: 0.85 }}>
                {schoolName} &bull; Anti-Proxy Child Security System
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
          gap: '20px'
        }}>

          {/* BRANCH 2: EMERGENCY DEPARTURE FREEZE (Right branch in diagram) */}
          <div style={{
            backgroundColor: isFrozen ? '#FEF2F2' : 'var(--bg-secondary, #F8FAFC)',
            border: `1.5px solid ${isFrozen ? '#EF4444' : 'var(--border-subtle, #E2E8F0)'}`,
            borderRadius: '14px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: isFrozen ? '#EF4444' : 'rgba(100, 116, 139, 0.15)',
                color: isFrozen ? '#FFFFFF' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {isFrozen ? <Lock size={18} /> : <Unlock size={18} />}
              </div>
              <div>
                <strong style={{ fontSize: '13px', color: isFrozen ? '#991B1B' : 'var(--text-main)', display: 'block' }}>
                  {isFrozen ? 'Departure Freeze Active!' : 'Block Child Departure For A While'}
                </strong>
                <span style={{ fontSize: '11px', color: isFrozen ? '#7F1D1D' : 'var(--text-muted)' }}>
                  {isFrozen
                    ? 'Gate security will hold student in reception until you arrive.'
                    : 'Freeze leave of child till you leave or arrive at the school.'}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                const next = !isFrozen;
                setIsFrozen(next);
                showToast(next
                  ? 'EMERGENCY FREEZE ACTIVATED: School security alerted to block departure.'
                  : 'Departure re-authorized.');
              }}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: isFrozen ? '#10B981' : '#EF4444',
                color: '#FFFFFF',
                boxShadow: isFrozen ? '0 2px 8px rgba(16, 185, 129, 0.3)' : '0 2px 8px rgba(239, 68, 68, 0.3)',
                whiteSpace: 'nowrap'
              }}
            >
              {isFrozen ? 'Unfreeze Release' : 'Freeze Departure'}
            </button>
          </div>

          {/* BRANCH 1: DEPUTE SUBSTITUTE RECEIVER (Left branch in diagram) */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(21, 94, 239, 0.04) 0%, rgba(2, 132, 199, 0.08) 100%)',
            border: `2px solid ${isFrozen ? '#F87171' : '#155EEF'}`,
            borderRadius: '16px',
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                fontSize: '11px',
                fontWeight: 800,
                color: isFrozen ? '#DC2626' : '#155EEF',
                backgroundColor: isFrozen ? 'rgba(239, 68, 68, 0.12)' : 'rgba(21, 94, 239, 0.12)',
                padding: '4px 10px',
                borderRadius: '999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isFrozen ? '#DC2626' : '#10B981' }} />
                {isFrozen ? 'PASS TEMPORARILY BLOCKED' : 'SEND SUBSTITUTE SCAN QR'}
              </span>

              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                <Clock size={12} />
                <span>Refreshes in {secondsRemaining}s</span>
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
                <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', display: 'block' }}>Child To Pick (x)</span>
                <strong style={{ fontSize: '13.5px', color: 'var(--text-main)' }}>{childName}</strong>
                <span style={{ fontSize: '11px', color: '#155EEF', display: 'block' }}>{childClass} (xx)</span>
              </div>
              <div>
                <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', display: 'block' }}>Authorizing Parent</span>
                <strong style={{ fontSize: '13.5px', color: 'var(--text-main)' }}>{parentName}</strong>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>{parentPhone}</span>
              </div>
            </div>

            {/* Input Form for Substitute Receiver: y, yy, xxx */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={15} color="#155EEF" />
                <span>Create Substitute Receiver Details:</span>
              </span>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '3px' }}>
                    Receiver Name (y) <span style={{ color: '#EF4444' }}>*</span>:
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
                    Relation (yy):
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
                      border: '1.5px solid var(--border-subtle)',
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
                  Receiver Mobile (xxx) <span style={{ color: '#EF4444' }}>*</span>:
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

            {/* Notify Org Button (Notifying school/guards) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              backgroundColor: '#FFFFFF',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)'
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
                transition: 'all 0.2s ease',
                marginTop: '2px'
              }}
            >
              <QrCode size={18} />
              <span>{isQrGenerated ? '✓ QR Code Generated (Click to Re-generate)' : '⚡ Generate Official Gate QR Code'}</span>
            </button>

            {/* CONDITIONAL QR CODE DISPLAY */}
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
                  QR Code Will Appear Here
                </strong>
                <span style={{ fontSize: '11.5px', color: '#64748B', maxWidth: '340px', lineHeight: 1.4 }}>
                  Fill in the substitute receiver details above and tap <strong>"Generate Official Gate QR Code"</strong>.
                </span>
              </div>
            ) : (
              <div style={{
                backgroundColor: '#FFFFFF',
                padding: '18px 20px',
                borderRadius: '16px',
                border: '2px solid #10B981',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.15)',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: '#ECFDF3',
                  color: '#027A48',
                  fontSize: '10px',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '999px',
                  border: '1px solid #A6F4C5'
                }}>
                  ● LIVE &amp; SCANNABLE
                </div>

                {/* Real Scannable High-Res QR Code Image */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=6&data=${encodeURIComponent(passUrl)}`}
                  alt="EduBandhan Suraksha Gate Pass QR"
                  style={{
                    width: '170px',
                    height: '170px',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#FFFFFF',
                    padding: '6px',
                    display: 'block'
                  }}
                />

                <div style={{
                  marginTop: '10px',
                  fontSize: '13px',
                  fontWeight: 800,
                  color: '#0F172A',
                  textAlign: 'center'
                }}>
                  PASS AUTHORIZED FOR: <span style={{ color: '#155EEF' }}>{receiverName.toUpperCase()}</span>
                </div>
                <span style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px', textAlign: 'center' }}>
                  {receiverRelation ? `Relation: ${receiverRelation} • ` : ''}Mobile: {receiverPhone}
                </span>
                <span style={{ fontSize: '11px', color: '#059669', marginTop: '6px', fontWeight: 600 }}>
                  ✓ Scan with any mobile camera to view full verified departure details.
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
