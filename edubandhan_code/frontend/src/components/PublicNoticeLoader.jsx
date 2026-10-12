import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, 
  Megaphone, 
  Calendar, 
  Clock, 
  ShieldAlert, 
  ArrowRight, 
  X, 
  Sparkles,
  School,
  ChevronRight,
  ChevronLeft,
  Pause,
  Play,
  Lock,
  Volume2
} from 'lucide-react';

const FALLBACK_PUBLIC_NOTICES = [
  {
    id: 1,
    title: "CBSE Pre-Board Examination Schedules & Hall Tickets Released",
    content: "Pre-board examination schedules for Classes 10 & 12 are officially declared. Practical assessments begin from Nov 15th. Students are instructed to collect verified hall tickets from their class proctors before Friday.",
    author_name: "Examination Controller",
    author_role: "SCHOOL_ADMIN",
    is_urgent: true,
    category: "EXAM",
    school_name: "Delhi Public School, Rourkela",
    created_at: "Today"
  },
  {
    id: 2,
    title: "38th Annual Campus Athletic Meet 2026 Registration Open",
    content: "The 38th Annual Sports Gala will commence on October 24th at the Main Olympic Pavilion. Track and field entries, relay teams, and house captaincy registrations are now open through your physical education instructor. Parents are cordially invited to attend.",
    author_name: "Dr. Sunita Sharma (Principal)",
    author_role: "SCHOOL_ADMIN",
    is_urgent: false,
    category: "EVENT",
    school_name: "Delhi Public School, Rourkela",
    created_at: "Yesterday"
  },
  {
    id: 3,
    title: "National STEM & Robotics Innovation Dry-Runs",
    content: "Selected junior and senior robotics teams are requested to report to Innovation Lab 3 for project dry-runs. The state evaluation panel will inspect working models and AI integration demonstrations this Thursday afternoon.",
    author_name: "Head of Science & Tech",
    author_role: "TEACHER",
    is_urgent: false,
    category: "CIRCULAR",
    school_name: "Delhi Public School, Rourkela",
    created_at: "2 days ago"
  }
];

export default function PublicNoticeLoader({ 
  onDismiss, 
  onOpenAuth,
  onSwitchTab 
}) {
  const [publicNotices, setPublicNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100%
  const SLIDE_DURATION = 4200; // 4.2 seconds per notice

  useEffect(() => {
    let isMounted = true;
    async function fetchPublicNotices() {
      try {
        const res = await fetch('/api/notices');
        const data = await res.json();
        if (isMounted && data.notices && data.notices.length > 0) {
          const pub = data.notices.filter(n => (n.notice_type || 'PUBLIC').toUpperCase() === 'PUBLIC');
          if (pub.length > 0) {
            setPublicNotices(pub);
          }
        }
      } catch (err) {
        console.warn('Failed to load public notices in bulletin:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchPublicNotices();
    return () => { isMounted = false; };
  }, []);

  const activeNotices = publicNotices.length > 0 ? publicNotices : FALLBACK_PUBLIC_NOTICES;
  const activeNotice = activeNotices[currentIndex % activeNotices.length] || activeNotices[0];

  // Automatic one-by-one notice movement timer
  useEffect(() => {
    if (activeNotices.length <= 1 || isPaused) return;

    const intervalStep = 50; // update progress every 50ms
    const totalSteps = SLIDE_DURATION / intervalStep;
    let stepCount = 0;

    const timer = setInterval(() => {
      stepCount += 1;
      setProgress((stepCount / totalSteps) * 100);

      if (stepCount >= totalSteps) {
        stepCount = 0;
        setProgress(0);
        setCurrentIndex(prev => (prev + 1) % activeNotices.length);
      }
    }, intervalStep);

    return () => clearInterval(timer);
  }, [activeNotices.length, isPaused, currentIndex]);

  const handleNext = () => {
    if (activeNotices.length === 0) return;
    setProgress(0);
    setCurrentIndex(prev => (prev + 1) % activeNotices.length);
  };

  const handlePrev = () => {
    if (activeNotices.length === 0) return;
    setProgress(0);
    setCurrentIndex(prev => (prev - 1 + activeNotices.length) % activeNotices.length);
  };

  // Keyboard navigation: Left/Right arrows, Space for pause/play, Esc to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape' && onDismiss) {
        onDismiss();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPaused(p => !p);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeNotices.length]);

  const getCategoryColor = (cat) => {
    switch ((cat || '').toUpperCase()) {
      case 'EMERGENCY': return { bg: 'rgba(239, 68, 68, 0.15)', text: '#EF4444', border: 'rgba(239, 68, 68, 0.35)' };
      case 'EVENT': return { bg: 'rgba(16, 185, 129, 0.15)', text: '#10B981', border: 'rgba(16, 185, 129, 0.35)' };
      case 'EXAM': return { bg: 'rgba(139, 92, 246, 0.15)', text: '#A855F7', border: 'rgba(139, 92, 246, 0.35)' };
      case 'CIRCULAR': return { bg: 'rgba(2, 132, 199, 0.15)', text: '#0284C7', border: 'rgba(56, 189, 248, 0.35)' };
      default: return { bg: 'rgba(2, 132, 199, 0.12)', text: '#38BDF8', border: 'rgba(56, 189, 248, 0.3)' };
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 999999,
      backgroundColor: 'rgba(4, 13, 26, 0.88)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      color: 'var(--text-main, #FFFFFF)',
      fontFamily: 'var(--font-sans)',
      animation: 'fadeIn 0.22s ease-out'
    }}>
      
      {/* Top Controls Bar */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '24px',
        right: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 10
      }}>
        {/* Brand identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: '#0284C7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(2, 132, 199, 0.5)'
          }}>
            <Megaphone size={20} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 900, letterSpacing: '-0.2px', color: '#FFFFFF' }}>
              EduBandhan (एडूबंधन)
            </div>
            <div style={{ fontSize: '11px', color: '#38BDF8', fontWeight: 600 }}>
              Live Public Notice Board &bull; Moving Automatically
            </div>
          </div>
        </div>

        {/* Action & Close Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onDismiss}
            style={{
              background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
              border: 'none',
              color: '#FFFFFF',
              padding: '8px 18px',
              borderRadius: '24px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)',
              transition: 'all 0.18s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <span>Enter Portal</span>
            <ArrowRight size={15} />
          </button>

          <button
            onClick={onDismiss}
            title="Close Bulletin (Esc)"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.14)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.18s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.35)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Center Notice Board Stage with Flanking Prev/Next Arrows */}
      <div 
        style={{
          maxWidth: '860px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
          marginTop: '40px'
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >

        {/* Live Auto-Moving Status Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: 'rgba(2, 132, 199, 0.18)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          padding: '6px 16px',
          borderRadius: '30px',
          fontSize: '12px',
          fontWeight: 700,
          color: '#38BDF8'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isPaused ? '#F59E0B' : '#10B981',
            boxShadow: isPaused ? '0 0 8px #F59E0B' : '0 0 8px #10B981',
            display: 'inline-block'
          }} />
          <span>
            {isPaused ? 'Auto-Movement Paused (Hovered)' : `Notices Moving Automatically (${currentIndex + 1} of ${activeNotices.length})`}
          </span>
          <button
            onClick={() => setIsPaused(!isPaused)}
            title={isPaused ? "Resume auto-slide (Space)" : "Pause auto-slide (Space)"}
            style={{
              background: 'rgba(56, 189, 248, 0.2)',
              border: 'none',
              borderRadius: '4px',
              color: '#38BDF8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '3px 6px',
              marginLeft: '4px',
              fontSize: '11px',
              fontWeight: 800,
              gap: '4px'
            }}
          >
            {isPaused ? <Play size={12} /> : <Pause size={12} />}
            <span>{isPaused ? 'Play' : 'Pause'}</span>
          </button>
        </div>

        {/* Stage Row: Left Arrow + Notice Card + Right Arrow */}
        <div style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          {/* Flanking Previous Button */}
          <button
            onClick={handlePrev}
            title="Previous Notice (Left Arrow)"
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-surface, #0D223E)',
              border: '1.5px solid var(--border-subtle, rgba(255,255,255,0.2))',
              color: 'var(--text-main, #FFFFFF)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
              transition: 'all 0.18s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.borderColor = '#0284C7';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = 'var(--border-subtle, rgba(255,255,255,0.2))';
            }}
          >
            <ChevronLeft size={24} />
          </button>

          {/* The Digital Notice Board Card */}
          <div style={{
            flex: 1,
            backgroundColor: 'var(--bg-surface, #0D223E)',
            borderRadius: '20px',
            boxShadow: '0 25px 65px rgba(0, 0, 0, 0.6), 0 0 0 1px var(--border-subtle, rgba(255, 255, 255, 0.12))',
            color: 'var(--text-main, #F8FAFC)',
            overflow: 'hidden',
            position: 'relative',
            minHeight: '340px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'all 0.3s ease'
          }}>
            
            {/* Linear Progress Bar for auto-movement */}
            <div style={{
              height: '4px',
              width: '100%',
              backgroundColor: 'var(--bg-secondary, rgba(255,255,255,0.08))',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${isPaused ? 100 : progress}%`,
                backgroundColor: isPaused ? '#F59E0B' : '#0284C7',
                transition: isPaused ? 'none' : 'width 0.05s linear'
              }} />
            </div>

            {/* Main Notice Body with animated key */}
            <div 
              key={activeNotice ? activeNotice.id : 'loading'} 
              style={{
                padding: '28px 32px',
                animation: 'noticeSlideIn 0.32s ease-out'
              }}
            >
              {activeNotice ? (
                <>
                  {/* Meta Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '14px',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        backgroundColor: 'rgba(2, 132, 199, 0.15)',
                        color: '#38BDF8',
                        border: '1px solid rgba(56, 189, 248, 0.35)',
                        padding: '3px 10px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Globe size={12} />
                        PUBLIC NOTICE
                      </span>

                      {(() => {
                        const catStyle = getCategoryColor(activeNotice.category);
                        return (
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            backgroundColor: catStyle.bg,
                            color: catStyle.text,
                            border: `1px solid ${catStyle.border}`,
                            padding: '3px 10px',
                            borderRadius: '6px'
                          }}>
                            {activeNotice.category || 'NOTICE'}
                          </span>
                        );
                      })()}

                      {activeNotice.is_urgent && (
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          backgroundColor: 'rgba(239, 68, 68, 0.2)',
                          color: '#EF4444',
                          border: '1px solid rgba(239, 68, 68, 0.4)',
                          padding: '3px 10px',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          animation: 'pulse 1.5s infinite ease-in-out'
                        }}>
                          <ShieldAlert size={12} />
                          URGENT
                        </span>
                      )}
                    </div>

                    <span style={{ fontSize: '12px', color: 'var(--text-dim, #94A3B8)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={13} />
                      Official School Circular &bull; {activeNotice.created_at || 'Active'}
                    </span>
                  </div>

                  {/* Notice Title */}
                  <h2 style={{
                    fontSize: '21px',
                    fontWeight: 900,
                    color: 'var(--text-main, #FFFFFF)',
                    margin: '0 0 14px',
                    lineHeight: 1.35,
                    letterSpacing: '-0.3px'
                  }}>
                    {activeNotice.title}
                  </h2>

                  {/* Content Box */}
                  <div style={{
                    backgroundColor: 'var(--bg-secondary, rgba(255,255,255,0.05))',
                    border: '1px solid var(--border-subtle, rgba(255,255,255,0.12))',
                    borderRadius: '12px',
                    padding: '18px 22px',
                    fontSize: '14px',
                    color: 'var(--text-main, #E2E8F0)',
                    lineHeight: 1.65,
                    whiteSpace: 'pre-wrap',
                    maxHeight: '190px',
                    overflowY: 'auto'
                  }}>
                    {activeNotice.content || activeNotice.message}
                  </div>

                  {/* Issuer Footnote */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '16px',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border-subtle, rgba(255,255,255,0.1))',
                    fontSize: '12px',
                    color: 'var(--text-muted, #94A3B8)'
                  }}>
                    <div>
                      Issued by: <strong style={{ color: 'var(--text-main, #FFFFFF)' }}>{activeNotice.author_name || 'Dr. Sunita Sharma (Principal)'}</strong> ({activeNotice.author_role || 'SCHOOL_ADMIN'})
                    </div>
                    <div style={{ color: '#38BDF8', fontWeight: 700 }}>
                      {activeNotice.school_name || 'Delhi Public School, Rourkela'}
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
                  <Megaphone size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                  <h3>Loading Campus Notices...</h3>
                </div>
              )}
            </div>

            {/* Bottom Card Navigation Toolbar */}
            <div style={{
              backgroundColor: 'var(--bg-surface-hover, rgba(255,255,255,0.03))',
              borderTop: '1px solid var(--border-subtle, rgba(255,255,255,0.1))',
              padding: '12px 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              
              {/* Prev & Next Toolbar Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={handlePrev}
                  title="Previous notice (<)"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle, rgba(255,255,255,0.2))',
                    backgroundColor: 'var(--bg-surface, rgba(255,255,255,0.08))',
                    color: 'var(--text-main, #FFFFFF)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  <ChevronLeft size={16} />
                </button>

                <button
                  onClick={handleNext}
                  title="Next notice (>)"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle, rgba(255,255,255,0.2))',
                    backgroundColor: 'var(--bg-surface, rgba(255,255,255,0.08))',
                    color: 'var(--text-main, #FFFFFF)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  <ChevronRight size={16} />
                </button>

                <span style={{ fontSize: '12px', color: 'var(--text-muted, #94A3B8)', fontWeight: 600, marginLeft: '6px' }}>
                  Notice {currentIndex + 1} of {activeNotices.length}
                </span>
              </div>

              {/* Stepper Dots (Clickable) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {activeNotices.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setProgress(0);
                      setCurrentIndex(idx);
                    }}
                    title={`Jump to notice ${idx + 1}`}
                    style={{
                      width: idx === currentIndex ? '22px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      backgroundColor: idx === currentIndex ? '#0284C7' : 'rgba(148, 163, 184, 0.4)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease'
                    }}
                  />
                ))}
              </div>

              {/* Parent Auth Link */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => {
                    if (onOpenAuth) onOpenAuth('signin');
                    if (onDismiss) onDismiss();
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#A855F7',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Lock size={13} />
                  <span>Sign In for Private Notices</span>
                </button>
              </div>

            </div>

          </div>

          {/* Flanking Next Button */}
          <button
            onClick={handleNext}
            title="Next Notice (Right Arrow)"
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-surface, #0D223E)',
              border: '1.5px solid var(--border-subtle, rgba(255,255,255,0.2))',
              color: 'var(--text-main, #FFFFFF)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
              transition: 'all 0.18s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.borderColor = '#0284C7';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = 'var(--border-subtle, rgba(255,255,255,0.2))';
            }}
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Bottom Helper Prompt */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.65)',
          marginTop: '6px'
        }}>
          <span>💡 Notices move automatically one by one. Use &larr; / &rarr; keys or hover to pause.</span>
        </div>

      </div>

      <style>{`
        @keyframes noticeSlideIn {
          0% {
            opacity: 0;
            transform: translateX(18px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>

    </div>
  );
}
