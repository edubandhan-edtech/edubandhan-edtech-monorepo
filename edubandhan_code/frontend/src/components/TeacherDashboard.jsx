import React, { useState } from 'react';
import {
  Users,
  CalendarOff,
  Radio,
  HelpCircle,
  Video,
  MessageSquare,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  BookOpen,
  AlertCircle,
  FileText,
  UserCheck,
  PlusCircle,
  ShieldCheck,
  Megaphone,
  Globe,
  Lock,
  Send,
  Network
} from 'lucide-react';
import NoticeBoardHub from './NoticeBoardHub';
import PublishNoticeModal from './PublishNoticeModal';
import {
  GeometryCompassIcon,
  LabMicroscopeIcon,
  DesktopGlobeIcon,
  ChemicalLabIcon,
  WoodenAbacusIcon
} from './ScholasticIcons';

export default function TeacherDashboard({ onSwitchTab, onRequireAuth, currentUser }) {
  const [quickNoticeSent, setQuickNoticeSent] = useState(false);
  const [noticeText, setNoticeText] = useState('');
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  const handleAction = (tabId, tabTitle) => {
    onSwitchTab(tabId);
  };

  const handleSendNotice = (e) => {
    e.preventDefault();
    if (!currentUser && onRequireAuth) {
      onRequireAuth({ id: 'teacher', title: 'Broadcast Teacher Notice' });
      return;
    }
    if (!noticeText.trim()) return;
    setQuickNoticeSent(true);
    setTimeout(() => {
      setQuickNoticeSent(false);
      setNoticeText('');
    }, 3500);
  };

  const teacherName = currentUser?.full_name || "Mrs. Sunita Sharma";
  const teacherRole = currentUser?.role === 'TEACHER' ? "Class 8-B Head Teacher & STEM Faculty" : "Class Teacher Workspace";

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* 1. Header Greeting & Morning Focus Banner */}
      <div className="glass-panel" style={{
        padding: '28px 32px',
        background: 'linear-gradient(135deg, rgba(15, 39, 68, 0.95) 0%, rgba(10, 27, 51, 0.98) 100%)',
        border: '1.5px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)'
      }}>
        {/* Subtle background glow */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '220px',
          height: '220px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(2, 132, 199, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', position: 'relative', zIndex: 2 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{
                background: 'rgba(56, 189, 248, 0.18)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                color: 'var(--accent-cyan)',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.04em'
              }}>
                👩‍🏫 TEACHER WORKSPACE
              </span>
              <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.65)' }}>
                Delhi Public School &bull; Academic Term 2026
              </span>
            </div>

            <h1 style={{
              fontSize: '28px',
              fontWeight: 800,
              margin: '0 0 6px 0',
              fontFamily: 'var(--font-heading)',
              color: '#ffffff'
            }}>
              Good Morning, {teacherName}
            </h1>
            <p style={{ fontSize: '14px', color: '#cbd5e1', margin: 0 }}>
              {teacherRole} &bull; Here is your teaching schedule, attendance, and parent requests for today.
            </p>
          </div>

          {/* Quick Date & Live Sync Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: 'var(--radius-full)',
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#34d399'
            }}>
              <span className="pulse-dot"></span>
              <span>Class 8-B: 28/29 Present (96.5%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Four 1-Click Fast Action Shortcuts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <button
          onClick={() => handleAction('kiosk', 'Classroom Attendance Kiosk')}
          style={{
            background: 'var(--bg-surface)',
            border: '1.5px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.2s ease'
          }}
          className="hover-card"
        >
          <div style={{
            background: 'rgba(2, 132, 199, 0.12)',
            padding: '12px',
            borderRadius: '12px',
            color: 'var(--accent-cyan)'
          }}>
            <UserCheck size={22} />
          </div>
          <div>
            <strong style={{ fontSize: '14px', color: 'var(--text-main)', display: 'block' }}>Mark Attendance</strong>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Face AI Kiosk Check-in</span>
          </div>
        </button>

        <button
          onClick={() => handleAction('quiz', 'Child Quiz Arena & AI Coach')}
          style={{
            background: 'var(--bg-surface)',
            border: '1.5px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.2s ease'
          }}
          className="hover-card"
        >
          <div style={{
            background: 'rgba(168, 85, 247, 0.12)',
            padding: '12px',
            borderRadius: '12px',
            color: 'var(--accent-purple)'
          }}>
            <HelpCircle size={22} />
          </div>
          <div>
            <strong style={{ fontSize: '14px', color: 'var(--text-main)', display: 'block' }}>Assign Quiz / HW</strong>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>AI Generator & Topics</span>
          </div>
        </button>

        <button
          onClick={() => handleAction('leaves', 'Dual-Tier Leave Engine')}
          style={{
            background: 'var(--bg-surface)',
            border: '1.5px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.2s ease'
          }}
          className="hover-card"
        >
          <div style={{
            background: 'rgba(245, 158, 11, 0.12)',
            padding: '12px',
            borderRadius: '12px',
            color: 'var(--accent-amber)'
          }}>
            <CalendarOff size={22} />
          </div>
          <div>
            <strong style={{ fontSize: '14px', color: 'var(--text-main)', display: 'block' }}>Approve Leave Pass</strong>
            <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 700 }}>2 Requests Pending</span>
          </div>
        </button>

        <button
          onClick={() => handleAction('sockets', 'Moderated Classroom Feed')}
          style={{
            background: 'var(--bg-surface)',
            border: '1.5px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.2s ease'
          }}
          className="hover-card"
        >
          <div style={{
            background: 'rgba(16, 185, 129, 0.12)',
            padding: '12px',
            borderRadius: '12px',
            color: '#10b981'
          }}>
            <Radio size={22} />
          </div>
          <div>
            <strong style={{ fontSize: '14px', color: 'var(--text-main)', display: 'block' }}>Classroom Sockets</strong>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Live Moderated Feed</span>
          </div>
        </button>

        <button
          onClick={() => handleAction('organization', 'Classroom Hierarchy Tree & Directory')}
          style={{
            background: 'var(--bg-surface)',
            border: '1.5px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.2s ease'
          }}
          className="hover-card"
        >
          <div style={{
            background: 'rgba(21, 94, 239, 0.12)',
            padding: '12px',
            borderRadius: '12px',
            color: 'var(--brand-blue)'
          }}>
            <Network size={22} />
          </div>
          <div>
            <strong style={{ fontSize: '14px', color: 'var(--text-main)', display: 'block' }}>Classroom Org Tree</strong>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Students & Guardians</span>
          </div>
        </button>
      </div>

      {/* 3. Core Working Panels: Today's Schedule + Instant Broadcast + Pending Leaves */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>

        {/* Panel A: Today's Teaching Schedule */}
        <div className="glass-panel" style={{
          padding: '24px',
          background: 'var(--bg-surface)',
          border: '1.5px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="var(--accent-cyan)" />
              <span>Today's Class Schedule (Wednesday)</span>
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>4 Lectures Scheduled</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Period 1 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#10b981', minWidth: '65px' }}>08:30 AM</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>Class 8-B &bull; Mathematics &amp; Geometry</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Room 204 &bull; Topic: Pythagorean Triples &amp; Proofs</div>
                </div>
              </div>
              <span style={{ fontSize: '11px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>
                Completed
              </span>
            </div>

            {/* Period 2 (Active/Next) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              borderRadius: '10px',
              background: 'rgba(2, 132, 199, 0.1)',
              border: '1.5px solid var(--accent-cyan)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent-cyan)', minWidth: '65px' }}>11:30 AM</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-main)' }}>Class 8-A &bull; STEM Science Laboratory</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Physics Lab #2 &bull; Cellular Optics &amp; Microscopes</div>
                </div>
              </div>
              <span style={{ fontSize: '11px', background: 'var(--accent-cyan)', color: '#ffffff', padding: '3px 8px', borderRadius: '4px', fontWeight: 800 }}>
                Next Up
              </span>
            </div>

            {/* Period 3 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              borderRadius: '10px',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', minWidth: '65px' }}>01:15 PM</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>Class 9-C &bull; Remedial Math Workshop</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Room 108 &bull; Polynomial Factoring</div>
                </div>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Upcoming</span>
            </div>

            {/* Period 4 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              borderRadius: '10px',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', minWidth: '65px' }}>02:45 PM</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>1-on-1 Parent Consultations (Booked)</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>WebRTC Encrypted Chamber &bull; 2 Sessions</div>
                </div>
              </div>
              <button
                onClick={() => handleAction('consultation', '1-on-1 Consultation Marketplace')}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--accent-amber)',
                  cursor: 'pointer'
                }}
              >
                View
              </button>
            </div>
          </div>
        </div>

        {/* Panel B: Instant Classroom Notice Broadcaster */}
        <div className="glass-panel" style={{
          padding: '24px',
          background: 'var(--bg-surface)',
          border: '1.5px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Send size={18} color="#10b981" />
                <span>Quick Notice to Parents of Class 8-B</span>
              </h3>
              <span style={{ fontSize: '11px', color: 'var(--text-cyan)', fontWeight: 700 }}>29 Parents Connected</span>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 14px', lineHeight: 1.5 }}>
              Send an instant verified announcement directly to parent smartphones via the Parent Pulse notification stream.
            </p>

            <form onSubmit={handleSendNotice}>
              <textarea
                value={noticeText}
                onChange={(e) => setNoticeText(e.target.value)}
                placeholder="Example: Please ensure students bring their geometry compass and graph notebook for the Math lab practical tomorrow..."
                rows={4}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '12px',
                  color: 'var(--text-main)',
                  fontSize: '13px',
                  lineHeight: 1.5,
                  resize: 'none',
                  outline: 'none',
                  marginBottom: '12px'
                }}
              />

              {quickNoticeSent ? (
                <div style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#10b981',
                  fontSize: '12px',
                  fontWeight: 700
                }}>
                  <CheckCircle2 size={16} />
                  <span>Notice dispatched instantly to 29 parent devices &amp; live classroom socket!</span>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      if (!currentUser && onRequireAuth) {
                        onRequireAuth({ id: 'teacher', title: 'Publish School Notice' });
                        return;
                      }
                      setIsPublishModalOpen(true);
                    }}
                    style={{
                      background: 'rgba(2, 132, 199, 0.1)',
                      border: '1px solid rgba(2, 132, 199, 0.3)',
                      color: '#0284C7',
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '8px 14px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Megaphone size={14} />
                    <span>Publish Public / Private Notice</span>
                  </button>

                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ fontSize: '12px', padding: '9px 18px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Send size={14} />
                    <span>Quick Broadcast</span>
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* AI Teaching Co-Pilot Banner */}
          <div style={{
            marginTop: '16px',
            padding: '12px 16px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(59, 130, 246, 0.08) 100%)',
            border: '1px solid rgba(168, 85, 247, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={16} color="var(--accent-purple)" />
              <span style={{ fontSize: '12px', color: 'var(--text-main)', fontWeight: 600 }}>
                Need lesson plans or custom quiz questions for tomorrow?
              </span>
            </div>
            <button
              onClick={() => handleAction('aichat', 'EduBandhan AI Mentor')}
              style={{
                background: 'var(--accent-purple)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '5px 12px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Ask AI Mentor &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Notice Board Hub (Public & Private Notices) */}
      <NoticeBoardHub
        currentUser={currentUser}
        activeRole="teacher"
        onRequireAuth={onRequireAuth}
      />

      {/* Publish Notice Modal */}
      <PublishNoticeModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        currentUser={currentUser}
        activeRole="teacher"
      />

    </div>
  );
}
