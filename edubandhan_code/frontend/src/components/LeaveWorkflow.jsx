import React, { useState } from 'react';
import { 
  CalendarOff, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User, 
  Send, 
  FileText, 
  Sparkles,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function LeaveWorkflow({ currentUser, onRequireAuth }) {
  const [activeTab, setActiveTab] = useState('parent'); // 'parent' | 'teacher_review' | 'teacher_to_admin'

  // Pre-populated leaves
  const [parentLeaves, setParentLeaves] = useState([
    {
      id: 1,
      applicant: "Ramesh Sharma(Aarav Sharma)",
      role: "Parent(Child)",
      dates: "Oct 8 - Oct 10, 2026",
      reason: "Viral fever - Doctor advised 3 days rest",
      status: "APPROVED",
      teacherNote: "Approved. Medical certificate verified. Auto-excused at Kiosk #1 & #2.",
      autoCascaded: true
    },
    {
      id: 2,
      applicant: "Sunita Verma(Ananya Verma)",
      role: "Parent(Child)",
      dates: "Oct 12, 2026",
      reason: "Family wedding attendance",
      status: "PENDING",
      teacherNote: "Pending Class Teacher review",
      autoCascaded: false
    }
  ]);

  const [teacherLeaves, setTeacherLeaves] = useState([
    {
      id: 101,
      teacher: "Dr. Vikram Sen (Physics HOD)",
      dates: "Oct 15 - Oct 16, 2026",
      reason: "National Science Congress Speaker Invitation",
      reliefTeacher: "Prof. Anjali Mehta taking Class 11-A lectures",
      status: "APPROVED",
      adminNote: "Approved by Principal. Relief timetable synced.",
      autoCascaded: true
    }
  ]);

  // Form states for new parent application
  const [parentName, setParentName] = useState("Pooja Nair");
  const [childName, setChildName] = useState("Rohan Nair");
  const [leaveDates, setLeaveDates] = useState("Oct 14 - Oct 15, 2026");
  const [leaveReason, setLeaveReason] = useState("Dental surgery appointment");

  const handleApplyParentLeave = (e) => {
    e.preventDefault();
    if (!currentUser && onRequireAuth) {
      onRequireAuth({ id: 'leaves', title: 'Submit Child Leave Pass' });
      return;
    }
    const formattedApplicant = `${parentName}(${childName})`;
    const newLeave = {
      id: Date.now(),
      applicant: formattedApplicant,
      role: "Parent(Child)",
      dates: leaveDates,
      reason: leaveReason,
      status: "PENDING",
      teacherNote: "Submitted to Class Teacher for approval",
      autoCascaded: false
    };
    setParentLeaves([newLeave, ...parentLeaves]);
    alert(`Leave submitted for ${formattedApplicant}! Class teacher has been notified.`);
  };

  const handleApproveLeave = (id) => {
    if (!currentUser && onRequireAuth) {
      onRequireAuth({ id: 'leaves', title: 'Approve Student Leave' });
      return;
    }
    setParentLeaves(parentLeaves.map(l => {
      if (l.id === id) {
        return {
          ...l,
          status: "APPROVED",
          teacherNote: "Approved by Class Teacher. Automatically cascaded to Gate Kiosk as EXCUSED.",
          autoCascaded: true
        };
      }
      return l;
    }));
  };

  const handleRejectLeave = (id) => {
    if (!currentUser && onRequireAuth) {
      onRequireAuth({ id: 'leaves', title: 'Reject Student Leave' });
      return;
    }
    setParentLeaves(parentLeaves.map(l => {
      if (l.id === id) {
        return {
          ...l,
          status: "REJECTED",
          teacherNote: "Rejected due to upcoming mid-term assessment on these dates.",
          autoCascaded: false
        };
      }
      return l;
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ 
        padding: '20px 26px', 
        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.16) 0%, rgba(14, 165, 233, 0.18) 100%)',
        border: '1.5px solid rgba(168, 85, 247, 0.35)',
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
            background: 'rgba(168, 85, 247, 0.22)', 
            border: '1px solid rgba(168, 85, 247, 0.45)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#a855f7',
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.3)',
            flexShrink: 0
          }}>
            <CalendarOff size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-heading)', margin: 0 }}>
              Dual-Tier Leave Management &amp; Auto-Cascade Engine
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-cyan)', margin: '3px 0 0 0' }}>
              <code>Parent_Name(Child_Name)</code> &rarr; Teacher Approval &bull; Teacher &rarr; Admin Approval &bull; Auto-Excuses Kiosk Scans
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            className={`btn-secondary ${activeTab === 'parent' ? 'btn-primary' : ''}`}
            onClick={() => setActiveTab('parent')}
            style={{ fontSize: '11px', padding: '7px 14px' }}
          >
            Apply for Child
          </button>
          <button 
            className={`btn-secondary ${activeTab === 'teacher_review' ? 'btn-primary' : ''}`}
            onClick={() => setActiveTab('teacher_review')}
            style={{ fontSize: '11px', padding: '7px 14px' }}
          >
            Teacher Approvals ({parentLeaves.filter(l => l.status === 'PENDING').length})
          </button>
          <button 
            className={`btn-secondary ${activeTab === 'teacher_to_admin' ? 'btn-primary' : ''}`}
            onClick={() => setActiveTab('teacher_to_admin')}
            style={{ fontSize: '11px', padding: '7px 14px' }}
          >
            Faculty &rarr; Admin
          </button>
        </div>
      </div>

      {/* Tab 1: Apply for Child (Parent view) */}
      {activeTab === 'parent' && (
        <div className="grid-cols-2">
          {/* Form */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-heading)' }}>
              <FileText size={17} color="var(--accent-purple)" />
              <span>Submit Child Leave to Class Teacher</span>
            </h3>

            <form onSubmit={handleApplyParentLeave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Parent Name</label>
                  <input 
                    type="text" 
                    value={parentName} 
                    onChange={e => setParentName(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '13px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Child Name</label>
                  <input 
                    type="text" 
                    value={childName} 
                    onChange={e => setChildName(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '13px'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Leave Dates</label>
                <input 
                  type="text" 
                  value={leaveDates} 
                  onChange={e => setLeaveDates(e.target.value)}
                  placeholder="e.g. Oct 14 - Oct 15, 2026"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '13px'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Reason / Doctor Advice</label>
                <textarea 
                  rows={3}
                  value={leaveReason} 
                  onChange={e => setLeaveReason(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '13px'
                  }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ padding: '12px', fontSize: '13px', background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)' }}>
                <Send size={15} />
                <span>Submit to Class Teacher</span>
              </button>
            </form>
          </div>

          {/* Submissions List */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '16px', fontFamily: 'var(--font-heading)' }}>
              Your Submissions &amp; Kiosk Status
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {parentLeaves.map(leave => (
                <div 
                  key={leave.id}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface)',
                    border: leave.autoCascaded ? '1.5px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <strong style={{ fontSize: '13px', color: 'var(--text-main)' }}>{leave.applicant}</strong>
                    <span className={`badge ${leave.status === 'APPROVED' ? 'badge-emerald' : (leave.status === 'REJECTED' ? 'badge-danger' : 'badge-amber')}`}>
                      {leave.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-cyan)', marginBottom: '4px', fontWeight: 600 }}>📅 {leave.dates}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>&quot;{leave.reason}&quot;</p>
                  
                  {leave.autoCascaded ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#10b981', background: 'rgba(16, 185, 129, 0.12)', padding: '6px 10px', borderRadius: '6px' }}>
                      <CheckCircle2 size={14} />
                      <span>⚡ Auto-Cascaded: Kiosk marks child as <strong>EXCUSED</strong>. No panic alerts!</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#f59e0b' }}>
                      <Clock size={13} />
                      <span>Pending Class Teacher approval</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Teacher Approvals View */}
      {activeTab === 'teacher_review' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '8px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-heading)', margin: 0 }}>
              Class Teacher Approval Queue
            </h3>
            <span className="badge badge-cyan">Class 8-A &bull; Mrs. Ananya Sen</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {parentLeaves.map(leave => (
              <div 
                key={leave.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '14px', color: 'var(--accent-cyan)' }}>{leave.applicant}</strong>
                    <span className="badge badge-purple">{leave.role}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-main)', margin: '2px 0', fontWeight: 600 }}>📅 {leave.dates}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Reason: &quot;{leave.reason}&quot;</p>
                  <p style={{ fontSize: '11px', color: leave.status === 'APPROVED' ? '#10b981' : '#f59e0b', marginTop: '4px' }}>
                    Status: {leave.teacherNote}
                  </p>
                </div>

                {leave.status === 'PENDING' ? (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-primary" onClick={() => handleApproveLeave(leave.id)} style={{ fontSize: '11px', padding: '8px 14px', background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' }}>
                      <CheckCircle2 size={13} />
                      <span>Approve &amp; Sync Kiosk</span>
                    </button>
                    <button className="btn-secondary" onClick={() => handleRejectLeave(leave.id)} style={{ fontSize: '11px', padding: '8px 14px', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#f87171' }}>
                      <XCircle size={13} />
                      <span>Reject</span>
                    </button>
                  </div>
                ) : (
                  <span className={`badge ${leave.status === 'APPROVED' ? 'badge-emerald' : 'badge-danger'}`} style={{ padding: '6px 14px', fontSize: '11px' }}>
                    {leave.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Faculty to Admin View */}
      {activeTab === 'teacher_to_admin' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '8px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-heading)', margin: 0 }}>
              Faculty &rarr; Admin / Principal Approvals
            </h3>
            <span className="badge badge-emerald">Principal Portal Clearance</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {teacherLeaves.map(tLeave => (
              <div 
                key={tLeave.id}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface)',
                  border: '1px solid rgba(16, 185, 129, 0.35)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                  <strong style={{ fontSize: '15px', color: 'var(--text-main)' }}>{tLeave.teacher}</strong>
                  <span className="badge badge-emerald">APPROVED BY PRINCIPAL</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-cyan)', margin: '2px 0', fontWeight: 600 }}>📅 Dates: {tLeave.dates}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0' }}>Reason: &quot;{tLeave.reason}&quot;</p>
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '6px 10px', borderRadius: '6px' }}>
                  <CheckCircle2 size={13} />
                  <span>Relief Timetable Synced: <strong>{tLeave.reliefTeacher}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
