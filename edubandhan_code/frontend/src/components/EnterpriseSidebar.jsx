import React from 'react';
import {
  LayoutDashboard,
  Users,
  ScanFace,
  CreditCard,
  Radio,
  Sparkles,
  CalendarOff,
  Layers,
  LogOut,
  School,
  Trophy,
  LogIn,
  User,
  Video,
  ShieldCheck,
  CalendarCheck,
  Network
} from 'lucide-react';

export default function EnterpriseSidebar({
  activeTab,
  onSwitchTab,
  activeRole,
  currentUser,
  onLogout,
  onOpenAuth
}) {
  const isParent = activeRole === 'parent' || (currentUser && String(currentUser.role).toUpperCase().includes('PARENT'));

  const navItems = [
    ...(activeRole === 'super_admin' ? [
      {
        id: 'super_admin_hq',
        label: 'Super Admin HQ',
        icon: ShieldCheck,
        targetTab: 'super_admin',
        badge: 'Owner'
      }
    ] : [
      {
        id: 'dashboard',
        label: isParent ? 'Parent Hub' : (activeRole === 'teacher' ? 'Teacher Desk' : 'Dashboard'),
        icon: LayoutDashboard,
        targetTab: activeRole === 'admin' ? 'admin' : (activeRole === 'teacher' ? 'teacher' : 'parent_hub'),
        badge: null
      }
    ]),
    // Parent-specific modules: Child Attendance record & Quiz arena
    ...(isParent ? [
      {
        id: 'parent_attendance',
        label: 'Child Attendance',
        icon: CalendarCheck,
        targetTab: 'attendance_view',
        badge: '94% Safe'
      },
      {
        id: 'quiz',
        label: 'Child Quiz Arena',
        icon: Trophy,
        targetTab: 'quiz',
        badge: 'Gamified'
      }
    ] : []),
    // Staff & Faculty only modules: Students & Faculty Management + Attendance & Kiosk + Org Hierarchy
    ...(!isParent ? [
      {
        id: 'students',
        label: 'Students & Faculty',
        icon: Users,
        targetTab: 'management',
        badge: null
      },
      {
        id: 'organization',
        label: 'Org Hierarchy',
        icon: Network,
        targetTab: 'organization',
        badge: 'Tree 360°'
      },
      {
        id: 'attendance',
        label: 'Attendance & Kiosk',
        icon: ScanFace,
        targetTab: 'kiosk',
        badge: 'Face AI'
      },
    ] : []),
    {
      id: 'fees',
      label: 'Fees & Payments',
      icon: CreditCard,
      targetTab: 'fees',
      badge: null
    },
    {
      id: 'communication',
      label: 'Communication',
      icon: Radio,
      targetTab: 'sockets',
      badge: 'Live WS'
    },
    {
      id: 'aichat',
      label: 'AI Mentor',
      icon: Sparkles,
      targetTab: 'aichat',
      badge: 'Violet AI',
      isAi: true
    },
    ...(!isParent ? [
      {
        id: 'quiz',
        label: 'Quiz Arena',
        icon: Trophy,
        targetTab: 'quiz',
        badge: null
      }
    ] : []),
    {
      id: 'consultation',
      label: '1-on-1 Consultation',
      icon: Video,
      targetTab: 'consultation',
      badge: 'Video'
    },
    {
      id: 'leaves',
      label: 'Leave Passes',
      icon: CalendarOff,
      targetTab: 'leaves',
      badge: null
    },
    {
      id: 'overview',
      label: 'Ecosystem 360°',
      icon: Layers,
      targetTab: 'overview',
      badge: '9 Features'
    }
  ];

  const isCurrentActive = (item) => {
    if (item.id === 'super_admin_hq') {
      return activeTab === 'super_admin';
    }
    if (item.id === 'dashboard') {
      return ['admin', 'teacher', 'parent_hub', 'dashboard'].includes(activeTab);
    }
    return activeTab === item.targetTab;
  };

  const getRoleBadge = () => {
    if (!currentUser) {
      return {
        label: 'READ-ONLY GUEST',
        color: '#38BDF8',
        bg: 'rgba(56, 189, 248, 0.14)',
        name: 'Guest Explorer'
      };
    }
    const realName = currentUser.full_name || 'User';
    const userRoleStr = (currentUser.role || activeRole || '').toUpperCase();
    if (userRoleStr.includes('SUPER')) {
      return { label: 'SUPER_ADMIN', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.2)', name: realName || 'Super Admin' };
    }
    if (userRoleStr.includes('ADMIN')) {
      return { label: currentUser.role || 'SCHOOL_ADMIN', color: '#155EEF', bg: 'rgba(21, 94, 239, 0.15)', name: realName };
    }
    if (userRoleStr.includes('TEACH')) {
      return { label: 'TEACHER', color: '#12B76A', bg: 'rgba(18, 183, 106, 0.15)', name: realName };
    }
    if (userRoleStr.includes('PARENT')) {
      const parentFormatted = realName.includes('(') ? realName : `${realName} (Aarav Sharma)`;
      return { label: 'PARENT', color: '#6C4CE8', bg: 'rgba(108, 76, 232, 0.15)', name: parentFormatted };
    }
    return { label: currentUser.role || activeRole.toUpperCase(), color: '#155EEF', bg: 'rgba(21, 94, 239, 0.15)', name: realName };
  };

  const roleInfo = getRoleBadge();

  return (
    <aside style={{
      width: '260px',
      minWidth: '260px',
      backgroundColor: '#102A56', // Deep Navy Primary Brand / Trust
      color: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      boxShadow: '4px 0 24px rgba(16, 42, 86, 0.15)'
    }}>
      {/* Brand Header */}
      <div
        onClick={() => onSwitchTab('overview')}
        style={{
          padding: '24px 20px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '10px',
          overflow: 'hidden',
          background: '#030a16',
          border: '1.5px solid rgba(22, 119, 255, 0.4)',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img
            src="/web_app/edubandhan/assets/edubandhan_logo_dark.jpg"
            alt="EduBandhan Logo"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { e.target.onerror = null; e.target.src = '/edubandhan_logo_dark.jpg'; }}
          />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              fontWeight: 800,
              fontSize: '17px',
              letterSpacing: '-0.2px',
              color: '#FFFFFF'
            }}>
              EDUBANDHAN
            </span>
          </div>
          <p style={{
            fontSize: '10px',
            color: '#94A3B8',
            margin: '2px 0 0',
            letterSpacing: '0.4px',
            textTransform: 'uppercase',
            fontWeight: 600
          }}>
            Connecting Home &amp; School
          </p>
        </div>
      </div>

      {/* Navigation Items */}
      <nav style={{
        flex: 1,
        padding: '16px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        overflowY: 'auto'
      }}>
        <div style={{
          fontSize: '10px',
          fontWeight: 700,
          color: '#64748B',
          padding: '6px 12px 4px',
          letterSpacing: '0.6px',
          textTransform: 'uppercase'
        }}>
          Platform Modules
        </div>

        {navItems.map((item) => {
          const active = isCurrentActive(item);
          const IconComponent = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onSwitchTab(item.targetTab)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '8px',
                border: 'none',
                background: active
                  ? '#155EEF' // Canonical Action Blue #155EEF for active navigation item
                  : 'transparent',
                color: active
                  ? '#FFFFFF'
                  : '#CBD5E1',
                fontSize: '13.5px',
                fontWeight: active ? 700 : 500,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.18s ease',
                width: '100%'
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.color = '#FFFFFF';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#CBD5E1';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <IconComponent
                  size={18}
                  color={active ? '#FFFFFF' : (item.isAi ? '#A78BFA' : '#94A3B8')}
                />
                <span>{item.label}</span>
              </div>

              {item.isAi && !active && (
                <span style={{
                  fontSize: '9.5px',
                  fontWeight: 700,
                  backgroundColor: 'rgba(108, 76, 232, 0.25)',
                  color: '#C4B5FD',
                  border: '1px solid rgba(108, 76, 232, 0.4)',
                  padding: '2px 6px',
                  borderRadius: '999px'
                }}>
                  AI
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* School Branch & Active Profile Footer */}
      <div style={{
        padding: '16px 14px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        backgroundColor: 'rgba(0, 0, 0, 0.16)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {/* Campus Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <School size={15} color="#22B8E6" />
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#FFFFFF',
              margin: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              Green Valley High School
            </p>
            <p style={{ fontSize: '10px', color: '#64748B', margin: '1px 0 0' }}>
              Bhubaneswar Campus
            </p>
          </div>
        </div>

        {/* User Card */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 10px',
          borderRadius: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: roleInfo.color,
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '12px',
              flexShrink: 0
            }}>
              {roleInfo.name.charAt(0)}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{
                fontSize: '11.5px',
                fontWeight: 700,
                color: '#FFFFFF',
                margin: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {currentUser?.full_name || roleInfo.name}
              </p>
              <span style={{
                fontSize: '9.5px',
                color: roleInfo.color,
                fontWeight: 800,
                letterSpacing: '0.4px'
              }}>
                {roleInfo.label}
              </span>
            </div>
          </div>

          <button
            onClick={() => currentUser ? onLogout() : onOpenAuth('signin')}
            title={currentUser ? "Log Out" : "Sign In to EduBandhan"}
            style={{
              background: currentUser ? 'transparent' : 'rgba(22, 119, 255, 0.15)',
              border: currentUser ? 'none' : '1px solid rgba(22, 119, 255, 0.4)',
              color: currentUser ? '#94A3B8' : '#38BDF8',
              cursor: 'pointer',
              padding: '5px 8px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              fontWeight: 700,
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              if (currentUser) e.currentTarget.style.color = '#EF5350';
              else e.currentTarget.style.backgroundColor = '#155EEF';
            }}
            onMouseLeave={(e) => {
              if (currentUser) e.currentTarget.style.color = '#94A3B8';
              else e.currentTarget.style.backgroundColor = 'rgba(21, 94, 239, 0.15)';
            }}
          >
            {currentUser ? (
              <LogOut size={15} />
            ) : (
              <>
                <LogIn size={13} color="#38BDF8" />
                <span style={{ color: '#FFFFFF', fontSize: '11px' }}>Login</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
