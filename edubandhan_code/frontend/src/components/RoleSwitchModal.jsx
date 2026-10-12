import React, { useEffect } from 'react';
import { 
  X, 
  ShieldAlert, 
  LogOut, 
  Lock, 
  ArrowRight, 
  AlertTriangle,
  UserCheck
} from 'lucide-react';

export default function RoleSwitchModal({
  isOpen,
  onClose,
  currentUser,
  attemptedRole,
  onConfirmLogoutAndSwitch,
  theme = 'light'
}) {
  const isDark = theme === 'dark';

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !currentUser) return null;

  const roleLabels = {
    admin: { label: 'School Admin', icon: '👑', color: '#1677FF', badge: 'SCHOOL_ADMIN' },
    teacher: { label: 'Teacher Desk', icon: '👩‍🏫', color: '#18B981', badge: 'TEACHER' },
    parent: { label: 'Parent Hub', icon: '👨‍👩‍👦', color: '#6C4CE8', badge: 'PARENT' }
  };

  const getNormalizedRoleKey = (roleStr) => {
    if (!roleStr) return 'admin';
    const r = String(roleStr).toUpperCase();
    if (r.includes('ADMIN')) return 'admin';
    if (r.includes('TEACH')) return 'teacher';
    if (r.includes('PARENT')) return 'parent';
    return 'admin';
  };

  const currentRoleKey = getNormalizedRoleKey(currentUser.role);
  const currentRoleMeta = roleLabels[currentRoleKey] || { label: currentUser.role, icon: '👤', color: '#1677FF', badge: currentUser.role };
  const attemptedRoleMeta = roleLabels[attemptedRole] || { label: attemptedRole, icon: '🔄', color: '#F59E0B', badge: attemptedRole?.toUpperCase() };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 12, 24, 0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '520px',
          backgroundColor: 'var(--bg-surface)',
          border: `1px solid ${isDark ? 'rgba(239, 68, 68, 0.35)' : 'rgba(239, 68, 68, 0.25)'}`,
          borderRadius: '16px',
          boxShadow: isDark 
            ? '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 30px rgba(239, 68, 68, 0.15)' 
            : '0 20px 45px -10px rgba(18, 33, 58, 0.18)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Gradient Bar */}
        <div style={{
          height: '5px',
          width: '100%',
          background: 'linear-gradient(90deg, #EF4444 0%, #F59E0B 50%, #EF4444 100%)'
        }} />

        {/* Modal Header */}
        <div style={{
          padding: '20px 24px 16px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          borderBottom: `1px solid var(--border-subtle)`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <ShieldAlert size={24} color="#EF4444" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                  color: '#EF4444',
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  padding: '2px 8px',
                  borderRadius: '6px'
                }}>
                  Security Enforcement
                </span>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  color: 'var(--text-muted)'
                }}>
                  <Lock size={12} /> Active Session Locked
                </span>
              </div>
              <h3 style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: 800,
                color: 'var(--text-main)',
                letterSpacing: '-0.3px'
              }}>
                Cannot Switch Role After Login
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
              e.currentTarget.style.color = 'var(--text-main)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
            title="Close warning"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Comparison Cards: Current Active Role vs Attempted Target Role */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            gap: '12px',
            padding: '16px',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)'
          }}>
            {/* Active User Card */}
            <div style={{
              padding: '12px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '10px',
              border: `1.5px solid ${currentRoleMeta.color}`,
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '22px', display: 'block', marginBottom: '4px' }}>
                {currentRoleMeta.icon}
              </span>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Active Identity
              </div>
              <div style={{ 
                fontSize: '13px', 
                fontWeight: 800, 
                color: 'var(--text-main)', 
                marginTop: '2px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis' 
              }}>
                {currentUser.full_name || 'Current User'}
              </div>
              <span style={{
                display: 'inline-block',
                marginTop: '6px',
                fontSize: '10px',
                fontWeight: 800,
                color: currentRoleMeta.color,
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                padding: '2px 8px',
                borderRadius: '6px'
              }}>
                {currentUser.role || currentRoleMeta.badge}
              </span>
            </div>

            {/* Blocked Arrow Indicator */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '14px'
              }}>
                ✕
              </div>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#EF4444' }}>
                Blocked
              </span>
            </div>

            {/* Attempted Role Card */}
            <div style={{
              padding: '12px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '10px',
              border: '1.5px dashed #EF4444',
              textAlign: 'center',
              opacity: 0.85
            }}>
              <span style={{ fontSize: '22px', display: 'block', marginBottom: '4px' }}>
                {attemptedRoleMeta.icon}
              </span>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Attempted Role
              </div>
              <div style={{ 
                fontSize: '13px', 
                fontWeight: 800, 
                color: '#EF4444', 
                marginTop: '2px' 
              }}>
                {attemptedRoleMeta.label}
              </div>
              <span style={{
                display: 'inline-block',
                marginTop: '6px',
                fontSize: '10px',
                fontWeight: 800,
                color: '#EF4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                padding: '2px 8px',
                borderRadius: '6px'
              }}>
                Restricted
              </span>
            </div>
          </div>

          {/* Explanation Text */}
          <div style={{
            fontSize: '13px',
            lineHeight: 1.6,
            color: 'var(--text-muted)',
            backgroundColor: isDark ? 'rgba(239, 68, 68, 0.08)' : '#FEF2F2',
            padding: '12px 16px',
            borderRadius: '10px',
            border: `1px solid ${isDark ? 'rgba(239, 68, 68, 0.2)' : '#FCA5A5'}`
          }}>
            <p style={{ margin: 0, color: isDark ? '#FECACA' : '#991B1B', fontWeight: 500 }}>
              You are currently authenticated as <strong>{currentUser.full_name || 'User'}</strong> ({currentUser.role}). 
              Role switching is disabled during an active session to protect role-based access control (RBAC) and campus data privacy.
            </p>
            <p style={{ margin: '8px 0 0', color: isDark ? '#CBD5E1' : '#7F1D1D', fontSize: '12px' }}>
              To access the <strong>{attemptedRoleMeta.label}</strong> workspace, you must log out first and sign in with the appropriate credentials.
            </p>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div style={{
          padding: '16px 24px 20px',
          backgroundColor: 'var(--bg-secondary)',
          borderTop: `1px solid var(--border-subtle)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 18px',
              borderRadius: '9px',
              border: `1px solid var(--border-subtle)`,
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-main)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface)'}
          >
            Stay as {currentRoleMeta.label}
          </button>

          <button
            onClick={() => onConfirmLogoutAndSwitch(attemptedRole)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '9px',
              border: 'none',
              backgroundColor: '#EF4444',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(239, 68, 68, 0.35)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#DC2626'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#EF4444'}
          >
            <LogOut size={15} />
            <span>Log Out & Switch Role</span>
          </button>
        </div>
      </div>
    </div>
  );
}
