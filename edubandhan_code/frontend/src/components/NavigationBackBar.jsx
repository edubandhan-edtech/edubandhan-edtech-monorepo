import React from 'react';
import { ArrowLeft, Home, ChevronRight, Compass, RotateCcw } from 'lucide-react';

export default function NavigationBackBar({
  activeTab,
  previousTab,
  onBack,
  onHome,
  onNavigate,
  getPortalTitle
}) {
  // If we are on overview and have no previous tab, don't show the bar
  if (activeTab === 'overview' && !previousTab) {
    return null;
  }

  const currentTitle = getPortalTitle ? getPortalTitle(activeTab) : activeTab;
  const prevTitle = previousTab ? (getPortalTitle ? getPortalTitle(previousTab) : previousTab) : 'Ecosystem 360°';

  return (
    <nav
      aria-label="Portal Navigation & History"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        background: 'linear-gradient(135deg, rgba(8, 24, 46, 0.75) 0%, rgba(15, 23, 42, 0.8) 100%)',
        border: '1px solid rgba(56, 189, 248, 0.22)',
        borderRadius: '12px',
        padding: '10px 16px',
        marginBottom: '20px',
        boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.25)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        transition: 'all 0.25s ease'
      }}
    >
      {/* Left: Back Button + Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        {/* Back Arrow Button */}
        <button
          onClick={onBack}
          id="btn-nav-back"
          title={`Go back to last visited place: ${prevTitle} (Browser back also supported)`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.18) 0%, rgba(2, 132, 199, 0.28) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.45)',
            color: '#38bdf8',
            padding: '7px 14px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 2px 8px rgba(14, 165, 233, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(14, 165, 233, 0.3) 0%, rgba(2, 132, 199, 0.45) 100%)';
            e.currentTarget.style.transform = 'translateX(-2px)';
            e.currentTarget.style.boxShadow = '0 0 14px rgba(56, 189, 248, 0.45)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(14, 165, 233, 0.18) 0%, rgba(2, 132, 199, 0.28) 100%)';
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(14, 165, 233, 0.2)';
          }}
        >
          <ArrowLeft size={16} strokeWidth={2.4} />
          <span>Back to {previousTab ? prevTitle.split('(')[0].trim() : 'Ecosystem 360°'}</span>
        </button>

        {/* Breadcrumb Trail */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
          <button
            onClick={onHome}
            style={{
              background: 'transparent',
              border: 'none',
              color: activeTab === 'overview' ? 'var(--accent-cyan)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: 600,
              fontSize: '12px'
            }}
            title="Go to Ecosystem 360° Home"
          >
            <Home size={13} />
            <span>Home</span>
          </button>

          {previousTab && previousTab !== 'overview' && (
            <>
              <ChevronRight size={12} color="rgba(148, 163, 184, 0.6)" />
              <button
                onClick={() => onNavigate && onNavigate(previousTab)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: 600,
                  fontSize: '12px'
                }}
                title={`Return to ${prevTitle}`}
              >
                {prevTitle.split('(')[0].trim()}
              </button>
            </>
          )}

          {activeTab !== 'overview' && (
            <>
              <ChevronRight size={12} color="rgba(148, 163, 184, 0.6)" />
              <span style={{
                color: 'var(--text-main)',
                fontWeight: 700,
                background: 'rgba(56, 189, 248, 0.12)',
                padding: '2px 8px',
                borderRadius: '5px',
                border: '1px solid rgba(56, 189, 248, 0.25)'
              }}>
                {currentTitle.split('(')[0].trim()}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Right: Quick Shortcuts */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {activeTab !== 'overview' && (
          <button
            onClick={onHome}
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-main)';
              e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
            }}
          >
            <Compass size={13} />
            <span>All 9 Features</span>
          </button>
        )}

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(52, 211, 153, 0.3)',
          color: '#34d399',
          padding: '4px 10px',
          borderRadius: '999px',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.4px'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
          <span>Live Session Sync</span>
        </div>
      </div>
    </nav>
  );
}
