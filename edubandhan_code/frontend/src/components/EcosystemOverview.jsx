import React, { useState, useEffect } from 'react';
import { 
  ScanFace, 
  Smartphone, 
  CreditCard, 
  Video, 
  Radio, 
  ShieldCheck, 
  MessageSquare, 
  HelpCircle, 
  CalendarOff,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Building,
  GraduationCap,
  Target,
  BookOpen,
  Sparkles,
  Zap,
  Lock,
  Layers,
  Clock,
  Cpu,
  Compass,
  Award,
  Megaphone,
  ChevronRight,
  ChevronLeft,
  Bell,
  Play,
  Pause,
  X
} from 'lucide-react';
import {
  GeometryCompassIcon,
  LabMicroscopeIcon,
  DesktopGlobeIcon,
  ChemicalLabIcon,
  WoodenAbacusIcon
} from './ScholasticIcons';

export default function EcosystemOverview({ 
  onSwitchTab, 
  activeSector, 
  setActiveSector,
  onRequireAuth,
  currentUser,
  onOpenNoticeBoard
}) {
  const [publicNotices, setPublicNotices] = useState([]);
  const [activeNoticeIdx, setActiveNoticeIdx] = useState(0);
  const [isNoticePaused, setIsNoticePaused] = useState(false);
  const [selectedNoticeModal, setSelectedNoticeModal] = useState(null);

  // Fetch live public notices for the 5th capsule
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
        console.warn('Failed to load notices in EcosystemOverview:', err);
      }
    }
    fetchPublicNotices();
    return () => { isMounted = false; };
  }, []);

  const fallbackNotices = [
    {
      id: 1,
      title: "CBSE Pre-Board Schedules & Hall Tickets Released",
      message: "Pre-board examination schedules for Classes 10 & 12 are officially declared. Practical assessments begin from Nov 15th.",
      author_name: "Examination Controller",
      author_role: "SCHOOL_ADMIN",
      is_urgent: true,
      category: "EXAM",
      created_at: "Today"
    },
    {
      id: 2,
      title: "DPS Rourkela Annual Athletic Meet 2026",
      message: "The 38th Annual Sports Gala will commence on October 24th at the Main Olympic Pavilion. All parents cordially invited.",
      author_name: "Dr. Sunita Sharma (Principal)",
      author_role: "SCHOOL_ADMIN",
      is_urgent: false,
      category: "EVENT",
      created_at: "Today"
    },
    {
      id: 3,
      title: "Mathematics Chapter 4 Practice Homework",
      message: "Please complete Exercise 4.2 in your homework notebook for submission tomorrow morning.",
      author_name: "Dr. Sunita Sharma",
      author_role: "SCHOOL_ADMIN",
      is_urgent: false,
      category: "HOMEWORK",
      created_at: "Yesterday"
    }
  ];

  const activeNoticesList = publicNotices.length > 0 ? publicNotices : fallbackNotices;
  const currentNotice = activeNoticesList[activeNoticeIdx % activeNoticesList.length] || activeNoticesList[0];

  // Auto-cycle notices one by one every 3.8s
  useEffect(() => {
    if (activeNoticesList.length <= 1 || isNoticePaused) return;
    const timer = setInterval(() => {
      setActiveNoticeIdx(prev => (prev + 1) % activeNoticesList.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [activeNoticesList.length, isNoticePaused]);

  const handleFeatureClick = (featureId, featureTitle) => {
    onSwitchTab(featureId);
  };
  const features = [
    {
      num: '01',
      code: 'EB-BIO-01',
      id: 'kiosk',
      title: 'Classroom Touch & Face-AI Kiosk',
      desc: 'Touch-free attendance with AI face recognition in < 150ms. High-speed, proxy-free biometric check-in with zero raw photos stored.',
      tags: ['< 150ms Face AI', 'Proxy-Free', 'Zero Capex'],
      icon: ScanFace,
      scholasticIcon: LabMicroscopeIcon,
      scholasticTool: 'Optical Biometric Lens',
      scholasticSub: 'Micro-precision verification',
      color: '#0284c7',
      gradient: 'linear-gradient(135deg, rgba(2, 132, 199, 0.22) 0%, rgba(14, 165, 233, 0.08) 100%)'
    },
    {
      num: '02',
      code: 'EB-PULSE-02',
      id: 'parent',
      title: 'Parent Mobile Pulse Hub',
      desc: 'Real-time entry/exit timestamps, instant push notifications, bus tracking, and complete daily visibility into your child’s journey.',
      tags: ['Live Sync', 'PWA Mobile', 'Real-Time Alerts'],
      icon: Smartphone,
      scholasticIcon: DesktopGlobeIcon,
      scholasticTool: 'Transit Geolocation Globe',
      scholasticSub: 'Real-time boundary tracking',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.22) 0%, rgba(52, 211, 153, 0.08) 100%)'
    },
    {
      num: '03',
      code: 'EB-ACCTS-03',
      id: 'fees',
      title: 'Itemized Fee Ledger & 1-Tap UPI',
      desc: 'Tuition, STEM lab, and transit fee payments with instant GST receipts, automated reconciliations, and platform escrow routing.',
      tags: ['1-Tap UPI QR', 'Instant Receipt', 'Escrow Safe'],
      icon: CreditCard,
      scholasticIcon: WoodenAbacusIcon,
      scholasticTool: 'Soroban Ledger Abacus',
      scholasticSub: 'Double-entry audit precision',
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.22) 0%, rgba(168, 85, 247, 0.08) 100%)'
    },
    {
      num: '04',
      code: 'EB-CONF-04',
      id: 'consultation',
      title: '1-on-1 Consultation Marketplace',
      desc: 'Direct interaction between parents and faculty. Peer-to-peer encrypted 10-minute micro-sessions with calendar slot booking.',
      tags: ['WebRTC Video', 'Encrypted', '10-Min Micro Slots'],
      icon: Video,
      scholasticIcon: DesktopGlobeIcon,
      scholasticTool: "Consultation Chamber",
      scholasticSub: 'Academic faculty lounge',
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.22) 0%, rgba(251, 191, 36, 0.08) 100%)'
    },
    {
      num: '05',
      code: 'EB-RAD-05',
      id: 'sockets',
      title: 'Moderated Classroom Sockets',
      desc: 'Real-time communication for connected classrooms with FastAPI WebSocket broadcasts, categorized notices, and instant moderation.',
      tags: ['FastAPI WebSockets', 'Categorized Feed', 'Instant Broadcast'],
      icon: Radio,
      scholasticIcon: GeometryCompassIcon,
      scholasticTool: 'Radius Broadcast Compass',
      scholasticSub: 'Synchronized campus wave',
      color: '#06b6d4',
      gradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.22) 0%, rgba(56, 189, 248, 0.08) 100%)'
    },
    {
      num: '06',
      code: 'EB-SEC-06',
      id: 'admin',
      title: 'Verified KYC & Data Security',
      desc: 'Trusted, compliant institutional command center. PostgreSQL pgvector embeddings, DPDP Act 2023 compliance, and role access control.',
      tags: ['Neon pgvector', 'DPDP 2023', 'Role HUD'],
      icon: ShieldCheck,
      scholasticIcon: ShieldCheck,
      scholasticTool: 'Statutory Compliance Shield',
      scholasticSub: 'Encrypted institutional vault',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.22) 0%, rgba(96, 165, 250, 0.08) 100%)'
    },
    {
      num: '07',
      code: 'EB-AI-07',
      id: 'aichat',
      title: 'EduBandhan AI Chatbot & Mentor',
      desc: 'Dual-perspective AI Saathi powered by Groq Cloud Qwen 27B. Pedagogical guidance for parents and fun analogies for students.',
      tags: ['Groq Cloud LLM', '< 800ms Latency', 'Dual-Perspective'],
      icon: MessageSquare,
      scholasticIcon: GeometryCompassIcon,
      scholasticTool: 'Socratic Vector Compass',
      scholasticSub: 'Guided curriculum navigator',
      color: '#ec4899',
      gradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.22) 0%, rgba(244, 114, 182, 0.08) 100%)'
    },
    {
      num: '08',
      code: 'EB-LAB-08',
      id: 'quiz',
      title: 'Child Quiz Arena & AI Coach',
      desc: 'Interactive NCERT gamified learning arena with instant assessments, streak bonuses, question explanations, and live scoring.',
      tags: ['NCERT Aligned', 'Streak Bonuses', 'Instant Scoring'],
      icon: HelpCircle,
      scholasticIcon: ChemicalLabIcon,
      scholasticTool: 'Reaction Test Tubes',
      scholasticSub: 'STEM experimental tests',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.22) 0%, rgba(52, 211, 153, 0.08) 100%)'
    },
    {
      num: '09',
      code: 'EB-ROSTER-09',
      id: 'leaves',
      title: 'Dual-Tier Leave & Medical Absence Pass',
      desc: 'Simplified leave cascade with automated roster sync, medical certificate tracking, parent requests, and teacher/principal approvals.',
      tags: ['Dual-Approval', 'Roster Sync', 'Medical Pass'],
      icon: CalendarOff,
      scholasticIcon: WoodenAbacusIcon,
      scholasticTool: 'Roster Reckoning Beam',
      scholasticSub: 'Daily attendance ledger',
      color: '#f97316',
      gradient: 'linear-gradient(135deg, rgba(249, 115, 22, 0.22) 0%, rgba(251, 146, 60, 0.08) 100%)'
    }
  ];

  const institutions = [
    { id: 'school', name: 'K-12 Schools', desc: 'Primary to Senior Secondary', icon: Building, color: '#38bdf8' },
    { id: 'college', name: 'Colleges & Universities', desc: 'UG & PG Departments', icon: GraduationCap, color: '#a855f7' },
    { id: 'coaching', name: 'Coaching Hubs', desc: 'Competitive Exams (JEE/NEET)', icon: Target, color: '#f59e0b' },
    { id: 'library', name: '24/7 Libraries', desc: 'Touchless Access & Pods', icon: BookOpen, color: '#10b981' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* =========================================================================
          CLASSROOM BLACKBOARD BANNER & SUBJECT CARDS (OPTION B - SAMPLE 2)
          ========================================================================= */}
      <div className="classroom-blackboard-banner">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '2px solid rgba(254, 240, 138, 0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(254, 240, 138, 0.35)',
              flexShrink: 0,
              background: '#020617'
            }}>
              <img 
                src="/web_app/edubandhan/assets/edubandhan_logo_dark.jpg" 
                alt="EduBandhan Logo" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.onerror = null; e.target.src = '/edubandhan_logo_dark.jpg'; }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h2 className="chalk-font chalk-text-yellow" style={{ fontSize: 'clamp(20px, 4.5vw, 32px)', fontWeight: 700, margin: 0, lineHeight: 1.15 }}>
                  EduBandhan — Smart Classroom &amp; Academic Lab
                </h2>
                <span style={{
                  fontSize: '11px',
                  background: 'rgba(254, 240, 138, 0.2)',
                  border: '1px solid rgba(254, 240, 138, 0.55)',
                  color: '#fef08a',
                  padding: '2px 9px',
                  borderRadius: '999px',
                  fontWeight: 800,
                  letterSpacing: '0.4px'
                }}>
                  CBSE &bull; ICSE &bull; NCERT Standard
                </span>
                <span style={{
                  fontSize: '11px',
                  background: 'rgba(56, 189, 248, 0.2)',
                  border: '1px solid rgba(56, 189, 248, 0.45)',
                  color: '#7dd3fc',
                  padding: '2px 9px',
                  borderRadius: '999px',
                  fontWeight: 700
                }}>
                  विद्या ददाति विनयम
                </span>
              </div>
              <p className="chalk-font chalk-text-white" style={{ fontSize: 'clamp(13px, 3.2vw, 17px)', margin: '6px 0 0', opacity: 0.95, lineHeight: 1.4 }}>
                "Nurturing Minds, Building Futures &bull; The Sacred Bond Connecting Child, Parent &amp; School"
              </p>
            </div>
          </div>

          {/* Blackboard Chalk Tray with Authentic Laboratory & Scholastic Instruments */}
          <div 
            className="blackboard-chalk-tray"
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '14px',
              background: 'rgba(0, 0, 0, 0.42)',
              padding: '8px 16px',
              borderRadius: '12px',
              border: '1.5px dashed rgba(254, 240, 138, 0.4)',
              boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.4)',
              maxWidth: '100%',
              boxSizing: 'border-box'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} title="Precision Mathematical Instruments">
              <GeometryCompassIcon size={22} />
              <span className="chalk-font chalk-text-cyan" style={{ fontSize: '16px' }}>a² + b² = c²</span>
            </div>
            <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>&bull;</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} title="Laboratory Kinetics & Photosynthesis">
              <ChemicalLabIcon size={22} />
              <span className="chalk-font chalk-text-green" style={{ fontSize: '16px' }}>6CO₂ + 6H₂O</span>
            </div>
            <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>&bull;</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} title="Terrestrial Geography">
              <DesktopGlobeIcon size={22} />
              <span className="chalk-font chalk-text-yellow" style={{ fontSize: '16px' }}>E = mc²</span>
            </div>
            <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>&bull;</span>
            {/* Real Wooden Chalk Ledge with Chalk Sticks */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(120, 53, 15, 0.6)', padding: '3px 8px', borderRadius: '4px', border: '1px solid #92400e' }} title="Classroom Chalk Tray & Eraser">
              <div style={{ width: '14px', height: '5px', background: '#ffffff', borderRadius: '1px' }} />
              <div style={{ width: '14px', height: '5px', background: '#fef08a', borderRadius: '1px' }} />
              <div style={{ width: '14px', height: '5px', background: '#7dd3fc', borderRadius: '1px' }} />
              <div style={{ width: '16px', height: '8px', background: '#451a03', border: '1px solid #78350f', borderRadius: '2px', marginLeft: '2px' }} title="Wooden Duster" />
            </div>
          </div>
        </div>
      </div>

      {/* ROW 1: 3 SUBJECT BLOCK CAPSULES (Math, Science, Social Studies) */}
      <div className="scholastic-subjects-grid">
        {/* 1. Math Subject Card */}
        <div 
          className="subject-card-math"
          onClick={() => handleFeatureClick('quiz', 'Mathematics Curriculum')}
          title="Jump to Mathematics Quizzes & Formula Lessons"
          style={{ position: 'relative', overflow: 'hidden' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '6px',
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(180, 83, 9, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <GeometryCompassIcon size={32} />
              </div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '6px',
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(180, 83, 9, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <WoodenAbacusIcon size={32} />
              </div>
            </div>
            <span style={{ fontSize: '12px', background: 'rgba(255, 255, 255, 0.25)', padding: '4px 10px', borderRadius: '999px', fontWeight: 800 }}>
              Class 5-12
            </span>
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '16px 0 6px', fontFamily: 'var(--font-heading)', color: '#FFFFFF' }}>
            Mathematics &amp; Logic
          </h3>
          <p style={{ fontSize: '13px', margin: 0, opacity: 0.96, lineHeight: 1.5, color: '#FFFFFF' }}>
            Precision Geometry, Soroban Abacus Arithmetic, Visual Fractions &amp; Slope Theorems
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '16px', fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>
            <span>Start Practice &amp; Quiz &rarr;</span>
          </div>
        </div>

        {/* 2. Science Subject Card */}
        <div 
          className="subject-card-science"
          onClick={() => handleFeatureClick('quiz', 'Science Lab')}
          title="Jump to Science Lessons & Cellular Biology"
          style={{ position: 'relative', overflow: 'hidden' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '6px',
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(4, 120, 87, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <LabMicroscopeIcon size={32} />
              </div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '6px',
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(4, 120, 87, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ChemicalLabIcon size={32} />
              </div>
            </div>
            <span style={{ fontSize: '12px', background: 'rgba(255, 255, 255, 0.25)', padding: '4px 10px', borderRadius: '999px', fontWeight: 800 }}>
              STEM &amp; Bio
            </span>
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '16px 0 6px', fontFamily: 'var(--font-heading)', color: '#FFFFFF' }}>
            Science &amp; Lab Bench
          </h3>
          <p style={{ fontSize: '13px', margin: 0, opacity: 0.96, lineHeight: 1.5, color: '#FFFFFF' }}>
            Cellular Microscopy, Chemical Reaction Titrations, Solar Orbit &amp; Physics Labs
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '16px', fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>
            <span>Explore Experiments &rarr;</span>
          </div>
        </div>

        {/* 3. Social Studies Subject Card */}
        <div 
          className="subject-card-social"
          onClick={() => handleFeatureClick('quiz', 'Social Studies')}
          title="Explore Indian Heritage & World Geography"
          style={{ position: 'relative', overflow: 'hidden' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '6px',
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(3, 105, 161, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <DesktopGlobeIcon size={32} />
              </div>
            </div>
            <span style={{ fontSize: '12px', background: 'rgba(255, 255, 255, 0.25)', padding: '4px 10px', borderRadius: '999px', fontWeight: 800 }}>
              Heritage &amp; Geo
            </span>
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '16px 0 6px', fontFamily: 'var(--font-heading)', color: '#FFFFFF' }}>
            Social Studies &amp; Civics
          </h3>
          <p style={{ fontSize: '13px', margin: 0, opacity: 0.96, lineHeight: 1.5, color: '#FFFFFF' }}>
            Terrestrial Continents, Indian Constitutional Heritage, Civics &amp; Environment
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '16px', fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>
            <span>Discover Chapters &rarr;</span>
          </div>
        </div>
      </div>

      {/* ROW 2: 2 CARDS (Teacher's Encouragement Note & Campus Notice Board) */}
      <div className="scholastic-duo-grid">
        {/* 4. Teacher Encouragement Note Card */}
        <div 
          className="teacher-note-card"
          onClick={() => handleFeatureClick('leaves', 'Teacher & Classroom Hub')}
          style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          title="Open Teacher Hub & Leave Engine"
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0284c7, #0ea5e9)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 800,
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)'
              }}>
                👩‍🏫
              </div>
              <div>
                <strong style={{ fontSize: '15px', color: 'var(--text-main)', display: 'block' }}>Mrs. Sunita Sharma</strong>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Class 8-B Head Teacher &bull; DPS Rourkela</span>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-main)', margin: '0 0 10px', lineHeight: 1.5, fontStyle: 'italic' }}>
              "Great effort, student! Keep up the excellent curiosity in Science and Daily Quizzes! ⭐⭐⭐⭐⭐"
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-muted)', borderTop: '1px dashed var(--border-subtle)', paddingTop: '10px' }}>
            <span>Verified Homework &bull; Today</span>
            <span style={{ color: 'var(--color-mint)', fontWeight: 700 }}>Active Classroom</span>
          </div>
        </div>

        {/* 5. Campus Notice Board Capsule (Auto-cycles public notices one by one) */}
        <div 
          className="subject-card-notice"
          onClick={() => {
            if (onOpenNoticeBoard) onOpenNoticeBoard();
            else setSelectedNoticeModal(currentNotice);
          }}
          onMouseEnter={() => setIsNoticePaused(true)}
          onMouseLeave={() => setIsNoticePaused(false)}
          title="Click to launch interactive Notice Board Live viewer"
          style={{ position: 'relative', cursor: 'pointer' }}
        >
          {/* Top Bar: Icon + Live Pulsing Badge */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '7px',
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(49, 46, 129, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4338ca'
              }}>
                <Megaphone size={20} />
              </div>
              <div>
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff', display: 'block', lineHeight: 1.2 }}>
                  Notice Board
                </span>
                <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)' }}>
                  Campus Live Bulletin
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsNoticePaused(p => !p);
                }}
                title={isNoticePaused ? "Resume auto-rotation" : "Pause auto-rotation"}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#ffffff',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                {isNoticePaused ? <Play size={12} /> : <Pause size={12} />}
              </button>
              <span style={{
                fontSize: '11px',
                background: currentNotice?.is_urgent ? '#ef4444' : 'rgba(255, 255, 255, 0.22)',
                color: '#ffffff',
                padding: '3px 10px',
                borderRadius: '999px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: currentNotice?.is_urgent ? '#ffffff' : '#4ade80',
                  display: 'inline-block',
                  boxShadow: '0 0 6px rgba(74, 222, 128, 0.8)'
                }} />
                {currentNotice?.is_urgent ? 'URGENT' : `${(activeNoticeIdx % activeNoticesList.length) + 1}/${activeNoticesList.length}`}
              </span>
            </div>
          </div>

          {/* Dynamic Content (Moving one by one) */}
          <div style={{ margin: '10px 0', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
              <span style={{
                fontSize: '10px',
                background: 'rgba(56, 189, 248, 0.25)',
                color: '#7dd3fc',
                padding: '2px 8px',
                borderRadius: '4px',
                fontWeight: 700,
                textTransform: 'uppercase'
              }}>
                {currentNotice?.category || 'CIRCULAR'}
              </span>
              <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)' }}>
                {currentNotice?.author_name || 'Admin'}
              </span>
            </div>
            <h4 style={{ 
              fontSize: '14px', 
              fontWeight: 800, 
              margin: '0 0 4px', 
              lineHeight: 1.35,
              color: '#ffffff',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {currentNotice?.title || "Campus Announcement"}
            </h4>
            <p style={{ 
              fontSize: '12px', 
              margin: 0, 
              color: 'rgba(255, 255, 255, 0.82)', 
              lineHeight: 1.45,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {currentNotice?.message || "Check latest circulars published by school administration."}
            </p>
          </div>

          {/* Bottom Bar: Stepper Controls, Prev/Next & Action */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            fontSize: '11px', 
            borderTop: '1px solid rgba(255, 255, 255, 0.16)',
            paddingTop: '10px'
          }}>
            {/* Prev/Next arrows + Stepper Dots */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveNoticeIdx(prev => (prev - 1 + activeNoticesList.length) % activeNoticesList.length);
                }}
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '5px',
                  background: 'rgba(255, 255, 255, 0.22)',
                  border: 'none',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'background 0.15s'
                }}
                title="Previous Notice"
              >
                <ChevronLeft size={13} />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveNoticeIdx(prev => (prev + 1) % activeNoticesList.length);
                }}
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '5px',
                  background: 'rgba(255, 255, 255, 0.22)',
                  border: 'none',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'background 0.15s'
                }}
                title="Next Notice"
              >
                <ChevronRight size={13} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '3px' }}>
                {activeNoticesList.slice(0, 5).map((n, i) => (
                  <button
                    key={n.id || i}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveNoticeIdx(i);
                    }}
                    style={{
                      width: (activeNoticeIdx % activeNoticesList.length) === i ? '15px' : '6px',
                      height: '6px',
                      borderRadius: '3px',
                      background: (activeNoticeIdx % activeNoticesList.length) === i ? '#38bdf8' : 'rgba(255, 255, 255, 0.35)',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    title={`Go to notice ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <div 
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenNoticeBoard) onOpenNoticeBoard();
                else setSelectedNoticeModal(currentNotice);
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, color: '#93c5fd', fontSize: '12px', cursor: 'pointer' }}
            >
              <span>Notice Board Live &rarr;</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Showcase Card */}
      <div className="glass-panel" style={{
        padding: '36px',
        background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.08) 0%, rgba(245, 158, 11, 0.06) 100%)',
        border: '1.5px solid var(--border-subtle)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Ambient Top Corner Light Orb */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          right: '-60px',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '920px', position: 'relative', zIndex: 2 }}>
          {/* Top Pill Tags Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(14, 165, 233, 0.18)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: '11px',
              fontWeight: 800,
              color: 'var(--text-cyan)',
              letterSpacing: '0.4px'
            }}>
              <Sparkles size={13} />
              <span>THE UNIFIED EDUCATIONAL OPERATING SYSTEM</span>
            </span>

            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: '11px',
              fontWeight: 800,
              color: '#10b981'
            }}>
              <ShieldCheck size={13} />
              <span>India DPDP Act 2023 Compliant</span>
            </span>
          </div>

          <h1 style={{
            fontSize: '40px',
            fontWeight: 900,
            lineHeight: 1.15,
            fontFamily: 'var(--font-heading)',
            color: 'var(--text-main)',
            margin: '0 0 16px 0',
            letterSpacing: '-0.5px'
          }}>
            The Smart Education Ecosystem for a <span className="gradient-text-cyan">Brighter Future</span>
          </h1>

          <p style={{
            fontSize: '15px',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            marginBottom: '26px',
            maxWidth: '820px'
          }}>
            Seamless communication &bull; Smarter campus management &bull; Stronger relationships. Built natively with Touchless Face AI, Real-Time WebSockets, and DPDP 2023 Biometric Privacy Protection.
          </p>

          {/* Quick Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '28px' }}>
            <button 
              onClick={() => handleFeatureClick('aichat', 'AI Saathi Assistant')}
              className="btn-primary" 
              style={{ fontSize: '13px', padding: '11px 22px' }}
            >
              <MessageSquare size={16} />
              <span>Launch AI Saathi</span>
              {!currentUser && <Lock size={12} style={{ opacity: 0.8 }} />}
              <ArrowRight size={14} />
            </button>
            <button 
              onClick={() => handleFeatureClick('sockets', 'Classroom Sockets')}
              className="btn-secondary" 
              style={{ fontSize: '13px', padding: '11px 22px' }}
            >
              <Radio size={16} />
              <span>Classroom Sockets</span>
              {!currentUser && <Lock size={12} style={{ opacity: 0.7 }} />}
            </button>
            <button 
              onClick={() => handleFeatureClick('kiosk', 'Face AI Gate Kiosk')}
              className="btn-secondary" 
              style={{ fontSize: '13px', padding: '11px 22px' }}
            >
              <ScanFace size={16} />
              <span>Face AI Gate Kiosk</span>
              {!currentUser && <Lock size={12} style={{ opacity: 0.7 }} />}
            </button>
            <button 
              onClick={() => handleFeatureClick('consultation', '1-on-1 Consultations')}
              className="btn-secondary" 
              style={{ fontSize: '13px', padding: '11px 22px' }}
            >
              <Video size={16} />
              <span>1-on-1 Consultations</span>
              {!currentUser && <Lock size={12} style={{ opacity: 0.7 }} />}
            </button>
            {!currentUser && (
              <button 
                onClick={() => onRequireAuth ? onRequireAuth({ id: 'overview', title: 'EduBandhan Portal' }) : null}
                style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(5, 150, 105, 0.35))',
                  border: '1.5px solid rgba(52, 211, 153, 0.55)',
                  color: '#fff',
                  borderRadius: 'var(--radius-md)',
                  padding: '11px 22px',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.25)'
                }}
              >
                <Sparkles size={16} color="#34d399" />
                <span>1-Click Demo Login</span>
              </button>
            )}
          </div>

          {/* Micro Metrics Strip */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-cyan)'
              }}>
                <Zap size={16} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
                  &lt; 150ms
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Face AI Scan Speed</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10b981'
              }}>
                <Cpu size={16} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
                  9 Modules
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Zero Capex Integration</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(168, 85, 247, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#a855f7'
              }}>
                <Sparkles size={16} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
                  Groq Qwen AI
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Pedagogical Doubts</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(245, 158, 11, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f59e0b'
              }}>
                <ShieldCheck size={16} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
                  Zero Photos
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Vector Embeddings Only</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* The Problem vs The EduBandhan Solution Comparison Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        
        {/* Problem Card */}
        <div className="glass-panel" style={{
          padding: '26px',
          border: '1.5px solid rgba(239, 68, 68, 0.3)',
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, var(--bg-surface) 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div style={{
              background: 'rgba(239, 68, 68, 0.18)',
              color: '#f87171',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '16px'
            }}>
              !
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
                The Traditional Friction
              </h3>
              <p style={{ fontSize: '11px', color: 'var(--text-dim)', margin: 0 }}>Challenges faced by schools, parents, and children</p>
            </div>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
            Outdated campus systems suffer from multiple pain-points that waste administrative hours and create parent anxiety:
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
            {[
              'Proxy attendance & error-prone paper registers at school gates',
              'Fragmented WhatsApp groups leading to missed circulars & confusion',
              'Long fee counter queues, cash reconciliation delays & lost receipts',
              'Zero visibility into school bus delays or child arrival timestamps',
              'Parent struggles to explain modern curriculum doubts to their kids'
            ].map((p, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: 'var(--text-muted)' }}>
                <span style={{ color: '#f87171', fontWeight: 900, fontSize: '14px', lineHeight: 1 }}>&times;</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Solution Card */}
        <div className="glass-panel" style={{
          padding: '26px',
          border: '1.5px solid rgba(16, 185, 129, 0.35)',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, var(--bg-surface) 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div style={{
              background: 'rgba(16, 185, 129, 0.2)',
              color: '#34d399',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
                The EduBandhan Architecture
              </h3>
              <p style={{ fontSize: '11px', color: 'var(--text-dim)', margin: 0 }}>A unified, intelligent ecosystem connecting all 3 stakeholders</p>
            </div>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
            A single, secure platform that bridges the gap between home and institution with cutting-edge AI and complete transparency:
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', marginBottom: '18px' }}>
            {[
              'Sub-150ms Face AI kiosk check-ins with zero raw facial photos kept',
              'Moderated FastAPI WebSocket feeds with clean categorization',
              '1-Tap Dynamic UPI QR escrow with instant verified GST receipts',
              'Real-time Parent Mobile Pulse with bus tracking & automated leave passes',
              'Groq-powered AI Saathi with dual-perspective parent & child mentoring'
            ].map((s, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: 'var(--text-main)' }}>
                <CheckCircle2 size={15} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{s}</span>
              </li>
            ))}
          </ul>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['1 Unified Platform', '3 Stakeholders', 'Endless Possibilities'].map(pill => (
              <span key={pill} style={{
                background: 'rgba(16, 185, 129, 0.18)',
                color: '#10b981',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 800
              }}>
                {pill}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* 9 Powerful Features Section Heading */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
          <span style={{
            background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 900,
            width: '30px',
            height: '30px',
            borderRadius: '9px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(14, 165, 233, 0.4)'
          }}>
            9
          </span>
          <h2 style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-heading)', margin: 0, color: 'var(--text-main)' }}>
            Powerful Integrated Modules
          </h2>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
          Everything your institution needs to operate seamlessly, securely, and smartly. Click any module to launch.
        </p>
      </div>

      {/* 9 Features Interactive Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {features.map(f => {
          const Icon = f.icon;
          const ScholasticToolIcon = f.scholasticIcon;
          return (
            <div
              key={f.num}
              onClick={() => handleFeatureClick(f.id, f.title)}
              className="glass-card-interactive"
              title={!currentUser ? `Click to sign in or register to access ${f.title}` : `Open ${f.title}`}
              style={{
                padding: '24px',
                cursor: 'pointer',
                position: 'relative',
                backgroundColor: f.id === 'aichat' ? 'var(--ai-bg-subtle, rgba(108, 76, 232, 0.12))' : 'var(--bg-surface)',
                border: f.id === 'aichat' ? '1.5px solid var(--ai-border, rgba(108, 76, 232, 0.35))' : '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.18s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-card-hover, 0 8px 24px rgba(0, 0, 0, 0.18))';
                e.currentTarget.style.borderColor = f.id === 'aichat' ? 'var(--accent-purple, #8B5CF6)' : 'var(--accent-blue, #3B82F6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                e.currentTarget.style.borderColor = f.id === 'aichat' ? 'var(--ai-border, rgba(108, 76, 232, 0.35))' : 'var(--border-subtle)';
              }}
            >
              <div>
                {/* Header with Number & Icon */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      backgroundColor: f.id === 'aichat' ? 'var(--color-violet)' : (f.id === 'admin' ? 'var(--color-navy)' : 'var(--color-blue)'),
                      color: '#ffffff',
                      borderRadius: '6px',
                      padding: '3px 8px',
                      fontSize: '11px',
                      fontWeight: 800,
                      letterSpacing: '0.4px'
                    }}>
                      {f.num}
                    </span>
                    <span style={{
                      fontSize: '10.5px',
                      fontWeight: 700,
                      color: 'var(--text-muted)',
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)',
                      padding: '2px 7px',
                      borderRadius: '4px',
                      fontFamily: 'monospace'
                    }}>
                      {f.code}
                    </span>
                  </div>

                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: f.id === 'aichat' ? 'rgba(108, 76, 232, 0.2)' : 'rgba(22, 119, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Icon size={18} color={f.id === 'aichat' ? '#8B5CF6' : 'var(--accent-blue, #3B82F6)'} />
                  </div>
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0', lineHeight: 1.3 }}>
                  {f.title}
                </h3>

                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                  {f.desc}
                </p>
              </div>

              {/* Tag Pills & Click Indicator */}
              <div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {f.tags.map(t => (
                    <span 
                      key={t}
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-subtle)',
                        padding: '3px 8px',
                        borderRadius: '5px',
                        fontSize: '10px',
                        fontWeight: 700,
                        color: 'var(--text-cyan)'
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {!currentUser ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'rgba(2, 132, 199, 0.18)',
                    border: '1px solid rgba(56, 189, 248, 0.45)',
                    color: 'var(--text-main)',
                    fontSize: '11px',
                    fontWeight: 800,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Lock size={12} color="var(--accent-cyan)" />
                      <span>Click to Sign In &amp; Explore</span>
                    </span>
                    <ArrowRight size={13} color="var(--accent-cyan)" />
                  </div>
                ) : (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    fontWeight: 800,
                    color: f.color,
                    transition: 'gap 0.15s ease'
                  }}>
                    <span>Launch Module Portal</span>
                    <ArrowRight size={14} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Built for Every Learning Institution Strip */}
      <div className="glass-panel" style={{
        padding: '28px',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px'
      }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 4px 0', color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
            Built for Every Learning Institution
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
            Flexible. Secure. Zero Hardware Capex. Select target deployment profile:
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
          {institutions.map(inst => {
            const Icon = inst.icon;
            const isSelected = activeSector === inst.id;
            return (
              <div
                key={inst.id}
                onClick={() => setActiveSector(inst.id)}
                className="glass-card-interactive"
                style={{
                  background: isSelected ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.25), rgba(14, 165, 233, 0.15))' : 'var(--bg-surface)',
                  border: isSelected ? '1.5px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px'
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: isSelected ? 'linear-gradient(135deg, #0284c7, #38bdf8)' : 'rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={20} color={isSelected ? '#ffffff' : inst.color} />
                </div>
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                    {inst.name}
                  </h4>
                  <p style={{ fontSize: '11px', color: 'var(--text-dim)', margin: '2px 0 0 0' }}>
                    {inst.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notice Detail Reader Modal */}
      {selectedNoticeModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setSelectedNoticeModal(null)}
        >
          <div 
            style={{
              background: 'var(--bg-surface)',
              borderRadius: '20px',
              maxWidth: '560px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
              border: '1.5px solid var(--border-subtle)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedNoticeModal(null)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: 'rgba(148, 163, 184, 0.15)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)'
              }}
              title="Close"
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span style={{
                background: selectedNoticeModal.is_urgent ? 'rgba(239, 68, 68, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                color: selectedNoticeModal.is_urgent ? '#ef4444' : '#0284c7',
                padding: '3px 10px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: 800
              }}>
                {selectedNoticeModal.category || 'NOTICE'}
              </span>
              <span style={{
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                padding: '3px 10px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: 700
              }}>
                PUBLIC CIRCULAR
              </span>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 14px', color: 'var(--text-main)', lineHeight: 1.4 }}>
              {selectedNoticeModal.title}
            </h3>

            <p style={{ fontSize: '13px', lineHeight: 1.65, color: 'var(--text-main)', margin: '0 0 22px', whiteSpace: 'pre-line' }}>
              {selectedNoticeModal.message}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <div>
                <strong style={{ display: 'block', color: 'var(--text-main)' }}>{selectedNoticeModal.author_name || 'School Administration'}</strong>
                <span style={{ fontSize: '11px' }}>{selectedNoticeModal.author_role || 'ADMIN'} &bull; {selectedNoticeModal.created_at ? new Date(selectedNoticeModal.created_at).toLocaleDateString() : 'Today'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    const curIdx = activeNoticesList.findIndex(n => n.id === selectedNoticeModal.id);
                    const prevIdx = (curIdx - 1 + activeNoticesList.length) % activeNoticesList.length;
                    setSelectedNoticeModal(activeNoticesList[prevIdx]);
                  }}
                  className="btn btn-secondary"
                  style={{ padding: '7px 12px', fontSize: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  title="Previous Notice"
                >
                  <ChevronLeft size={14} />
                  <span>Prev</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const curIdx = activeNoticesList.findIndex(n => n.id === selectedNoticeModal.id);
                    const nextIdx = (curIdx + 1) % activeNoticesList.length;
                    setSelectedNoticeModal(activeNoticesList[nextIdx]);
                  }}
                  className="btn btn-secondary"
                  style={{ padding: '7px 12px', fontSize: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  title="Next Notice"
                >
                  <span>Next</span>
                  <ChevronRight size={14} />
                </button>
                <button 
                  onClick={() => setSelectedNoticeModal(null)}
                  className="btn btn-primary"
                  style={{ padding: '7px 16px', fontSize: '12px', borderRadius: '8px' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
