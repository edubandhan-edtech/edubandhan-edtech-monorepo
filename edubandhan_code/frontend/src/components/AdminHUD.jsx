import React, { useState } from 'react';
import {
  Users,
  ScanFace,
  CreditCard,
  CalendarOff,
  TrendingUp,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Sparkles,
  Radio,
  FileText,
  Filter,
  Eye,
  ShieldCheck,
  Megaphone,
  Plus,
  Network
} from 'lucide-react';
import NoticeBoardHub from './NoticeBoardHub';
import PublishNoticeModal from './PublishNoticeModal';

export default function AdminHUD({ onSwitchTab, onRequireAuth, currentUser }) {
  const [activeRange, setActiveRange] = useState('week'); // 'week' | 'month'
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  const metrics = [
    {
      title: "Total Students",
      value: "1,248",
      sub: "+12 this week",
      trend: "up",
      color: "#1677FF", // Blue: Platform metric
      bg: "rgba(22, 119, 255, 0.08)",
      icon: Users
    },
    {
      title: "Attendance Rate",
      value: "94.8%",
      sub: "+2.4% vs last week",
      trend: "up",
      color: "#18B981", // Mint: Success metric
      bg: "rgba(24, 185, 129, 0.08)",
      icon: CheckCircle2
    },
    {
      title: "Pending Fees",
      value: "₹2,48,500",
      sub: "12 students overdue",
      trend: "warn",
      color: "#F59E0B", // Amber: Pending metric
      bg: "rgba(245, 158, 11, 0.08)",
      icon: CreditCard
    },
    {
      title: "Pending Leaves",
      value: "8",
      sub: "-3 from yesterday",
      trend: "down",
      color: "#EF5350", // Red: Action required
      bg: "rgba(239, 83, 80, 0.08)",
      icon: CalendarOff
    }
  ];

  const quickActions = [
    {
      id: 'kiosk',
      title: 'Mark Attendance',
      sub: 'Face Recognition Kiosk',
      icon: ScanFace,
      color: '#1677FF'
    },
    {
      id: 'fees',
      title: 'Manage Fees',
      sub: 'View & Collect Ledger',
      icon: CreditCard,
      color: '#1677FF'
    },
    {
      id: 'sockets',
      title: 'Send Notice',
      sub: 'Broadcast to Parents',
      icon: Radio,
      color: '#1677FF'
    },
    {
      id: 'aichat',
      title: 'AI Mentor',
      sub: 'Ask & Support Co-Pilot',
      icon: Sparkles,
      color: '#6C4CE8',
      isAi: true
    }
  ];

  const recentActivities = [
    {
      id: 1,
      title: "Rahul Sharma marked attendance",
      detail: "Gate Kiosk #1 • 08:12 AM",
      time: "Today, 08:12 AM",
      type: "success",
      badgeColor: "#18B981"
    },
    {
      id: 2,
      title: "Fee payment received: ₹2,500",
      detail: "Rohan Mehta (Class 8-A) • Instant UPI",
      time: "Today, 09:24 AM",
      type: "payment",
      badgeColor: "#1677FF"
    },
    {
      id: 3,
      title: "New leave request submitted",
      detail: "Aditi Singh (Class 5) • 2 Days Medical",
      time: "Today, 10:02 AM",
      type: "pending",
      badgeColor: "#F59E0B"
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Page Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 800,
            color: 'var(--text-main)',
            margin: '0 0 4px',
            letterSpacing: '-0.3px'
          }}>
            Dashboard
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
            Good morning, Rahul! Here's what's happening at your school today.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => onSwitchTab('organization')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              backgroundColor: 'rgba(21, 94, 239, 0.08)',
              border: '1px solid rgba(21, 94, 239, 0.25)',
              borderRadius: '8px',
              color: 'var(--brand-blue)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Network size={15} />
            <span>Org Hierarchy Tree</span>
          </button>

          <button
            onClick={() => onSwitchTab('management')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              color: 'var(--text-main)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Users size={15} color="var(--text-muted)" />
            <span>Manage Students</span>
          </button>

          <button
            onClick={() => onSwitchTab('kiosk')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              backgroundColor: '#1677FF',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <ScanFace size={15} />
            <span>Open Gate Kiosk</span>
          </button>

          <button
            onClick={() => {
              if (!currentUser && onRequireAuth) {
                onRequireAuth({ id: 'admin', title: 'Publish Official Notice' });
                return;
              }
              setIsPublishModalOpen(true);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)'
            }}
          >
            <Megaphone size={15} />
            <span>Publish Notice</span>
          </button>
        </div>
      </div>

      {/* 1. Four Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px'
      }}>
        {metrics.map((m, idx) => {
          const IconComp = m.icon;
          return (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  {m.title}
                </span>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: m.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <IconComp size={18} color={m.color} />
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: '28px',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.5px'
                }}>
                  {m.value}
                </div>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: m.color,
                  marginTop: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span>{m.sub}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Quick Actions Row */}
      <div>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 12px' }}>
          Quick Actions
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px'
        }}>
          {quickActions.map(action => {
            const IconComponent = action.icon;
            return (
              <div
                key={action.id}
                onClick={() => {
                  if (action.id === 'sockets') {
                    setIsPublishModalOpen(true);
                  } else {
                    onSwitchTab(action.id);
                  }
                }}
                style={{
                  backgroundColor: action.isAi ? 'var(--ai-bg-subtle, rgba(108, 76, 232, 0.12))' : 'var(--bg-surface)',
                  border: `1px solid ${action.isAi ? 'var(--ai-border, rgba(108, 76, 232, 0.3))' : 'var(--border-subtle)'}`,
                  borderRadius: '12px',
                  padding: '16px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  boxShadow: 'var(--shadow-sm)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-card-hover, 0 6px 16px rgba(0, 0, 0, 0.12))';
                  e.currentTarget.style.borderColor = action.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  e.currentTarget.style.borderColor = action.isAi ? 'var(--ai-border, rgba(108, 76, 232, 0.3))' : 'var(--border-subtle)';
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: action.isAi ? 'rgba(108, 76, 232, 0.2)' : 'rgba(22, 119, 255, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <IconComponent size={20} color={action.color} />
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                    {action.title}
                  </h4>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                    {action.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Main Dashboard Body: Chart + Recent Activities + AI Mentor */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: '20px'
      }}>

        {/* Left Column: Attendance Overview Chart */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          padding: '22px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                Attendance Overview
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Daily student attendance rates across all grades
              </p>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => setActiveRange('week')}
                style={{
                  padding: '4px 10px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: activeRange === 'week' ? '#1677FF' : 'var(--bg-secondary)',
                  color: activeRange === 'week' ? '#FFFFFF' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                This Week
              </button>
              <button
                onClick={() => setActiveRange('month')}
                style={{
                  padding: '4px 10px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: activeRange === 'month' ? '#1677FF' : 'var(--bg-secondary)',
                  color: activeRange === 'month' ? '#FFFFFF' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                Last Week
              </button>
            </div>
          </div>

          {/* Clean SVG Trend Chart */}
          <div style={{ width: '100%', height: '200px', position: 'relative', marginTop: '10px' }}>
            <svg viewBox="0 0 500 180" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              {/* Grid Lines */}
              <line x1="0" y1="20" x2="500" y2="20" stroke="var(--border-subtle, rgba(226, 232, 240, 0.15))" strokeWidth="1" />
              <line x1="0" y1="60" x2="500" y2="60" stroke="var(--border-subtle, rgba(226, 232, 240, 0.15))" strokeWidth="1" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="var(--border-subtle, rgba(226, 232, 240, 0.15))" strokeWidth="1" />
              <line x1="0" y1="140" x2="500" y2="140" stroke="var(--border-subtle, rgba(226, 232, 240, 0.15))" strokeWidth="1" />

              {/* Last week line (dashed grey) */}
              <path
                d="M 30,120 Q 100,105 180,110 T 330,85 T 470,90"
                fill="none"
                stroke="#CBD5E1"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Current week line (Solid Blue #1677FF) */}
              <path
                d="M 30,110 Q 100,85 180,70 T 330,55 T 470,40"
                fill="none"
                stroke="#1677FF"
                strokeWidth="3.5"
              />

              {/* Data points */}
              {[[30, 110], [105, 85], [180, 70], [255, 65], [330, 55], [405, 48], [470, 40]].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="4.5" fill="var(--bg-surface)" stroke="#1677FF" strokeWidth="2.5" />
              ))}

              {/* X Axis Labels */}
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                <text key={day} x={30 + i * 73} y="170" fontSize="11" fill="var(--text-muted)" textAnchor="middle" fontWeight="500">
                  {day}
                </text>
              ))}
            </svg>
          </div>

          <div style={{ display: 'flex', gap: '20px', fontSize: '12px', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '3px', backgroundColor: '#1677FF', borderRadius: '2px' }}></span>
              <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>This Week (Avg 94.8%)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '3px', backgroundColor: '#CBD5E1', borderRadius: '2px' }}></span>
              <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Last Week (Avg 92.4%)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activities + AI Mentor Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Recent Activities Card */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                Recent Activities
              </h3>
              <button
                onClick={() => onSwitchTab('sockets')}
                style={{
                  fontSize: '12px',
                  color: '#1677FF',
                  fontWeight: 600,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                View all &rarr;
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentActivities.map(act => (
                <div key={act.id} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '10px 12px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: act.badgeColor,
                    marginTop: '6px',
                    flexShrink: 0
                  }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
                      {act.title}
                    </p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                      {act.detail}
                    </p>
                  </div>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
                    {act.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Mentor Promo Card (Violet Brand Moment) */}
          <div style={{
            backgroundColor: 'var(--ai-bg-subtle, rgba(108, 76, 232, 0.12))',
            border: '1.5px solid var(--ai-border, rgba(108, 76, 232, 0.25))',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <Sparkles size={16} color="var(--accent-purple, #8B5CF6)" />
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--accent-purple, #8B5CF6)', margin: 0 }}>
                  EduBandhan AI Mentor
                </h4>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-main)', margin: '0 0 12px', maxWidth: '280px', lineHeight: 1.4 }}>
                Your 24/7 AI pedagogical assistant for students, faculty lesson planning and parent questions.
              </p>
              <button
                onClick={() => onSwitchTab('aichat')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  backgroundColor: '#6C4CE8',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '7px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <span>Chat Now</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(108, 76, 232, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              flexShrink: 0
            }}>
              🤖
            </div>
          </div>

        </div>
      </div>

      {/* 4. Notice Board Management Hub (Public & Private Notices) */}
      <NoticeBoardHub
        currentUser={currentUser}
        activeRole="admin"
        onRequireAuth={onRequireAuth}
      />

      {/* Publish Notice Modal */}
      <PublishNoticeModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        currentUser={currentUser}
        activeRole="admin"
      />

    </div>
  );
}
