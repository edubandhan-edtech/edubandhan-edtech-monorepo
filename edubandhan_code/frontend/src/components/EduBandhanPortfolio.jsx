import React, { useState } from 'react';
import {
  ShieldCheck,
  Sparkles,
  GraduationCap,
  School,
  Users,
  ScanFace,
  Smartphone,
  CreditCard,
  Video,
  Radio,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Award,
  Lock,
  BookOpen,
  Layers,
  Clock,
  Cpu,
  Heart,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Building,
  Trophy,
  HelpCircle,
  Star,
  Globe,
  Send,
  Check,
  Sun,
  Moon,
  Zap,
  CalendarCheck,
  Network,
  AlertOctagon,
  MessageSquare,
  CalendarOff,
  QrCode,
  Activity,
  CheckSquare,
  Bot
} from 'lucide-react';

export default function EduBandhanPortfolio({
  onLaunchPortal,
  theme = 'dark',
  onToggleTheme,
  currentUser,
  onOpenAuth
}) {
  const [activeTeaserTab, setActiveTeaserTab] = useState('kiosk');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    institutionName: '',
    contactPerson: '',
    designation: 'Principal',
    phone: '',
    email: '',
    institutionType: 'K-12 School',
    studentCount: '500 - 2000 Students',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.institutionName.trim() || !formData.contactPerson.trim() || !formData.phone.trim()) {
      alert('Please fill in your institution name, contact person, and phone number.');
      return;
    }
    setContactSubmitted(true);
  };

  const isDark = theme === 'dark';

  // 10 Landmark Features matching the EduBandhan Sovereign Ecosystem
  const tenFeatures = [
    {
      number: 1,
      id: 'kiosk',
      targetTab: 'kiosk',
      title: 'Classroom Touch & Face-AI Kiosk',
      badge: '< 150ms Face-AI',
      category: 'Biometrics & Attendance',
      desc: 'Instant touch-free recognition in < 150ms using 512-dim pgvector float embeddings. Zero raw facial imagery kept; offline queue ensures 100% operational uptime.',
      icon: ScanFace,
      color: '#155EEF',
      bgGlow: 'rgba(21, 94, 239, 0.12)',
      borderColor: 'rgba(21, 94, 239, 0.35)',
      impact: 'Instant touchless face verification in < 150ms with zero proxy attendance.'
    },
    {
      number: 2,
      id: 'parent_hub',
      targetTab: 'parent_hub',
      title: 'Parent Mobile Pulse Hub',
      badge: 'Real-Time Pulse',
      category: 'Parent Transparency',
      desc: 'Real-time student journey telemetry, instant gate entry/exit timestamps, live daily timetable sync, and school bus transit tracking.',
      icon: Smartphone,
      color: '#10B981',
      bgGlow: 'rgba(16, 185, 129, 0.12)',
      borderColor: 'rgba(16, 185, 129, 0.35)',
      impact: 'Instant WhatsApp & push notifications keep parents informed with zero delay.'
    },
    {
      number: 3,
      id: 'fees',
      targetTab: 'fees',
      title: 'Itemized Fee Ledger & 1-Tap UPI',
      badge: 'Escrow UPI',
      category: 'Campus FinTech',
      desc: 'Itemized tuition, laboratory, and transport schedules. 1-tap dynamic UPI QR code generator with automated GST tax invoices and zero settlement delay.',
      icon: CreditCard,
      color: '#F59E0B',
      bgGlow: 'rgba(245, 158, 11, 0.12)',
      borderColor: 'rgba(245, 158, 11, 0.35)',
      impact: 'Direct 1-tap UPI QR payments with instant GST invoice generation and zero delays.'
    },
    {
      number: 4,
      id: 'consultation',
      targetTab: 'consultation',
      title: '1-on-1 Consultation Marketplace',
      badge: 'P2P Encrypted Video',
      category: 'Parent-Teacher Harmony',
      desc: 'Encrypted peer-to-peer 10-minute micro video consultations connecting working parents directly with class teachers, counselors, and subject educators.',
      icon: Video,
      color: '#8B5CF6',
      bgGlow: 'rgba(139, 92, 246, 0.12)',
      borderColor: 'rgba(139, 92, 246, 0.35)',
      impact: 'Scheduled 10-minute encrypted video meetings with teachers anytime, anywhere.'
    },
    {
      number: 5,
      id: 'sockets',
      targetTab: 'sockets',
      title: 'Moderated Classroom Sockets',
      badge: 'Sub-50ms WebSockets',
      category: 'Real-Time Broadcasts',
      desc: 'High-concurrency WebSocket channels for verified institutional bulletins, teacher homework dispatch, emergency alerts, and moderated classroom channels.',
      icon: Radio,
      color: '#EC4899',
      bgGlow: 'rgba(236, 72, 153, 0.12)',
      borderColor: 'rgba(236, 72, 153, 0.35)',
      impact: 'Sub-50ms live socket streaming for instant circulars, homework, and broadcasts.'
    },
    {
      number: 6,
      id: 'admin',
      targetTab: 'admin',
      title: 'Verified KYC & Data Security',
      badge: 'DPDP 2023 Shield',
      category: 'Data Sovereignty & RBAC',
      desc: 'Strict role-based access control (RBAC), multi-factor guardian verification, audit logs, and 100% statutory DPDP Act 2023 compliance.',
      icon: ShieldCheck,
      color: '#0284C7',
      bgGlow: 'rgba(2, 132, 199, 0.12)',
      borderColor: 'rgba(2, 132, 199, 0.35)',
      impact: 'Sovereign mathematical storage with 100% DPDP Act 2023 statutory compliance.'
    },
    {
      number: 7,
      id: 'aichat',
      targetTab: 'aichat',
      title: 'EduBandhan AI Chatbot & Mentor',
      badge: 'Groq Qwen 27B LLM',
      category: 'Socratic GenAI Intelligence',
      desc: 'Violet AI Saathi powered by Groq Qwen 27B (< 800ms). Dual-perspective engine delivers step-by-step Socratic hints for children and pedagogical advice for parents.',
      icon: Sparkles,
      color: '#14B8A6',
      bgGlow: 'rgba(20, 184, 166, 0.12)',
      borderColor: 'rgba(20, 184, 166, 0.35)',
      impact: '24/7 personalized Socratic homework tutoring & parenting guidance powered by Groq.'
    },
    {
      number: 8,
      id: 'quiz',
      targetTab: 'quiz',
      title: 'Child Quiz Arena & AI Coach',
      badge: 'NCERT Gamification',
      category: 'Gamified Academics',
      desc: 'Daily NCERT-aligned syllabus quizzes with streak bonuses, subject tournaments (Math, Science, English, Robotics), and instant performance telemetry.',
      icon: Trophy,
      color: '#F97316',
      bgGlow: 'rgba(249, 115, 22, 0.12)',
      borderColor: 'rgba(249, 115, 22, 0.35)',
      impact: 'Daily NCERT-aligned syllabus tournaments that motivate student self-learning.'
    },
    {
      number: 9,
      id: 'leaves',
      targetTab: 'leaves',
      title: 'Dual-Tier Leave & Medical Absence Pass',
      badge: 'Digital Approvals',
      category: 'Workflow Automation',
      desc: 'Seamless medical leave submissions with prescription upload, dual-tier teacher/principal authorization workflows, and auto-adjusted attendance registries.',
      icon: CalendarOff,
      color: '#6366F1',
      bgGlow: 'rgba(99, 102, 241, 0.12)',
      borderColor: 'rgba(99, 102, 241, 0.35)',
      impact: '1-click digital leave pass with prescription upload and verified approvals.'
    },
    {
      number: 10,
      id: 'suraksha_pass',
      targetTab: 'parent_hub',
      title: 'EduBandhan Suraksha Pass',
      badge: 'Static QR + Hold',
      category: 'Perimeter Security',
      desc: 'Anti-kidnapping perimeter protection. Generates static QR passes for authorized substitute guardians with single-tap instant Emergency Freeze hold at reception.',
      icon: Lock,
      color: '#1D4ED8',
      bgGlow: 'rgba(29, 78, 216, 0.12)',
      borderColor: 'rgba(29, 78, 216, 0.35)',
      impact: 'Static QR substitute guardian passes with 1-tap instant departure freeze hold.'
    }
  ];

  // Products Showcase Data
  const products = [
    {
      id: 'kiosk',
      targetTab: 'kiosk',
      title: 'Classroom Touch & Face-AI Kiosk',
      subtitle: 'EB-BIO-01 • Instant Biometric Gate & Classroom Station',
      desc: 'Touch-free student and faculty check-ins in < 150ms. Zero raw photo retention; uses 512-dimensional pgvector mathematical embeddings with offline failover.',
      icon: ScanFace,
      color: '#0284C7',
      bgGlow: 'rgba(2, 132, 199, 0.15)',
      borderColor: 'rgba(2, 132, 199, 0.35)',
      highlights: ['< 150ms Recognition', 'Zero Raw Photos Stored', 'Offline-First Queue']
    },
    {
      id: 'parent_hub',
      targetTab: 'parent_hub',
      title: 'Parent Mobile Pulse & Suraksha Pass',
      subtitle: 'EB-PULSE-02 • Real-Time Daily Journey & Departure Control',
      desc: 'Instant gate entry/exit alerts, daily timetable tracking, live school bus updates, and dynamic Suraksha guardian substitute passes with Emergency Freeze hold.',
      icon: Smartphone,
      color: '#10B981',
      bgGlow: 'rgba(16, 185, 129, 0.15)',
      borderColor: 'rgba(16, 185, 129, 0.35)',
      highlights: ['Instant WhatsApp Passes', 'Emergency Freeze Protocol', 'Daily Roster Sync']
    },
    {
      id: 'admin',
      targetTab: 'admin',
      title: 'Institutional Command & Admin HUD',
      subtitle: 'EB-SEC-06 • Multi-Role Sovereign Governance',
      desc: 'Complete administrative command dashboard with student enrollment, faculty role assignment, KYC audit logs, and DPDP Act 2023 compliance tracking.',
      icon: ShieldCheck,
      color: '#3B82F6',
      bgGlow: 'rgba(59, 130, 246, 0.15)',
      borderColor: 'rgba(59, 130, 246, 0.35)',
      highlights: ['Role-Based JWT Security', 'DPDP 2023 Audit Logs', 'Complete Campus Ledger']
    },
    {
      id: 'aichat',
      targetTab: 'aichat',
      title: 'Violet AI Saathi & Socratic Mentor',
      subtitle: 'EB-AI-07 • Dual-Perspective Pedagogical LLM',
      desc: 'Powered by Groq Cloud Qwen 27B with < 800ms latency. Provides fun, step-by-step analogies for students and pedagogical parenting coaching for mothers & fathers.',
      icon: Sparkles,
      color: '#8B5CF6',
      bgGlow: 'rgba(139, 92, 246, 0.15)',
      borderColor: 'rgba(139, 92, 246, 0.35)',
      highlights: ['< 800ms Groq Inference', 'Dual-Perspective Engine', 'Socratic Questioning']
    },
    {
      id: 'quiz',
      targetTab: 'quiz',
      title: 'Child NCERT Quiz & Skill Arena',
      subtitle: 'EB-LAB-08 • Gamified Daily Academic Mastery',
      desc: 'Interactive NCERT syllabus challenges with streak multipliers, subject categories (Math, Science, English, Robotics), and instant performance scorecards.',
      icon: Trophy,
      color: '#F59E0B',
      bgGlow: 'rgba(245, 158, 11, 0.15)',
      borderColor: 'rgba(245, 158, 11, 0.35)',
      highlights: ['NCERT-Aligned Questions', 'Daily Streak Bonuses', 'Instant Socratic Hints']
    },
    {
      id: 'fees',
      targetTab: 'fees',
      title: 'Itemized Fee Ledger & Instant UPI',
      subtitle: 'EB-ACCTS-03 • Escrow-Secured Campus Banking',
      desc: 'Tuition, transportation, and STEM lab fee ledgers with 1-tap dynamic UPI QR generation, instant GST receipts, automated reconciliations, and zero settlement delays.',
      icon: CreditCard,
      color: '#EC4899',
      bgGlow: 'rgba(236, 72, 153, 0.15)',
      borderColor: 'rgba(236, 72, 153, 0.35)',
      highlights: ['1-Tap UPI QR Codes', 'Automated GST Invoices', 'Bank-Grade Escrow']
    },
    {
      id: 'consultation',
      targetTab: 'consultation',
      title: '1-on-1 Consultation Marketplace',
      subtitle: 'EB-CONF-04 • Peer-to-Peer Encrypted Video Sessions',
      desc: 'Direct micro-consultations connecting parents with class teachers, counselors, and subject educators. 10-minute encrypted slots with appointment scheduling.',
      icon: Video,
      color: '#06B6D4',
      bgGlow: 'rgba(6, 182, 212, 0.15)',
      borderColor: 'rgba(6, 182, 212, 0.35)',
      highlights: ['Encrypted WebRTC Video', '10-Min Micro Slots', 'Zero App Download Needed']
    },
    {
      id: 'organization',
      targetTab: 'organization',
      title: 'Campus Organization Hierarchy 360°',
      subtitle: 'EB-NET-10 • Dynamic Academic Tree & Staff Directory',
      desc: 'Interactive visual directory mapping Trust Owners, School Principals, Department Heads, Teachers, and Class Sections with live headcount telemetrics.',
      icon: Network,
      color: '#6366F1',
      bgGlow: 'rgba(99, 102, 241, 0.15)',
      borderColor: 'rgba(99, 102, 241, 0.35)',
      highlights: ['Full Multi-Branch Tree', 'Live Headcount Tickers', 'Department Hierarchy']
    }
  ];

  // Core Services Data
  const services = [
    {
      title: 'Campus Digital Transformation',
      desc: 'Turnkey upgrade of school entry gates, classrooms, and offices with edge-ready biometric kiosks, modern networking, and digital smartboards.',
      icon: School,
      tag: 'Infrastructure'
    },
    {
      title: 'Pedagogical AI Integration',
      desc: 'Custom-tailored institutional Socratic AI models aligned with CBSE, ICSE, and State curricula for homework tutoring and teacher lesson drafting.',
      icon: Cpu,
      tag: 'GenAI & EdTech'
    },
    {
      title: 'Student Safety & Transit Shield',
      desc: 'Holistic child departure security combining gate facial recognition, digital guardian gate passes, and emergency freeze protocol for parents.',
      icon: ShieldCheck,
      tag: 'Child Security'
    },
    {
      title: 'Automated Fee Billing & Escrow UPI',
      desc: 'Complete digital reconciliation of school finances, instant parent payment portals, installment tracking, and automated digital receipts.',
      icon: CreditCard,
      tag: 'FinTech'
    },
    {
      title: 'Multi-Tenant Trust Governance',
      desc: 'Centralized administrative monitoring for educational trusts and chains operating multiple school branches across multiple cities.',
      icon: Building,
      tag: 'Enterprise ERP'
    },
    {
      title: 'DPDP 2023 Statutory Compliance',
      desc: 'Full regulatory certification under India’s Digital Personal Data Protection Act with encrypted vector storage and zero biometric leakage.',
      icon: Lock,
      tag: 'Data Sovereignty'
    }
  ];

  // Teaser Mockup Content
  const teaserContent = {
    kiosk: {
      title: 'Classroom Face-AI Kiosk Verification',
      badge: '< 150ms Speed',
      desc: 'Students step in front of the classroom tablet. Recognition occurs in under 150 milliseconds. Attendance is committed directly into the Neon pgvector database without storing any raw face imagery.',
      stats: ['512-dim Embedding Vector', 'No Raw Camera Feed Kept', 'Auto Parent Alert Dispatched'],
      previewImg: '👤 Face Scanned: Aarav Sharma (Class 8-B) • Status: PRESENT (08:42 AM)'
    },
    parent: {
      title: 'Parent Mobile Pulse & Suraksha Pass',
      badge: 'Zero Proxy',
      desc: 'Parents receive immediate entry/exit timestamps. If sending a relative or driver for pickup, the parent generates a static QR Suraksha Gate Pass, or engages Emergency Freeze to block child departure at reception.',
      stats: ['Instant WhatsApp Share', 'Single-Tap Departure Freeze', 'Live Classroom Feed'],
      previewImg: '🛡️ Suraksha Gate Pass Verified: Mr. Rajesh Kumar (Uncle) • Gate 1 Clearance'
    },
    ai: {
      title: 'Violet AI Saathi: Socratic Mentorship',
      badge: 'Pedagogical LLM',
      desc: 'Dual-perspective educational intelligence powered by Groq Qwen 27B. Never simply blurts answers — guides students step-by-step through mathematical proofs and science analogies.',
      stats: ['NCERT Aligned', 'Child & Parent Perspectives', 'Groq Ultra-Fast Inference'],
      previewImg: '💡 Violet: "Think about Newton\'s 3rd Law like pushing against the edge of a swimming pool..."'
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: isDark ? '#071527' : '#F5F7FB',
      color: isDark ? '#F8FAFC' : '#12213A',
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      overflowX: 'hidden',
      position: 'relative'
    }}>

      {/* =========================================================================
          1. PORTFOLIO TOP NAVIGATION BAR
          ========================================================================= */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: isDark ? 'rgba(7, 21, 39, 0.88)' : 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${isDark ? 'rgba(56, 189, 248, 0.15)' : '#E2E8F0'}`,
        padding: '14px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 0.2s ease'
      }}>
        {/* Brand Logo & Name */}
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            overflow: 'hidden',
            background: '#071527',
            border: '2px solid rgba(245, 158, 11, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 18px rgba(21, 94, 239, 0.45)',
            flexShrink: 0
          }}>
            <img
              src="/edubandhan_logo_dark.jpg"
              alt="EduBandhan Official Logo"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/web_app/edubandhan/assets/edubandhan_logo_dark.jpg';
              }}
            />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '-0.3px', color: isDark ? '#FFFFFF' : '#102A56' }}>
                EduBandhan
              </span>
              <span style={{
                fontSize: '11px',
                fontWeight: 800,
                color: '#F59E0B',
                backgroundColor: 'rgba(245, 158, 11, 0.12)',
                padding: '2px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(245, 158, 11, 0.3)'
              }}>
                एडूबंधन
              </span>
            </div>
            <span style={{ fontSize: '11px', color: isDark ? '#94A3B8' : '#475569', fontWeight: 600, letterSpacing: '0.1px', display: 'block', marginTop: '1px' }}>
              The Sacred Bond Connecting Child, Parent &amp; Educational Organization
            </span>
          </div>
        </div>

        {/* Section Anchor Links (Clean Standard Corporate Structure) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <a href="#about" style={{ textDecoration: 'none', color: isDark ? '#CBD5E1' : '#475569', fontSize: '13.5px', fontWeight: 600, transition: 'color 0.15s ease' }}>
            About Us
          </a>
          <a href="#products" style={{ textDecoration: 'none', color: isDark ? '#CBD5E1' : '#475569', fontSize: '13.5px', fontWeight: 600, transition: 'color 0.15s ease' }}>
            Products
          </a>
          <a href="#services" style={{ textDecoration: 'none', color: isDark ? '#CBD5E1' : '#475569', fontSize: '13.5px', fontWeight: 600, transition: 'color 0.15s ease' }}>
            Services
          </a>
          <a href="#features" style={{ textDecoration: 'none', color: isDark ? '#CBD5E1' : '#475569', fontSize: '13.5px', fontWeight: 600, transition: 'color 0.15s ease' }}>
            Features
          </a>
          <a href="#security" style={{ textDecoration: 'none', color: isDark ? '#CBD5E1' : '#475569', fontSize: '13.5px', fontWeight: 600, transition: 'color 0.15s ease' }}>
            DPDP &amp; Security
          </a>
          <a href="#contact" style={{ textDecoration: 'none', color: isDark ? '#CBD5E1' : '#475569', fontSize: '13.5px', fontWeight: 600, transition: 'color 0.15s ease' }}>
            Contact &amp; Demo
          </a>
        </div>

        {/* Action Controls: Theme Switch & Launch Portal CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: isDark ? 'rgba(30, 41, 59, 0.8)' : '#F1F5F9',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : '#CBD5E1'}`,
                color: isDark ? '#FDE68A' : '#1E293B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Toggle Light/Dark Theme"
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          )}

          {/* Primary Portal Launch Button */}
          <button
            onClick={() => onLaunchPortal('overview')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #155EEF 0%, #0040C1 100%)',
              color: '#FFFFFF',
              border: '1.5px solid rgba(245, 158, 11, 0.6)',
              fontSize: '13.5px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(21, 94, 239, 0.45)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
          >
            <span>Launch EduBandhan Portal</span>
            <ArrowRight size={16} color="#FDE68A" />
          </button>
        </div>
      </nav>

      {/* Custom Keyframe Animations for Modern-Day Parenting Tagline and 10 Landmark Features */}
      <style>{`
        @keyframes ebPillFloat {
          0% { transform: translateY(0px) rotate(-0.5deg); box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4); }
          50% { transform: translateY(-4px) rotate(0.3deg); box-shadow: 0 14px 35px rgba(245, 158, 11, 0.65); }
          100% { transform: translateY(0px) rotate(-0.5deg); box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4); }
        }
        @keyframes ebGlowPulse {
          0% { opacity: 0.6; transform: scale(0.98); }
          50% { opacity: 1; transform: scale(1.02); }
          100% { opacity: 0.6; transform: scale(0.98); }
        }
        @keyframes ebNumberPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        .eb-feature-card {
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .eb-feature-card:hover {
          transform: translateY(-5px);
        }
        .eb-feature-card:hover .eb-pulse-number {
          animation: ebNumberPulse 0.8s ease infinite;
        }
      `}</style>

      {/* =========================================================================
          2. HERO SECTION
          ========================================================================= */}
      <section style={{
        padding: '60px 24px 60px',
        maxWidth: '1240px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Glowing Announcement Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '999px',
          backgroundColor: isDark ? 'rgba(21, 94, 239, 0.16)' : 'rgba(21, 94, 239, 0.08)',
          border: '1px solid rgba(21, 94, 239, 0.35)',
          color: isDark ? '#38BDF8' : '#155EEF',
          fontSize: '12.5px',
          fontWeight: 800,
          marginBottom: '28px',
          boxShadow: '0 2px 10px rgba(21, 94, 239, 0.15)'
        }}>
          <Sparkles size={14} color="#F59E0B" />
          <span>Next-Gen Multi-Tenant AI Smart School Ecosystem &bull; 2026 Sovereign Architecture</span>
        </div>

        {/* Master Poster Slogan: Empowering institutions to meet modern-day parenting */}
        <div style={{
          margin: '0 0 28px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{
            fontSize: 'clamp(24px, 4.2vw, 46px)',
            fontWeight: 900,
            letterSpacing: '-1px',
            color: isDark ? '#FFFFFF' : '#102A56',
            lineHeight: 1.15
          }}>
            Empowering institutions to meet
          </span>
          <span style={{
            display: 'inline-block',
            padding: '8px 28px',
            borderRadius: '999px',
            background: 'linear-gradient(135deg, #FACC15 0%, #EAB308 50%, #CA8A04 100%)',
            color: '#071527',
            fontSize: 'clamp(22px, 3.8vw, 42px)',
            fontWeight: 950,
            letterSpacing: '-0.6px',
            boxShadow: '0 8px 30px rgba(234, 179, 8, 0.45)',
            border: '2px solid rgba(254, 240, 138, 0.9)',
            transform: 'rotate(-0.5deg)',
            animation: 'ebPillFloat 3.5s ease-in-out infinite alternate',
            cursor: 'default'
          }}>
            modern-day parenting.
          </span>
        </div>

        {/* Master Headline */}
        <h1 style={{
          fontSize: 'clamp(28px, 4.2vw, 48px)',
          fontWeight: 900,
          lineHeight: 1.18,
          letterSpacing: '-1px',
          margin: '0 0 20px',
          maxWidth: '1020px',
          color: isDark ? '#F1F5F9' : '#1E293B'
        }}>
          The Sacred Bond Connecting{' '}
          <span style={{
            background: 'linear-gradient(135deg, #38BDF8 0%, #155EEF 60%, #F59E0B 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Child, Parent &amp; Educational Organization
          </span>
        </h1>

        {/* Narrative Subtitle */}
        <p style={{
          fontSize: '17.5px',
          lineHeight: 1.6,
          maxWidth: '820px',
          color: isDark ? '#94A3B8' : '#475569',
          margin: '0 0 24px'
        }}>
          Transforming Indian educational institutions with <strong>Touchless Face-AI biometric attendance</strong>, 
          <strong> DPDP Act 2023 compliance</strong>, real-time <strong>Parent Mobile Pulse</strong>, 
          Socratic <strong>Violet AI Mentorship</strong>, and unified multi-tenant campus operations.
        </p>

        {/* Core Capabilities Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          padding: '8px 20px',
          borderRadius: '999px',
          backgroundColor: isDark ? 'rgba(56, 189, 248, 0.1)' : 'rgba(21, 94, 239, 0.08)',
          border: `1.5px solid ${isDark ? 'rgba(56, 189, 248, 0.3)' : 'rgba(21, 94, 239, 0.25)'}`,
          color: isDark ? '#38BDF8' : '#155EEF',
          fontSize: '13px',
          fontWeight: 800,
          marginBottom: '36px',
          boxShadow: '0 4px 14px rgba(21, 94, 239, 0.1)'
        }}>
          <Zap size={15} color="#F59E0B" />
          <span>Touchless Face-AI &bull; Real-Time Mobile Pulse &bull; Socratic Violet AI Mentorship</span>
        </div>

        {/* Hero Call to Action Buttons */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '50px' }}>
          <button
            onClick={() => onLaunchPortal('overview')}
            style={{
              padding: '14px 28px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #155EEF 0%, #0040C1 100%)',
              color: '#FFFFFF',
              border: '1.5px solid rgba(245, 158, 11, 0.5)',
              fontSize: '15px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 10px 25px rgba(21, 94, 239, 0.4)'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
          >
            <span>🚀 Launch Live Portal (All Modules)</span>
            <ArrowRight size={18} />
          </button>

          <a
            href="#products"
            style={{
              padding: '14px 28px',
              borderRadius: '12px',
              backgroundColor: isDark ? 'rgba(15, 23, 42, 0.6)' : '#FFFFFF',
              color: isDark ? '#FFFFFF' : '#102A56',
              border: `1.5px solid ${isDark ? 'rgba(255, 255, 255, 0.15)' : '#CBD5E1'}`,
              fontSize: '15px',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
            }}
          >
            <BookOpen size={17} color="#38BDF8" />
            <span>Explore All 14 Products</span>
          </a>

          <a
            href="#contact"
            style={{
              padding: '14px 24px',
              borderRadius: '12px',
              backgroundColor: 'transparent',
              color: '#F59E0B',
              border: '1.5px solid rgba(245, 158, 11, 0.4)',
              fontSize: '15px',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <CalendarCheck size={17} />
            <span>Schedule Campus Demo</span>
          </a>
        </div>

        {/* Institutional Metrics Strip */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          width: '100%',
          maxWidth: '1000px',
          backgroundColor: isDark ? 'rgba(13, 34, 62, 0.65)' : '#FFFFFF',
          border: `1.5px solid ${isDark ? 'rgba(56, 189, 248, 0.2)' : '#E2E8F0'}`,
          borderRadius: '18px',
          padding: '24px 28px',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.08)'
        }}>
          <div>
            <div style={{ fontSize: '32px', fontWeight: 900, color: '#38BDF8', letterSpacing: '-0.5px' }}>
              &lt; 150ms
            </div>
            <div style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', fontWeight: 600, marginTop: '2px' }}>
              Touchless Face AI Latency
            </div>
          </div>
          <div>
            <div style={{ fontSize: '32px', fontWeight: 900, color: '#10B981', letterSpacing: '-0.5px' }}>
              100%
            </div>
            <div style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', fontWeight: 600, marginTop: '2px' }}>
              DPDP Act 2023 Compliant
            </div>
          </div>
          <div>
            <div style={{ fontSize: '32px', fontWeight: 900, color: '#F59E0B', letterSpacing: '-0.5px' }}>
              14+
            </div>
            <div style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', fontWeight: 600, marginTop: '2px' }}>
              Integrated Micro-Modules
            </div>
          </div>
          <div>
            <div style={{ fontSize: '32px', fontWeight: 900, color: '#8B5CF6', letterSpacing: '-0.5px' }}>
              0 Proxy
            </div>
            <div style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', fontWeight: 600, marginTop: '2px' }}>
              Anti-Proxy Suraksha Pass
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. INTERACTIVE LIVE ECOSYSTEM TEASER SHOWCASE
          ========================================================================= */}
      <section style={{
        padding: '20px 24px 80px',
        maxWidth: '1160px',
        margin: '0 auto'
      }}>
        <div style={{
          backgroundColor: isDark ? '#0D223E' : '#FFFFFF',
          borderRadius: '24px',
          border: `1.5px solid ${isDark ? 'rgba(21, 94, 239, 0.35)' : '#CBD5E1'}`,
          boxShadow: isDark ? '0 20px 50px rgba(0, 0, 0, 0.4)' : '0 16px 40px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden'
        }}>
          {/* Teaser Tabs Header */}
          <div style={{
            display: 'flex',
            borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0'}`,
            backgroundColor: isDark ? 'rgba(7, 21, 39, 0.7)' : '#F8FAFC',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => setActiveTeaserTab('kiosk')}
              style={{
                flex: 1,
                padding: '16px 20px',
                border: 'none',
                background: activeTeaserTab === 'kiosk'
                  ? (isDark ? '#0D223E' : '#FFFFFF')
                  : 'transparent',
                color: activeTeaserTab === 'kiosk' ? '#155EEF' : (isDark ? '#94A3B8' : '#64748B'),
                fontSize: '13.5px',
                fontWeight: 800,
                cursor: 'pointer',
                borderBottom: activeTeaserTab === 'kiosk' ? '3px solid #155EEF' : '3px solid transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <ScanFace size={16} />
              <span>Face AI Kiosk</span>
            </button>

            <button
              onClick={() => setActiveTeaserTab('parent')}
              style={{
                flex: 1,
                padding: '16px 20px',
                border: 'none',
                background: activeTeaserTab === 'parent'
                  ? (isDark ? '#0D223E' : '#FFFFFF')
                  : 'transparent',
                color: activeTeaserTab === 'parent' ? '#10B981' : (isDark ? '#94A3B8' : '#64748B'),
                fontSize: '13.5px',
                fontWeight: 800,
                cursor: 'pointer',
                borderBottom: activeTeaserTab === 'parent' ? '3px solid #10B981' : '3px solid transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Smartphone size={16} />
              <span>Parent Pulse &amp; Suraksha Pass</span>
            </button>

            <button
              onClick={() => setActiveTeaserTab('ai')}
              style={{
                flex: 1,
                padding: '16px 20px',
                border: 'none',
                background: activeTeaserTab === 'ai'
                  ? (isDark ? '#0D223E' : '#FFFFFF')
                  : 'transparent',
                color: activeTeaserTab === 'ai' ? '#8B5CF6' : (isDark ? '#94A3B8' : '#64748B'),
                fontSize: '13.5px',
                fontWeight: 800,
                cursor: 'pointer',
                borderBottom: activeTeaserTab === 'ai' ? '3px solid #8B5CF6' : '3px solid transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Sparkles size={16} />
              <span>Violet AI Socratic Saathi</span>
            </button>
          </div>

          {/* Teaser Tab Content */}
          <div style={{ padding: '36px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px', alignItems: 'center' }}>
            <div>
              <div style={{
                display: 'inline-block',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 800,
                backgroundColor: 'rgba(56, 189, 248, 0.12)',
                color: '#38BDF8',
                marginBottom: '12px'
              }}>
                {teaserContent[activeTeaserTab].badge}
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 14px', color: isDark ? '#FFFFFF' : '#102A56' }}>
                {teaserContent[activeTeaserTab].title}
              </h2>
              <p style={{ fontSize: '15px', lineHeight: 1.6, color: isDark ? '#CBD5E1' : '#475569', margin: '0 0 20px' }}>
                {teaserContent[activeTeaserTab].desc}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                {teaserContent[activeTeaserTab].stats.map((s, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', fontWeight: 600 }}>
                    <CheckCircle2 size={16} color="#10B981" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  if (activeTeaserTab === 'kiosk') onLaunchPortal('kiosk');
                  else if (activeTeaserTab === 'parent') onLaunchPortal('parent_hub');
                  else onLaunchPortal('aichat');
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #155EEF 0%, #0040C1 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13.5px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(21, 94, 239, 0.35)'
                }}
              >
                <span>Launch This Feature in App</span>
                <ArrowRight size={15} />
              </button>
            </div>

            {/* Simulated Live Terminal / HUD Preview */}
            <div style={{
              backgroundColor: isDark ? '#071527' : '#F1F5F9',
              borderRadius: '16px',
              border: `1.5px solid ${isDark ? 'rgba(56, 189, 248, 0.25)' : '#CBD5E1'}`,
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(148, 163, 184, 0.15)', paddingBottom: '10px' }}>
                <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#38BDF8', fontWeight: 700 }}>
                  LIVE ECOSYSTEM TELEMETRY
                </span>
                <span style={{ fontSize: '10.5px', color: '#10B981', fontWeight: 800 }}>
                  ● CONNECTED 2026
                </span>
              </div>

              <div style={{
                padding: '16px',
                borderRadius: '10px',
                backgroundColor: isDark ? 'rgba(15, 23, 42, 0.8)' : '#FFFFFF',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                fontSize: '13px',
                fontWeight: 700,
                color: isDark ? '#E2E8F0' : '#1E293B',
                lineHeight: 1.5
              }}>
                {teaserContent[activeTeaserTab].previewImg}
              </div>

              <div style={{ fontSize: '11.5px', color: isDark ? '#64748B' : '#94A3B8', lineHeight: 1.4 }}>
                Sovereign Indian Cloud Infrastructure &bull; Neon pgvector Real-time Index &bull; Zero Biometric Leakage
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. 10 POWERFUL FEATURES (One Smart Platform Connecting Child, Parent & Org)
          ========================================================================= */}
      <section id="features" style={{
        padding: '70px 24px 60px',
        maxWidth: '1240px',
        margin: '0 auto',
        borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0'}`
      }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 40px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 14px',
            borderRadius: '999px',
            backgroundColor: 'rgba(21, 94, 239, 0.1)',
            border: `1px solid ${isDark ? 'rgba(56, 189, 248, 0.3)' : 'rgba(21, 94, 239, 0.25)'}`,
            color: isDark ? '#38BDF8' : '#155EEF',
            fontSize: '11.5px',
            fontWeight: 800,
            letterSpacing: '0.6px',
            textTransform: 'uppercase',
            marginBottom: '14px'
          }}>
            <Sparkles size={13} color="#F59E0B" />
            <span>Platform Capabilities &bull; विशेषताएं</span>
          </div>

          <h2 style={{
            fontSize: 'clamp(30px, 4vw, 44px)',
            fontWeight: 900,
            color: isDark ? '#FFFFFF' : '#102A56',
            letterSpacing: '-0.8px',
            margin: '0 0 12px'
          }}>
            Features
          </h2>
          <p style={{
            fontSize: '16.5px',
            lineHeight: 1.6,
            color: isDark ? '#94A3B8' : '#475569',
            margin: 0,
            fontWeight: 600
          }}>
            One smart platform connecting children, parents and educational organization.
          </p>
        </div>

        {/* 10 Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '20px',
          marginBottom: '44px'
        }}>
          {tenFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.number}
                className="eb-feature-card"
                style={{
                  backgroundColor: isDark ? '#0D223E' : '#FFFFFF',
                  borderRadius: '18px',
                  border: `1.5px solid ${feat.borderColor}`,
                  padding: '22px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '14px',
                  boxShadow: isDark
                    ? '0 10px 26px rgba(0, 0, 0, 0.25)'
                    : '0 8px 24px rgba(16, 42, 86, 0.05)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div>
                  {/* Top Bar with Number Badge & Category */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {/* Signature Number Pill */}
                      <div
                        className="eb-pulse-number"
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: feat.color,
                          color: '#FFFFFF',
                          fontSize: '15px',
                          fontWeight: 900,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: `0 0 14px ${feat.color}55`,
                          flexShrink: 0
                        }}
                      >
                        {feat.number}
                      </div>

                      {/* Icon */}
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        backgroundColor: feat.bgGlow,
                        color: feat.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `1px solid ${feat.borderColor}`
                      }}>
                        <Icon size={20} />
                      </div>
                    </div>

                    {/* Tech Badge */}
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      color: feat.color,
                      backgroundColor: feat.bgGlow,
                      padding: '3px 9px',
                      borderRadius: '6px',
                      border: `1px solid ${feat.borderColor}`
                    }}>
                      {feat.badge}
                    </span>
                  </div>

                  {/* Title & Category */}
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 800,
                    margin: '0 0 4px',
                    color: isDark ? '#FFFFFF' : '#102A56',
                    letterSpacing: '-0.2px'
                  }}>
                    {feat.title}
                  </h3>
                  <div style={{
                    fontSize: '11px',
                    color: feat.color,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '10px'
                  }}>
                    {feat.category}
                  </div>

                  {/* Description */}
                  <p style={{
                    fontSize: '13px',
                    lineHeight: 1.55,
                    color: isDark ? '#CBD5E1' : '#475569',
                    margin: '0 0 12px'
                  }}>
                    {feat.desc}
                  </p>

                  {/* Key Operational Impact */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '6px',
                    fontSize: '11.5px',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F8FAFC',
                    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0'}`,
                    color: isDark ? '#94A3B8' : '#64748B',
                    lineHeight: 1.45
                  }}>
                    <Zap size={13} color="#F59E0B" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span><strong>Key Impact:</strong> {feat.impact}</span>
                  </div>
                </div>

                {/* Direct Launch Button */}
                <button
                  onClick={() => onLaunchPortal(feat.targetTab)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '9px 14px',
                    borderRadius: '8px',
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F1F5F9',
                    color: isDark ? '#FFFFFF' : '#102A56',
                    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.12)' : '#CBD5E1'}`,
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = feat.color;
                    e.currentTarget.style.color = '#FFFFFF';
                    e.currentTarget.style.borderColor = feat.color;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.06)' : '#F1F5F9';
                    e.currentTarget.style.color = isDark ? '#FFFFFF' : '#102A56';
                    e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.12)' : '#CBD5E1';
                  }}
                >
                  <span>Launch Live Feature</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            );
          })}
        </div>

        {/* 3 Audience Personas Row (Matching Poster) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px',
          marginBottom: '36px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '16px 20px',
            borderRadius: '16px',
            backgroundColor: isDark ? '#0D223E' : '#FFFFFF',
            border: `1.5px solid ${isDark ? 'rgba(21, 94, 239, 0.35)' : '#CBD5E1'}`,
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: '#155EEF',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              flexShrink: 0
            }}>
              <GraduationCap size={20} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#102A56' }}>
                Students
              </div>
              <div style={{ fontSize: '12px', color: '#38BDF8', fontWeight: 700 }}>
                Learn &amp; Grow
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '16px 20px',
            borderRadius: '16px',
            backgroundColor: isDark ? '#0D223E' : '#FFFFFF',
            border: `1.5px solid ${isDark ? 'rgba(139, 92, 246, 0.35)' : '#CBD5E1'}`,
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: '#8B5CF6',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              flexShrink: 0
            }}>
              <Smartphone size={20} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#102A56' }}>
                Parents
              </div>
              <div style={{ fontSize: '12px', color: '#A78BFA', fontWeight: 700 }}>
                Stay Informed
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '16px 20px',
            borderRadius: '16px',
            backgroundColor: isDark ? '#0D223E' : '#FFFFFF',
            border: `1.5px solid ${isDark ? 'rgba(16, 185, 129, 0.35)' : '#CBD5E1'}`,
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              flexShrink: 0
            }}>
              <School size={20} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#102A56' }}>
                Teachers
              </div>
              <div style={{ fontSize: '12px', color: '#34D399', fontWeight: 700 }}>
                Teach &amp; Support
              </div>
            </div>
          </div>
        </div>

        {/* Impact Mission Banner (Matching Poster Footer) */}
        <div style={{
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #155EEF 0%, #1D4ED8 50%, #4338CA 100%)',
          padding: '28px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          boxShadow: '0 12px 30px rgba(21, 94, 239, 0.35)',
          border: '1.5px solid rgba(254, 240, 138, 0.4)'
        }}>
          <div>
            <div style={{
              fontSize: 'clamp(20px, 3vw, 28px)',
              fontWeight: 900,
              color: '#FFFFFF',
              lineHeight: 1.25,
              margin: '0 0 6px'
            }}>
              Better Communication. <span style={{ color: '#FDE047' }}>Safer Children.</span> Brighter Future.
            </div>
            <div style={{
              fontSize: '13.5px',
              color: '#E0E7FF',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Globe size={15} color="#FDE047" />
              <span>edubandhan.in &bull; One smart platform connecting children, parents and educational organization</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => onLaunchPortal('overview')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '12px',
                backgroundColor: '#FFFFFF',
                color: '#155EEF',
                border: 'none',
                fontSize: '14px',
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              <span>Explore All 10 Features</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. ABOUT US SECTION: The Sacred Bond (दर्शन व संकल्प)
          ========================================================================= */}
      <section id="about" style={{
        padding: '80px 24px',
        maxWidth: '1240px',
        margin: '0 auto',
        borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0'}`
      }}>
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 50px' }}>
          <span style={{
            fontSize: '12px',
            fontWeight: 800,
            color: '#F59E0B',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            display: 'block',
            marginBottom: '8px'
          }}>
            Our Cultural Philosophy &bull; हमारा संकल्प
          </span>
          <h2 style={{ fontSize: '36px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#102A56', margin: '0 0 16px' }}>
            Why EduBandhan?
          </h2>
          <p style={{ fontSize: '16px', lineHeight: 1.6, color: isDark ? '#94A3B8' : '#475569', margin: 0 }}>
            In traditional Indian education, a school is not a transactional business—it is a sacred bond (बंधन) 
            connecting parents, educators, and children in mutual trust, holistic care, and shared responsibility.
          </p>
        </div>

        {/* 3 Pillars of Excellence */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '60px' }}>
          <div style={{
            backgroundColor: isDark ? '#0D223E' : '#FFFFFF',
            borderRadius: '18px',
            border: `1.5px solid ${isDark ? 'rgba(56, 189, 248, 0.15)' : '#E2E8F0'}`,
            padding: '30px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'rgba(2, 132, 199, 0.15)',
              color: '#0284C7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '18px'
            }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: '19px', fontWeight: 800, margin: '0 0 10px', color: isDark ? '#FFFFFF' : '#102A56' }}>
              1. Child Safety &amp; Suraksha
            </h3>
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: isDark ? '#94A3B8' : '#64748B', margin: 0 }}>
              Zero proxy dismissals at school gates. Parents can depute substitute guardians with scannable static QR passes, 
              or trigger an instant Emergency Departure Freeze if they suspect any irregularity.
            </p>
          </div>

          <div style={{
            backgroundColor: isDark ? '#0D223E' : '#FFFFFF',
            borderRadius: '18px',
            border: `1.5px solid ${isDark ? 'rgba(16, 185, 129, 0.15)' : '#E2E8F0'}`,
            padding: '30px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              color: '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '18px'
            }}>
              <Heart size={24} />
            </div>
            <h3 style={{ fontSize: '19px', fontWeight: 800, margin: '0 0 10px', color: isDark ? '#FFFFFF' : '#102A56' }}>
              2. Parental Peace of Mind (विश्वास)
            </h3>
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: isDark ? '#94A3B8' : '#64748B', margin: 0 }}>
              No more lost circulars or surprise fee notices. Transparent itemized digital ledgers with 1-tap UPI QR codes, 
              live bus arrival geofencing, and direct 10-minute encrypted video consultations with teachers.
            </p>
          </div>

          <div style={{
            backgroundColor: isDark ? '#0D223E' : '#FFFFFF',
            borderRadius: '18px',
            border: `1.5px solid ${isDark ? 'rgba(139, 92, 246, 0.15)' : '#E2E8F0'}`,
            padding: '30px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'rgba(139, 92, 246, 0.15)',
              color: '#8B5CF6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '18px'
            }}>
              <Sparkles size={24} />
            </div>
            <h3 style={{ fontSize: '19px', fontWeight: 800, margin: '0 0 10px', color: isDark ? '#FFFFFF' : '#102A56' }}>
              3. Socratic AI &amp; Academic Excellence
            </h3>
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: isDark ? '#94A3B8' : '#64748B', margin: 0 }}>
              AI designed to teach, not cheat. Violet AI Saathi uses Socratic inquiry to guide students through NCERT problems, 
              complemented by a gamified daily Quiz Arena with streak rewards and progress insights.
            </p>
          </div>
        </div>

        {/* Traditional ERPs vs EduBandhan Comparison Table */}
        <div style={{
          backgroundColor: isDark ? '#0D223E' : '#FFFFFF',
          borderRadius: '20px',
          border: `1.5px solid ${isDark ? 'rgba(56, 189, 248, 0.25)' : '#CBD5E1'}`,
          overflow: 'hidden',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{
            padding: '24px 28px',
            backgroundColor: isDark ? 'rgba(7, 21, 39, 0.75)' : '#F8FAFC',
            borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <span style={{
                fontSize: '11px',
                fontWeight: 800,
                color: '#38BDF8',
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
                display: 'block',
                marginBottom: '4px'
              }}>
                Technical Benchmark &bull; तुलना
              </span>
              <h3 style={{ fontSize: '20px', fontWeight: 900, margin: 0, color: isDark ? '#FFFFFF' : '#102A56' }}>
                Traditional School ERPs vs. The EduBandhan Smart Platform
              </h3>
            </div>
            <span style={{
              fontSize: '12px',
              padding: '4px 12px',
              borderRadius: '999px',
              backgroundColor: 'rgba(16, 185, 129, 0.14)',
              color: '#10B981',
              fontWeight: 800,
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              ✓ 2026 Sovereign Architecture
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0'}`, backgroundColor: isDark ? 'rgba(15, 23, 42, 0.4)' : '#F1F5F9' }}>
                  <th style={{ padding: '16px 24px', color: isDark ? '#94A3B8' : '#64748B', fontWeight: 700, width: '25%' }}>Capability</th>
                  <th style={{ padding: '16px 24px', color: '#EF4444', fontWeight: 800, width: '37.5%' }}>Traditional School ERPs</th>
                  <th style={{ padding: '16px 24px', color: '#10B981', fontWeight: 800, width: '37.5%' }}>EduBandhan Smart Platform</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9'}` }}>
                  <td style={{ padding: '14px 24px', fontWeight: 700 }}>Attendance Verification</td>
                  <td style={{ padding: '14px 24px', color: isDark ? '#94A3B8' : '#64748B' }}>Slow manual roll calls or proxy-prone paper registers (20-min daily teacher time loss)</td>
                  <td style={{ padding: '14px 24px', color: '#10B981', fontWeight: 700 }}>Touchless Face AI in &lt; 150ms with mathematical pgvector embeddings &bull; Zero proxy</td>
                </tr>
                <tr style={{ borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9'}` }}>
                  <td style={{ padding: '14px 24px', fontWeight: 700 }}>Gate Pickup &amp; Child Safety</td>
                  <td style={{ padding: '14px 24px', color: isDark ? '#94A3B8' : '#64748B' }}>Unregulated gate dismissal with zero biometric audit trails or stranger verification</td>
                  <td style={{ padding: '14px 24px', color: '#10B981', fontWeight: 700 }}>EduBandhan Suraksha Pass: Static QR substitute passes &amp; 1-tap Emergency Child Freeze</td>
                </tr>
                <tr style={{ borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9'}` }}>
                  <td style={{ padding: '14px 24px', fontWeight: 700 }}>AI Pedagogical Mentorship</td>
                  <td style={{ padding: '14px 24px', color: isDark ? '#94A3B8' : '#64748B' }}>Zero AI integration; static downloadable PDF documents and homework sheets</td>
                  <td style={{ padding: '14px 24px', color: '#10B981', fontWeight: 700 }}>Violet AI Saathi (Groq Qwen 27B Socratic tutoring for kids + parenting coaching)</td>
                </tr>
                <tr style={{ borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9'}` }}>
                  <td style={{ padding: '14px 24px', fontWeight: 700 }}>Real-Time Communication</td>
                  <td style={{ padding: '14px 24px', color: isDark ? '#94A3B8' : '#64748B' }}>Batch SMS blasts with carrier delays and no instant feedback</td>
                  <td style={{ padding: '14px 24px', color: '#10B981', fontWeight: 700 }}>Sub-50ms WebSocket classroom sockets &amp; instant WhatsApp push notifications</td>
                </tr>
                <tr style={{ borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9'}` }}>
                  <td style={{ padding: '14px 24px', fontWeight: 700 }}>Data Privacy &amp; Biometrics</td>
                  <td style={{ padding: '14px 24px', color: isDark ? '#94A3B8' : '#64748B' }}>Unencrypted photo galleries on shared hosting; vulnerable to DPDP liabilities</td>
                  <td style={{ padding: '14px 24px', color: '#10B981', fontWeight: 700 }}>100% DPDP Act 2023 compliant &bull; 512-dim pgvector float math; zero raw photos stored</td>
                </tr>
                <tr style={{ borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9'}` }}>
                  <td style={{ padding: '14px 24px', fontWeight: 700 }}>Fee Collections &amp; Banking</td>
                  <td style={{ padding: '14px 24px', color: isDark ? '#94A3B8' : '#64748B' }}>Clunky payment gateway redirects with frequent drop-offs &amp; 3-day bank settlements</td>
                  <td style={{ padding: '14px 24px', color: '#10B981', fontWeight: 700 }}>1-Tap dynamic UPI QR code generator with instant GST receipt &amp; automated ledger</td>
                </tr>
                <tr style={{ borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9'}` }}>
                  <td style={{ padding: '14px 24px', fontWeight: 700 }}>Leave &amp; Medical Absence</td>
                  <td style={{ padding: '14px 24px', color: isDark ? '#94A3B8' : '#64748B' }}>Lost physical paper sick notes, manual diary signatures, and unlinked attendance</td>
                  <td style={{ padding: '14px 24px', color: '#10B981', fontWeight: 700 }}>Digital prescription uploads, dual-tier teacher/principal approvals, auto-roster sync</td>
                </tr>
                <tr>
                  <td style={{ padding: '14px 24px', fontWeight: 700 }}>Platform Speed &amp; Architecture</td>
                  <td style={{ padding: '14px 24px', color: isDark ? '#94A3B8' : '#64748B' }}>Monolithic legacy PHP/ASP.NET backend with slow, bloated mobile webviews</td>
                  <td style={{ padding: '14px 24px', color: '#10B981', fontWeight: 700 }}>Modern React 19 SPA + Python ASGI FastAPI + Neon pgvector &bull; Sub-50ms TTFB</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. SERVICES SECTION: Institutional Transformation
          ========================================================================= */}
      <section id="services" style={{
        padding: '80px 24px',
        maxWidth: '1240px',
        margin: '0 auto',
        borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0'}`
      }}>
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 50px' }}>
          <span style={{
            fontSize: '12px',
            fontWeight: 800,
            color: '#38BDF8',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            display: 'block',
            marginBottom: '8px'
          }}>
            Institutional Services &bull; सेवाएं
          </span>
          <h2 style={{ fontSize: '36px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#102A56', margin: '0 0 16px' }}>
            Comprehensive Solutions for Modern Campuses
          </h2>
          <p style={{ fontSize: '16px', lineHeight: 1.6, color: isDark ? '#94A3B8' : '#475569', margin: 0 }}>
            End-to-end digitization engineered specifically for Indian K-12 schools, CBSE/ICSE colleges, and competitive coaching hubs.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          {services.map((svc, idx) => {
            const Icon = svc.icon;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: isDark ? '#0D223E' : '#FFFFFF',
                  borderRadius: '18px',
                  border: `1.5px solid ${isDark ? 'rgba(56, 189, 248, 0.15)' : '#E2E8F0'}`,
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#155EEF';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = isDark ? 'rgba(56, 189, 248, 0.15)' : '#E2E8F0';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(21, 94, 239, 0.14)',
                    color: '#155EEF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={22} />
                  </div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '999px',
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9',
                    color: isDark ? '#94A3B8' : '#64748B'
                  }}>
                    {svc.tag}
                  </span>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: isDark ? '#FFFFFF' : '#102A56' }}>
                  {svc.title}
                </h3>
                <p style={{ fontSize: '14px', lineHeight: 1.6, color: isDark ? '#94A3B8' : '#64748B', margin: 0 }}>
                  {svc.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          6. FLAGSHIP PRODUCTS SUITE (All Products with direct launch buttons)
          ========================================================================= */}
      <section id="products" style={{
        padding: '80px 24px',
        maxWidth: '1240px',
        margin: '0 auto',
        borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0'}`
      }}>
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 50px' }}>
          <span style={{
            fontSize: '12px',
            fontWeight: 800,
            color: '#10B981',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            display: 'block',
            marginBottom: '8px'
          }}>
            Our Products Suite &bull; उत्पाद
          </span>
          <h2 style={{ fontSize: '36px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#102A56', margin: '0 0 16px' }}>
            Built for Students, Parents, Faculty &amp; Administrators
          </h2>
          <p style={{ fontSize: '16px', lineHeight: 1.6, color: isDark ? '#94A3B8' : '#475569', margin: 0 }}>
            Every product connects natively into the unified EduBandhan database. Click <strong>"Launch Product"</strong> on any card to test the live feature!
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          {products.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                style={{
                  backgroundColor: isDark ? '#0D223E' : '#FFFFFF',
                  borderRadius: '20px',
                  border: `1.5px solid ${p.borderColor}`,
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '18px',
                  boxShadow: '0 10px 28px rgba(0, 0, 0, 0.05)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: p.bgGlow,
                      color: p.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Icon size={24} />
                    </div>

                    <span style={{
                      fontSize: '11px',
                      fontFamily: 'monospace',
                      color: p.color,
                      fontWeight: 800,
                      backgroundColor: p.bgGlow,
                      padding: '3px 8px',
                      borderRadius: '6px'
                    }}>
                      {p.subtitle.split('•')[0].trim()}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 6px', color: isDark ? '#FFFFFF' : '#102A56' }}>
                    {p.title}
                  </h3>
                  <div style={{ fontSize: '12px', color: p.color, fontWeight: 700, marginBottom: '12px' }}>
                    {p.subtitle}
                  </div>
                  <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: isDark ? '#CBD5E1' : '#475569', margin: '0 0 16px' }}>
                    {p.desc}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                    {p.highlights.map((h, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '11px',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F1F5F9',
                          color: isDark ? '#94A3B8' : '#64748B',
                          fontWeight: 600
                        }}
                      >
                        ✓ {h}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Direct Launch Button */}
                <button
                  onClick={() => onLaunchPortal(p.targetTab)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    backgroundColor: p.bgGlow,
                    color: p.color,
                    border: `1.5px solid ${p.color}`,
                    fontSize: '13.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = p.color;
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = p.bgGlow;
                    e.currentTarget.style.color = p.color;
                  }}
                >
                  <span>Launch This Product</span>
                  <ExternalLink size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          7. DPDP ACT 2023 & SECURITY VAULT SECTION
          ========================================================================= */}
      <section id="security" style={{
        padding: '80px 24px',
        maxWidth: '1240px',
        margin: '0 auto',
        borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0'}`
      }}>
        <div style={{
          backgroundColor: isDark ? '#0D223E' : '#FFFFFF',
          borderRadius: '24px',
          border: '2px solid rgba(16, 185, 129, 0.35)',
          padding: '48px',
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '40px',
          alignItems: 'center',
          boxShadow: '0 20px 50px rgba(16, 185, 129, 0.08)'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '999px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              color: '#10B981',
              fontSize: '12px',
              fontWeight: 800,
              marginBottom: '16px'
            }}>
              <ShieldCheck size={16} />
              <span>STATUTORY COMPLIANCE • भारत सरकार</span>
            </div>

            <h2 style={{ fontSize: '32px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#102A56', margin: '0 0 16px' }}>
              Built from Ground Up for the Digital Personal Data Protection (DPDP) Act 2023
            </h2>

            <p style={{ fontSize: '15px', lineHeight: 1.6, color: isDark ? '#CBD5E1' : '#475569', margin: '0 0 24px' }}>
              Unlike legacy systems that upload raw student photographs to vulnerable clouds, EduBandhan operates with mathematical vector embeddings. 
              The camera feed is processed in-memory at the kiosk; vectors are indexed via PostgreSQL pgvector, and raw pictures are discarded immediately.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: isDark ? '#071527' : '#F8FAFC', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <strong style={{ fontSize: '13.5px', color: '#10B981', display: 'block' }}>Zero Raw Face Photos</strong>
                <span style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B' }}>512-dim pgvector float math only</span>
              </div>
              <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: isDark ? '#071527' : '#F8FAFC', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <strong style={{ fontSize: '13.5px', color: '#10B981', display: 'block' }}>Indian Sovereign Hosting</strong>
                <span style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B' }}>Strict in-country residency</span>
              </div>
              <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: isDark ? '#071527' : '#F8FAFC', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <strong style={{ fontSize: '13.5px', color: '#10B981', display: 'block' }}>Parent Consent Ledger</strong>
                <span style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B' }}>Explicit OTP authorization</span>
              </div>
              <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: isDark ? '#071527' : '#F8FAFC', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <strong style={{ fontSize: '13.5px', color: '#10B981', display: 'block' }}>Role-Segregated JWT</strong>
                <span style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B' }}>Super, Admin, Teacher, Parent</span>
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: isDark ? '#071527' : '#F1F5F9',
            borderRadius: '18px',
            border: `1.5px solid ${isDark ? 'rgba(56, 189, 248, 0.2)' : '#CBD5E1'}`,
            padding: '30px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              color: '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto'
            }}>
              <Lock size={30} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: isDark ? '#FFFFFF' : '#102A56' }}>
              Institutional Data Vault
            </h3>
            <p style={{ fontSize: '13.5px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.5, margin: 0 }}>
              EduBandhan protects your school against punitive statutory liabilities while guaranteeing parents that their child’s privacy is safeguarded.
            </p>
            <div style={{
              padding: '12px',
              borderRadius: '10px',
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
              border: '1px dashed #10B981',
              fontSize: '12px',
              fontWeight: 700,
              color: '#10B981'
            }}>
              ✓ ISO 27001 &amp; DPDP 2023 Architecture Readiness
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. CONTACT & INSTITUTIONAL DEMO REQUEST SECTION
          ========================================================================= */}
      <section id="contact" style={{
        padding: '80px 24px',
        maxWidth: '1240px',
        margin: '0 auto',
        borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0'}`
      }}>
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 50px' }}>
          <span style={{
            fontSize: '12px',
            fontWeight: 800,
            color: '#F59E0B',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            display: 'block',
            marginBottom: '8px'
          }}>
            Get In Touch &bull; संपर्क
          </span>
          <h2 style={{ fontSize: '36px', fontWeight: 900, color: isDark ? '#FFFFFF' : '#102A56', margin: '0 0 16px' }}>
            Transform Your Campus with EduBandhan
          </h2>
          <p style={{ fontSize: '16px', lineHeight: 1.6, color: isDark ? '#94A3B8' : '#475569', margin: 0 }}>
            Request a personalized walkthrough, get hardware kiosk specs, or speak with our educational technology architects.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '36px', alignItems: 'start' }}>
          {/* Inquiry Form */}
          <div style={{
            backgroundColor: isDark ? '#0D223E' : '#FFFFFF',
            borderRadius: '20px',
            border: `1.5px solid ${isDark ? 'rgba(56, 189, 248, 0.2)' : '#CBD5E1'}`,
            padding: '36px',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.05)'
          }}>
            {contactSubmitted ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: '#10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}>
                  <Check size={32} />
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#102A56', marginBottom: '10px' }}>
                  Walkthrough Request Received!
                </h3>
                <p style={{ fontSize: '14.5px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.6, maxWidth: '440px', margin: '0 auto 24px' }}>
                  Thank you, <strong>{formData.contactPerson}</strong>. Our institutional implementation team will contact you at <strong>{formData.phone}</strong> within 4 business hours.
                </p>
                <button
                  onClick={() => onLaunchPortal('overview')}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #155EEF 0%, #0040C1 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Meanwhile, Explore Live Portal
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 4px', color: isDark ? '#FFFFFF' : '#102A56' }}>
                  Schedule Institutional Consultation
                </h3>
                <span style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', marginBottom: '8px' }}>
                  Fill in your campus details for priority onboarding.
                </span>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      Institution Name <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="institutionName"
                      required
                      value={formData.institutionName}
                      onChange={handleInputChange}
                      placeholder="e.g. Delhi Public School"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: `1.5px solid ${isDark ? 'rgba(255, 255, 255, 0.15)' : '#CBD5E1'}`,
                        backgroundColor: isDark ? '#071527' : '#FFFFFF',
                        color: isDark ? '#FFFFFF' : '#102A56',
                        fontSize: '13.5px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      Contact Person &amp; Role <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      required
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      placeholder="Dr. Sunita Sharma (Principal)"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: `1.5px solid ${isDark ? 'rgba(255, 255, 255, 0.15)' : '#CBD5E1'}`,
                        backgroundColor: isDark ? '#071527' : '#FFFFFF',
                        color: isDark ? '#FFFFFF' : '#102A56',
                        fontSize: '13.5px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      Mobile / WhatsApp <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: `1.5px solid ${isDark ? 'rgba(255, 255, 255, 0.15)' : '#CBD5E1'}`,
                        backgroundColor: isDark ? '#071527' : '#FFFFFF',
                        color: isDark ? '#FFFFFF' : '#102A56',
                        fontSize: '13.5px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      Official Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="principal@dpscampus.edu.in"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: `1.5px solid ${isDark ? 'rgba(255, 255, 255, 0.15)' : '#CBD5E1'}`,
                        backgroundColor: isDark ? '#071527' : '#FFFFFF',
                        color: isDark ? '#FFFFFF' : '#102A56',
                        fontSize: '13.5px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      Institution Category
                    </label>
                    <select
                      name="institutionType"
                      value={formData.institutionType}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: `1.5px solid ${isDark ? 'rgba(255, 255, 255, 0.15)' : '#CBD5E1'}`,
                        backgroundColor: isDark ? '#071527' : '#FFFFFF',
                        color: isDark ? '#FFFFFF' : '#102A56',
                        fontSize: '13.5px',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option>K-12 School (CBSE / ICSE / State)</option>
                      <option>Junior &amp; Degree College</option>
                      <option>Competitive Coaching Hub (JEE/NEET)</option>
                      <option>Multi-Branch Educational Trust</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      Student Strength
                    </label>
                    <select
                      name="studentCount"
                      value={formData.studentCount}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: `1.5px solid ${isDark ? 'rgba(255, 255, 255, 0.15)' : '#CBD5E1'}`,
                        backgroundColor: isDark ? '#071527' : '#FFFFFF',
                        color: isDark ? '#FFFFFF' : '#102A56',
                        fontSize: '13.5px',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option>Under 500 Students</option>
                      <option>500 - 2,000 Students</option>
                      <option>2,000 - 5,000 Students</option>
                      <option>5,000+ Students (Enterprise)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Specific Inquiries or Requirements
                  </label>
                  <textarea
                    name="message"
                    rows="3"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us about your campus setup, entry gates, or AI goals..."
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: `1.5px solid ${isDark ? 'rgba(255, 255, 255, 0.15)' : '#CBD5E1'}`,
                      backgroundColor: isDark ? '#071527' : '#FFFFFF',
                      color: isDark ? '#FFFFFF' : '#102A56',
                      fontSize: '13.5px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '14px 20px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #155EEF 0%, #0040C1 100%)',
                    color: '#FFFFFF',
                    border: '1.5px solid rgba(245, 158, 11, 0.4)',
                    fontSize: '14.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(21, 94, 239, 0.35)',
                    marginTop: '8px'
                  }}
                >
                  <Send size={16} />
                  <span>Submit Walkthrough Request</span>
                </button>
              </form>
            )}
          </div>

          {/* Contact Details & Direct Channels */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{
              backgroundColor: isDark ? '#0D223E' : '#FFFFFF',
              borderRadius: '20px',
              border: `1.5px solid ${isDark ? 'rgba(56, 189, 248, 0.2)' : '#CBD5E1'}`,
              padding: '30px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: isDark ? '#FFFFFF' : '#102A56' }}>
                Corporate Headquarters &amp; Support
              </h3>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <MapPin size={20} color="#38BDF8" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ fontSize: '14px', display: 'block', color: isDark ? '#FFFFFF' : '#102A56' }}>
                    Technology &amp; Operations Center
                  </strong>
                  <span style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B' }}>
                    EduBandhan Campus Innovation Hub &bull; Bhubaneswar, Odisha, India
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <Phone size={20} color="#10B981" style={{ flexShrink: 0 }} />
                <div>
                  <strong style={{ fontSize: '14px', display: 'block', color: isDark ? '#FFFFFF' : '#102A56' }}>
                    Institutional Helpline
                  </strong>
                  <span style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B' }}>
                    <a href="tel:+919078200899" style={{ color: '#10B981', textDecoration: 'none', fontWeight: 700 }}>
                      +91 90782 00899
                    </a>{' '}
                    (Mon - Fri, 10:00 AM - 07:00 PM IST)
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <Mail size={20} color="#F59E0B" style={{ flexShrink: 0 }} />
                <div>
                  <strong style={{ fontSize: '14px', display: 'block', color: isDark ? '#FFFFFF' : '#102A56' }}>
                    Official Inquiries
                  </strong>
                  <span style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B' }}>
                    <a href="mailto:edubandhan@gmail.com" style={{ color: '#F59E0B', textDecoration: 'none', fontWeight: 700 }}>
                      edubandhan@gmail.com
                    </a>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Instant Access Box */}
            <div style={{
              backgroundColor: isDark ? '#071527' : '#F8FAFC',
              borderRadius: '16px',
              border: '1.5px dashed rgba(21, 94, 239, 0.4)',
              padding: '24px',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '12px', color: '#38BDF8', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                Instant Live Sandbox
              </span>
              <h4 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 10px', color: isDark ? '#FFFFFF' : '#102A56' }}>
                Want to test the platform right now?
              </h4>
              <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.5, margin: '0 0 16px' }}>
                No signup required to explore! Launch the guest sandbox to experience Kiosks, Fee Ledgers, Quiz Arena, and AI Saathi.
              </p>
              <button
                onClick={() => onLaunchPortal('overview')}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #155EEF 0%, #0040C1 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Launch Guest Explorer ➔
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. CORPORATE FOOTER
          ========================================================================= */}
      <footer style={{
        backgroundColor: isDark ? '#050E1A' : '#0B192C',
        color: '#94A3B8',
        padding: '50px 24px 30px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '36px',
          marginBottom: '40px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                overflow: 'hidden',
                background: '#071527',
                border: '1.5px solid rgba(245, 158, 11, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(21, 94, 239, 0.4)',
                flexShrink: 0
              }}>
                <img
                  src="/edubandhan_logo_dark.jpg"
                  alt="EduBandhan Official Logo"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/web_app/edubandhan/assets/edubandhan_logo_dark.jpg';
                  }}
                />
              </div>
              <span style={{ fontSize: '18px', fontWeight: 900, color: '#FFFFFF' }}>
                EduBandhan
              </span>
            </div>
            <p style={{ fontSize: '13px', lineHeight: 1.6, margin: '0 0 16px', color: '#94A3B8' }}>
              The Sacred Bond Connecting Child, Parent &amp; Educational Organization with uncompromised trust, biometric edge verification, and sovereign data privacy.
            </p>
            <span style={{ fontSize: '11.5px', color: '#F59E0B', fontWeight: 700 }}>
              एडूबंधन &bull; निष्ठा, सुरक्षा व प्रगति
            </span>
          </div>

          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 16px' }}>
              Flagship Products
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <span style={{ cursor: 'pointer' }} onClick={() => onLaunchPortal('kiosk')}>Face AI Attendance Kiosk</span>
              <span style={{ cursor: 'pointer' }} onClick={() => onLaunchPortal('parent_hub')}>Parent Mobile Pulse HUD</span>
              <span style={{ cursor: 'pointer' }} onClick={() => onLaunchPortal('aichat')}>Violet AI Saathi Mentor</span>
              <span style={{ cursor: 'pointer' }} onClick={() => onLaunchPortal('quiz')}>NCERT Quiz Arena</span>
              <span style={{ cursor: 'pointer' }} onClick={() => onLaunchPortal('fees')}>Itemized Fee Ledger</span>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 16px' }}>
              Ecosystem Navigation
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <a href="#about" style={{ color: '#94A3B8', textDecoration: 'none' }}>About EduBandhan</a>
              <a href="#services" style={{ color: '#94A3B8', textDecoration: 'none' }}>Campus Services</a>
              <a href="#products" style={{ color: '#94A3B8', textDecoration: 'none' }}>Products Suite</a>
              <a href="#security" style={{ color: '#94A3B8', textDecoration: 'none' }}>DPDP Act 2023 Shield</a>
              <a href="#contact" style={{ color: '#94A3B8', textDecoration: 'none' }}>Book Campus Walkthrough</a>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 16px' }}>
              Direct Access
            </h4>
            <p style={{ fontSize: '12.5px', lineHeight: 1.5, margin: '0 0 14px' }}>
              Ready to jump into the administration portal or parent dashboard?
            </p>
            <button
              onClick={() => onLaunchPortal('overview')}
              style={{
                width: '100%',
                padding: '10px 16px',
                borderRadius: '8px',
                backgroundColor: '#155EEF',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              Open Full Portal ➔
            </button>
          </div>
        </div>

        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '12px'
        }}>
          <div>
            &copy; 2026 EduBandhan (एडूबंधन) Ecosystem. All rights reserved. Made with pride in India 🇮🇳.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>DPDP Act 2023 Compliant</span>
            <span>&bull;</span>
            <span>Neon pgvector Sovereign Hosting</span>
            <span>&bull;</span>
            <span>Zero Raw Biometric Storage</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
