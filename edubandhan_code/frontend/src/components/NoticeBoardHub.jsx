import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  Globe, 
  Lock, 
  Plus, 
  Trash2, 
  ShieldAlert, 
  Clock, 
  Calendar, 
  Filter, 
  Send,
  Eye,
  CheckCircle2,
  RefreshCw,
  Search,
  Sparkles
} from 'lucide-react';
import PublishNoticeModal from './PublishNoticeModal';

export default function NoticeBoardHub({ 
  currentUser, 
  activeRole = 'admin',
  onRequireAuth,
  defaultFilter = 'ALL',
  compact = false
}) {
  const [notices, setNotices] = useState([]);
  const [filterType, setFilterType] = useState(defaultFilter); // 'ALL' | 'PUBLIC' | 'PRIVATE'
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [actionSuccess, setActionSuccess] = useState('');

  const isParent = activeRole === 'parent' || currentUser?.role === 'PARENT';
  const canPublish = !isParent && (activeRole === 'admin' || activeRole === 'teacher' || currentUser?.role === 'SCHOOL_ADMIN' || currentUser?.role === 'TEACHER');

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('edubandhan_token');
      const roleParam = currentUser?.role || (activeRole === 'parent' ? 'PARENT' : (activeRole === 'teacher' ? 'TEACHER' : 'SCHOOL_ADMIN'));
      
      const res = await fetch(`/api/notices?client_role=${roleParam}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const data = await res.json();
      if (data.notices) {
        setNotices(data.notices);
      }
    } catch (err) {
      console.error('Failed to load notices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [currentUser, activeRole]);

  const handleDeleteNotice = async (noticeId) => {
    if (!currentUser && onRequireAuth) {
      onRequireAuth({ id: 'notices', title: 'Delete School Notice' });
      return;
    }
    if (!window.confirm('Are you sure you want to delete this notice? It will be removed immediately from Neon PostgreSQL.')) {
      return;
    }

    setDeleteLoadingId(noticeId);
    try {
      const token = localStorage.getItem('edubandhan_token');
      const res = await fetch(`/api/notices/${noticeId}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        setNotices(prev => prev.filter(n => n.id !== noticeId));
        setActionSuccess('Notice successfully deleted.');
        setTimeout(() => setActionSuccess(''), 2500);
      } else {
        const err = await res.json();
        alert(err.detail || 'Failed to delete notice');
      }
    } catch (e) {
      alert('Error deleting notice');
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const handleNoticePublished = (newNotice) => {
    setNotices(prev => [newNotice, ...prev]);
    setActionSuccess('Notice published & broadcasted successfully!');
    setTimeout(() => setActionSuccess(''), 3000);
  };

  const filteredNotices = notices.filter(n => {
    const typeMatch = filterType === 'ALL' || (n.notice_type || 'PUBLIC').toUpperCase() === filterType;
    const queryMatch = !searchQuery.trim() || 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.category || '').toLowerCase().includes(searchQuery.toLowerCase());
    return typeMatch && queryMatch;
  });

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      borderRadius: '16px',
      border: '1px solid var(--border-subtle)',
      padding: compact ? '20px' : '24px',
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      flexDirection: 'column',
      gap: '18px'
    }}>
      
      {/* Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            backgroundColor: 'rgba(2, 132, 199, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#38BDF8'
          }}>
            <Megaphone size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Campus Notice Board</span>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '10px',
                backgroundColor: isParent ? 'rgba(124, 58, 237, 0.15)' : 'rgba(2, 132, 199, 0.15)',
                color: isParent ? '#A855F7' : '#38BDF8'
              }}>
                {isParent ? 'Parent View (Public + Private)' : 'Management & Publishing Mode'}
              </span>
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              {isParent 
                ? 'Official public school announcements and your private child progress circulars.' 
                : 'Publish public circulars (website loader) or private notices (parents only).'
              }
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={fetchNotices}
            disabled={loading}
            title="Refresh notice feed"
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-main)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12.5px',
              fontWeight: 600
            }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>

          {canPublish && (
            <button
              onClick={() => {
                if (!currentUser && onRequireAuth) {
                  onRequireAuth({ id: 'notices', title: 'Publish School Notice' });
                  return;
                }
                setIsPublishModalOpen(true);
              }}
              style={{
                padding: '9px 18px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)'
              }}
            >
              <Plus size={16} />
              <span>Publish Notice</span>
            </button>
          )}

          {isParent && (
            <span style={{
              fontSize: '11.5px',
              color: 'var(--text-muted)',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              padding: '6px 12px',
              borderRadius: '8px',
              fontWeight: 600
            }}>
              🔒 Read-Only Parent Access
            </span>
          )}
        </div>
      </div>

      {actionSuccess && (
        <div style={{
          backgroundColor: 'rgba(24, 185, 129, 0.15)',
          color: '#34D399',
          padding: '10px 14px',
          borderRadius: '8px',
          fontSize: '12.5px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          border: '1px solid rgba(24, 185, 129, 0.3)'
        }}>
          <CheckCircle2 size={16} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        padding: '10px 14px',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '10px',
        border: '1px solid var(--border-subtle)'
      }}>
        {/* Scope Filter Tabs */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setFilterType('ALL')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: filterType === 'ALL' ? '#0284C7' : 'transparent',
              color: filterType === 'ALL' ? '#FFFFFF' : 'var(--text-muted)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            All Notices ({notices.length})
          </button>

          <button
            onClick={() => setFilterType('PUBLIC')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: filterType === 'PUBLIC' ? '#0284C7' : 'transparent',
              color: filterType === 'PUBLIC' ? '#FFFFFF' : '#38BDF8',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <Globe size={13} />
            <span>Public ({notices.filter(n => (n.notice_type || 'PUBLIC').toUpperCase() === 'PUBLIC').length})</span>
          </button>

          <button
            onClick={() => setFilterType('PRIVATE')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: filterType === 'PRIVATE' ? '#7C3AED' : 'transparent',
              color: filterType === 'PRIVATE' ? '#FFFFFF' : '#A855F7',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <Lock size={13} />
            <span>Private Parent Circulars ({notices.filter(n => (n.notice_type || 'PUBLIC').toUpperCase() === 'PRIVATE').length})</span>
          </button>
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: '220px' }}>
          <Search size={14} color="var(--text-dim)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
          <input
            type="text"
            placeholder="Search circulars..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '7px 10px 7px 30px',
              borderRadius: '6px',
              border: '1px solid var(--border-subtle)',
              fontSize: '12px',
              outline: 'none',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-main)'
            }}
          />
        </div>
      </div>

      {/* Notices Stream Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredNotices.map((notice) => {
          const isPublic = (notice.notice_type || 'PUBLIC').toUpperCase() === 'PUBLIC';
          return (
            <div
              key={notice.id}
              style={{
                backgroundColor: isPublic ? 'var(--bg-surface)' : 'var(--ai-bg-subtle, rgba(108, 76, 232, 0.12))',
                border: `1.5px solid ${isPublic ? 'var(--border-subtle)' : 'rgba(139, 92, 246, 0.35)'}`,
                borderRadius: '12px',
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                transition: 'box-shadow 0.2s',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              
              {/* Card Header Badges */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  
                  {/* Public vs Private Badge */}
                  {isPublic ? (
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      backgroundColor: 'rgba(2, 132, 199, 0.15)',
                      color: '#38BDF8',
                      padding: '3px 10px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      border: '1px solid rgba(56, 189, 248, 0.3)'
                    }}>
                      <Globe size={12} />
                      PUBLIC NOTICE &bull; LOADER SCREEN
                    </span>
                  ) : (
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      backgroundColor: 'rgba(124, 58, 237, 0.15)',
                      color: '#A855F7',
                      padding: '3px 10px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      border: '1px solid rgba(139, 92, 246, 0.3)'
                    }}>
                      <Lock size={12} />
                      PRIVATE &bull; PARENT SECURE LOGIN
                    </span>
                  )}

                  {/* Category Badge */}
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-muted)',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    {notice.category || 'NOTICE'}
                  </span>

                  {/* Urgent Alert Badge */}
                  {notice.is_urgent && (
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      backgroundColor: 'rgba(239, 68, 68, 0.15)',
                      color: '#EF4444',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      border: '1px solid rgba(239, 68, 68, 0.35)'
                    }}>
                      <ShieldAlert size={12} />
                      URGENT
                    </span>
                  )}

                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} />
                    Verified Campus Announcement
                  </span>

                  {/* Delete Button for Admin & Teachers */}
                  {canPublish && (
                    <button
                      onClick={() => handleDeleteNotice(notice.id)}
                      disabled={deleteLoadingId === notice.id}
                      title="Delete notice"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-dim)',
                        cursor: 'pointer',
                        padding: '4px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'color 0.15s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#EF4444'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-dim)'}
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>

              {/* Title */}
              <h4 style={{
                fontSize: '16px',
                fontWeight: 800,
                color: 'var(--text-main)',
                margin: '2px 0 0',
                lineHeight: 1.4
              }}>
                {notice.title}
              </h4>

              {/* Content */}
              <p style={{
                fontSize: '13.5px',
                color: 'var(--text-main)',
                margin: 0,
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap'
              }}>
                {notice.content}
              </p>

              {/* Author & Classroom Footer */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '8px',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '12px',
                color: 'var(--text-muted)'
              }}>
                <div>
                  Published by <strong style={{ color: 'var(--text-main)' }}>{notice.author_name || 'School Authority'}</strong> ({notice.author_role || 'SCHOOL_ADMIN'})
                </div>

                {notice.class_grade && (
                  <div>
                    Classroom: <strong style={{ color: 'var(--text-main)' }}>Class {notice.class_grade}-{notice.class_section}</strong>
                  </div>
                )}
              </div>

            </div>
          );
        })}

        {filteredNotices.length === 0 && !loading && (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '12px',
            border: '1px dashed var(--border-subtle)',
            color: 'var(--text-muted)'
          }}>
            <Megaphone size={32} style={{ margin: '0 auto 8px', color: 'var(--text-dim)' }} />
            <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 4px', color: 'var(--text-main)' }}>
              No notices match current filter
            </h4>
            <p style={{ fontSize: '12.5px', margin: 0 }}>
              Try selecting "All Notices" or publish a new notice above.
            </p>
          </div>
        )}
      </div>

      {/* Publish Notice Modal */}
      <PublishNoticeModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onNoticePublished={handleNoticePublished}
        currentUser={currentUser}
        activeRole={activeRole}
      />

    </div>
  );
}
