import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  Trophy, 
  GraduationCap, 
  Activity,
  Sparkles
} from 'lucide-react';
import {
  GeometryCompassIcon,
  LabMicroscopeIcon,
  DesktopGlobeIcon,
  ChemicalLabIcon,
  WoodenAbacusIcon
} from './ScholasticIcons';

/**
 * All 13 Campus Educational Activities & Sports in strict serial sequence.
 * Structured with distinct identities, micro-animations, and cheer feedback.
 */
const CAMPUS_ACTIVITIES = [
  {
    id: 'runner',
    emoji: '🏃',
    title: 'Student Sprint',
    subtitle: 'Physical Edu • Athletics',
    borderColor: '#38BDF8',
    bgColor: 'rgba(56, 189, 248, 0.16)',
    color: '#0284C7',
    animStyle: { animation: 'runnerStrideHop 0.6s infinite ease-in-out' },
    cheer: 'Athletics Sprint! Cultivating physical stamina and perseverance!'
  },
  {
    id: 'bag',
    emoji: '🎒',
    title: 'School Backpack',
    subtitle: 'Books & Geometry Kit',
    borderColor: '#EC4899',
    bgColor: 'rgba(236, 72, 153, 0.16)',
    color: '#DB2777',
    animStyle: { animation: 'bagBouncingTravel 1.8s infinite ease-in-out' },
    cheer: 'Academic Backpack! Loaded with textbooks, notebooks and curious minds!'
  },
  {
    id: 'cricket',
    emoji: '🏏',
    title: 'Cricket Academy',
    subtitle: 'Inter-School League',
    borderColor: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.16)',
    color: '#D97706',
    animStyle: { animation: 'cricketBatDrive 1.8s infinite ease-in-out' },
    cheer: 'Cricket Academy! Cover drive straight over the boundary line!'
  },
  {
    id: 'football',
    emoji: '⚽',
    title: 'Football Turf',
    subtitle: 'Agility & Teamwork',
    borderColor: '#3B82F6',
    bgColor: 'rgba(59, 130, 246, 0.16)',
    color: '#2563EB',
    animStyle: { animation: 'footballRollBounceTravel 1.8s infinite cubic-bezier(0.34, 1.56, 0.64, 1)' },
    cheer: 'Football League! Precision passing and top-corner strikes!'
  },
  {
    id: 'tiffin',
    emoji: '🍱',
    title: 'Daily Nutrition',
    subtitle: 'Balanced Student Meal',
    borderColor: '#F97316',
    bgColor: 'rgba(249, 115, 22, 0.16)',
    color: '#EA580C',
    animStyle: { animation: 'tiffinGlidePuff 2s infinite ease-in-out' },
    cheer: 'Wholesome Nutrition! Balanced diet energizing student focus!'
  },
  {
    id: 'hockey',
    emoji: '🏑',
    title: 'Field Hockey',
    subtitle: 'Turf Coordination',
    borderColor: '#10B981',
    bgColor: 'rgba(16, 185, 129, 0.16)',
    color: '#059669',
    animStyle: { animation: 'hockeyTurfDribble 1.5s infinite ease-in-out' },
    cheer: 'Field Hockey! National sport excellence and tactical dribbling!'
  },
  {
    id: 'badminton',
    emoji: '🏸',
    title: 'Badminton Rally',
    subtitle: 'Reflexes & High Smash',
    borderColor: '#A855F7',
    bgColor: 'rgba(168, 85, 247, 0.16)',
    color: '#9333EA',
    animStyle: { animation: 'badmintonHighSmash 1.8s infinite ease-in-out' },
    cheer: 'Badminton Arena! Rapid reflexes and high-velocity rallies!'
  },
  {
    id: 'smartboard',
    emoji: '🖥️',
    title: 'Digital Classroom',
    subtitle: 'Computer Lab & AI',
    borderColor: '#06B6D4',
    bgColor: 'rgba(6, 182, 212, 0.16)',
    color: '#0891B2',
    animStyle: { animation: 'smartboardRoverRoll 2s infinite ease-in-out' },
    cheer: 'Smart Classroom! Interactive digital lessons and futuristic coding!'
  },
  {
    id: 'compass',
    iconType: 'compass',
    title: 'Geometry Compass',
    subtitle: 'Drafting & Arc Logic',
    borderColor: '#0284C7',
    bgColor: 'rgba(2, 132, 199, 0.16)',
    color: '#0284C7',
    animStyle: {},
    cheer: 'Precision Geometry! Measuring angles, tangents, and drafting theorems!'
  },
  {
    id: 'microscope',
    iconType: 'microscope',
    title: 'Optical Microscope',
    subtitle: '1000x Bio Specimen',
    borderColor: '#059669',
    bgColor: 'rgba(5, 150, 105, 0.16)',
    color: '#059669',
    animStyle: {},
    cheer: 'Optical Microscope! 1000x resolution revealing cell mitochondria & plant vacuoles!'
  },
  {
    id: 'globe',
    iconType: 'globe',
    title: 'Terrestrial Globe',
    subtitle: 'World Geography',
    borderColor: '#D97706',
    bgColor: 'rgba(217, 119, 6, 0.16)',
    color: '#B45309',
    animStyle: {},
    cheer: 'Terrestrial Globe! Exploring latitudes, oceans, and Indian heritage!'
  },
  {
    id: 'tubes',
    iconType: 'tubes',
    title: 'Chemical Lab Bench',
    subtitle: 'Reaction Solutions',
    borderColor: '#8B5CF6',
    bgColor: 'rgba(139, 92, 246, 0.16)',
    color: '#7C3AED',
    animStyle: {},
    cheer: 'Reaction Test Tubes! Exothermic kinetic reaction with bubbling solutions!'
  },
  {
    id: 'abacus',
    iconType: 'abacus',
    title: 'Soroban Abacus',
    subtitle: 'Arithmetic Reckoning',
    borderColor: '#B45309',
    bgColor: 'rgba(180, 83, 9, 0.16)',
    color: '#92400E',
    animStyle: {},
    cheer: 'Soroban Abacus! Decimal place reckoning, mental math, and Vedic speed calculation!'
  }
];

export default function VerticalCampusRail({ 
  onSwitchTab, 
  onRequireAuth, 
  currentUser,
  theme = 'light'
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeBoardMsgIdx, setActiveBoardMsgIdx] = useState(0);
  const [clickedItemFeedback, setClickedItemFeedback] = useState(null);
  const [paradeSpeed, setParadeSpeed] = useState('normal'); // 'normal' | 'fast' | 'paused'

  // Proactive theme synchronization: checks prop, localStorage, and DOM attributes
  const [isDark, setIsDark] = useState(() => {
    if (typeof document !== 'undefined') {
      const docTheme = document.documentElement.getAttribute('data-theme');
      return docTheme === 'dark' || theme === 'dark';
    }
    return theme === 'dark';
  });

  useEffect(() => {
    const syncTheme = () => {
      const docTheme = document.documentElement.getAttribute('data-theme');
      setIsDark(docTheme === 'dark' || theme === 'dark');
    };
    syncTheme();

    // Observe any runtime attribute change on <html data-theme="...">
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.attributeName === 'data-theme') {
          syncTheme();
          break;
        }
      }
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, [theme]);

  const smartboardLessons = [
    { title: "📐 Mathematics", text: "Pythagoras Theorem: a² + b² = c²", icon: "📐" },
    { title: "🌿 Botany & Science", text: "Photosynthesis: 6CO₂ + 6H₂O", icon: "🌱" },
    { title: "🚀 Lunar Research", text: "Chandrayaan Moon South Pole", icon: "🌕" },
    { title: "💡 Thought of Day", text: "Education is Empowerment", icon: "✨" }
  ];

  // Rotate smartboard lessons every 3.4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBoardMsgIdx(prev => (prev + 1) % smartboardLessons.length);
    }, 3400);
    return () => clearInterval(timer);
  }, [smartboardLessons.length]);

  const handleItemClick = (itemKey, cheerText, emojiOrIcon) => {
    setClickedItemFeedback({ key: itemKey, message: cheerText, displayIcon: emojiOrIcon });
    setTimeout(() => {
      setClickedItemFeedback(null);
    }, 3800);
  };

  const getConveyorDuration = () => {
    if (paradeSpeed === 'fast') return '22s';
    return '46s'; // Relaxed, elegant serial pace
  };

  const getConveyorPlayState = () => {
    return paradeSpeed === 'paused' ? 'paused' : 'running';
  };

  const renderIcon = (item) => {
    if (item.iconType === 'compass') return <GeometryCompassIcon size={22} />;
    if (item.iconType === 'microscope') return <LabMicroscopeIcon size={22} />;
    if (item.iconType === 'globe') return <DesktopGlobeIcon size={22} />;
    if (item.iconType === 'tubes') return <ChemicalLabIcon size={22} />;
    if (item.iconType === 'abacus') return <WoodenAbacusIcon size={22} />;
    return <span style={{ fontSize: '22px', ...item.animStyle }}>{item.emoji}</span>;
  };

  const renderCard = (item, uniqueKey) => {
    return (
      <div
        key={uniqueKey}
        className="vertical-capsule-card"
        onClick={() => handleItemClick(item.id, item.cheer, item.emoji || '🎓')}
        title={`Click to cheer ${item.title}!`}
        style={{
          border: `1px solid ${isDark ? 'rgba(226, 232, 240, 0.12)' : '#E2E8F0'}`,
          backgroundColor: isDark ? '#0D223E' : '#FFFFFF'
        }}
      >
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          backgroundColor: item.bgColor,
          border: `1px solid ${item.borderColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          {renderIcon(item)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ 
            fontSize: '11px', 
            fontWeight: 700, 
            color: isDark ? '#F8FAFC' : '#12213A', 
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {item.title}
          </div>
          <div style={{ 
            fontSize: '9px', 
            color: isDark ? '#94A3B8' : '#64748B', 
            fontWeight: 600, 
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {item.subtitle}
          </div>
        </div>
      </div>
    );
  };

  // =========================================================================
  // 1. COLLAPSED VIEW: DOCKED COMPACT STRIP ON RIGHT EDGE
  // =========================================================================
  if (isCollapsed) {
    return (
      <aside 
        className="vertical-campus-rail-collapsed"
        style={{
          position: 'sticky',
          top: '70px',
          height: 'calc(100vh - 70px)',
          width: '38px',
          flexShrink: 0,
          zIndex: 35,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 4px',
          boxSizing: 'border-box'
        }}
      >
        <button
          onClick={() => setIsCollapsed(false)}
          title="Expand Right Campus Activity Rail (🏃🎒🏏⚽🍱🏑🏸🖥️)"
          style={{
            background: isDark ? 'rgba(56, 189, 248, 0.15)' : 'rgba(21, 94, 239, 0.1)',
            border: isDark ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(21, 94, 239, 0.25)',
            color: isDark ? '#38BDF8' : '#155EEF',
            padding: '8px 5px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            width: '100%'
          }}
        >
          <ChevronLeft size={16} />
        </button>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span 
            style={{ 
              fontSize: '18px',
              animation: 'runnerStrideHop 1s infinite ease-in-out',
              display: 'inline-block'
            }}
            title="Active Student in Motion"
          >
            🏃
          </span>
          <span style={{ 
            writingMode: 'vertical-rl', 
            fontSize: '9.5px', 
            fontWeight: 800, 
            letterSpacing: '2px',
            color: isDark ? '#94A3B8' : '#475569',
            textTransform: 'uppercase'
          }}>
            CAMPUS VITALITY
          </span>
        </div>

        <div 
          title="Campus Life: Live"
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#10B981',
            boxShadow: '0 0 8px #10B981'
          }}
        />
      </aside>
    );
  }

  // =========================================================================
  // 2. EXPANDED VIEW: SERIAL ONE-BY-ONE CONVEYOR (ZERO OVERLAP)
  // =========================================================================
  return (
    <aside 
      className="vertical-campus-rail"
      style={{
        position: 'sticky',
        top: '70px',
        height: 'calc(100vh - 70px)',
        width: '220px',
        flexShrink: 0,
        zIndex: 35,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}
    >
      {/* -------------------------------------------------------------
          HEADER: Brand Bar & Speed Controls
          ------------------------------------------------------------- */}
      <div 
        className="rail-header"
        style={{
          padding: '12px 14px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          flexShrink: 0,
          zIndex: 20,
          backgroundColor: isDark ? '#0D223E' : '#FFFFFF',
          borderBottom: `1px solid ${isDark ? 'rgba(226, 232, 240, 0.08)' : '#E2E8F0'}`
        }}
      >
        {/* Top Row: Brand & Minimize Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={14} color={isDark ? '#38BDF8' : '#155EEF'} />
            <span 
              className="rail-brand-text"
              style={{
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.6px',
                textTransform: 'uppercase'
              }}
            >
              Campus Vitality
            </span>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              boxShadow: '0 0 6px #10B981',
              display: 'inline-block'
            }} />
          </div>

          <button
            onClick={() => setIsCollapsed(true)}
            className="rail-toggle-btn"
            title="Collapse rail to right side"
            style={{
              cursor: 'pointer',
              borderRadius: '5px',
              padding: '3px 5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.15s ease'
            }}
          >
            <ChevronRight size={13} />
          </button>
        </div>

        {/* Bottom Row: Subtitle & Pace Selector */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
          <span style={{ fontSize: '9.5px', color: isDark ? '#38BDF8' : '#155EEF', fontWeight: 700 }}>
            Life in Motion
          </span>

          {/* Speed Buttons */}
          <div 
            className="rail-speed-bar"
            style={{
              display: 'flex',
              alignItems: 'center',
              borderRadius: '8px',
              padding: '2px'
            }}
          >
            <button
              onClick={() => setParadeSpeed('normal')}
              title="Normal Pace (1x)"
              style={{
                border: 'none',
                backgroundColor: paradeSpeed === 'normal' ? '#155EEF' : 'transparent',
                color: paradeSpeed === 'normal' ? '#FFFFFF' : (isDark ? '#94A3B8' : '#64748B'),
                padding: '2px 6px',
                borderRadius: '5px',
                fontSize: '9px',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              1x
            </button>
            <button
              onClick={() => setParadeSpeed('fast')}
              title="Fast Sprint (2x)"
              style={{
                border: 'none',
                backgroundColor: paradeSpeed === 'fast' ? '#155EEF' : 'transparent',
                color: paradeSpeed === 'fast' ? '#FFFFFF' : (isDark ? '#94A3B8' : '#64748B'),
                padding: '2px 6px',
                borderRadius: '5px',
                fontSize: '9px',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              2x
            </button>
            <button
              onClick={() => setParadeSpeed(paradeSpeed === 'paused' ? 'normal' : 'paused')}
              title={paradeSpeed === 'paused' ? "Resume Motion" : "Pause Motion"}
              style={{
                border: 'none',
                backgroundColor: paradeSpeed === 'paused' ? '#F59E0B' : 'transparent',
                color: paradeSpeed === 'paused' ? '#FFFFFF' : (isDark ? '#94A3B8' : '#64748B'),
                padding: '2px 5px',
                borderRadius: '5px',
                fontSize: '9px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {paradeSpeed === 'paused' ? <Play size={8} /> : <Pause size={8} />}
            </button>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          INTERACTIVE CHEER POPUP TOAST (Pops out to the left)
          ------------------------------------------------------------- */}
      {clickedItemFeedback && (
        <div style={{
          position: 'fixed',
          top: '84px',
          right: '232px',
          width: '240px',
          backgroundColor: isDark ? 'rgba(7, 21, 39, 0.98)' : 'rgba(255, 255, 255, 0.98)',
          border: '1px solid #155EEF',
          borderRadius: '12px',
          padding: '12px 14px',
          boxShadow: isDark 
            ? '0 12px 36px rgba(0, 0, 0, 0.6), 0 0 16px rgba(56, 189, 248, 0.25)' 
            : '0 12px 36px rgba(0, 0, 0, 0.15), 0 0 16px rgba(21, 94, 239, 0.15)',
          zIndex: 9999,
          color: isDark ? '#F8FAFC' : '#12213A',
          fontSize: '11.5px',
          fontWeight: 700,
          animation: 'fadeIn 0.2s ease-in-out',
          backdropFilter: 'blur(12px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#155EEF', marginBottom: '4px' }}>
            <span style={{ fontSize: '18px' }}>{clickedItemFeedback.displayIcon}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Volume2 size={13} />
              <span style={{ fontSize: '10px', letterSpacing: '0.5px', textTransform: 'uppercase', fontWeight: 800 }}>
                Campus Cheer
              </span>
            </div>
          </div>
          <div style={{ lineHeight: 1.4 }}>{clickedItemFeedback.message}</div>
        </div>
      )}

      {/* -------------------------------------------------------------
          ZERO-OVERLAP SERIAL CONVEYOR VIEWPORT
          ------------------------------------------------------------- */}
      <div 
        className="vertical-conveyor-viewport"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 16px, black calc(100% - 16px), transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 16px, black calc(100% - 16px), transparent 100%)'
        }}
      >
        {/* Subtle Central Guideline Track */}
        <div style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '26px',
          width: '2px',
          backgroundImage: isDark
            ? 'repeating-linear-gradient(180deg, rgba(56, 189, 248, 0.35) 0, rgba(56, 189, 248, 0.35) 12px, transparent 12px, transparent 24px)'
            : 'repeating-linear-gradient(180deg, rgba(21, 94, 239, 0.25) 0, rgba(21, 94, 239, 0.25) 12px, transparent 12px, transparent 24px)',
          animation: 'verticalTrackDashesMove 1.2s linear infinite',
          animationPlayState: getConveyorPlayState(),
          opacity: 0.5,
          zIndex: 1,
          pointerEvents: 'none'
        }} />

        {/* Conveyor Track: Moves smoothly upwards without ANY overlap */}
        <div 
          className="vertical-conveyor-track"
          style={{
            animationDuration: getConveyorDuration(),
            animationPlayState: getConveyorPlayState(),
            zIndex: 2,
            paddingTop: '16px'
          }}
        >
          {/* Group 1: All 13 items in clean serial order */}
          <div className="vertical-conveyor-group">
            {CAMPUS_ACTIVITIES.map(item => renderCard(item, `grp1-${item.id}`))}
          </div>

          {/* Group 2: Seamless duplicate array for infinite smooth loop */}
          <div className="vertical-conveyor-group" aria-hidden="true">
            {CAMPUS_ACTIVITIES.map(item => renderCard(item, `grp2-${item.id}`))}
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          FOOTER: Rotating Smartboard Lessons & Active Status
          ------------------------------------------------------------- */}
      <div 
        className="rail-footer"
        style={{
          padding: '10px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          flexShrink: 0,
          zIndex: 20,
          backgroundColor: isDark ? '#0D223E' : '#FFFFFF',
          borderTop: `1px solid ${isDark ? 'rgba(226, 232, 240, 0.08)' : '#E2E8F0'}`
        }}
      >
        {/* Rotating Smartboard Capsule */}
        <div 
          className="rail-ticker-box"
          style={{
            borderRadius: '8px',
            padding: '6px 8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span style={{ fontSize: '16px' }}>{smartboardLessons[activeBoardMsgIdx].icon}</span>
          <div style={{ overflow: 'hidden' }}>
            <div 
              className="rail-ticker-title"
              style={{ 
                fontSize: '10px', 
                fontWeight: 800, 
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {smartboardLessons[activeBoardMsgIdx].title}
            </div>
            <div style={{ 
              fontSize: '8.5px', 
              color: isDark ? '#38BDF8' : '#1677FF',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {smartboardLessons[activeBoardMsgIdx].text}
            </div>
          </div>
        </div>

        {/* Live Active Students Counter */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '9px',
          fontWeight: 700,
          color: isDark ? '#94A3B8' : '#64748B'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={11} color={isDark ? '#38BDF8' : '#1677FF'} />
            <span>1,248 Students</span>
          </div>
          <span style={{ color: '#10B981' }}>● 100% Active</span>
        </div>
      </div>
    </aside>
  );
}
