import React, { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  Calendar,
  Clock,
  AlertCircle,
  FileText,
  Download,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Award,
  ArrowRight,
  UserCheck,
  Sparkles,
  Info
} from 'lucide-react';

export default function ChildAttendanceView({ currentUser, onSwitchTab }) {
  const [selectedMonth, setSelectedMonth] = useState('October 2026');
  const [selectedDayDetail, setSelectedDayDetail] = useState(null);
  const [downloadNotice, setDownloadNotice] = useState(false);

  const childInfo = {
    name: "Aarav Sharma",
    grade: "Class 5 - Section B",
    rollNo: "14",
    studentId: "DPS-2026-0801",
    school: "Green Valley High School",
    teacher: "Mrs. Sunita Sharma (Class Head)"
  };

  // October 2026 Day-by-day attendance data (Starts on Thursday Oct 1)
  // Day status: 'P' = Present, 'L' = Leave, 'H' = Holiday / Weekend, 'U' = Upcoming
  const attendanceCalendar = [
    { day: 1, dow: 'Thu', status: 'P', time: '08:12 AM', mode: 'Teacher Roll Call • Gate #1 Kiosk' },
    { day: 2, dow: 'Fri', status: 'P', time: '08:14 AM', mode: 'Teacher Roll Call • Gate #1 Kiosk' },
    { day: 3, dow: 'Sat', status: 'H', label: 'Weekend' },
    { day: 4, dow: 'Sun', status: 'H', label: 'Sunday' },
    { day: 5, dow: 'Mon', status: 'P', time: '08:10 AM', mode: 'Teacher Roll Call • Gate #1 Kiosk' },
    { day: 6, dow: 'Tue', status: 'P', time: '08:15 AM', mode: 'Teacher Roll Call • Gate #1 Kiosk' },
    { day: 7, dow: 'Wed', status: 'P', time: '08:11 AM', mode: 'Teacher Roll Call • Gate #1 Kiosk' },
    { day: 8, dow: 'Thu', status: 'P', time: '08:09 AM', mode: 'Teacher Roll Call • Gate #1 Kiosk' },
    { day: 9, dow: 'Fri', status: 'L', label: 'Approved Medical Leave', passId: 'LP-2026-044' },
    { day: 10, dow: 'Sat', status: 'H', label: 'Weekend' },
    { day: 11, dow: 'Sun', status: 'P', time: '08:12 AM', mode: 'Today • Teacher Verified', isToday: true },
    { day: 12, dow: 'Mon', status: 'U' },
    { day: 13, dow: 'Tue', status: 'U' },
    { day: 14, dow: 'Wed', status: 'U' },
    { day: 15, dow: 'Thu', status: 'U' },
    { day: 16, dow: 'Fri', status: 'U' },
    { day: 17, dow: 'Sat', status: 'H', label: 'Weekend' },
    { day: 18, dow: 'Sun', status: 'H', label: 'Sunday' },
    { day: 19, dow: 'Mon', status: 'U' },
    { day: 20, dow: 'Tue', status: 'U' },
    { day: 21, dow: 'Wed', status: 'U' },
    { day: 22, dow: 'Thu', status: 'U' },
    { day: 23, dow: 'Fri', status: 'U' },
    { day: 24, dow: 'Sat', status: 'H', label: 'Diwali Break' },
    { day: 25, dow: 'Sun', status: 'H', label: 'Diwali Holiday' },
    { day: 26, dow: 'Mon', status: 'U' },
    { day: 27, dow: 'Tue', status: 'U' },
    { day: 28, dow: 'Wed', status: 'U' },
    { day: 29, dow: 'Thu', status: 'U' },
    { day: 30, dow: 'Fri', status: 'U' },
    { day: 31, dow: 'Sat', status: 'H', label: 'Weekend' }
  ];

  const subjectAttendance = [
    { subject: "Mathematics & Geometry", conducted: 20, attended: 20, percent: 100 },
    { subject: "Science & STEM Lab", conducted: 18, attended: 17, percent: 94.4 },
    { subject: "English & Literature", conducted: 20, attended: 19, percent: 95.0 },
    { subject: "Social Studies & Civics", conducted: 18, attended: 17, percent: 94.4 },
    { subject: "Hindi & Sanskrit", conducted: 16, attended: 16, percent: 100 },
    { subject: "Physical Education & Sports", conducted: 12, attended: 12, percent: 100 }
  ];

  const handleDownload = () => {
    setDownloadNotice(true);
    setTimeout(() => setDownloadNotice(false), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header Banner */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '16px',
        border: '1px solid var(--border-subtle)',
        padding: '24px 28px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            backgroundColor: 'rgba(22, 119, 255, 0.1)',
            border: '1.5px solid rgba(22, 119, 255, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1677FF',
            flexShrink: 0
          }}>
            <CalendarCheck size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                {childInfo.name}'s Attendance Record
              </h1>
              <span style={{
                fontSize: '11px',
                fontWeight: 800,
                backgroundColor: 'rgba(24, 185, 129, 0.12)',
                color: '#18B981',
                padding: '3px 10px',
                borderRadius: '999px',
                border: '1px solid rgba(24, 185, 129, 0.25)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <CheckCircle2 size={12} />
                <span>Present Today</span>
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
              {childInfo.grade} &bull; Roll #{childInfo.rollNo} &bull; Student ID: <strong>{childInfo.studentId}</strong> &bull; {childInfo.school}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Month Selector */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{
              padding: '9px 14px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              color: 'var(--text-main)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="October 2026">October 2026</option>
            <option value="September 2026">September 2026</option>
            <option value="August 2026">August 2026</option>
          </select>

          {/* Download Monthly Slip */}
          <button
            onClick={handleDownload}
            style={{
              padding: '9px 16px',
              backgroundColor: '#1677FF',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 8px rgba(22, 119, 255, 0.25)'
            }}
          >
            <Download size={15} />
            <span>Download Slip</span>
          </button>
        </div>
      </div>

      {/* Download Alert Toast */}
      {downloadNotice && (
        <div style={{
          backgroundColor: 'rgba(24, 185, 129, 0.1)',
          border: '1px solid #18B981',
          borderRadius: '10px',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#18B981',
          fontSize: '13px',
          fontWeight: 600
        }}>
          <CheckCircle2 size={18} />
          <span>Official Monthly Attendance Certificate &amp; Slip for {selectedMonth} generated successfully!</span>
        </div>
      )}

      {/* KPI Cards: Overall Performance & CBSE Rule */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: 600 }}>Overall Attendance</span>
            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#18B981',
              backgroundColor: 'rgba(24, 185, 129, 0.1)',
              padding: '2px 8px',
              borderRadius: '999px'
            }}>
              CBSE &ge; 75% Met
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '28px', fontWeight: 900, color: '#18B981' }}>94.2%</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Excellent Standing</span>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-dim)', margin: 0 }}>
            Mandatory 75% CBSE Board exam eligibility requirement is safely satisfied.
          </p>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: 600 }}>Present Days</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '28px', fontWeight: 900, color: 'var(--text-main)' }}>8 Days</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>out of 9 working days</span>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-dim)', margin: 0 }}>
            Daily check-ins verified by Class Teacher roll call.
          </p>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: 600 }}>Approved Leaves</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '28px', fontWeight: 900, color: '#F59E0B' }}>1 Day</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Medical Pass</span>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-dim)', margin: 0 }}>
            Pass #LP-2026-044 granted by Principal on Oct 9.
          </p>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: 600 }}>Unexcused Absences</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '28px', fontWeight: 900, color: '#18B981' }}>0 Days</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Zero Infractions</span>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-dim)', margin: 0 }}>
            No unexcused or missing attendance records this term.
          </p>
        </div>
      </div>

      {/* Main Grid: Interactive Monthly Heatmap & Daily Verification Details */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '20px'
      }}>

        {/* Left: Monthly Attendance Heatmap */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '14px',
          border: '1px solid var(--border-subtle)',
          padding: '22px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                {selectedMonth} Attendance Heatmap
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Click any day to inspect teacher verification timestamp
              </p>
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(22, 119, 255, 0.08)',
              padding: '4px 10px',
              borderRadius: '8px',
              color: '#1677FF',
              fontSize: '11.5px',
              fontWeight: 700
            }}>
              <Calendar size={13} />
              <span>Term 2 Roster</span>
            </div>
          </div>

          {/* Weekday Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '8px',
            textAlign: 'center',
            marginBottom: '8px'
          }}>
            {['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed'].map(w => (
              <span key={w} style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {w}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '8px'
          }}>
            {attendanceCalendar.map(item => {
              const isSelected = selectedDayDetail?.day === item.day;
              let bg = 'var(--bg-secondary)';
              let border = 'var(--border-subtle)';
              let text = 'var(--text-main)';
              let badge = null;

              if (item.status === 'P') {
                bg = 'rgba(24, 185, 129, 0.12)';
                border = isSelected ? '#18B981' : 'rgba(24, 185, 129, 0.35)';
                text = '#18B981';
                badge = 'P';
              } else if (item.status === 'L') {
                bg = 'rgba(245, 158, 11, 0.12)';
                border = isSelected ? '#F59E0B' : 'rgba(245, 158, 11, 0.35)';
                text = '#F59E0B';
                badge = 'L';
              } else if (item.status === 'H') {
                bg = 'var(--bg-secondary)';
                border = 'var(--border-subtle)';
                text = 'var(--text-dim)';
                badge = 'H';
              } else if (item.status === 'U') {
                bg = 'transparent';
                border = '1px dashed var(--border-subtle)';
                text = 'var(--text-dim)';
              }

              return (
                <button
                  key={item.day}
                  onClick={() => setSelectedDayDetail(item)}
                  style={{
                    backgroundColor: bg,
                    border: `1.5px solid ${border}`,
                    borderRadius: '10px',
                    padding: '8px 4px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '2px',
                    cursor: item.status !== 'U' ? 'pointer' : 'default',
                    transition: 'all 0.18s ease',
                    transform: isSelected ? 'scale(1.05)' : 'none',
                    boxShadow: isSelected ? '0 0 12px rgba(22, 119, 255, 0.3)' : 'none'
                  }}
                  title={`Oct ${item.day} - ${item.status === 'P' ? 'Present' : (item.status === 'L' ? 'Leave' : item.label || 'Upcoming')}`}
                >
                  <span style={{ fontSize: '13px', fontWeight: 800, color: text }}>
                    {item.day}
                  </span>
                  {badge && (
                    <span style={{
                      fontSize: '9.5px',
                      fontWeight: 800,
                      color: text,
                      letterSpacing: '0.2px'
                    }}>
                      {badge}
                    </span>
                  )}
                  {item.isToday && (
                    <span style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      backgroundColor: '#18B981',
                      marginTop: '2px'
                    }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-subtle)',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#18B981' }} />
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Present (P)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#F59E0B' }} />
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Excused Leave (L)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: 'var(--text-dim)' }} />
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Holiday / Weekend (H)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '3px', border: '1px dashed var(--border-subtle)' }} />
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Upcoming</span>
            </div>
          </div>
        </div>

        {/* Right: Selected Day Inspection or Subject Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Selected Day Verification Inspector */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '14px',
            border: '1px solid var(--border-subtle)',
            padding: '22px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(22, 119, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1677FF'
              }}>
                <Info size={16} />
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                {selectedDayDetail ? `Record for Oct ${selectedDayDetail.day}, 2026` : "Today's Verified Check-In"}
              </h3>
            </div>

            {selectedDayDetail ? (
              <div style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '10px',
                padding: '16px',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
                    October {selectedDayDetail.day}, 2026 ({selectedDayDetail.dow})
                  </span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: selectedDayDetail.status === 'P' ? '#18B981' : (selectedDayDetail.status === 'L' ? '#F59E0B' : 'var(--text-dim)'),
                    backgroundColor: selectedDayDetail.status === 'P' ? 'rgba(24, 185, 129, 0.12)' : (selectedDayDetail.status === 'L' ? 'rgba(245, 158, 11, 0.12)' : 'var(--bg-surface)'),
                    padding: '3px 8px',
                    borderRadius: '6px'
                  }}>
                    {selectedDayDetail.status === 'P' ? 'Present' : (selectedDayDetail.status === 'L' ? 'Excused Leave' : selectedDayDetail.label || 'Upcoming')}
                  </span>
                </div>

                {selectedDayDetail.time && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--text-main)' }}>
                    <Clock size={14} color="#1677FF" />
                    <span>Time Recorded: <strong>{selectedDayDetail.time}</strong></span>
                  </div>
                )}

                {selectedDayDetail.mode && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <ShieldCheck size={14} color="#18B981" />
                    <span>Method: {selectedDayDetail.mode}</span>
                  </div>
                )}

                {selectedDayDetail.passId && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#F59E0B' }}>
                    <FileText size={14} />
                    <span>Medical Leave Pass: <strong>{selectedDayDetail.passId}</strong> (Doctor slip attached)</span>
                  </div>
                )}

                <div style={{
                  marginTop: '6px',
                  paddingTop: '8px',
                  borderTop: '1px solid var(--border-subtle)',
                  fontSize: '11.5px',
                  color: 'var(--text-dim)'
                }}>
                  Verified by: {childInfo.teacher}
                </div>
              </div>
            ) : (
              <div style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '10px',
                padding: '16px',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
                    Today &bull; Sunday, Oct 11, 2026
                  </span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#18B981',
                    backgroundColor: 'rgba(24, 185, 129, 0.12)',
                    padding: '3px 8px',
                    borderRadius: '6px'
                  }}>
                    Present
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--text-main)' }}>
                  <Clock size={14} color="#1677FF" />
                  <span>Class Entry Recorded: <strong>08:12 AM</strong></span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <ShieldCheck size={14} color="#18B981" />
                  <span>Method: Morning Roll Call • Verified by Class Teacher</span>
                </div>

                <div style={{
                  marginTop: '6px',
                  paddingTop: '8px',
                  borderTop: '1px solid var(--border-subtle)',
                  fontSize: '11.5px',
                  color: 'var(--text-dim)'
                }}>
                  Gate Pass Status: Safely inside Campus &bull; Class 5-B
                </div>
              </div>
            )}
          </div>

          {/* Subject-Wise Attendance Breakdown */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '14px',
            border: '1px solid var(--border-subtle)',
            padding: '22px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.03)'
          }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 14px' }}>
              Subject-Wise Attendance Breakdown
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {subjectAttendance.map(sub => (
                <div key={sub.subject} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div>
                    <p style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                      {sub.subject}
                    </p>
                    <p style={{ fontSize: '11px', color: 'var(--text-dim)', margin: '2px 0 0' }}>
                      {sub.attended}/{sub.conducted} lectures attended
                    </p>
                  </div>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    color: sub.percent >= 90 ? '#18B981' : '#F59E0B'
                  }}>
                    {sub.percent}%
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Quick Navigation Footer */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '12px',
        border: '1px solid var(--border-subtle)',
        padding: '16px 22px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={16} color="#1677FF" />
          <span style={{ fontSize: '13px', color: 'var(--text-main)' }}>
            Need to request planned absence or medical leave for Aarav?
          </span>
        </div>
        <button
          onClick={() => onSwitchTab('leaves')}
          style={{
            padding: '8px 16px',
            backgroundColor: 'transparent',
            border: '1px solid #1677FF',
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
          <span>Apply Leave Pass</span>
          <ArrowRight size={13} />
        </button>
      </div>

    </div>
  );
}
