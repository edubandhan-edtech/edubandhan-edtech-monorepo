import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Globe, 
  Lock, 
  AlertTriangle, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  Users,
  ShieldAlert,
  Loader2
} from 'lucide-react';

export default function PublishNoticeModal({ 
  isOpen, 
  onClose, 
  onNoticePublished, 
  currentUser,
  activeRole = 'admin'
}) {
  const [noticeType, setNoticeType] = useState('PUBLIC'); // 'PUBLIC' | 'PRIVATE'
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('NOTICE');
  const [isUrgent, setIsUrgent] = useState(false);
  const [targetClass, setTargetClass] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const isTeacher = activeRole === 'teacher' || currentUser?.role === 'TEACHER';
  const authorName = currentUser?.full_name || (isTeacher ? 'Class Teacher' : 'Principal Desk');
  const authorRole = isTeacher ? 'TEACHER' : 'SCHOOL_ADMIN';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setErrorMsg('Please enter both a title and detailed content for the notice.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const token = localStorage.getItem('edubandhan_token');
      const payload = {
        title: title.trim(),
        content: content.trim(),
        notice_type: noticeType,
        category: category,
        is_urgent: isUrgent,
        author_name: authorName,
        author_role: authorRole,
        class_id: targetClass === 'ALL' ? null : targetClass
      };

      const res = await fetch('/api/notices/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to publish notice');
      }

      setSuccessMsg(`✅ ${noticeType === 'PUBLIC' ? 'Public Notice Published' : 'Private Notice Dispatched'}! Dispatched to ${noticeType === 'PUBLIC' ? 'Website Loader Screen & Campus Hub' : 'Parent Portals'}.`);
      
      if (onNoticePublished) {
        onNoticePublished(data.notice);
      }

      setTimeout(() => {
        setTitle('');
        setContent('');
        setIsUrgent(false);
        setSuccessMsg('');
        onClose();
      }, 1400);

    } catch (err) {
      setErrorMsg(err.message || 'Error connecting to database');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(7, 21, 39, 0.78)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '560px',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5)',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden',
        animation: 'modalSlideUp 0.25s ease-out',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '90vh'
      }}>
        
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, #102A56 0%, #163E75 100%)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255, 255, 255, 0.25)'
            }}>
              <Send size={20} color="#38BDF8" />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, letterSpacing: '-0.2px' }}>
                Publish Institutional Notice
              </h2>
              <p style={{ fontSize: '12px', margin: '2px 0 0', color: '#93C5FD' }}>
                Publishing as <strong>{authorName}</strong> ({isTeacher ? 'Class Teacher' : 'School Admin'})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#93C5FD',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>

          {/* Feedback messages */}
          {errorMsg && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#F87171',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertTriangle size={16} flexShrink={0} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div style={{
              background: 'rgba(24, 185, 129, 0.15)',
              color: '#34D399',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              border: '1px solid rgba(24, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle2 size={16} flexShrink={0} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1. Notice Scope Selector (Public vs Private) */}
          <div>
            <label style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>
              Notice Visibility & Audience Scope <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              
              {/* Option A: Public Notice */}
              <button
                type="button"
                onClick={() => setNoticeType('PUBLIC')}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  border: `2px solid ${noticeType === 'PUBLIC' ? '#0284C7' : 'var(--border-subtle)'}`,
                  backgroundColor: noticeType === 'PUBLIC' ? 'rgba(2, 132, 199, 0.15)' : 'var(--bg-secondary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: noticeType === 'PUBLIC' ? '#38BDF8' : 'var(--text-muted)' }}>
                    <Globe size={18} color={noticeType === 'PUBLIC' ? '#38BDF8' : 'var(--text-muted)'} />
                    <span style={{ fontSize: '14px', fontWeight: 800 }}>Public Notice</span>
                  </div>
                  <input 
                    type="radio" 
                    name="noticeType" 
                    checked={noticeType === 'PUBLIC'} 
                    onChange={() => setNoticeType('PUBLIC')} 
                  />
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.35 }}>
                  Visible on <strong>Website Loader Screen</strong>, Overview, and to all campus visitors & portals.
                </p>
                <span style={{
                  fontSize: '10.5px',
                  fontWeight: 700,
                  color: '#0284C7',
                  backgroundColor: 'rgba(2, 132, 199, 0.12)',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  alignSelf: 'flex-start'
                }}>
                  📢 Loader &amp; Public
                </span>
              </button>

              {/* Option B: Private Notice */}
              <button
                type="button"
                onClick={() => setNoticeType('PRIVATE')}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  border: `2px solid ${noticeType === 'PRIVATE' ? '#8B5CF6' : 'var(--border-subtle)'}`,
                  backgroundColor: noticeType === 'PRIVATE' ? 'rgba(139, 92, 246, 0.15)' : 'var(--bg-secondary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: noticeType === 'PRIVATE' ? '#C084FC' : 'var(--text-muted)' }}>
                    <Lock size={18} color={noticeType === 'PRIVATE' ? '#A78BFA' : 'var(--text-muted)'} />
                    <span style={{ fontSize: '14px', fontWeight: 800 }}>Private Notice</span>
                  </div>
                  <input 
                    type="radio" 
                    name="noticeType" 
                    checked={noticeType === 'PRIVATE'} 
                    onChange={() => setNoticeType('PRIVATE')} 
                  />
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.35 }}>
                  Confidential. Visible <strong>strictly to enrolled parents</strong> after login to their Parent Portal.
                </p>
                <span style={{
                  fontSize: '10.5px',
                  fontWeight: 700,
                  color: '#A78BFA',
                  backgroundColor: 'rgba(124, 58, 237, 0.15)',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  alignSelf: 'flex-start'
                }}>
                  🔒 Parents Login Only
                </span>
              </button>

            </div>
          </div>

          {/* 2. Notice Title */}
          <div>
            <label style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
              Notice Subject / Title <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Annual Sports Day 2026 or Term-1 Unit Test Grade Cards"
              required
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)',
                fontSize: '13.5px',
                outline: 'none',
                color: 'var(--text-main)'
              }}
            />
          </div>

          {/* 3. Category & Target Classroom */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '13px',
                  outline: 'none',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-main)'
                }}
              >
                <option value="NOTICE">📢 General Notice</option>
                <option value="CIRCULAR">📜 Official Circular</option>
                <option value="EVENT">🏆 Sports &amp; Cultural Event</option>
                <option value="EXAM">📝 Exam &amp; Report Card</option>
                <option value="HOLIDAY">🏖️ Holiday Declaration</option>
                <option value="EMERGENCY">🚨 Urgent Emergency</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                Target Classroom
              </label>
              <select
                value={targetClass}
                onChange={(e) => setTargetClass(e.target.value)}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '13px',
                  outline: 'none',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-main)'
                }}
              >
                <option value="ALL">🏫 Entire Institution (All Classes)</option>
                <option value="Class 8-B">Class 8-B (Sec A &amp; B)</option>
                <option value="Class 5-A">Class 5-A</option>
                <option value="Primary Wing">Primary Wing (Classes 1-5)</option>
                <option value="Senior Wing">Senior Wing (Classes 9-12)</option>
              </select>
            </div>
          </div>

          {/* 4. Notice Content */}
          <div>
            <label style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
              Full Announcement Content <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Provide comprehensive instructions, dates, timings, venue, or details..."
              required
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)',
                fontSize: '13px',
                outline: 'none',
                color: 'var(--text-main)',
                lineHeight: 1.5,
                resize: 'vertical'
              }}
            />
          </div>

          {/* 5. Priority Checkbox */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 14px',
            backgroundColor: isUrgent ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-secondary)',
            borderRadius: '10px',
            border: `1px solid ${isUrgent ? '#F87171' : 'var(--border-subtle)'}`,
            cursor: 'pointer'
          }} onClick={() => setIsUrgent(!isUrgent)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldAlert size={18} color={isUrgent ? '#DC2626' : 'var(--text-muted)'} />
              <div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: isUrgent ? '#F87171' : 'var(--text-main)' }}>
                  Mark as High-Priority / Urgent Flash Alert
                </span>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '1px 0 0' }}>
                  Applies pulsating badge and high-contrast alert styling.
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isUrgent}
              onChange={(e) => setIsUrgent(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
          </div>

          {/* Modal Footer Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '6px' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-muted)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 22px',
                borderRadius: '8px',
                border: 'none',
                background: noticeType === 'PUBLIC' 
                  ? 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)' 
                  : 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: noticeType === 'PUBLIC'
                  ? '0 4px 14px rgba(2, 132, 199, 0.35)'
                  : '0 4px 14px rgba(124, 58, 237, 0.35)',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Broadcasting Notice...</span>
                </>
              ) : (
                <>
                  <Send size={15} />
                  <span>Publish {noticeType === 'PUBLIC' ? 'Public Notice' : 'Private Notice'}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
