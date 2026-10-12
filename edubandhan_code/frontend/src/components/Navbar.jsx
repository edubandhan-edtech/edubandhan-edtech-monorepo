import React from 'react';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  ScanFace, 
  Smartphone, 
  GraduationCap, 
  CalendarOff, 
  HelpCircle, 
  CreditCard, 
  MessageSquare, 
  Lock, 
  LogOut, 
  UserCheck, 
  Radio, 
  Video, 
  Sparkles, 
  Sun, 
  Moon, 
  Laptop,
  CheckCircle2,
  Type
} from 'lucide-react';
import {
  GeometryCompassIcon,
  LabMicroscopeIcon,
  DesktopGlobeIcon,
  ChemicalLabIcon,
  WoodenAbacusIcon
} from './ScholasticIcons';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  activeSector, 
  setActiveSector, 
  onOpenAuth, 
  currentUser, 
  onLogout, 
  theme, 
  setTheme,
  fontMode = 'outfit',
  setFontMode,
  onRequireAuth,
  animationLayout,
  onSwitchLayout
}) {
  const handleTabClick = (tabId, tabLabel) => {
    if (!currentUser && tabId !== 'overview') {
      if (onRequireAuth) {
        onRequireAuth({ id: tabId, title: tabLabel });
      } else if (onOpenAuth) {
        onOpenAuth();
      }
      return;
    }
    setActiveTab(tabId);
  };

  const tabs = [
    { id: 'overview', label: 'Ecosystem 360°', icon: Sparkles, badge: '9 Features' },
    { id: 'admin', label: 'Admin Command', icon: LayoutDashboard },
    { id: 'teacher', label: 'Teacher Hub', icon: UserCheck },
    { id: 'parent_hub', label: 'Parent Portal', icon: Smartphone },
    { id: 'kiosk', label: 'Face AI Kiosk', icon: ScanFace },
    { id: 'sockets', label: 'Classroom Feed', icon: Radio, badge: 'Live WS' },
    { id: 'parent', label: 'Parent Pulse', icon: Smartphone },
    { id: 'fees', label: 'Fee Escrow', icon: CreditCard },
    { id: 'leaves', label: 'Leave Engine', icon: CalendarOff },
    { id: 'consultation', label: '1-on-1 Consult', icon: Video },
    { id: 'quiz', label: 'Quiz Arena', icon: HelpCircle },
    { id: 'aichat', label: 'AI Saathi Mentor', icon: MessageSquare, badge: 'Groq AI' },
  ];

  const sectors = [
    { id: 'school', label: '🏫 Schools' },
    { id: 'college', label: '🎓 Colleges' },
    { id: 'coaching', label: '🎯 Coaching Hubs' },
    { id: 'library', label: '📚 24/7 Libraries' },
  ];

  const cycleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('hybrid');
    else setTheme('dark');
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun size={14} color="#0284c7" />;
    if (theme === 'hybrid') return <Sparkles size={14} color="#38bdf8" />;
    return <Moon size={14} color="#cbd5e1" />;
  };

  const getThemeLabel = () => {
    if (theme === 'light') return 'Parchment';
    if (theme === 'hybrid') return 'Hybrid';
    return 'Dark';
  };

  const cycleFont = () => {
    if (!setFontMode) return;
    if (fontMode === 'outfit') setFontMode('cinzel');
    else if (fontMode === 'cinzel') setFontMode('lexend');
    else setFontMode('outfit');
  };

  const getFontLabel = () => {
    if (fontMode === 'cinzel') return 'Ivy Roman';
    if (fontMode === 'lexend') return 'Lexend Fluency';
    return 'Modern Royal';
  };

  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--bg-nav)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '12px 24px 8px',
      transition: 'background-color 0.25s ease, border-color 0.25s ease',
      boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.15)'
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        {/* Brand Logo & Title */}
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', userSelect: 'none' }} 
          onClick={() => setActiveTab('overview')}
        >
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '2px solid rgba(217, 119, 6, 0.65)',
              boxShadow: '0 0 18px rgba(245, 158, 11, 0.35)',
              background: '#020617',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s ease'
            }}>
              <img 
                src="/web_app/edubandhan/assets/edubandhan_logo_dark.jpg" 
                alt="EduBandhan Logo" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.onerror = null; e.target.src = '/edubandhan_logo_dark.jpg'; }}
              />
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ 
                fontFamily: 'var(--font-heading)', 
                fontSize: '20px', 
                fontWeight: 900, 
                color: 'var(--text-main)', 
                letterSpacing: '-0.4px', 
                margin: 0,
                lineHeight: 1.1
              }}>
                EduBandhan
              </span>
              <span style={{ 
                background: 'rgba(245, 158, 11, 0.16)', 
                color: '#f59e0b', 
                border: '1px solid rgba(245, 158, 11, 0.35)', 
                borderRadius: '5px', 
                padding: '2px 7px', 
                fontSize: '10px', 
                fontWeight: 800,
                letterSpacing: '0.2px'
              }}>
                एडूबंधन
              </span>
              <span style={{
                background: 'rgba(56, 189, 248, 0.12)',
                color: 'var(--text-cyan)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: '4px',
                padding: '1px 5px',
                fontSize: '9px',
                fontWeight: 700
              }}>
                v2.6 OS
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-cyan)', fontWeight: 600 }}>
                The Sacred Bond Connecting Child, Parent &amp; School
              </span>
              <span style={{
                fontSize: '9.5px',
                background: 'rgba(217, 119, 6, 0.15)',
                color: '#b45309',
                border: '1px solid rgba(217, 119, 6, 0.35)',
                borderRadius: '4px',
                padding: '1px 5px',
                fontWeight: 800
              }}>
                विद्या ददाति विनयम
              </span>
            </div>
          </div>
        </div>

        {/* 3 Dedicated Role Workspaces Switcher (Admin, Teacher, Parent) */}
        <div style={{ 
          display: 'flex', 
          background: 'var(--bg-surface)', 
          padding: '4px', 
          borderRadius: 'var(--radius-full)', 
          border: '1.5px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
          gap: '4px',
          alignItems: 'center'
        }}>
          <button
            onClick={() => setActiveTab('admin')}
            title="School Admin & Principal Command Center: KPIs, Kiosks & AI Insights"
            style={{
              border: 'none',
              background: activeTab === 'admin' ? 'linear-gradient(135deg, #0284c7, #0369a1)' : 'transparent',
              color: activeTab === 'admin' ? '#ffffff' : 'var(--text-main)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.18s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: activeTab === 'admin' ? '0 2px 8px rgba(2, 132, 199, 0.35)' : 'none'
            }}
          >
            <span>👑 Admin</span>
          </button>

          <button
            onClick={() => setActiveTab('teacher')}
            title="Teacher Daily Workspace: Class Schedule, Attendance & Parent Messaging"
            style={{
              border: 'none',
              background: activeTab === 'teacher' ? 'linear-gradient(135deg, #059669, #10b981)' : 'transparent',
              color: activeTab === 'teacher' ? '#ffffff' : 'var(--text-main)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.18s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: activeTab === 'teacher' ? '0 2px 8px rgba(5, 150, 105, 0.35)' : 'none'
            }}
          >
            <span>👩‍🏫 Teacher</span>
          </button>

          <button
            onClick={() => setActiveTab('parent_hub')}
            title="Parent Portal: Child Daily Status, 1-Tap Fees, Homework & Leave Passes"
            style={{
              border: 'none',
              background: activeTab === 'parent_hub' ? 'linear-gradient(135deg, #d97706, #f59e0b)' : 'transparent',
              color: activeTab === 'parent_hub' ? '#ffffff' : 'var(--text-main)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.18s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: activeTab === 'parent_hub' ? '0 2px 8px rgba(217, 119, 6, 0.35)' : 'none'
            }}
          >
            <span>👨‍👩‍👦 Parent</span>
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            title="Ecosystem 360°: Complete Holistic Architecture of All 9 Features"
            style={{
              border: 'none',
              background: activeTab === 'overview' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
              color: activeTab === 'overview' ? 'var(--accent-cyan)' : 'var(--text-muted)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.18s ease'
            }}
          >
            <span>🌐 360° Overview</span>
          </button>
        </div>

        {/* Right Utility Bar: Theme Toggle + DB Indicator + Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          
          {/* Light / Dark / Hybrid Theme Toggle Button */}
          <button
            onClick={cycleTheme}
            title={`Current Theme: ${getThemeLabel()}. Click to switch between Parchment, Dark, and Hybrid.`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              padding: '6px 13px',
              cursor: 'pointer',
              color: 'var(--text-main)',
              fontSize: '11px',
              fontWeight: 700,
              transition: 'all 0.18s ease',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            {getThemeIcon()}
            <span>{getThemeLabel()}</span>
          </button>

          {/* Typography Font Pairing Switcher Button */}
          {setFontMode && (
            <button
              onClick={cycleFont}
              title={`Current Font System: ${getFontLabel()} (${fontMode}). Click to cycle pairings: Modern Royal (Outfit) → Ivy Roman (Cinzel) → Lexend Fluency.`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                padding: '6px 13px',
                cursor: 'pointer',
                color: 'var(--accent-amber)',
                fontSize: '11px',
                fontWeight: 700,
                transition: 'all 0.18s ease',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <Type size={13} color="var(--accent-amber)" />
              <span>{getFontLabel()}</span>
            </button>
          )}

          {/* Animation Layout Mode Toggle (Left Rail vs Footer Runway) */}
          {onSwitchLayout && (
            <button
              onClick={onSwitchLayout}
              title={`Animation Placement: currently ${animationLayout === 'left' ? 'Left Vertical Rail' : 'Bottom Runway'}. Click to switch.`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                padding: '6px 12px',
                cursor: 'pointer',
                color: 'var(--accent-cyan)',
                fontSize: '11px',
                fontWeight: 700,
                transition: 'all 0.18s ease',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <span>{animationLayout === 'left' ? '↕ Left Rail' : '↔ Bottom Runway'}</span>
            </button>
          )}

          {/* Live Neon DB Indicator */}
          <div 
            title="Neon PostgreSQL live connection verified via connection pooler"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: '11px',
              fontWeight: 800,
              color: '#10b981',
              boxShadow: '0 0 14px rgba(16, 185, 129, 0.15)'
            }}
          >
            <span className="pulse-dot"></span>
            <span>Neon DB Live</span>
          </div>

          {/* User Profile / Login Button */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '12px'
                }}
              >
                <UserCheck size={14} color="#38bdf8" />
                <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>{currentUser.full_name}</span>
                <span style={{
                  background: 'rgba(56, 189, 248, 0.2)',
                  color: 'var(--accent-cyan)',
                  padding: '2px 7px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: 800
                }}>
                  {currentUser.role}
                </span>
              </div>
              <button 
                onClick={onLogout}
                title="Sign Out"
                style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  color: '#f87171',
                  borderRadius: 'var(--radius-md)',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '11px',
                  fontWeight: 700,
                  transition: 'all 0.15s ease'
                }}
              >
                <LogOut size={13} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button 
              className="btn-primary" 
              onClick={() => onOpenAuth && onOpenAuth('signin')}
              style={{ fontSize: '12px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Lock size={14} />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Feature Tabs Strip (All 9 Features + 360° Overview) */}
      <div style={{
        maxWidth: '1440px',
        margin: '12px auto 0',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        overflowX: 'auto',
        paddingBottom: '4px',
        scrollbarWidth: 'none'
      }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id, tab.label)}
              title={!currentUser && tab.id !== 'overview' ? `Click to sign in or register to access ${tab.label}` : tab.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                background: isActive 
                  ? 'linear-gradient(135deg, rgba(14, 165, 233, 0.25), rgba(2, 132, 199, 0.35))' 
                  : 'var(--bg-surface)',
                border: isActive ? '1.5px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                padding: '8px 14px',
                borderRadius: '9px',
                fontSize: '12px',
                fontWeight: isActive ? 800 : 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.18s ease',
                boxShadow: isActive ? '0 2px 12px rgba(14, 165, 233, 0.25)' : 'none'
              }}
            >
              <Icon size={14} color={isActive ? 'var(--accent-cyan)' : 'var(--text-dim)'} />
              <span>{tab.label}</span>
              {!currentUser && tab.id !== 'overview' && (
                <Lock size={11} color="var(--text-dim)" style={{ opacity: 0.7 }} />
              )}
              {tab.badge && (
                <span style={{
                  fontSize: '9px',
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: isActive ? 'var(--accent-cyan)' : 'rgba(56, 189, 248, 0.14)',
                  color: isActive ? '#030a16' : 'var(--accent-cyan)',
                  letterSpacing: '0.2px'
                }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Scholastic Workbench Quick Tray (Geometry, Microscope, Globe, Test Tubes, Abacus) */}
      <div style={{
        maxWidth: '1440px',
        margin: '8px auto 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        padding: '5px 12px',
        background: 'linear-gradient(90deg, rgba(254, 240, 138, 0.12) 0%, rgba(217, 119, 6, 0.08) 50%, rgba(56, 189, 248, 0.08) 100%)',
        border: '1px solid rgba(217, 119, 6, 0.28)',
        borderRadius: '8px',
        overflowX: 'auto',
        scrollbarWidth: 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <span style={{
            fontSize: '10px',
            fontWeight: 900,
            color: '#b45309',
            textTransform: 'uppercase',
            letterSpacing: '0.6px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <span>🏛️ Scholastic Workbench:</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* 1. Geometry Compass */}
          <button
            onClick={() => handleTabClick('sockets', 'Classroom Sockets')}
            title="Geometry Compass: Classroom Broadcast Radius & Sockets"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--bg-surface)',
              border: '1px solid rgba(2, 132, 199, 0.35)',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--text-main)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            <GeometryCompassIcon size={16} />
            <span>Geometry Compass</span>
          </button>

          {/* 2. Optical Microscope */}
          <button
            onClick={() => handleTabClick('kiosk', 'Face AI Gate Kiosk')}
            title="Optical Microscope: High-Precision Attendance Biometrics"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--bg-surface)',
              border: '1px solid rgba(5, 150, 105, 0.35)',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--text-main)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            <LabMicroscopeIcon size={16} />
            <span>Optical Microscope</span>
          </button>

          {/* 3. Terrestrial Globe */}
          <button
            onClick={() => handleTabClick('parent', 'Parent Mobile Pulse')}
            title="Terrestrial Globe: Student Transit Geolocation & Pulse Hub"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--bg-surface)',
              border: '1px solid rgba(217, 119, 6, 0.35)',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--text-main)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            <DesktopGlobeIcon size={16} />
            <span>Terrestrial Globe</span>
          </button>

          {/* 4. Chemical Test Tubes */}
          <button
            onClick={() => handleTabClick('quiz', 'NCERT Quiz Arena')}
            title="Chemical Reaction Tubes: Experimental Assessments & Quiz Arena"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--bg-surface)',
              border: '1px solid rgba(139, 92, 246, 0.35)',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--text-main)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            <ChemicalLabIcon size={16} />
            <span>Chemical Lab Tubes</span>
          </button>

          {/* 5. Wooden Abacus */}
          <button
            onClick={() => handleTabClick('fees', 'Itemized Fee Ledger')}
            title="Soroban Abacus: Double-Entry Arithmetic Ledger & UPI Escrow"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--bg-surface)',
              border: '1px solid rgba(180, 83, 9, 0.35)',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--text-main)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            <WoodenAbacusIcon size={16} />
            <span>Soroban Abacus</span>
          </button>
        </div>
      </div>
    </header>
  );
}
