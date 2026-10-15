import React, { useState } from 'react';
import { 
  Smartphone, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Bus, 
  ShieldCheck,
  PhoneCall,
  User,
  Flame,
  Award,
  QrCode
} from 'lucide-react';
import GuardianGatePassModal from './GuardianGatePassModal';

export default function ParentPulse({ currentUser, onSwitchTab }) {
  const [isGatePassOpen, setIsGatePassOpen] = useState(false);
  const guardianName = currentUser?.name || currentUser?.full_name || "Ramesh Sharma";

  const studentName = currentUser?.child_name || "Aarav Sharma";

  const days = [
    { day: 1, status: "P" }, { day: 2, status: "P" }, { day: 3, status: "P" },
    { day: 4, status: "P" }, { day: 5, status: "P" }, { day: 6, status: "H" }, { day: 7, status: "H" },
    { day: 8, status: "E" }, { day: 9, status: "E" }, { day: 10, status: "E" },
    { day: 11, status: "P" }, { day: 12, status: "P" }, { day: 13, status: "P" }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ 
        padding: '20px 26px', 
        background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.16) 0%, rgba(16, 185, 129, 0.16) 100%)',
        border: '1.5px solid rgba(56, 189, 248, 0.35)',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ 
            width: '46px', 
            height: '46px', 
            borderRadius: '12px', 
            background: 'rgba(14, 165, 233, 0.22)', 
            border: '1px solid rgba(56, 189, 248, 0.45)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'var(--accent-cyan)',
            boxShadow: '0 0 20px rgba(14, 165, 233, 0.3)',
            flexShrink: 0
          }}>
            <Smartphone size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-heading)', margin: 0 }}>
              Parent Mobile Pulse Hub
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-cyan)', margin: '3px 0 0 0' }}>
              {studentName} (Class 8-B) &bull; Guardian: {guardianName} &bull; Instant Gate &amp; Bus GPS Alerts
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span className="badge badge-emerald">
            <CheckCircle2 size={13} />
            <span>Checked In (08:14 AM Today)</span>
          </span>

          <button
            onClick={() => setIsGatePassOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              background: 'linear-gradient(135deg, #155EEF 0%, #004EEB 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(21, 94, 239, 0.35)'
            }}
          >
            <QrCode size={14} />
            <span>Safe Gate Pass</span>
          </button>
        </div>
      </div>

      {/* Grid: Gate Alerts + Live Bus GPS */}
      <div className="grid-cols-2">
        {/* Real-time Alerts */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-heading)' }}>
            <Clock size={17} color="var(--accent-cyan)" />
            <span>Today's Gate &amp; Activity Timeline</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              alignItems: 'flex-start',
              padding: '12px',
              borderRadius: '10px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', marginTop: '5px', boxShadow: '0 0 8px #10b981', flexShrink: 0 }}></div>
              <div>
                <strong style={{ fontSize: '13px', color: 'var(--text-main)' }}>08:14 AM &bull; Gate Kiosk #1 Check-In</strong>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>Face verified in 114ms via Neon pgvector. Instant parent push notification sent.</p>
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              alignItems: 'flex-start',
              padding: '12px',
              borderRadius: '10px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#38bdf8', marginTop: '5px', boxShadow: '0 0 8px #38bdf8', flexShrink: 0 }}></div>
              <div>
                <strong style={{ fontSize: '13px', color: 'var(--text-main)' }}>07:45 AM &bull; Boarded Bus #12 (Stop: Mayur Vihar)</strong>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>Bus attendant scanned child transit pass. GPS telemetry live.</p>
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              alignItems: 'flex-start',
              padding: '12px',
              borderRadius: '10px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#c084fc', marginTop: '5px', boxShadow: '0 0 8px #c084fc', flexShrink: 0 }}></div>
              <div>
                <strong style={{ fontSize: '13px', color: 'var(--text-main)' }}>Yesterday &bull; Completed Science Quiz Arena</strong>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>Score: 100% (+50 XP) &bull; Streak maintained to 5 days 🔥</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Bus GPS Tracker */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontFamily: 'var(--font-heading)' }}>
              <Bus size={17} color="var(--accent-amber)" />
              <span>Smart GPS Transit Bus #12</span>
            </h3>
            <span className="badge badge-emerald">Live Telemetry</span>
          </div>

          <div style={{ 
            background: 'var(--bg-surface)', 
            border: '1px solid var(--border-subtle)', 
            borderRadius: '12px', 
            padding: '16px', 
            marginBottom: '16px' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Current Location:</span>
              <strong style={{ color: 'var(--accent-cyan)' }}>Campus Main Gate (Safely Arrived)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Morning Route ETA:</span>
              <strong style={{ color: '#10b981' }}>On Time (08:10 AM)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Driver &bull; Contact:</span>
              <strong style={{ color: 'var(--text-main)' }}>Mr. Rajesh Yadav (+91 98112 00341)</strong>
            </div>
          </div>

          {/* Attendance Calendar Grid */}
          <div>
            <h4 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '10px' }}>
              October 2026 Attendance Heatmap (P: Present, E: Excused Medical Leave)
            </h4>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {days.map(d => (
                <div 
                  key={d.day}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    background: d.status === 'P' ? 'rgba(16, 185, 129, 0.18)' : (d.status === 'E' ? 'rgba(245, 158, 11, 0.18)' : 'var(--bg-surface)'),
                    border: d.status === 'P' ? '1px solid #10b981' : (d.status === 'E' ? '1px solid #f59e0b' : '1px solid var(--border-subtle)'),
                    color: d.status === 'P' ? '#10b981' : (d.status === 'E' ? '#f59e0b' : 'var(--text-dim)'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 800,
                    boxShadow: d.status === 'P' ? '0 0 8px rgba(16, 185, 129, 0.15)' : 'none'
                  }}
                >
                  {d.day}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Safe Guardian Dismissal Gate Pass Modal */}
      <GuardianGatePassModal
        isOpen={isGatePassOpen}
        onClose={() => setIsGatePassOpen(false)}
        currentUser={currentUser}
        onOpenViewer={(passUrl) => {
          if (passUrl && typeof window !== 'undefined') {
            try {
              const url = new URL(passUrl, window.location.origin);
              window.history.pushState({ tab: 'suraksha_pass' }, '', url.pathname + url.search);
            } catch (e) { }
          }
          onSwitchTab('suraksha_pass');
        }}
      />

    </div>
  );
}
