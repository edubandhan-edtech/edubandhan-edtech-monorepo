import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Trophy, 
  Zap, 
  ShieldCheck, 
  Heart, 
  Flame, 
  Volume2, 
  CheckCircle2, 
  ChevronRight, 
  Play, 
  Pause, 
  FastForward, 
  Info 
} from 'lucide-react';
import {
  GeometryCompassIcon,
  LabMicroscopeIcon,
  DesktopGlobeIcon,
  ChemicalLabIcon,
  WoodenAbacusIcon
} from './ScholasticIcons';

export default function EducationalFooter({ 
  onSwitchTab, 
  onRequireAuth, 
  currentUser,
  animationLayout = 'left',
  onSwitchLayout
}) {
  const [activeBoardMsgIdx, setActiveBoardMsgIdx] = useState(0);
  const [clickedItemFeedback, setClickedItemFeedback] = useState(null);
  const [paradeSpeed, setParadeSpeed] = useState('normal'); // 'normal' | 'fast' | 'paused'

  const smartboardLessons = [
    { title: "📐 Mathematics", text: "Pythagoras Theorem: a² + b² = c² • Ex 4.2 Quadratic Equations", icon: "📐" },
    { title: "🌿 Botany & Science", text: "Photosynthesis: 6CO₂ + 6H₂O + Sunlight ➔ C₆H₁₂O₆ + 6O₂", icon: "🌱" },
    { title: "🚀 Space & Innovation", text: "Chandrayaan Discovery: Water ice on Lunar South Pole", icon: "🌕" },
    { title: "📜 History & Culture", text: "Ashoka's Pillars: Truth, Peace, Non-Violence & Education", icon: "🏛️" },
    { title: "💡 Quote of the Day", text: "'Education is the most powerful weapon to change the world.'", icon: "✨" }
  ];

  // Rotate smartboard messages automatically every 3.6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBoardMsgIdx(prev => (prev + 1) % smartboardLessons.length);
    }, 3600);
    return () => clearInterval(timer);
  }, [smartboardLessons.length]);

  const handleItemClick = (itemKey, cheerText) => {
    setClickedItemFeedback({ key: itemKey, message: cheerText });
    setTimeout(() => {
      setClickedItemFeedback(null);
    }, 3800);
  };

  const handleModuleClick = (moduleId, moduleTitle) => {
    if (!currentUser && onRequireAuth) {
      onRequireAuth({ id: moduleId, title: moduleTitle });
    } else if (onSwitchTab) {
      onSwitchTab(moduleId);
    }
  };

  // Speed multiplier calculation
  const getSpeedMultiplier = () => {
    if (paradeSpeed === 'fast') return 0.5; // twice as fast
    return 1;
  };

  const getPlayState = () => {
    return paradeSpeed === 'paused' ? 'paused' : 'running';
  };

  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      background: 'var(--bg-nav)',
      marginTop: '40px',
      transition: 'all 0.25s ease',
      overflow: 'hidden'
    }}>
      {/* 1. TRAVELING CAMPUS SPORTS & ACADEMIC PARADE TRACK (HORIZONTAL OR CONDITIONAL) */}
      {animationLayout === 'left' ? (
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '24px 24px 12px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            background: 'linear-gradient(135deg, rgba(8, 28, 54, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)',
            borderRadius: '14px',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            padding: '16px 20px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>🏃🎒🏏⚽🍱🏑🏸🖥️</span>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Active Campus Life in Motion</span>
                  <span style={{
                    fontSize: '10px',
                    color: 'var(--accent-cyan)',
                    background: 'rgba(56, 189, 248, 0.15)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontWeight: 800
                  }}>
                    ↕ RIGHT VERTICAL RAIL ACTIVE
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  The animated runner, school bag, cricket, football, tiffin, hockey, badminton &amp; smartboard are traveling smoothly along the right campus rail!
                </div>
              </div>
            </div>

            <button
              onClick={onSwitchLayout}
              style={{
                background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.25), rgba(14, 165, 233, 0.35))',
                border: '1px solid rgba(56, 189, 248, 0.5)',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 10px rgba(14, 165, 233, 0.2)'
              }}
            >
              <span>↔ Switch to Bottom Runway</span>
            </button>
          </div>
        </div>
      ) : (
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '30px 24px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
        {/* Track Header & Interactive Speed Controls */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{
                background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
                color: '#ffffff',
                padding: '3px 9px',
                borderRadius: '6px',
                fontSize: '10px',
                fontWeight: 900,
                letterSpacing: '0.4px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <Sparkles size={11} />
                LIVE CAMPUS RUNWAY
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-cyan)', fontWeight: 700 }}>
                Traveling Animated Educational &amp; Sports Parade
              </span>
            </div>
            <h3 style={{
              fontSize: '19px',
              fontWeight: 800,
              color: 'var(--text-main)',
              fontFamily: 'var(--font-heading)',
              margin: 0
            }}>
              Active Campus Life in Motion 🏃🎒🏏⚽🍱🏑🏸🖥️
            </h3>
          </div>

          {/* Speed Controls & Feedback */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {clickedItemFeedback && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(14, 165, 233, 0.25))',
                border: '1px solid rgba(52, 211, 153, 0.5)',
                color: 'var(--text-main)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '12px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                animation: 'fadeIn 0.2s ease-in-out',
                boxShadow: '0 0 16px rgba(16, 185, 129, 0.25)'
              }}>
                <Volume2 size={13} color="#10b981" />
                <span>{clickedItemFeedback.message}</span>
              </div>
            )}

            {/* Parade Pace Controls */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              padding: '3px',
              gap: '2px'
            }}>
              <button
                onClick={() => setParadeSpeed('normal')}
                title="Normal Running Pace"
                style={{
                  border: 'none',
                  background: paradeSpeed === 'normal' ? 'var(--accent-cyan)' : 'transparent',
                  color: paradeSpeed === 'normal' ? '#020617' : 'var(--text-muted)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>🏃 Jog</span>
              </button>
              <button
                onClick={() => setParadeSpeed('fast')}
                title="Sprint 2x Speed"
                style={{
                  border: 'none',
                  background: paradeSpeed === 'fast' ? 'var(--accent-cyan)' : 'transparent',
                  color: paradeSpeed === 'fast' ? '#020617' : 'var(--text-muted)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <FastForward size={12} />
                <span>Sprint</span>
              </button>
              <button
                onClick={() => setParadeSpeed(paradeSpeed === 'paused' ? 'normal' : 'paused')}
                title={paradeSpeed === 'paused' ? "Resume Motion" : "Freeze / Inspect"}
                style={{
                  border: 'none',
                  background: paradeSpeed === 'paused' ? '#f59e0b' : 'transparent',
                  color: paradeSpeed === 'paused' ? '#000' : 'var(--text-muted)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {paradeSpeed === 'paused' ? <Play size={12} /> : <Pause size={12} />}
                <span>{paradeSpeed === 'paused' ? 'Resume' : 'Pause'}</span>
              </button>
              {onSwitchLayout && (
                <button
                  onClick={onSwitchLayout}
                  title="Switch animation to Left Vertical Rail"
                  style={{
                    border: 'none',
                    background: 'rgba(56, 189, 248, 0.18)',
                    color: 'var(--text-cyan)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>↕ Move to Left Rail</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* THE TRAVELING ARENA TRACK (HORIZONTAL HORIZON RUNWAY)   */}
        {/* ======================================================== */}
        <div style={{
          position: 'relative',
          height: '190px',
          width: '100%',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1.5px solid var(--border-subtle)',
          boxShadow: 'inset 0 2px 20px rgba(0, 0, 0, 0.4), 0 8px 32px rgba(2, 6, 23, 0.25)',
          background: 'linear-gradient(180deg, rgba(8, 28, 54, 0.85) 0%, rgba(15, 23, 42, 0.95) 45%, #7f1d1d 75%, #450a0a 100%)'
        }}>
          {/* Ambient Sky Horizon with Stars / Starlight */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '60px',
            background: 'linear-gradient(180deg, rgba(14, 165, 233, 0.12) 0%, transparent 100%)',
            pointerEvents: 'none'
          }} />

          {/* Running Track Middle Lane (Athletic Terracotta Red) */}
          <div style={{
            position: 'absolute',
            bottom: '40px',
            left: 0,
            right: 0,
            height: '65px',
            background: 'linear-gradient(180deg, #991b1b 0%, #7f1d1d 100%)',
            borderTop: '2px solid rgba(255, 255, 255, 0.55)',
            borderBottom: '2px dashed rgba(255, 255, 255, 0.45)',
            boxShadow: 'inset 0 4px 12px rgba(0, 0, 0, 0.3)'
          }}>
            {/* Athletic White Lane Stripes moving */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '3px',
              backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.7) 0, rgba(255,255,255,0.7) 30px, transparent 30px, transparent 60px)',
              animation: `trackStripesMove ${1.2 * getSpeedMultiplier()}s linear infinite`,
              animationPlayState: getPlayState()
            }} />
          </div>

          {/* Sports Turf Green Ground (Lower Lane) */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '40px',
            background: 'linear-gradient(180deg, #15803d 0%, #14532d 100%)',
            borderTop: '2px solid #22c55e',
            boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.4)'
          }}>
            <div style={{
              position: 'absolute',
              top: '2px',
              left: 0,
              right: 0,
              height: '2px',
              background: 'repeating-linear-gradient(90deg, #4ade80 0, #4ade80 20px, transparent 20px, transparent 40px)'
            }} />
          </div>

          {/* Track Labels & Goal Line */}
          <div style={{
            position: 'absolute',
            top: '8px',
            left: '16px',
            fontSize: '10px',
            fontWeight: 800,
            color: 'rgba(255, 255, 255, 0.45)',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            pointerEvents: 'none'
          }}>
            LANE 1: ATHLETICS &bull; LANE 2: SPORTS TURF &bull; AIR LANE: AEROBICS
          </div>

          {/* ======================================================== */}
          {/* ITEM 1: CHILD RUNNING (TRAVELING ACROSS SCREEN)         */}
          {/* ======================================================== */}
          <div
            className="traveler-container"
            onClick={() => handleItemClick('runner', "🏃 Champion Runner! Sprinting toward a bright academic & athletic future!")}
            title="Click to cheer the running student!"
            style={{
              bottom: '46px',
              top: 'auto',
              animation: `travelTrackEast ${16 * getSpeedMultiplier()}s linear infinite`,
              animationDelay: '0s',
              animationPlayState: getPlayState()
            }}
          >
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Motivational Speech Tag */}
              <div style={{
                background: 'rgba(2, 6, 23, 0.85)',
                border: '1px solid #38bdf8',
                borderRadius: '8px',
                padding: '2px 7px',
                fontSize: '10px',
                fontWeight: 800,
                color: '#38bdf8',
                whiteSpace: 'nowrap',
                marginBottom: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
              }}>
                Sprint to Win! 🏃
              </div>

              {/* Animated Running Child Figure */}
              <div style={{
                width: '46px',
                height: '62px',
                position: 'relative',
                animation: `runnerStrideHop ${0.55 * getSpeedMultiplier()}s infinite ease-in-out`,
                animationPlayState: getPlayState()
              }}>
                {/* Head with Sports Headband */}
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#fbcfe8',
                  border: '2px solid #be185d',
                  margin: '0 auto',
                  position: 'relative',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                  {/* Headband */}
                  <div style={{
                    position: 'absolute',
                    top: '5px',
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: '#0284c7',
                    borderRadius: '2px'
                  }} />
                  {/* Smile & Eye */}
                  <div style={{ position: 'absolute', top: '9px', right: '4px', width: '3px', height: '3px', borderRadius: '50%', background: '#000' }} />
                </div>

                {/* Torso with School Jersey #01 */}
                <div style={{
                  width: '22px',
                  height: '24px',
                  background: 'linear-gradient(135deg, #0284c7, #0ea5e9)',
                  borderRadius: '6px',
                  margin: '2px auto 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '9px',
                  fontWeight: 900,
                  border: '1.5px solid #38bdf8'
                }}>
                  01
                </div>

                {/* Arms swinging in running motion */}
                <div style={{
                  position: 'absolute',
                  top: '24px',
                  left: '3px',
                  width: '6px',
                  height: '16px',
                  background: '#fbcfe8',
                  borderRadius: '3px',
                  transformOrigin: 'top center',
                  animation: `armSwingFront ${0.55 * getSpeedMultiplier()}s infinite ease-in-out`,
                  animationPlayState: getPlayState()
                }} />
                <div style={{
                  position: 'absolute',
                  top: '24px',
                  right: '3px',
                  width: '6px',
                  height: '16px',
                  background: '#fbcfe8',
                  borderRadius: '3px',
                  transformOrigin: 'top center',
                  animation: `armSwingBack ${0.55 * getSpeedMultiplier()}s infinite ease-in-out`,
                  animationPlayState: getPlayState()
                }} />

                {/* Running Legs */}
                <div style={{
                  position: 'absolute',
                  bottom: '0px',
                  left: '12px',
                  width: '6px',
                  height: '16px',
                  background: '#1e3a8a',
                  borderRadius: '2px',
                  transformOrigin: 'top center',
                  animation: `legKickFront ${0.55 * getSpeedMultiplier()}s infinite ease-in-out`,
                  animationPlayState: getPlayState()
                }}>
                  {/* Running Shoe */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, width: '10px', height: '4px', background: '#f59e0b', borderRadius: '2px' }} />
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: '0px',
                  right: '12px',
                  width: '6px',
                  height: '16px',
                  background: '#1e3a8a',
                  borderRadius: '2px',
                  transformOrigin: 'top center',
                  animation: `legKickBack ${0.55 * getSpeedMultiplier()}s infinite ease-in-out`,
                  animationPlayState: getPlayState()
                }}>
                  {/* Running Shoe */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, width: '10px', height: '4px', background: '#f59e0b', borderRadius: '2px' }} />
                </div>
              </div>

              {/* Trailing Dust Puffs */}
              <div style={{
                position: 'absolute',
                bottom: '2px',
                left: '-10px',
                width: '12px',
                height: '6px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.4)',
                filter: 'blur(1px)'
              }} />
            </div>
          </div>

          {/* ======================================================== */}
          {/* ITEM 2: SCHOOL BAG (BOUNCING & TRAVELING)               */}
          {/* ======================================================== */}
          <div
            className="traveler-container"
            onClick={() => handleItemClick('bag', "🎒 School Bag packed! Books, geometry box, notebook & high curiosity!")}
            title="Click to inspect school bag!"
            style={{
              bottom: '50px',
              top: 'auto',
              animation: `travelTrackEast ${21 * getSpeedMultiplier()}s linear infinite`,
              animationDelay: '-3.2s',
              animationPlayState: getPlayState()
            }}
          >
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              animation: `bagBouncingTravel ${1.8 * getSpeedMultiplier()}s infinite ease-in-out`,
              animationPlayState: getPlayState()
            }}>
              {/* Floating Label */}
              <div style={{
                background: 'rgba(2, 6, 23, 0.85)',
                border: '1px solid #10b981',
                borderRadius: '8px',
                padding: '2px 7px',
                fontSize: '9px',
                fontWeight: 800,
                color: '#34d399',
                whiteSpace: 'nowrap',
                marginBottom: '4px'
              }}>
                🎒 Books Inside
              </div>

              {/* Bag Body */}
              <div style={{
                width: '44px',
                height: '50px',
                background: 'linear-gradient(145deg, #10b981, #059669)',
                borderRadius: '12px',
                border: '2px solid #34d399',
                position: 'relative',
                boxShadow: '0 6px 14px rgba(16, 185, 129, 0.4)'
              }}>
                {/* Top Bag Handle */}
                <div style={{
                  position: 'absolute',
                  top: '-7px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '16px',
                  height: '7px',
                  borderRadius: '5px 5px 0 0',
                  border: '2px solid #34d399',
                  borderBottom: 'none'
                }} />
                {/* Front Pocket */}
                <div style={{
                  position: 'absolute',
                  bottom: '6px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '32px',
                  height: '20px',
                  borderRadius: '6px',
                  background: '#047857',
                  border: '1.5px solid #6ee7b7'
                }}>
                  {/* EduBandhan Shield Emblem */}
                  <div style={{
                    width: '8px',
                    height: '8px',
                    background: '#fef08a',
                    borderRadius: '2px',
                    margin: '3px auto 0'
                  }} />
                </div>
                {/* Books & Ruler peeking from top */}
                <div style={{
                  position: 'absolute',
                  top: '-6px',
                  left: '6px',
                  width: '8px',
                  height: '10px',
                  background: '#f97316',
                  borderRadius: '2px',
                  transform: 'rotate(-10deg)'
                }} />
                <div style={{
                  position: 'absolute',
                  top: '-7px',
                  right: '8px',
                  width: '6px',
                  height: '12px',
                  background: '#38bdf8',
                  borderRadius: '2px',
                  transform: 'rotate(15deg)'
                }} />
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* ITEM 3: CRICKET BAT & BALL (DRIVE & TRAVELING)          */}
          {/* ======================================================== */}
          <div
            className="traveler-container"
            onClick={() => handleItemClick('cricket', "🏏 SMACK! Massive cover drive straight to the boundary!")}
            title="Click to swing the cricket bat!"
            style={{
              bottom: '48px',
              top: 'auto',
              animation: `travelTrackEast ${18 * getSpeedMultiplier()}s linear infinite`,
              animationDelay: '-6.5s',
              animationPlayState: getPlayState()
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                background: 'rgba(2, 6, 23, 0.85)',
                border: '1px solid #f59e0b',
                borderRadius: '8px',
                padding: '2px 7px',
                fontSize: '9px',
                fontWeight: 800,
                color: '#fbbf24',
                whiteSpace: 'nowrap',
                marginBottom: '4px'
              }}>
                🏏 Cover Drive
              </div>

              <div style={{ position: 'relative', width: '60px', height: '52px' }}>
                {/* Swinging Wooden Cricket Bat */}
                <div style={{
                  position: 'absolute',
                  left: '8px',
                  bottom: '2px',
                  width: '14px',
                  height: '46px',
                  background: 'linear-gradient(180deg, #d97706 0%, #b45309 80%, #78350f 100%)',
                  borderRadius: '3px 3px 6px 6px',
                  border: '1.5px solid #fef3c7',
                  transformOrigin: 'bottom left',
                  animation: `cricketBatDrive ${2.2 * getSpeedMultiplier()}s infinite ease-in-out`,
                  animationPlayState: getPlayState(),
                  boxShadow: '0 4px 10px rgba(0,0,0,0.4)'
                }}>
                  {/* Grip Rubber Wrap */}
                  <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '2px',
                    right: '2px',
                    height: '14px',
                    background: '#1e293b',
                    borderRadius: '2px',
                    border: '1px solid #475569'
                  }} />
                  {/* Bat Sticker */}
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '1px',
                    right: '1px',
                    height: '8px',
                    background: '#ef4444',
                    borderRadius: '1px'
                  }} />
                </div>

                {/* Seam Cricket Ball zipping forward */}
                <div style={{
                  position: 'absolute',
                  right: '2px',
                  bottom: '8px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 35% 35%, #ef4444 0%, #991b1b 80%)',
                  border: '1px solid #fee2e2',
                  animation: `cricketBallZip ${2.2 * getSpeedMultiplier()}s infinite ease-in-out`,
                  animationPlayState: getPlayState(),
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.6)'
                }}>
                  {/* White Seam stitches */}
                  <div style={{
                    position: 'absolute',
                    top: '0',
                    bottom: '0',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '2px',
                    background: 'repeating-linear-gradient(180deg, #fff 0, #fff 2px, transparent 2px, transparent 4px)'
                  }} />
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* ITEM 4: FOOTBALL (ROLLING & BOUNCING ON TURF)           */}
          {/* ======================================================== */}
          <div
            className="traveler-container"
            onClick={() => handleItemClick('football', "⚽ GOAL! Curled right into the top corner netting!")}
            title="Click to kick the football!"
            style={{
              bottom: '10px',
              top: 'auto',
              animation: `travelTrackEast ${14 * getSpeedMultiplier()}s linear infinite`,
              animationDelay: '-10s',
              animationPlayState: getPlayState()
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                background: 'rgba(2, 6, 23, 0.85)',
                border: '1px solid #38bdf8',
                borderRadius: '8px',
                padding: '2px 7px',
                fontSize: '9px',
                fontWeight: 800,
                color: '#38bdf8',
                whiteSpace: 'nowrap',
                marginBottom: '4px'
              }}>
                ⚽ Turf Roll
              </div>

              {/* 3D Soccer Ball Rolling & Bouncing */}
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #cbd5e1 55%, #475569 100%)',
                border: '2px solid #0f172a',
                position: 'relative',
                animation: `footballRollBounceTravel ${1.8 * getSpeedMultiplier()}s infinite cubic-bezier(0.34, 1.56, 0.64, 1)`,
                animationPlayState: getPlayState(),
                boxShadow: '0 6px 14px rgba(0, 0, 0, 0.5)'
              }}>
                {/* Classic Black Pentagons */}
                <div style={{
                  position: 'absolute',
                  top: '11px',
                  left: '11px',
                  width: '12px',
                  height: '12px',
                  background: '#0f172a',
                  clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)'
                }} />
                <div style={{
                  position: 'absolute',
                  top: '2px',
                  right: '5px',
                  width: '7px',
                  height: '7px',
                  background: '#0f172a',
                  clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)'
                }} />
                <div style={{
                  position: 'absolute',
                  bottom: '3px',
                  left: '5px',
                  width: '7px',
                  height: '7px',
                  background: '#0f172a',
                  clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)'
                }} />
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* ITEM 5: TIFFIN BOX (STEAMING & GLIDING)                 */}
          {/* ======================================================== */}
          <div
            className="traveler-container"
            onClick={() => handleItemClick('tiffin', "🍱 Ding! Lunch break! Piping hot parathas, paneer & fresh fruit!")}
            title="Click to open the tiffin box!"
            style={{
              bottom: '12px',
              top: 'auto',
              animation: `travelTrackEast ${24 * getSpeedMultiplier()}s linear infinite`,
              animationDelay: '-13.5s',
              animationPlayState: getPlayState()
            }}
          >
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              animation: `tiffinGlidePuff ${2.4 * getSpeedMultiplier()}s infinite ease-in-out`,
              animationPlayState: getPlayState()
            }}>
              {/* Hot Lunch Tag */}
              <div style={{
                background: 'rgba(2, 6, 23, 0.85)',
                border: '1px solid #f97316',
                borderRadius: '8px',
                padding: '2px 7px',
                fontSize: '9px',
                fontWeight: 800,
                color: '#fb923c',
                whiteSpace: 'nowrap',
                marginBottom: '2px'
              }}>
                🍱 Hot Tiffin
              </div>

              {/* Rising Steam Waves */}
              <div style={{ display: 'flex', gap: '5px', height: '14px', marginBottom: '2px' }}>
                <span className="anim-steam" style={{ fontSize: '11px', animationDelay: '0s' }}>♨️</span>
                <span className="anim-steam" style={{ fontSize: '11px', animationDelay: '0.4s' }}>♨️</span>
              </div>

              {/* Double-Tier Stainless Lunch Box */}
              <div style={{
                width: '46px',
                height: '34px',
                background: 'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)',
                borderRadius: '8px',
                border: '2px solid #cbd5e1',
                position: 'relative',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}>
                {/* Clip Latches on sides */}
                <div style={{ position: 'absolute', top: '7px', left: '-3px', width: '4px', height: '14px', background: '#38bdf8', borderRadius: '2px' }} />
                <div style={{ position: 'absolute', top: '7px', right: '-3px', width: '4px', height: '14px', background: '#38bdf8', borderRadius: '2px' }} />
                {/* Horizontal Tier Divider */}
                <div style={{ position: 'absolute', top: '15px', left: 0, right: 0, height: '2px', background: '#475569' }} />
                {/* Insulated Lid Handle */}
                <div style={{
                  position: 'absolute',
                  top: '-5px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '14px',
                  height: '5px',
                  borderRadius: '3px',
                  background: '#f97316'
                }} />
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* ITEM 6: FIELD HOCKEY STICK & BALL (TURF DRIBBLE)        */}
          {/* ======================================================== */}
          <div
            className="traveler-container"
            onClick={() => handleItemClick('hockey', "🏑 Dribbled through defense! National game spirit in action!")}
            title="Click to flick the hockey ball!"
            style={{
              bottom: '12px',
              top: 'auto',
              animation: `travelTrackEast ${19 * getSpeedMultiplier()}s linear infinite`,
              animationDelay: '-16.8s',
              animationPlayState: getPlayState()
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                background: 'rgba(2, 6, 23, 0.85)',
                border: '1px solid #10b981',
                borderRadius: '8px',
                padding: '2px 7px',
                fontSize: '9px',
                fontWeight: 800,
                color: '#34d399',
                whiteSpace: 'nowrap',
                marginBottom: '4px'
              }}>
                🏑 Dribble Flick
              </div>

              <div style={{ position: 'relative', width: '50px', height: '48px' }}>
                {/* Curved Hockey Stick */}
                <div style={{
                  position: 'absolute',
                  left: '6px',
                  bottom: '2px',
                  width: '10px',
                  height: '42px',
                  background: 'linear-gradient(180deg, #0284c7 0%, #1e40af 70%, #f59e0b 100%)',
                  borderRadius: '2px',
                  border: '1px solid #93c5fd',
                  transformOrigin: 'bottom center',
                  animation: `hockeyTurfDribble ${1.6 * getSpeedMultiplier()}s infinite ease-in-out`,
                  animationPlayState: getPlayState()
                }}>
                  {/* Curved Toe of Stick */}
                  <div style={{
                    position: 'absolute',
                    bottom: '-1px',
                    left: '-7px',
                    width: '14px',
                    height: '10px',
                    borderRadius: '0 0 0 10px',
                    borderLeft: '4px solid #f59e0b',
                    borderBottom: '4px solid #f59e0b'
                  }} />
                </div>

                {/* Hockey Dimpled Turf Ball */}
                <div style={{
                  position: 'absolute',
                  right: '6px',
                  bottom: '4px',
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
                }}>
                  <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#94a3b8', margin: '3px auto 0' }} />
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* ITEM 7: BADMINTON RACKET & SHUTTLECOCK (HIGH SKY SMASH) */}
          {/* ======================================================== */}
          <div
            className="traveler-container"
            onClick={() => handleItemClick('badminton', "🏸 SMASH! 300 km/h shuttlecock winner down the baseline!")}
            title="Click to rally the shuttlecock!"
            style={{
              top: '18px',
              animation: `travelTrackEast ${15 * getSpeedMultiplier()}s linear infinite`,
              animationDelay: '-8.5s',
              animationPlayState: getPlayState()
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                background: 'rgba(2, 6, 23, 0.85)',
                border: '1px solid #a855f7',
                borderRadius: '8px',
                padding: '2px 7px',
                fontSize: '9px',
                fontWeight: 800,
                color: '#c084fc',
                whiteSpace: 'nowrap',
                marginBottom: '4px'
              }}>
                🏸 Air Smash
              </div>

              <div style={{ position: 'relative', width: '56px', height: '48px' }}>
                {/* Badminton Racket */}
                <div style={{
                  position: 'absolute',
                  left: '2px',
                  bottom: '2px',
                  width: '24px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '2px solid #a855f7',
                  boxShadow: 'inset 0 0 6px rgba(168, 85, 247, 0.4)'
                }}>
                  {/* String Net Pattern */}
                  <div style={{
                    position: 'absolute',
                    inset: '2px',
                    backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.4) 0, rgba(255,255,255,0.4) 3px, transparent 3px, transparent 6px), repeating-linear-gradient(90deg, rgba(255,255,255,0.4) 0, rgba(255,255,255,0.4) 3px, transparent 3px, transparent 6px)'
                  }} />
                  {/* Shaft & Handle */}
                  <div style={{
                    position: 'absolute',
                    top: '28px',
                    left: '10px',
                    width: '3px',
                    height: '22px',
                    background: '#cbd5e1',
                    borderRadius: '1px'
                  }}>
                    <div style={{ position: 'absolute', bottom: 0, left: '-1px', width: '5px', height: '8px', background: '#ec4899', borderRadius: '2px' }} />
                  </div>
                </div>

                {/* Feather Shuttlecock soaring high in air */}
                <div style={{
                  position: 'absolute',
                  right: '2px',
                  top: '4px',
                  width: '20px',
                  height: '20px',
                  animation: `badmintonHighSmash ${1.9 * getSpeedMultiplier()}s infinite ease-in-out`,
                  animationPlayState: getPlayState()
                }}>
                  {/* White Feather Skirt */}
                  <div style={{
                    width: '0',
                    height: '0',
                    borderLeft: '7px solid transparent',
                    borderRight: '7px solid transparent',
                    borderBottom: '12px solid #ffffff',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                  }} />
                  {/* Cork Base */}
                  <div style={{
                    width: '10px',
                    height: '6px',
                    borderRadius: '0 0 5px 5px',
                    background: '#ef4444',
                    margin: '-1px auto 0'
                  }} />
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* ITEM 8: DIGITAL SMART SCREEN BOARD (EDU-ROVER BOARD)    */}
          {/* ======================================================== */}
          <div
            className="traveler-container"
            onClick={() => {
              setActiveBoardMsgIdx(prev => (prev + 1) % smartboardLessons.length);
              handleItemClick('smartboard', `🖥️ Smartboard slide updated: ${smartboardLessons[(activeBoardMsgIdx + 1) % smartboardLessons.length].title}`);
            }}
            title="Click to flip the smartboard slide!"
            style={{
              top: '12px',
              animation: `travelTrackEast ${28 * getSpeedMultiplier()}s linear infinite`,
              animationDelay: '-22s',
              animationPlayState: getPlayState()
            }}
          >
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              animation: `smartboardRoverRoll ${2.5 * getSpeedMultiplier()}s infinite ease-in-out`,
              animationPlayState: getPlayState()
            }}>
              {/* Interactive Tag */}
              <div style={{
                background: 'rgba(2, 6, 23, 0.9)',
                border: '1px solid #38bdf8',
                borderRadius: '8px',
                padding: '2px 8px',
                fontSize: '9px',
                fontWeight: 800,
                color: '#38bdf8',
                whiteSpace: 'nowrap',
                marginBottom: '3px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span className="pulse-dot" style={{ width: '5px', height: '5px' }}></span>
                <span>Click to Flip Slide</span>
              </div>

              {/* Digital Smartboard Frame with Neon Glow */}
              <div style={{
                width: '160px',
                padding: '8px 10px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #020617 0%, #0f172a 100%)',
                border: '1.5px solid #38bdf8',
                boxShadow: '0 0 20px rgba(14, 165, 233, 0.5), inset 0 0 10px rgba(2, 132, 199, 0.4)',
                position: 'relative'
              }}>
                {/* Top LED Indicator & Camera Sensor */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981' }} />
                    <span style={{ fontSize: '9px', color: '#38bdf8', fontWeight: 800 }}>
                      {smartboardLessons[activeBoardMsgIdx].icon} {smartboardLessons[activeBoardMsgIdx].title}
                    </span>
                  </div>
                  <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>
                    4K LIVE
                  </span>
                </div>

                {/* Rotating Lesson Text */}
                <div style={{
                  fontSize: '9.5px',
                  color: '#f8fafc',
                  lineHeight: '1.25',
                  fontWeight: 600,
                  minHeight: '24px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {smartboardLessons[activeBoardMsgIdx].text}
                </div>

                {/* Smart Rover Wheels (Cruising along runway) */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  marginTop: '4px',
                  paddingTop: '3px',
                  borderTop: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <div style={{ width: '8px', height: '4px', borderRadius: '2px', background: '#64748b' }} />
                  <div style={{ width: '8px', height: '4px', borderRadius: '2px', background: '#64748b' }} />
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* ITEM 9: GEOMETRY COMPASS (AUTHENTIC SCHOLASTIC)          */}
          {/* ======================================================== */}
          <div
            className="traveler-container"
            onClick={() => handleItemClick('compass', "📐 Precision Geometry! Calibrating radius and mathematical curves!")}
            title="Click to calibrate compass!"
            style={{
              bottom: '16px',
              animation: `travelTrackEast ${26 * getSpeedMultiplier()}s linear infinite`,
              animationDelay: '-24s',
              animationPlayState: getPlayState()
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                background: 'rgba(2, 6, 23, 0.88)',
                border: '1px solid #0284c7',
                borderRadius: '8px',
                padding: '2px 7px',
                fontSize: '9px',
                fontWeight: 800,
                color: '#38bdf8',
                whiteSpace: 'nowrap',
                marginBottom: '3px'
              }}>
                📐 Geometry Compass
              </div>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.95)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.4)'
              }}>
                <GeometryCompassIcon size={28} />
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* ITEM 10: OPTICAL MICROSCOPE (AUTHENTIC LABORATORY)       */}
          {/* ======================================================== */}
          <div
            className="traveler-container"
            onClick={() => handleItemClick('microscope', "🔬 High-Resolution Microscope! 1000x cellular microbiology in focus!")}
            title="Click to inspect specimen!"
            style={{
              top: '18px',
              animation: `travelTrackEast ${26 * getSpeedMultiplier()}s linear infinite`,
              animationDelay: '-27s',
              animationPlayState: getPlayState()
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                background: 'rgba(2, 6, 23, 0.88)',
                border: '1px solid #059669',
                borderRadius: '8px',
                padding: '2px 7px',
                fontSize: '9px',
                fontWeight: 800,
                color: '#34d399',
                whiteSpace: 'nowrap',
                marginBottom: '3px'
              }}>
                🔬 Lab Microscope
              </div>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.95)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.4)'
              }}>
                <LabMicroscopeIcon size={28} />
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* ITEM 11: TERRESTRIAL GLOBE (AUTHENTIC SCHOLASTIC)        */}
          {/* ======================================================== */}
          <div
            className="traveler-container"
            onClick={() => handleItemClick('globe', "🌍 Rotating Terrestrial Globe! World continents and cartography!")}
            title="Click to spin globe!"
            style={{
              bottom: '18px',
              animation: `travelTrackEast ${26 * getSpeedMultiplier()}s linear infinite`,
              animationDelay: '-29.5s',
              animationPlayState: getPlayState()
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                background: 'rgba(2, 6, 23, 0.88)',
                border: '1px solid #d97706',
                borderRadius: '8px',
                padding: '2px 7px',
                fontSize: '9px',
                fontWeight: 800,
                color: '#fbbf24',
                whiteSpace: 'nowrap',
                marginBottom: '3px'
              }}>
                🌍 Terrestrial Globe
              </div>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.95)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(217, 119, 6, 0.4)'
              }}>
                <DesktopGlobeIcon size={28} />
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* ITEM 12: CHEMICAL TEST TUBES (AUTHENTIC LABORATORY)      */}
          {/* ======================================================== */}
          <div
            className="traveler-container"
            onClick={() => handleItemClick('tubes', "🧪 Reaction Test Tubes! Bubbling chemical indicators in titration rack!")}
            title="Click to observe reaction!"
            style={{
              top: '20px',
              animation: `travelTrackEast ${26 * getSpeedMultiplier()}s linear infinite`,
              animationDelay: '-32s',
              animationPlayState: getPlayState()
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                background: 'rgba(2, 6, 23, 0.88)',
                border: '1px solid #7c3aed',
                borderRadius: '8px',
                padding: '2px 7px',
                fontSize: '9px',
                fontWeight: 800,
                color: '#c084fc',
                whiteSpace: 'nowrap',
                marginBottom: '3px'
              }}>
                🧪 Reaction Flasks
              </div>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.95)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.4)'
              }}>
                <ChemicalLabIcon size={28} />
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* ITEM 13: SOROBAN WOODEN ABACUS (MATHEMATICAL INSTRUMENT)  */}
          {/* ======================================================== */}
          <div
            className="traveler-container"
            onClick={() => handleItemClick('abacus', "🧮 Soroban Wooden Abacus! Rapid decimal arithmetic calculation!")}
            title="Click to shift abacus beads!"
            style={{
              bottom: '16px',
              animation: `travelTrackEast ${26 * getSpeedMultiplier()}s linear infinite`,
              animationDelay: '-34.5s',
              animationPlayState: getPlayState()
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                background: 'rgba(2, 6, 23, 0.88)',
                border: '1px solid #b45309',
                borderRadius: '8px',
                padding: '2px 7px',
                fontSize: '9px',
                fontWeight: 800,
                color: '#f59e0b',
                whiteSpace: 'nowrap',
                marginBottom: '3px'
              }}>
                🧮 Soroban Abacus
              </div>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.95)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(180, 83, 9, 0.4)'
              }}>
                <WoodenAbacusIcon size={28} />
              </div>
            </div>
          </div>

        </div>
        {/* End of Traveling Arena Track */}

        {/* Informational Subtext */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          padding: '0 4px',
          fontSize: '11px',
          color: 'var(--text-muted)'
        }}>
          <div>
            💡 <em>Hover over any traveling item to pause &amp; inspect, or click to cheer and flip educational slides!</em>
          </div>
          <div style={{ display: 'flex', gap: '16px', color: 'var(--text-dim)' }}>
            <span>🏃 Active Athletics</span>
            <span>🏏 Cricket &amp; Football</span>
            <span>🍱 Healthy Nutrition</span>
            <span>🖥️ Smart Classroom</span>
          </div>
        </div>
      </div>
    )}

      {/* 2. THREE EDUCATIONAL PILLARS STRIP */}
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0 24px 28px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px'
      }}>
        {/* Pillar 1: Sports & Vitality */}
        <div 
          onClick={() => handleModuleClick('quiz', 'Child Quiz Arena & Sports')}
          className="glass-panel" 
          style={{
            padding: '18px',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, var(--bg-surface) 100%)',
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '20px' }}>🏃</span>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-main)' }}>
                Holistic Sports &amp; Wellness
              </div>
              <div style={{ fontSize: '11px', color: '#10b981' }}>
                Athletics, Cricket, Football &amp; Badminton
              </div>
            </div>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
            Regular sports build teamwork, emotional resilience, and lifelong focus. Track student athletic milestones alongside academics.
          </p>
        </div>

        {/* Pillar 2: Nutrition & Vital Energy */}
        <div 
          onClick={() => handleModuleClick('parent', 'Parent Pulse Hub')}
          className="glass-panel" 
          style={{
            padding: '18px',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, var(--bg-surface) 100%)',
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '20px' }}>🍱</span>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-main)' }}>
                Nutritious Tiffin &amp; Health
              </div>
              <div style={{ fontSize: '11px', color: '#f59e0b' }}>
                Balanced Meals &amp; Hydration Routine
              </div>
            </div>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
            Wholesome nutrition powers growing minds. Daily pulse reminders keep parents synchronized with meal and hydration wellness.
          </p>
        </div>

        {/* Pillar 3: AI & Smartboard Innovation */}
        <div 
          onClick={() => handleModuleClick('aichat', 'AI Saathi Assistant')}
          className="glass-panel" 
          style={{
            padding: '18px',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, var(--bg-surface) 100%)',
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '20px' }}>🖥️</span>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-main)' }}>
                Smart Interactive Classrooms
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-cyan)' }}>
                Powered by Groq Cloud AI &amp; Live Boards
              </div>
            </div>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
            Interactive STEM visualizers, instant doubt clarification with AI Saathi, and live classroom sockets unite home and school.
          </p>
        </div>
      </div>

      {/* 3. BOTTOM INSTITUTIONAL FOOTER */}
      <div style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '24px',
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand Copyright */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 900,
            fontSize: '14px'
          }}>
            E
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-main)' }}>
              EduBandhan &copy; 2026
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Unified Educational Ecosystem &bull; Empowering Schools, Parents, Teachers &amp; Students
            </div>
          </div>
        </div>

        {/* DPDP Compliance & Tech Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '11px',
            color: '#10b981',
            background: 'rgba(16, 185, 129, 0.12)',
            padding: '4px 10px',
            borderRadius: '6px',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            fontWeight: 700
          }}>
            🛡️ DPDP Act 2023 Compliant
          </span>
          <span style={{
            fontSize: '11px',
            color: 'var(--text-cyan)',
            background: 'rgba(56, 189, 248, 0.12)',
            padding: '4px 10px',
            borderRadius: '6px',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            fontWeight: 700
          }}>
            ⚡ Sub-150ms Face AI
          </span>
          <span style={{
            fontSize: '11px',
            color: '#a855f7',
            background: 'rgba(168, 85, 247, 0.12)',
            padding: '4px 10px',
            borderRadius: '6px',
            border: '1px solid rgba(168, 85, 247, 0.35)',
            fontWeight: 700
          }}>
            🤖 Groq Cloud AI Saathi
          </span>
        </div>
      </div>
    </footer>
  );
}
