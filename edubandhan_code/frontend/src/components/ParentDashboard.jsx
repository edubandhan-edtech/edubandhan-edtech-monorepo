import React from 'react';
import {
  CheckCircle2,
  CreditCard,
  CalendarOff,
  Video,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Clock,
  FileText,
  Bell,
  Award,
  BookOpen,
  ChevronRight,
  Megaphone,
  CalendarCheck
} from 'lucide-react';
import NoticeBoardHub from './NoticeBoardHub';

export default function ParentDashboard({ onSwitchTab, onRequireAuth, currentUser }) {
  const childInfo = {
    name: currentUser?.child_name || "Aarav Sharma",
    grade: currentUser?.child_class || "Class 8 - Section B",
    school: currentUser?.school_name || "Delhi Public School",
    rollNo: currentUser?.child_roll || "2",
    avatar: (currentUser?.child_name || "Aarav")[0].toUpperCase()
  };

  const latestUpdates = [
    {
      id: 1,
      title: "New circular from school",
      desc: "Exam schedule for Class 5 Term-2 final exams announced.",
      time: "Today, 09:15 AM",
      icon: FileText,
      badgeColor: "#1677FF"
    },
    {
      id: 2,
      title: "Fee payment reminder",
      desc: "₹2,500 due in 4 days (Tuition & STEM lab fee).",
      time: "Today, 09:42 AM",
      icon: CreditCard,
      badgeColor: "#F59E0B" // Amber for pending
    },
    {
      id: 3,
      title: "Your child's attendance marked",
      desc: "Aarav is present today. Gate Kiosk #1 verified at 08:12 AM.",
      time: "Today, 08:12 AM",
      icon: CheckCircle2,
      badgeColor: "#18B981" // Mint for success
    }
  ];

  const handleAction = (tabId, tabTitle) => {
    onSwitchTab(tabId);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header Greeting */}
      <div>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 800,
          color: 'var(--text-main)',
          margin: '0 0 4px',
          letterSpacing: '-0.3px'
        }}>
          Hello {currentUser?.full_name?.includes('(') ? currentUser.full_name : `${currentUser?.full_name || 'Pooja Sharma'}(${childInfo.name})`}! 👋
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
          Here's what's happening with your child today.
        </p>
      </div>

      {/* Top Child Card & Key Status Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px'
      }}>

        {/* Child Profile Card */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(18, 33, 58, 0.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-nav)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '18px',
              border: '2px solid var(--border-subtle)'
            }}>
              {childInfo.avatar}
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                {childInfo.name}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                {childInfo.grade}
              </p>
              <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 500 }}>
                {childInfo.school}
              </span>
            </div>
          </div>

          <div
            style={{
              padding: '6px 12px',
              backgroundColor: 'rgba(22, 119, 255, 0.08)',
              borderRadius: '8px',
              border: '1px solid rgba(22, 119, 255, 0.2)',
              color: '#1677FF',
              fontWeight: 700,
              fontSize: '11.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>Roll #14</span>
          </div>
        </div>

        {/* Today's Attendance Card */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(18, 33, 58, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
              Today's Attendance
            </span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: 'rgba(24, 185, 129, 0.1)',
              color: '#18B981', // Mint Green for success
              padding: '3px 8px',
              borderRadius: '999px',
              fontSize: '11.5px',
              fontWeight: 700
            }}>
              <CheckCircle2 size={12} />
              <span>Present</span>
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>Recorded in Class</p>
              <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', margin: '2px 0 0' }}>08:12 AM</p>
            </div>
            <button
              onClick={() => onSwitchTab('attendance_view')}
              style={{
                background: 'none',
                border: 'none',
                color: '#1677FF',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                borderRadius: '6px',
                backgroundColor: 'rgba(22, 119, 255, 0.08)'
              }}
            >
              <span>View History &rarr;</span>
            </button>
          </div>
        </div>

        {/* Fee Status Card */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(18, 33, 58, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
              Fee Status
            </span>
            <span style={{
              backgroundColor: 'rgba(245, 158, 11, 0.12)',
              color: '#F59E0B', // Amber for pending
              padding: '3px 8px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 700
            }}>
              Due in 4 Days
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)' }}>
                ₹2,500
              </span>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Due on 20 Apr 2025
              </p>
            </div>
            <button
              onClick={() => handleAction('fees', 'Pay Fees')}
              style={{
                padding: '7px 14px',
                backgroundColor: '#1677FF', // Blue action
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '7px',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(22, 119, 255, 0.2)'
              }}
            >
              Pay Now &rarr;
            </button>
          </div>
        </div>

      </div>

      {/* Child Attendance & Biometric Status Summary Section */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '14px',
        border: '1px solid var(--border-subtle)',
        padding: '18px 24px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            backgroundColor: 'rgba(24, 185, 129, 0.1)',
            border: '1px solid rgba(24, 185, 129, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#18B981',
            flexShrink: 0
          }}>
            <CalendarCheck size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                Aarav's Monthly Attendance: <span style={{ color: '#18B981' }}>94.2%</span>
              </h3>
              <span style={{
                fontSize: '10.5px',
                fontWeight: 800,
                color: '#18B981',
                backgroundColor: 'rgba(24, 185, 129, 0.1)',
                padding: '2px 7px',
                borderRadius: '999px'
              }}>
                CBSE &ge; 75% Met
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '3px 0 0' }}>
              8 of 9 Term Days Present &bull; 1 Approved Medical Leave &bull; Today checked in at <strong>08:12 AM</strong> by Class Teacher
            </p>
          </div>
        </div>

        <button
          onClick={() => onSwitchTab('attendance_view')}
          style={{
            padding: '8px 16px',
            backgroundColor: 'rgba(22, 119, 255, 0.08)',
            border: '1px solid rgba(22, 119, 255, 0.25)',
            color: '#1677FF',
            borderRadius: '8px',
            fontSize: '12.5px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>View Detailed Attendance &rarr;</span>
        </button>
      </div>

      {/* Main Two Columns: Latest Updates & AI Mentor Card */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '20px'
      }}>

        {/* Left Column: Latest Updates */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          padding: '22px',
          boxShadow: '0 1px 3px rgba(18, 33, 58, 0.04)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
              Latest Updates
            </h3>
            <button
              onClick={() => onSwitchTab('sockets')}
              style={{
                background: 'none',
                border: 'none',
                color: '#1677FF',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              View all &rarr;
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {latestUpdates.map(u => {
              const IconComp = u.icon;
              return (
                <div key={u.id} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  padding: '12px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <IconComp size={18} color={u.badgeColor} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                        {u.title}
                      </p>
                      <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{u.time}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0', lineHeight: 1.4 }}>
                      {u.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: AI Mentor for Your Child Card (Violet Identity) */}
        <div style={{
          backgroundColor: 'var(--ai-bg-subtle)',
          border: '1.5px solid var(--ai-border)',
          borderRadius: '12px',
          padding: '26px 24px',
          boxShadow: '0 1px 3px rgba(108, 76, 232, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '20px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(108, 76, 232, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Sparkles size={16} color="#6C4CE8" />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#6C4CE8', margin: 0 }}>
                AI Mentor for Your Child
              </h3>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-main)', lineHeight: 1.5, margin: '8px 0 16px' }}>
              Personalized learning support, homework explanation and instant doubt resolution tailored to Aarav's Class 5 curriculum.
            </p>

            <div style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '8px',
              padding: '12px',
              border: '1px solid var(--ai-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#6C4CE8', textTransform: 'uppercase' }}>
                Recent Topic Mastered
              </span>
              <p style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
                📐 Fractions &amp; Decimals (95% Accuracy in Quiz Arena)
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
            <button
              onClick={() => onSwitchTab('aichat')}
              style={{
                flex: 1,
                padding: '10px 18px',
                backgroundColor: '#6C4CE8', // Violet #6C4CE8 for AI action
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 2px 8px rgba(108, 76, 232, 0.25)'
              }}
            >
              <span>Chat with AI Mentor</span>
              <ArrowRight size={14} />
            </button>

            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-surface)',
              border: '1.5px solid var(--ai-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              flexShrink: 0
            }}>
              🤖
            </div>
          </div>
        </div>

      </div>

      {/* Quick 1-Tap Parent Actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '14px'
      }}>
        {[
          { id: 'leaves', label: 'Apply Leave Pass', sub: 'Medical & Standard', icon: CalendarOff, color: '#1677FF' },
          { id: 'consultation', label: '1-on-1 Consultation', sub: 'Book Teacher Call', icon: Video, color: '#1677FF' },
          { id: 'sockets', label: 'Class Messages', sub: 'Teacher Broadcasts', icon: MessageSquare, color: '#1677FF' },
          { id: 'quiz', label: 'Child Quiz Arena', sub: 'Daily Knowledge Quizzes', icon: Award, color: '#1677FF' }
        ].map(tile => {
          const IconComponent = tile.icon;
          return (
            <div
              key={tile.id}
              onClick={() => handleAction(tile.id, tile.label)}
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(18, 33, 58, 0.03)',
                transition: 'all 0.16s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(18, 33, 58, 0.06)';
                e.currentTarget.style.borderColor = '#1677FF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 1px 2px rgba(18, 33, 58, 0.03)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
              }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'rgba(22, 119, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <IconComponent size={18} color="#1677FF" />
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                  {tile.label}
                </p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                  {tile.sub}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Parent Notice Stream: Public Circulars & Private Progress Notices */}
      <NoticeBoardHub
        currentUser={currentUser}
        activeRole="parent"
        onRequireAuth={onRequireAuth}
      />

    </div>
  );
}
