import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Calendar, 
  Clock,
  ChevronDown, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  UserCheck,
  ShieldCheck,
  LogOut,
  LogIn,
  UserPlus,
  Sun,
  Moon,
  Megaphone,
  Menu
} from 'lucide-react';

export default function EnterpriseTopBar({ 
  activeRole, 
  onSwitchRole, 
  currentUser, 
  onOpenAuth, 
  onLogout,
  onSearch,
  theme = 'light',
  onToggleTheme,
  onOpenNoticeBoard,
  onToggleMobileNav
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const isDark = theme === 'dark';

  // Live real-time date and clock updating every second
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentDateTime.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const formattedTime = currentDateTime.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const notifications = [
    { id: 1, title: "Aarav Sharma marked present", time: "08:12 AM", type: "success" },
    { id: 2, title: "Fee ₹2,500 due in 4 days", time: "09:42 AM", type: "warning" },
    { id: 3, title: "New circular: Class 5 exam dates", time: "Yesterday", type: "info" }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
  };

  return (
    <header 
      className="enterprise-topbar"
      style={{
        height: '68px',
        backgroundColor: isDark ? '#0D223E' : '#FFFFFF',
        borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0'}`,
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        boxShadow: isDark ? '0 1px 4px rgba(0, 0, 0, 0.4)' : '0 1px 3px rgba(18, 33, 58, 0.03)',
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
        boxSizing: 'border-box'
      }}
    >
      {/* Left Search and Mobile Drawer Hamburger */}
      <div 
        className="topbar-left-controls"
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px', 
          flexShrink: 0 
        }}
      >
        {/* Mobile Hamburger Drawer Button */}
        <button
          type="button"
          className="topbar-mobile-menu-btn"
          onClick={onToggleMobileNav}
          aria-label="Open Navigation Drawer"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.12)' : '#E2E8F0'}`,
            color: isDark ? '#F8FAFC' : '#102A56',
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0
          }}
        >
          <Menu size={20} />
        </button>

        {/* Global Search Bar */}
        <form 
          onSubmit={handleSearchSubmit}
          className="topbar-search-form"
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: isDark ? '#071527' : '#F8FAFC',
          border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.12)' : '#E2E8F0'}`,
          borderRadius: '8px',
          height: '38px',
          padding: '0 12px',
          flex: '1 1 260px',
          maxWidth: '340px',
          minWidth: '150px',
          gap: '8px',
          boxSizing: 'border-box',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
        }}
        onFocusCapture={(e) => {
          e.currentTarget.style.borderColor = '#155EEF';
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(21, 94, 239, 0.12)';
        }}
        onBlurCapture={(e) => {
          e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.12)' : '#E2E8F0';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <Search size={15} color={isDark ? '#94A3B8' : '#64748B'} style={{ flexShrink: 0 }} />
        <input 
          type="text" 
          placeholder="Search students, classes, or features..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            border: 'none',
            background: 'transparent',
            outline: 'none',
            fontSize: '13px',
            color: isDark ? '#F8FAFC' : '#12213A',
            width: '100%',
            fontFamily: 'var(--font-sans)'
          }}
        />
        <span style={{
          fontSize: '10px',
          color: isDark ? '#64748B' : '#94A3B8',
          backgroundColor: isDark ? '#102A56' : '#EDF2F7',
          padding: '2px 5px',
          borderRadius: '4px',
          fontWeight: 600,
          flexShrink: 0
        }}>
          ⌘K
        </span>
      </form>
      </div>

      {/* Right Controls: 4-Role Switcher, Date, Notifications, User */}
      <div 
        className="topbar-right-controls" 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px', 
          flex: '1 1 auto', 
          minWidth: 0, 
          justifyContent: 'flex-end' 
        }}
      >
        
        {/* 3-Role Experience Switcher */}
        <div 
          className="topbar-role-switcher"
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: isDark ? '#071527' : '#F1F5F9',
            height: '38px',
            padding: '3px',
            borderRadius: '8px',
            gap: '2px',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0'}`,
            boxSizing: 'border-box'
          }}
        >
          {[
            { id: 'super_admin', label: '⚡ Super Admin', short: '⚡ Super' },
            { id: 'admin', label: '👑 Admin', short: '👑 Admin' },
            { id: 'teacher', label: '👩‍🏫 Teacher', short: '👩‍🏫 Teach' },
            { id: 'parent', label: '👨‍👩‍👦 Parent', short: '👨‍👩‍👦 Parent' }
          ].map(r => {
            const isActive = activeRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => onSwitchRole(r.id)}
                className={`topbar-role-btn ${isActive ? 'active' : ''}`}
                title={
                  currentUser && !isActive
                    ? `Cannot switch to ${r.label} while logged in as ${currentUser.role}. Click to switch role.`
                    : `Switch to ${r.label} experience`
                }
                style={{
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  border: 'none',
                  background: isActive ? (isDark ? '#102A56' : '#FFFFFF') : 'transparent',
                  color: isActive ? (isDark ? '#38BDF8' : '#102A56') : (isDark ? '#94A3B8' : '#64748B'),
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '12px',
                  padding: '0 8px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <span className="role-btn-full">{r.label}</span>
                <span className="role-btn-short">{r.short}</span>
              </button>
            );
          })}
        </div>

        {/* Real-Time Live Clock Badge */}
        <div 
          className="topbar-clock"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            fontSize: '12px',
            color: isDark ? '#94A3B8' : '#475569',
            fontWeight: 600,
            height: '38px',
            padding: '0 12px',
            backgroundColor: isDark ? '#071527' : '#F8FAFC',
            borderRadius: '8px',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0'}`,
            fontVariantNumeric: 'tabular-nums',
            boxSizing: 'border-box',
            whiteSpace: 'nowrap'
          }}
        >
          <Calendar size={13} color={isDark ? '#38BDF8' : '#155EEF'} />
          <span className="topbar-clock-date">{formattedDate}</span>
          <span className="topbar-clock-date" style={{ color: isDark ? '#334155' : '#CBD5E1' }}>•</span>
          <Clock size={13} color={isDark ? '#38BDF8' : '#155EEF'} />
          <span style={{ color: isDark ? '#F8FAFC' : '#102A56', fontWeight: 700 }}>{formattedTime}</span>
        </div>

        {/* Public Notice Board Loader / Bulletin Trigger */}
        <button
          onClick={onOpenNoticeBoard}
          className="topbar-notice-btn"
          title="Open Campus Public Notice Board (Loader Bulletin)"
          style={{
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '0 12px',
            borderRadius: '8px',
            border: `1px solid ${isDark ? 'rgba(56, 189, 248, 0.3)' : '#BAE6FD'}`,
            backgroundColor: isDark ? 'rgba(2, 132, 199, 0.15)' : 'rgba(2, 132, 199, 0.08)',
            color: isDark ? '#38BDF8' : '#0284C7',
            fontSize: '12.5px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxSizing: 'border-box',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
        >
          <Megaphone size={14} />
          <span className="topbar-notice-label">Notice Board</span>
          <span style={{
            fontSize: '10px',
            backgroundColor: '#0284C7',
            color: '#FFFFFF',
            padding: '1px 5px',
            borderRadius: '8px',
            fontWeight: 800
          }}>
            Live
          </span>
        </button>

        {/* Theme Toggle Button (Light / Dark) */}
        <button
          onClick={onToggleTheme}
          className="topbar-theme-btn"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.12)' : '#E2E8F0'}`,
            backgroundColor: isDark ? '#071527' : '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxSizing: 'border-box',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? '#102A56' : '#F8FAFC'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isDark ? '#071527' : '#FFFFFF'}
        >
          {isDark ? <Sun size={16} color="#F59E0B" /> : <Moon size={16} color="#155EEF" />}
        </button>

        {/* Notifications Popover Trigger */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="topbar-notifications-btn"
            style={{
              position: 'relative',
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.12)' : '#E2E8F0'}`,
              backgroundColor: isDark ? '#071527' : '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: isDark ? '#F8FAFC' : '#12213A',
              boxSizing: 'border-box'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? '#102A56' : '#F8FAFC'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isDark ? '#071527' : '#FFFFFF'}
          >
            <Bell size={16} color={isDark ? '#F8FAFC' : '#12213A'} />
            <span style={{
              position: 'absolute',
              top: '7px',
              right: '7px',
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: '#EF5350' // Semantic Red for unread alert
            }}></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: '46px',
              right: 0,
              width: '290px',
              backgroundColor: isDark ? '#0D223E' : '#FFFFFF',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.12)' : '#E2E8F0'}`,
              borderRadius: '10px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
              padding: '12px',
              zIndex: 60
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: isDark ? '#F8FAFC' : '#12213A' }}>Notifications</span>
                <span style={{ fontSize: '11px', color: '#155EEF', cursor: 'pointer', fontWeight: 600 }}>Mark read</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {notifications.map(n => (
                  <div key={n.id} style={{
                    padding: '8px',
                    borderRadius: '8px',
                    backgroundColor: isDark ? '#071527' : '#F8FAFC',
                    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0'}`,
                    fontSize: '12px'
                  }}>
                    <p style={{ margin: 0, fontWeight: 600, color: isDark ? '#F8FAFC' : '#12213A' }}>{n.title}</p>
                    <span style={{ fontSize: '10px', color: isDark ? '#94A3B8' : '#64748B' }}>{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar / Sign In & Register */}
        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: '#102A56',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '14px',
              border: `2px solid ${isDark ? 'rgba(255, 255, 255, 0.15)' : '#E2E8F0'}`,
              boxSizing: 'border-box'
            }}>
              {currentUser.full_name?.charAt(0) || 'U'}
            </div>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 700, color: isDark ? '#F8FAFC' : '#12213A', margin: 0, lineHeight: 1.2 }}>
                {(() => {
                  const rawName = currentUser.full_name || 'User';
                  const isParentRole = (currentUser.role?.toUpperCase() || '').includes('PARENT');
                  if (isParentRole && !rawName.includes('(')) {
                    return `${rawName} (Aarav Sharma)`;
                  }
                  return rawName;
                })()}
              </p>
              <span style={{ fontSize: '11px', color: isDark ? '#94A3B8' : '#64748B', fontWeight: 500 }}>
                {currentUser.role || activeRole.toUpperCase()}
              </span>
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                className="topbar-logout-btn"
                title="Sign out of account"
                style={{
                  height: '38px',
                  width: '38px',
                  borderRadius: '8px',
                  border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.12)' : '#E2E8F0'}`,
                  backgroundColor: isDark ? '#071527' : '#FFFFFF',
                  color: isDark ? '#94A3B8' : '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#EF4444';
                  e.currentTarget.style.borderColor = '#EF4444';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = isDark ? '#94A3B8' : '#64748B';
                  e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.12)' : '#E2E8F0';
                }}
              >
                <LogOut size={15} />
              </button>
            )}
          </div>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <button
              onClick={() => onOpenAuth('signin')}
              className="topbar-signin-btn"
              title="Sign In with existing account"
              style={{
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0 13px',
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF',
                color: isDark ? '#E2E8F0' : '#12213A',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.14)' : '#E2E8F0'}`,
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                boxSizing: 'border-box',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#155EEF';
                e.currentTarget.style.borderColor = '#155EEF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = isDark ? '#E2E8F0' : '#12213A';
                e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.14)' : '#E2E8F0';
              }}
            >
              <LogIn size={13} />
              <span>Sign In</span>
            </button>

            <button
              onClick={() => onOpenAuth('register')}
              className="topbar-register-btn"
              title="Register a new student, parent, or faculty account"
              style={{
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0 15px',
                backgroundColor: '#155EEF',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(21, 94, 239, 0.28)',
                boxSizing: 'border-box',
                transition: 'background-color 0.15s ease',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#004EEB'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#155EEF'}
            >
              <UserPlus size={13} />
              <span>Register</span>
            </button>
          </div>
        )}

      </div>
    </header>
  );
}
