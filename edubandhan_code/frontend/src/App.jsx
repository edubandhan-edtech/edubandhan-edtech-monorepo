import React, { useState, useEffect, useRef } from 'react';
import EnterpriseSidebar from './components/EnterpriseSidebar';
import EnterpriseTopBar from './components/EnterpriseTopBar';
import EcosystemOverview from './components/EcosystemOverview';
import AdminHUD from './components/AdminHUD';
import TeacherDashboard from './components/TeacherDashboard';
import ParentDashboard from './components/ParentDashboard';
import StudentTeacherManagement from './components/StudentTeacherManagement';
import FeeLedger from './components/FeeLedger';
import AiSaathiChat from './components/AiSaathiChat';
import ClassroomSockets from './components/ClassroomSockets';
import GateKiosk from './components/GateKiosk';
import ParentPulse from './components/ParentPulse';
import ConsultationMarketplace from './components/ConsultationMarketplace';
import LeaveWorkflow from './components/LeaveWorkflow';
import QuizArena from './components/QuizArena';
import NavigationBackBar from './components/NavigationBackBar';
import AuthModal from './components/AuthModal';
import EducationalFooter from './components/EducationalFooter';
import VerticalCampusRail from './components/VerticalCampusRail';
import PublicNoticeLoader from './components/PublicNoticeLoader';
import RoleSwitchModal from './components/RoleSwitchModal';
import SuperAdminHUD from './components/SuperAdminHUD';
import ChildAttendanceView from './components/ChildAttendanceView';
import OrganizationHierarchy from './components/OrganizationHierarchy';
import SurakshaPassViewer from './components/SurakshaPassViewer';
import EduBandhanPortfolio from './components/EduBandhanPortfolio';
import { CheckCircle2, X, Clock, LogIn, ShieldAlert, AlertTriangle } from 'lucide-react';

const VALID_TABS = [
  'portfolio',
  'overview',
  'super_admin',
  'admin',
  'teacher',
  'parent_hub',
  'management',
  'students',
  'sockets',
  'kiosk',
  'parent',
  'consultation',
  'leaves',
  'fees',
  'quiz',
  'aichat',
  'attendance_view',
  'organization',
  'suraksha_pass'
];

// 60-Minute Inactivity Session Policy (with 60-second warning countdown)
const INACTIVITY_TIMEOUT_MS = 60 * 60 * 1000; // 60 minutes (3,600,000 ms)
const WARNING_THRESHOLD_MS = 59 * 60 * 1000; // 59 minutes (60 seconds countdown)

// Helper to resolve normalized role key ('super_admin' | 'admin' | 'teacher' | 'parent') from backend user object
const getUserNormalizedRole = (user) => {
  if (!user || !user.role) return null;
  const r = String(user.role).toUpperCase();
  if (r.includes('SUPER')) return 'super_admin';
  if (r.includes('ADMIN')) return 'admin';
  if (r.includes('TEACH')) return 'teacher';
  if (r.includes('PARENT') || r.includes('STUDENT')) return 'parent';
  return 'admin';
};

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      // Clear legacy stale auto-logins stored in localStorage so the page loads cleanly as a guest
      localStorage.removeItem('edubandhan_user');
      localStorage.removeItem('edubandhan_token');
      localStorage.removeItem('edubandhan_refresh_token');
      localStorage.removeItem('edubandhan_last_activity');

      // Only maintain session if explicitly logged in within current tab session
      const saved = sessionStorage.getItem('edubandhan_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [inactivityWarning, setInactivityWarning] = useState(null); // seconds remaining when under 60s
  const [sessionExpiredNotice, setSessionExpiredNotice] = useState(false);
  const [roleSwitchWarning, setRoleSwitchWarning] = useState(null); // targetRole that was restricted
  const lastActivityRef = useRef(Date.now());

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const [activeRole, setActiveRole] = useState(() => {
    const normalized = getUserNormalizedRole(currentUser);
    if (normalized && ['super_admin', 'admin', 'teacher', 'parent'].includes(normalized)) {
      return normalized;
    }
    return 'admin'; // Default to School Admin
  });

  // Keep activeRole strictly synchronized with authenticated currentUser
  useEffect(() => {
    if (currentUser) {
      const normalized = getUserNormalizedRole(currentUser);
      if (normalized && ['super_admin', 'admin', 'teacher', 'parent'].includes(normalized)) {
        setActiveRole(normalized);
      }
    }
  }, [currentUser]);

  // Light and Dark theme state management
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('edubandhan_theme');
      return saved === 'dark' ? 'dark' : 'light';
    } catch (e) {
      return 'light';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('edubandhan_theme', theme);
    } catch (e) { }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Helper to determine the application base path (/web_app/edubandhan or root '')
  const getAppBasePath = () => {
    const p = window.location.pathname;
    if (p.includes('/web_app/edubandhan')) {
      return '/web_app/edubandhan';
    }
    return '';
  };

  // Helper to get clean path-based URL with slashes (/xxx) instead of #xxx
  const getTabUrl = (tab) => {
    const base = getAppBasePath();
    if (!tab || tab === 'portfolio') {
      return (base || '') + '/' + (window.location.search || '');
    }
    return `${base}/${tab}${window.location.search || ''}`;
  };

  // Helper to resolve active tab from URL path (e.g. /web_app/edubandhan/organization -> organization)
  const resolveTabFromUrl = () => {
    try {
      const pathname = window.location.pathname;
      const base = getAppBasePath();
      let relative = pathname;
      if (base && relative.startsWith(base)) {
        relative = relative.slice(base.length);
      }
      const segment = relative.replace(/^\/+|\/+$/g, '').split('/')[0].trim();
      if (segment && VALID_TABS.includes(segment)) {
        return segment;
      }

      // Backward-compatible fallback if legacy hash exists
      const hash = window.location.hash.replace('#', '').trim();
      if (hash && VALID_TABS.includes(hash)) {
        return hash;
      }
    } catch (e) { }

    return 'portfolio';
  };

  // Determine initial active tab from the URL path
  const [activeTab, setActiveTab] = useState(() => {
    return resolveTabFromUrl();
  });

  // Automatically close mobile navigation drawer on tab transition
  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [activeTab]);

  // History stack for in-app back navigation
  const [historyStack, setHistoryStack] = useState(() => [activeTab]);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState('signin'); // 'signin' | 'register'
  const [intendedFeature, setIntendedFeature] = useState(null);
  const [authNotice, setAuthNotice] = useState(null);
  const [showNoticeBoardModal, setShowNoticeBoardModal] = useState(false);

  const getPortalTitle = (tab) => {
    switch (tab) {
      case 'portfolio': return 'EduBandhan Portfolio & Product Showcase';
      case 'super_admin': return 'Super Admin Control Center';
      case 'admin': return 'School Admin Dashboard';
      case 'teacher': return 'Teacher Workspace (Daily Operations)';
      case 'parent_hub':
      case 'parent': return 'Parent Dashboard (Child Status & UPI)';
      case 'management':
      case 'students': return 'Student & Faculty Management';
      case 'fees': return 'Fee & Payment Management (UPI & GST)';
      case 'aichat': return 'EduBandhan AI Mentor';
      case 'sockets': return 'Classroom Sockets (Live WebSockets)';
      case 'leaves': return 'Dual-Tier Leave Passes';
      case 'consultation': return '1-on-1 Consultation Marketplace';
      case 'quiz': return 'Child Quiz Arena';
      case 'attendance_view': return 'Child Attendance & Academic Roster';
      case 'kiosk': return 'Touchless Face AI Kiosk';
      case 'overview': return 'Ecosystem 360° (9 Connected Features)';
      case 'organization': return 'Campus Organization Hierarchy & Directory';
      default: return tab;
    }
  };

  // Centralized tab navigation with history pushState and smooth scroll
  const navigateToTab = (targetTab, replace = false) => {
    if (!VALID_TABS.includes(targetTab)) return;

    // When in Guest Mode (not logged in), allow full read-only exploration of all tabs!
    // Role-based display adjustments:
    const isParent = activeRole === 'parent' || (currentUser && String(currentUser.role).toUpperCase().includes('PARENT'));
    if (isParent && (targetTab === 'kiosk' || targetTab === 'management')) {
      targetTab = 'parent_hub';
    }

    if (targetTab === activeTab) return;

    const targetUrl = getTabUrl(targetTab);

    if (replace) {
      window.history.replaceState({ tab: targetTab }, '', targetUrl);
      setHistoryStack(prev => [...prev.slice(0, -1), targetTab]);
    } else {
      window.history.pushState({ tab: targetTab }, '', targetUrl);
      setHistoryStack(prev => [...prev, targetTab]);
    }
    setActiveTab(targetTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSwitchRole = (targetRole) => {
    if (!currentUser) {
      // In Guest Mode: Allow previewing any role dashboard in Read-Only mode!
      setActiveRole(targetRole);
      const roleTarget = targetRole === 'super_admin' ? 'super_admin' : (targetRole === 'admin' ? 'admin' : (targetRole === 'teacher' ? 'teacher' : 'parent_hub'));
      navigateToTab(roleTarget);
      return;
    }

    const currentNormalized = getUserNormalizedRole(currentUser);
    // If the authenticated user attempts to switch to a role different from their own:
    if (currentNormalized && targetRole !== currentNormalized) {
      setRoleSwitchWarning(targetRole);
      return; // DO NOT SWITCH ROLES: Lock session and trigger restriction modal!
    }

    // User clicked their own assigned role: navigate to its primary dashboard
    setActiveRole(targetRole);
    if (targetRole === 'super_admin') navigateToTab('super_admin');
    else if (targetRole === 'admin') navigateToTab('admin');
    else if (targetRole === 'teacher') navigateToTab('teacher');
    else if (targetRole === 'parent') navigateToTab('parent_hub');
  };

  const handleConfirmRoleSwitchLogout = (targetRole) => {
    setRoleSwitchWarning(null);
    handleLogout();
    setActiveRole(targetRole);
    setTimeout(() => {
      const roleTarget = targetRole === 'super_admin' ? 'super_admin' : (targetRole === 'admin' ? 'admin' : (targetRole === 'teacher' ? 'teacher' : 'parent_hub'));
      handleRequireAuth({ id: roleTarget, title: `${targetRole.toUpperCase()} Experience` });
    }, 150);
  };

  // Back arrow navigation: go to last visited portal
  const handleGoBack = () => {
    if (window.history.length > 1 && historyStack.length > 1) {
      window.history.back();
    } else {
      navigateToTab(currentUser ? (activeRole === 'super_admin' ? 'super_admin' : (activeRole === 'teacher' ? 'teacher' : (activeRole === 'parent' ? 'parent_hub' : 'admin'))) : 'overview');
    }
  };

  // Listen to browser popstate (physical browser back/forward buttons)
  useEffect(() => {
    const currentTabUrl = getTabUrl(activeTab);
    if (!window.history.state || window.history.state.tab !== activeTab) {
      if (window.history.replaceState) {
        window.history.replaceState({ tab: activeTab }, '', currentTabUrl);
      }
    }

    const handlePopState = (event) => {
      const fromState = event.state?.tab;
      const fromPath = resolveTabFromUrl();
      const target = fromState || fromPath || 'overview';

      if (VALID_TABS.includes(target)) {
        setActiveTab(target);
        setHistoryStack(prev => {
          if (prev.length > 1 && prev[prev.length - 2] === target) {
            return prev.slice(0, -1);
          }
          return [...prev, target];
        });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeTab]);

  // Listen for global session expired event from fetch interceptor
  useEffect(() => {
    const handleExpired = () => {
      handleAutoLogoutDueInactivity();
    };
    window.addEventListener('edubandhan:session_expired', handleExpired);
    return () => window.removeEventListener('edubandhan:session_expired', handleExpired);
  }, []);

  const handleAutoLogoutDueInactivity = () => {
    localStorage.removeItem('edubandhan_user');
    localStorage.removeItem('edubandhan_token');
    localStorage.removeItem('edubandhan_refresh_token');
    localStorage.removeItem('edubandhan_last_activity');
    sessionStorage.removeItem('edubandhan_user');
    sessionStorage.removeItem('edubandhan_token');
    sessionStorage.removeItem('edubandhan_refresh_token');
    try {
      fetch('/api/auth/logout', { method: 'POST' }).catch(() => { });
    } catch (e) { }
    setCurrentUser(null);
    setActiveRole('admin');
    setInactivityWarning(null);
    setSessionExpiredNotice(true);

    const targetUrl = getTabUrl('overview');
    if (window.history && window.history.pushState) {
      window.history.pushState({ tab: 'overview' }, '', targetUrl);
    }
    setActiveTab('overview');
    setHistoryStack(['overview']);
    setIntendedFeature(null);
    setAuthNotice(null);
  };

  const handleStaySignedIn = () => {
    const now = Date.now();
    lastActivityRef.current = now;
    try {
      localStorage.setItem('edubandhan_last_activity', now.toString());
    } catch (e) { }
    setInactivityWarning(null);
  };

  // Automatic 15-Minute Inactivity Session Monitor
  useEffect(() => {
    if (!currentUser) {
      setInactivityWarning(null);
      return;
    }

    const initialActivity = Date.now();
    lastActivityRef.current = initialActivity;
    try {
      localStorage.setItem('edubandhan_last_activity', initialActivity.toString());
    } catch (e) { }

    const resetActivity = () => {
      const now = Date.now();
      if (now - lastActivityRef.current > 1500) {
        try {
          localStorage.setItem('edubandhan_last_activity', now.toString());
        } catch (e) { }
      }
      lastActivityRef.current = now;
      if (inactivityWarning !== null) {
        setInactivityWarning(null);
      }
    };

    const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    activityEvents.forEach(evt => window.addEventListener(evt, resetActivity, { passive: true }));

    const intervalId = setInterval(() => {
      const now = Date.now();
      const storedLast = localStorage.getItem('edubandhan_last_activity');
      const last = storedLast ? Math.max(lastActivityRef.current, parseInt(storedLast, 10)) : lastActivityRef.current;
      const elapsed = now - last;

      if (elapsed >= INACTIVITY_TIMEOUT_MS) {
        clearInterval(intervalId);
        handleAutoLogoutDueInactivity();
      } else if (elapsed >= WARNING_THRESHOLD_MS) {
        const remainingSec = Math.max(1, Math.ceil((INACTIVITY_TIMEOUT_MS - elapsed) / 1000));
        setInactivityWarning(remainingSec);
      } else {
        setInactivityWarning(null);
      }
    }, 1000);

    return () => {
      activityEvents.forEach(evt => window.removeEventListener(evt, resetActivity));
      clearInterval(intervalId);
    };
  }, [currentUser]);

  const handleRequireAuth = (feature, mode = 'signin') => {
    setAuthInitialMode(typeof mode === 'string' ? mode : 'signin');
    setIntendedFeature(feature);
    setIsAuthOpen(true);
  };

  const handleOpenAuth = (mode = 'signin') => {
    setAuthInitialMode(typeof mode === 'string' ? mode : 'signin');
    setIntendedFeature(null);
    setIsAuthOpen(true);
  };

  const handleLoginSuccess = (user, targetTab) => {
    setCurrentUser(user);
    lastActivityRef.current = Date.now();
    try {
      sessionStorage.setItem('edubandhan_user', JSON.stringify(user));
      sessionStorage.setItem('edubandhan_last_activity', Date.now().toString());
    } catch (e) { }
    setSessionExpiredNotice(false);
    setInactivityWarning(null);

    let resolvedTab = targetTab;
    if (user.role) {
      const normalized = getUserNormalizedRole(user);
      if (normalized && ['super_admin', 'admin', 'teacher', 'parent'].includes(normalized)) {
        setActiveRole(normalized);
      }
      if (!resolvedTab || resolvedTab === 'overview') {
        if (normalized === 'super_admin') resolvedTab = 'super_admin';
        else if (normalized === 'admin') resolvedTab = 'admin';
        else if (normalized === 'teacher') resolvedTab = 'teacher';
        else if (normalized === 'parent') resolvedTab = 'parent_hub';
      }
    }
    if (!resolvedTab) resolvedTab = 'admin';

    // Direct transition to target feature with clean URL and smooth scroll
    const targetUrl = getTabUrl(resolvedTab);
    window.history.pushState({ tab: resolvedTab }, '', targetUrl);
    setHistoryStack(prev => [...prev, resolvedTab]);
    setActiveTab(resolvedTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setIntendedFeature(null);
    setAuthNotice({
      userName: user.full_name || 'User',
      role: user.role,
      targetName: getPortalTitle(resolvedTab)
    });

    setTimeout(() => {
      setAuthNotice(null);
    }, 6000);
  };

  const handleLogout = () => {
    localStorage.removeItem('edubandhan_user');
    localStorage.removeItem('edubandhan_token');
    localStorage.removeItem('edubandhan_refresh_token');
    localStorage.removeItem('edubandhan_last_activity');
    sessionStorage.removeItem('edubandhan_user');
    sessionStorage.removeItem('edubandhan_token');
    sessionStorage.removeItem('edubandhan_refresh_token');
    try {
      fetch('/api/auth/logout', { method: 'POST' }).catch(() => { });
    } catch (e) { }
    setCurrentUser(null);
    setActiveRole('admin');
    setInactivityWarning(null);
    setSessionExpiredNotice(false);
    const targetUrl = getTabUrl('overview');
    window.history.pushState({ tab: 'overview' }, '', targetUrl);
    setActiveTab('overview');
    setHistoryStack(['overview']);
    setIntendedFeature(null);
    setAuthNotice(null);
  };

  return (
    <div 
      className="app-root-layout"
      style={{
        display: 'flex',
        height: '100vh',
        width: '100%',
        maxWidth: '100vw',
        overflow: 'hidden',
        backgroundColor: theme === 'dark' ? '#071527' : '#F7F9FC', // Dynamic Dark / Light Background
        color: theme === 'dark' ? '#F8FAFC' : '#12213A',
        fontFamily: 'var(--font-sans)',
        transition: 'background-color 0.2s ease, color 0.2s ease',
        position: 'relative'
      }}
    >
      {/* Portfolio Landing Page (Default View) vs Enterprise Portal Shell */}
      {activeTab === 'portfolio' ? (
        <div style={{ width: '100vw', height: '100vh', overflowY: 'auto' }}>
          <EduBandhanPortfolio
            onLaunchPortal={(targetTab = 'overview') => navigateToTab(targetTab)}
            theme={theme}
            onToggleTheme={handleToggleTheme}
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
          />
        </div>
      ) : (
        <>
          {/* Mobile Drawer Backdrop Overlay */}
          {isMobileNavOpen && (
            <div 
              className="sidebar-mobile-backdrop"
              onClick={() => setIsMobileNavOpen(false)}
              aria-hidden="true"
            />
          )}

          {/* 1. Deep Navy Enterprise SaaS Sidebar */}
          <EnterpriseSidebar
        activeTab={activeTab}
        onSwitchTab={navigateToTab}
        activeRole={activeRole}
        onSwitchRole={handleSwitchRole}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuth={handleOpenAuth}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* 2. Main Layout Column */}
      <div 
        className="app-main-column"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          width: '100%',
          maxWidth: '100%',
          height: '100vh',
          overflow: 'hidden'
        }}
      >
        {/* Enterprise Top Bar */}
        <EnterpriseTopBar
          activeRole={activeRole}
          onSwitchRole={handleSwitchRole}
          currentUser={currentUser}
          onOpenAuth={handleOpenAuth}
          onLogout={handleLogout}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onOpenNoticeBoard={() => setShowNoticeBoardModal(true)}
          onToggleMobileNav={() => setIsMobileNavOpen(prev => !prev)}
          onSearch={(query) => {
            const isParent = activeRole === 'parent' || (currentUser && String(currentUser.role).toUpperCase().includes('PARENT'));
            if (query.toLowerCase().includes('fee')) navigateToTab('fees');
            else if (query.toLowerCase().includes('attend')) {
              if (isParent) navigateToTab('attendance_view');
              else navigateToTab('kiosk');
            }
            else if (query.toLowerCase().includes('kiosk')) {
              if (isParent) navigateToTab('parent_hub');
              else navigateToTab('kiosk');
            }
            else if (query.toLowerCase().includes('ai') || query.toLowerCase().includes('mentor')) navigateToTab('aichat');
            else if (isParent) navigateToTab('parent_hub');
            else navigateToTab('management');
          }}
        />

        {/* Read-Only Guest Explorer Banner */}
        {!currentUser && (
          <div 
            className="guest-explorer-banner"
            style={{
              background: 'linear-gradient(90deg, rgba(14, 165, 233, 0.14) 0%, rgba(37, 99, 235, 0.12) 100%)',
              borderBottom: '1px solid rgba(56, 189, 248, 0.25)',
              padding: '7px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px',
              color: '#38BDF8',
              fontWeight: 600,
              backdropFilter: 'blur(8px)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px' }}>👁️</span>
              <span>
                <strong style={{ color: '#E0F2FE' }}>Guest Explorer (Read-Only Mode):</strong> You are previewing all EduBandhan features in read-only mode.
              </span>
            </div>
            <button
              onClick={() => handleOpenAuth('signin')}
              style={{
                background: 'linear-gradient(135deg, #0284C7, #2563EB)',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: 700,
                padding: '4px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 2px 4px rgba(2, 132, 199, 0.25)'
              }}
            >
              Sign In to Perform Operations →
            </button>
          </div>
        )}

        {/* Dynamic Main Viewport Row with Right Campus Vitality Rail */}
        <div 
          className="app-content-row"
          style={{
            display: 'flex',
            flex: 1,
            minHeight: 0,
            height: 'calc(100vh - 68px)',
            width: '100%',
            maxWidth: '100%',
            minWidth: 0,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Main Content Viewport */}
          <main className="main-content-viewport">
            {/* Back Navigation Bar (shown when navigated away from default role dashboard) */}
            {!['admin', 'parent_hub', 'teacher'].includes(activeTab) && (
              <NavigationBackBar
                activeTab={activeTab}
                previousTab={historyStack.length > 1 ? historyStack[historyStack.length - 2] : null}
                onBack={handleGoBack}
                onHome={() => navigateToTab(activeRole === 'admin' ? 'admin' : (activeRole === 'teacher' ? 'teacher' : 'parent_hub'))}
                onNavigate={navigateToTab}
                getPortalTitle={getPortalTitle}
              />
            )}

            {/* 15-Minute Inactivity Session Expiration Security Banner */}
            {sessionExpiredNotice && (
              <div style={{
                backgroundColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.95)' : '#FFFBEB',
                border: `1.5px solid ${theme === 'dark' ? '#F59E0B' : '#FBBF24'}`,
                borderRadius: '12px',
                padding: '16px 20px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                boxShadow: '0 8px 24px rgba(245, 158, 11, 0.15)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(245, 158, 11, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <ShieldAlert size={22} color="#F59E0B" />
                  </div>
                  <div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: 700,
                      color: theme === 'dark' ? '#FDE68A' : '#92400E',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span>Session Auto-Terminated (60-Minute Inactivity Protection)</span>
                      <span style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        background: 'rgba(245, 158, 11, 0.2)',
                        color: '#F59E0B',
                        fontWeight: 600
                      }}>
                        JWT Revoked
                      </span>
                    </div>
                    <div style={{
                      fontSize: '12.5px',
                      color: theme === 'dark' ? '#CBD5E1' : '#78350F',
                      marginTop: '3px',
                      lineHeight: 1.4
                    }}>
                      For campus data security, your session was automatically signed out after 60 minutes of inactivity. Please sign in again to resume work.
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                  <button
                    onClick={() => {
                      setSessionExpiredNotice(false);
                      handleOpenAuth('signin');
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: '#F59E0B',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(245, 158, 11, 0.35)'
                    }}
                  >
                    <LogIn size={15} />
                    Sign In Again
                  </button>
                  <button
                    onClick={() => setSessionExpiredNotice(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: theme === 'dark' ? '#94A3B8' : '#92400E',
                      cursor: 'pointer',
                      padding: '6px',
                      borderRadius: '6px'
                    }}
                    title="Dismiss notice"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Authentication Success Dispatch Toast */}
            {authNotice && (
              <div style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid #18B981',
                borderRadius: '10px',
                padding: '12px 18px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 4px 12px rgba(24, 185, 129, 0.12)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    backgroundColor: '#18B981',
                    borderRadius: '50%',
                    padding: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <CheckCircle2 size={16} color="#FFFFFF" />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
                      Authenticated as <strong>{authNotice.userName}</strong> ({authNotice.role})
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      Active Portal: <strong>{authNotice.targetName}</strong>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setAuthNotice(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* =========================================================================
              SCREEN 0: Super Admin Control Center (Platform Owner)
              ========================================================================= */}
            {activeTab === 'super_admin' && (
              <SuperAdminHUD 
                onSwitchTab={navigateToTab} 
                onSwitchRole={handleSwitchRole} 
                currentUser={currentUser} 
                onRequireAuth={handleRequireAuth}
              />
            )}

            {/* =========================================================================
              SCREEN 1: School Admin Dashboard
              ========================================================================= */}
            {activeTab === 'admin' && (
              <AdminHUD onSwitchTab={navigateToTab} onRequireAuth={handleRequireAuth} currentUser={currentUser} />
            )}

            {/* =========================================================================
              SCREEN 2: Parent Dashboard
              ========================================================================= */}
            {(activeTab === 'parent_hub' || activeTab === 'parent') && (
              <ParentDashboard onSwitchTab={navigateToTab} onRequireAuth={handleRequireAuth} currentUser={currentUser} />
            )}

            {/* Teacher Workspace */}
            {activeTab === 'teacher' && (
              <TeacherDashboard onSwitchTab={navigateToTab} onRequireAuth={handleRequireAuth} currentUser={currentUser} />
            )}

            {/* =========================================================================
              SCREEN 3: AI Mentor
              ========================================================================= */}
            {activeTab === 'aichat' && (
              <AiSaathiChat currentUser={currentUser} onRequireAuth={handleRequireAuth} />
            )}

            {/* =========================================================================
              SCREEN 4: Student/Teacher Management
              ========================================================================= */}
            {(activeTab === 'management' || activeTab === 'students') && (
              <StudentTeacherManagement 
                onSwitchTab={navigateToTab} 
                onRequireAuth={handleRequireAuth}
                currentUser={currentUser}
              />
            )}

            {/* =========================================================================
              SCREEN: Campus Organization Hierarchy (Super Admin, School Admin, Teacher)
              ========================================================================= */}
            {activeTab === 'organization' && (
              <OrganizationHierarchy currentUser={currentUser} activeRole={activeRole} onSwitchTab={navigateToTab} />
            )}

            {/* =========================================================================
              SCREEN 5: Fee & Payment Management
              ========================================================================= */}
            {activeTab === 'fees' && (
              <FeeLedger 
                currentUser={currentUser} 
                onRequireAuth={handleRequireAuth}
                onSwitchTab={navigateToTab}
              />
            )}

            {/* Ecosystem 360° & Other Connected Features */}
            {activeTab === 'overview' && (
              <EcosystemOverview
                onSwitchTab={navigateToTab}
                onRequireAuth={handleRequireAuth}
                currentUser={currentUser}
                onOpenNoticeBoard={() => setShowNoticeBoardModal(true)}
              />
            )}

            {activeTab === 'kiosk' && (
              (activeRole === 'parent' || (currentUser && String(currentUser.role).toUpperCase().includes('PARENT'))) ? (
                <div style={{
                  padding: '48px 24px',
                  textAlign: 'center',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: '16px',
                  border: '1px solid var(--border-subtle)',
                  margin: '30px auto',
                  maxWidth: '560px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    color: '#EF4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    fontSize: '28px'
                  }}>
                    🛡️
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '10px' }}>
                    Teacher &amp; Staff Desk Feature
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
                    Attendance marking and live gate kiosk operations are managed exclusively by teachers and school staff. You can view your child's attendance status and reports directly from your Parent Hub.
                  </p>
                  <button
                    onClick={() => navigateToTab('parent_hub')}
                    style={{
                      padding: '10px 24px',
                      backgroundColor: '#1677FF',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13.5px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Go to Parent Hub
                  </button>
                </div>
              ) : (
                <GateKiosk
                  currentUser={currentUser}
                  activeRole={activeRole}
                  onSwitchTab={navigateToTab}
                  onRequireAuth={handleRequireAuth}
                />
              )
            )}

            {activeTab === 'sockets' && (
              <ClassroomSockets 
                currentUser={currentUser} 
                onRequireAuth={handleRequireAuth}
              />
            )}

            {activeTab === 'leaves' && (
              <LeaveWorkflow 
                currentUser={currentUser} 
                onRequireAuth={handleRequireAuth}
              />
            )}

            {activeTab === 'consultation' && (
              <ConsultationMarketplace 
                currentUser={currentUser} 
                activeRole={activeRole} 
                onRequireAuth={handleRequireAuth}
              />
            )}

            {activeTab === 'quiz' && (
              <QuizArena 
                currentUser={currentUser} 
                onRequireAuth={handleRequireAuth}
              />
            )}

            {activeTab === 'attendance_view' && (
              <ChildAttendanceView
                currentUser={currentUser}
                onSwitchTab={navigateToTab}
              />
            )}

            {activeTab === 'suraksha_pass' && (
              <SurakshaPassViewer
                onBack={() => navigateToTab('parent_hub')}
                onSwitchTab={navigateToTab}
              />
            )}

            {/* Animated Campus Life Parade Track & Rotating Smartboard Lessons */}
            <EducationalFooter
              onSwitchTab={navigateToTab}
              onRequireAuth={handleRequireAuth}
              currentUser={currentUser}
            />

          </main>

          {/* Right-Side Animated Campus Activity Rail (🏃🎒🏏⚽🍱🏑🏸🖥️) */}
          <VerticalCampusRail
            onSwitchTab={navigateToTab}
            onRequireAuth={handleRequireAuth}
            currentUser={currentUser}
            theme={theme}
          />
        </div>
      </div>
      </>
      )}

      {/* Auth Portal Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authInitialMode}
        onClose={() => {
          setIsAuthOpen(false);
          setIntendedFeature(null);
        }}
        onLoginSuccess={handleLoginSuccess}
        intendedFeature={intendedFeature}
      />

      {/* Inactivity 30-Second Warning Floating Badge */}
      {currentUser && inactivityWarning !== null && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
          border: '2px solid #EF4444',
          borderRadius: '14px',
          padding: '16px 20px',
          boxShadow: '0 12px 36px rgba(239, 68, 68, 0.35)',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          maxWidth: '420px',
          animation: 'pulse 1.5s infinite ease-in-out'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Clock size={22} color="#EF4444" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: '13.5px',
              fontWeight: 700,
              color: theme === 'dark' ? '#FCA5A5' : '#991B1B',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span>Inactivity Warning</span>
              <span style={{
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                padding: '2px 8px',
                borderRadius: '10px',
                fontSize: '11px',
                fontWeight: 800
              }}>
                {inactivityWarning}s
              </span>
            </div>
            <div style={{
              fontSize: '11.5px',
              color: theme === 'dark' ? '#94A3B8' : '#64748B',
              marginTop: '2px'
            }}>
              Session will auto-close in {inactivityWarning}s due to inactivity.
            </div>
          </div>
          <button
            onClick={handleStaySignedIn}
            style={{
              backgroundColor: '#EF4444',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 6px rgba(239, 68, 68, 0.3)'
            }}
          >
            I'm Active
          </button>
        </div>
      )}

      {/* Interactive Campus Public Notice Board Modal */}
      {showNoticeBoardModal && (
        <PublicNoticeLoader
          onDismiss={() => setShowNoticeBoardModal(false)}
          onOpenAuth={handleOpenAuth}
          onSwitchTab={(tab) => {
            setShowNoticeBoardModal(false);
            navigateToTab(tab);
          }}
        />
      )}

      {/* Role Switch Restriction Modal (Active Session Protection) */}
      <RoleSwitchModal
        isOpen={!!roleSwitchWarning}
        onClose={() => setRoleSwitchWarning(null)}
        currentUser={currentUser}
        attemptedRole={roleSwitchWarning}
        onConfirmLogoutAndSwitch={handleConfirmRoleSwitchLogout}
        theme={theme}
      />
    </div>
  );
}
