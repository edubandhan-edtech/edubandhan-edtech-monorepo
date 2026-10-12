import React, { useState, useEffect, useMemo } from 'react';
import {
  Network,
  School,
  ShieldCheck,
  Users,
  GraduationCap,
  ChevronRight,
  ChevronDown,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  Copy,
  Check,
  UserCheck,
  Calendar,
  Clock,
  CreditCard,
  BookOpen,
  Layers,
  Sparkles,
  ArrowRight,
  Building2,
  FolderTree,
  ChevronUp
} from 'lucide-react';

export default function OrganizationHierarchy({
  currentUser,
  activeRole = 'super_admin',
  onSwitchTab
}) {
  const [loading, setLoading] = useState(true);
  const [treeData, setTreeData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchoolId, setSelectedSchoolId] = useState('ALL');
  const [viewMode, setViewMode] = useState('by_teacher'); // 'by_teacher' | 'by_class'
  const [expandedNodes, setExpandedNodes] = useState({});
  const [selectedEntity, setSelectedEntity] = useState(null); // { type, id }
  const [drawerProfile, setDrawerProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);

  // Normalize role
  const isSuperAdmin = activeRole === 'super_admin' || (currentUser && String(currentUser.role).toUpperCase().includes('SUPER'));
  const isSchoolAdmin = activeRole === 'admin' || (currentUser && String(currentUser.role).toUpperCase() === 'SCHOOL_ADMIN');
  const isTeacher = activeRole === 'teacher' || (currentUser && String(currentUser.role).toUpperCase().includes('TEACH'));

  const fetchTree = async () => {
    setLoading(true);
    try {
      let url = `/api/hierarchy/tree?role=${encodeURIComponent(activeRole)}`;
      if (currentUser?.school_id) {
        url += `&school_id=${encodeURIComponent(currentUser.school_id)}`;
      }
      if (isTeacher && currentUser?.id) {
        url += `&teacher_id=${encodeURIComponent(currentUser.id)}`;
      }

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const tree = data.tree || [];
        setTreeData(tree);

        // Auto-expand top level nodes on initial load
        const initialExpanded = {};
        tree.forEach(school => {
          initialExpanded[`school_${school.id}`] = true;
          // Expand first 2 teachers or classes
          (school.teachers || []).slice(0, 2).forEach(t => {
            initialExpanded[`teacher_${school.id}_${t.id}`] = true;
          });
          (school.classes || []).slice(0, 2).forEach(c => {
            initialExpanded[`class_${school.id}_${c.id}`] = true;
          });
        });
        setExpandedNodes(initialExpanded);
      }
    } catch (err) {
      console.error('Failed to load organization hierarchy:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTree();
  }, [activeRole, currentUser?.school_id, currentUser?.id]);

  // Load detailed profile when an entity is clicked
  useEffect(() => {
    if (!selectedEntity) {
      setDrawerProfile(null);
      return;
    }

    const fetchProfile = async () => {
      setLoadingProfile(true);
      try {
        const res = await fetch(`/api/hierarchy/profile/${selectedEntity.type}/${selectedEntity.id}`);
        if (res.ok) {
          const pData = await res.json();
          setDrawerProfile(pData);
        } else {
          setDrawerProfile(null);
        }
      } catch (err) {
        console.error('Failed to load profile details:', err);
        setDrawerProfile(null);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [selectedEntity]);

  // Handle ESC key to dismiss profile drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedEntity) {
        setSelectedEntity(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEntity]);

  const toggleNode = (nodeKey, e) => {
    e?.stopPropagation();
    setExpandedNodes(prev => ({
      ...prev,
      [nodeKey]: !prev[nodeKey]
    }));
  };

  const expandAll = () => {
    const allExpanded = {};
    treeData.forEach(school => {
      allExpanded[`school_${school.id}`] = true;
      (school.teachers || []).forEach(t => {
        allExpanded[`teacher_${school.id}_${t.id}`] = true;
        (t.classes || []).forEach(c => {
          allExpanded[`teacher_class_${t.id}_${c.id}`] = true;
        });
      });
      (school.classes || []).forEach(c => {
        allExpanded[`class_${school.id}_${c.id}`] = true;
      });
    });
    setExpandedNodes(allExpanded);
  };

  const collapseAll = () => {
    setExpandedNodes({});
  };

  const copyToClipboard = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Filter schools based on selectedSchoolId
  const displayedSchools = useMemo(() => {
    if (selectedSchoolId === 'ALL') return treeData;
    return treeData.filter(s => s.id === selectedSchoolId);
  }, [treeData, selectedSchoolId]);

  // Global platform metrics summary
  const summaryMetrics = useMemo(() => {
    let schoolsCount = displayedSchools.length;
    let adminsCount = 0;
    let teachersCount = 0;
    let classesCount = 0;
    let studentsCount = 0;
    let presentToday = 0;

    displayedSchools.forEach(s => {
      adminsCount += (s.admins || []).length;
      teachersCount += (s.teachers || []).length;
      classesCount += (s.classes || []).length;
      studentsCount += (s.stats?.total_students || 0);
      presentToday += (s.stats?.present_today || 0);
    });

    return {
      schoolsCount,
      adminsCount,
      teachersCount,
      classesCount,
      studentsCount,
      presentToday,
      attendanceRate: studentsCount > 0 ? Math.round((presentToday / studentsCount) * 100) : 100
    };
  }, [displayedSchools]);

  // Search filter helper: matches item text against searchTerm
  const matchesSearch = (text) => {
    if (!searchTerm) return true;
    return String(text || '').toLowerCase().includes(searchTerm.toLowerCase());
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      {/* 1. Header Banner & Identity */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 42, 86, 0.95) 0%, rgba(21, 94, 239, 0.88) 100%)',
        borderRadius: '16px',
        padding: '24px 28px',
        color: '#FFFFFF',
        boxShadow: '0 10px 30px rgba(16, 42, 86, 0.18)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          opacity: 0.08,
          pointerEvents: 'none'
        }}>
          <FolderTree size={200} color="#FFFFFF" />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.16)',
                borderRadius: '10px',
                padding: '6px 10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}>
                <Network size={14} />
                <span>EduBandhan Organization Tree</span>
              </div>
              <span style={{
                background: 'rgba(18, 183, 106, 0.25)',
                color: '#6CE9A6',
                border: '1px solid rgba(18, 183, 106, 0.4)',
                borderRadius: '20px',
                padding: '2px 10px',
                fontSize: '11px',
                fontWeight: 600
              }}>
                Live Multi-Tier
              </span>
            </div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
              Campus Hierarchy & Institutional Directory
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: '13.5px', color: 'rgba(255, 255, 255, 0.82)', maxWidth: '680px', lineHeight: 1.5 }}>
              Explore the end-to-end chain of command: from Super Admins and School Principals to Faculty Teachers and Classroom Children. Click any profile card to view exhaustive 360° details.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={fetchTree}
              disabled={loading}
              style={{
                background: 'rgba(255, 255, 255, 0.14)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#FFFFFF',
                borderRadius: '10px',
                padding: '9px 14px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                transition: 'all 0.2s ease'
              }}
              title="Refresh live hierarchy"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Stat Chips */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '12px',
          marginTop: '20px',
          paddingTop: '18px',
          borderTop: '1px solid rgba(255, 255, 255, 0.16)'
        }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '10px 14px' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}>Institutions</div>
            <div style={{ fontSize: '20px', fontWeight: 800, marginTop: '2px' }}>{summaryMetrics.schoolsCount}</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '10px 14px' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}>Administrators</div>
            <div style={{ fontSize: '20px', fontWeight: 800, marginTop: '2px', color: '#FDE047' }}>{summaryMetrics.adminsCount}</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '10px 14px' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}>Faculty / Teachers</div>
            <div style={{ fontSize: '20px', fontWeight: 800, marginTop: '2px', color: '#93C5FD' }}>{summaryMetrics.teachersCount}</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '10px 14px' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}>Classrooms</div>
            <div style={{ fontSize: '20px', fontWeight: 800, marginTop: '2px' }}>{summaryMetrics.classesCount}</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '10px 14px' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}>Enrolled Children</div>
            <div style={{ fontSize: '20px', fontWeight: 800, marginTop: '2px', color: '#86EFAC' }}>{summaryMetrics.studentsCount}</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '10px 14px' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}>Present Today</div>
            <div style={{ fontSize: '20px', fontWeight: 800, marginTop: '2px', color: '#6EE7B7' }}>
              {summaryMetrics.presentToday} <span style={{ fontSize: '12px', fontWeight: 600, opacity: 0.8 }}>({summaryMetrics.attendanceRate}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Controls & Filter Bar */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '14px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
      }}>
        {/* Search Input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'var(--bg-app)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '10px',
          padding: '8px 14px',
          flex: '1 1 280px',
          maxWidth: '420px'
        }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search by name, email, roll number, class..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              color: 'var(--text-main)',
              fontSize: '13px',
              width: '100%',
              fontFamily: 'inherit'
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--text-muted)' }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* View Mode Switcher + School Selector + Expand/Collapse */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* School Selector (for Super Admin if multiple schools) */}
          {treeData.length > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <School size={15} color="var(--text-muted)" />
              <select
                value={selectedSchoolId}
                onChange={(e) => setSelectedSchoolId(e.target.value)}
                style={{
                  background: 'var(--bg-app)',
                  color: 'var(--text-main)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '7px 12px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="ALL">All Schools ({treeData.length})</option>
                {treeData.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.code || s.admin_id})</option>
                ))}
              </select>
            </div>
          )}

          {/* Perspective View Toggle */}
          <div style={{
            display: 'inline-flex',
            background: 'var(--bg-app)',
            borderRadius: '10px',
            padding: '3px',
            border: '1px solid var(--border-subtle)'
          }}>
            <button
              onClick={() => setViewMode('by_teacher')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                border: 'none',
                background: viewMode === 'by_teacher' ? 'var(--brand-blue)' : 'transparent',
                color: viewMode === 'by_teacher' ? '#FFFFFF' : 'var(--text-muted)',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Users size={13} />
              <span>By Teachers & Staff</span>
            </button>
            <button
              onClick={() => setViewMode('by_class')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                border: 'none',
                background: viewMode === 'by_class' ? 'var(--brand-blue)' : 'transparent',
                color: viewMode === 'by_class' ? '#FFFFFF' : 'var(--text-muted)',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <BookOpen size={13} />
              <span>By Classrooms</span>
            </button>
          </div>

          {/* Expand / Collapse Controls */}
          <div style={{ display: 'inline-flex', gap: '6px' }}>
            <button
              onClick={expandAll}
              style={{
                background: 'var(--bg-app)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-main)',
                padding: '6px 10px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              title="Expand all nodes"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              style={{
                background: 'var(--bg-app)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
                padding: '6px 10px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              title="Collapse all nodes"
            >
              Collapse
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Tree Visualizer Viewport */}
      {loading ? (
        <div style={{
          background: 'var(--bg-surface)',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          padding: '60px 20px',
          textAlign: 'center',
          color: 'var(--text-muted)'
        }}>
          <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto 16px', color: 'var(--brand-blue)' }} />
          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>Loading Organization Hierarchy...</div>
          <div style={{ fontSize: '13px', marginTop: '4px' }}>Building multi-tier relations for schools, staff, and classrooms</div>
        </div>
      ) : displayedSchools.length === 0 ? (
        <div style={{
          background: 'var(--bg-surface)',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          padding: '50px 20px',
          textAlign: 'center',
          color: 'var(--text-muted)'
        }}>
          <Building2 size={40} style={{ margin: '0 auto 12px', color: 'var(--text-muted)', opacity: 0.5 }} />
          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>No Institutions Found</div>
          <p style={{ fontSize: '13px', marginTop: '4px' }}>There are no active schools registered in this scope.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {displayedSchools.map(school => (
            <SchoolHierarchyCard
              key={school.id}
              school={school}
              viewMode={viewMode}
              expandedNodes={expandedNodes}
              onToggleNode={toggleNode}
              onSelectEntity={setSelectedEntity}
              searchTerm={searchTerm}
              matchesSearch={matchesSearch}
            />
          ))}
        </div>
      )}

      {/* 4. Slide-Over 360° Profile Drawer */}
      {selectedEntity && (
        <ProfileSlideOverDrawer
          entity={selectedEntity}
          profileData={drawerProfile}
          loading={loadingProfile}
          onClose={() => setSelectedEntity(null)}
          onCopy={copyToClipboard}
          copiedKey={copiedKey}
          onSwitchTab={onSwitchTab}
        />
      )}
    </div>
  );
}

// =============================================================================
// Component: School Node & Tree Branch
// =============================================================================
function SchoolHierarchyCard({
  school,
  viewMode,
  expandedNodes,
  onToggleNode,
  onSelectEntity,
  searchTerm,
  matchesSearch
}) {
  const isSchoolExpanded = expandedNodes[`school_${school.id}`];

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1.5px solid var(--border-subtle)',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)'
    }}>
      {/* School Root Header */}
      <div
        onClick={(e) => onToggleNode(`school_${school.id}`, e)}
        style={{
          padding: '16px 20px',
          background: 'linear-gradient(90deg, rgba(16, 42, 86, 0.05) 0%, transparent 100%)',
          borderBottom: isSchoolExpanded ? '1px solid var(--border-subtle)' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          userSelect: 'none',
          gap: '12px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '240px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'var(--bg-app)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--brand-navy)'
          }}>
            {isSchoolExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </div>

          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #102A56 0%, #1E3A8A 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            flexShrink: 0
          }}>
            <School size={22} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>
                {school.name}
              </span>
              <span style={{
                background: 'rgba(21, 94, 239, 0.1)',
                color: 'var(--brand-blue)',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700
              }}>
                {school.code || school.admin_id}
              </span>
              {school.city && (
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  📍 {school.city}, {school.state}
                </span>
              )}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Institution Root • Click row to expand/collapse
            </div>
          </div>
        </div>

        {/* Right Action: Inspect School Profile + Counts */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <span style={{ background: 'var(--bg-app)', padding: '4px 8px', borderRadius: '6px', fontWeight: 600 }}>
              👨‍🏫 {school.teachers?.length || 0} Faculty
            </span>
            <span style={{ background: 'var(--bg-app)', padding: '4px 8px', borderRadius: '6px', fontWeight: 600 }}>
              🎒 {school.stats?.total_students || 0} Students
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectEntity({ type: 'school', id: school.id, name: school.name });
            }}
            style={{
              background: 'var(--brand-blue)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Eye size={13} />
            <span>School 360°</span>
          </button>
        </div>
      </div>

      {/* Expanded Branches */}
      {isSchoolExpanded && (
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Branch Tier 1: School Administrators (Principals / Admin Office) */}
          {(school.admins || []).length > 0 && (
            <div style={{
              background: 'rgba(245, 158, 11, 0.04)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              borderRadius: '12px',
              padding: '14px 18px'
            }}>
              <div style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#D97706',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                marginBottom: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                <ShieldCheck size={15} />
                <span>School Administrative Leadership ({school.admins.length})</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
                {school.admins.map(admin => (
                  <div
                    key={admin.id}
                    onClick={() => onSelectEntity({ type: 'admin', id: admin.id, name: admin.full_name })}
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#F59E0B';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'rgba(245, 158, 11, 0.15)',
                        color: '#D97706',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '14px'
                      }}>
                        👔
                      </div>
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-main)' }}>
                          {admin.full_name}
                        </div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                          {admin.email || admin.phone || 'Authorized School Admin'}
                        </div>
                      </div>
                    </div>

                    <span style={{ fontSize: '11px', color: '#D97706', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      Profile <ChevronRight size={13} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Branch Tier 2: Perspective View (By Teachers OR By Classrooms) */}
          {viewMode === 'by_teacher' ? (
            /* TEACHER-CENTRIC TREE VIEW */
            <div>
              <div style={{
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px'
              }}>
                <Users size={16} color="var(--brand-blue)" />
                <span>Teachers & Assigned Classroom Cohorts</span>
                <span style={{
                  fontSize: '11px',
                  background: 'var(--bg-app)',
                  color: 'var(--text-muted)',
                  padding: '2px 8px',
                  borderRadius: '10px'
                }}>
                  {school.teachers?.length || 0} Faculty Members
                </span>
              </div>

              {(!school.teachers || school.teachers.length === 0) ? (
                <div style={{ padding: '20px', background: 'var(--bg-app)', borderRadius: '10px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  No teachers registered in this school yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {school.teachers.map(teacher => (
                    <TeacherNodeCard
                      key={teacher.id}
                      schoolId={school.id}
                      teacher={teacher}
                      expandedNodes={expandedNodes}
                      onToggleNode={onToggleNode}
                      onSelectEntity={onSelectEntity}
                      searchTerm={searchTerm}
                      matchesSearch={matchesSearch}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* CLASSROOM-CENTRIC TREE VIEW */
            <div>
              <div style={{
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px'
              }}>
                <BookOpen size={16} color="var(--brand-blue)" />
                <span>Classroom Roster & Enrolled Students</span>
                <span style={{
                  fontSize: '11px',
                  background: 'var(--bg-app)',
                  color: 'var(--text-muted)',
                  padding: '2px 8px',
                  borderRadius: '10px'
                }}>
                  {school.classes?.length || 0} Classes
                </span>
              </div>

              {(!school.classes || school.classes.length === 0) ? (
                <div style={{ padding: '20px', background: 'var(--bg-app)', borderRadius: '10px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  No classrooms configured in this school yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {school.classes.map(cls => (
                    <ClassroomNodeCard
                      key={cls.id}
                      schoolId={school.id}
                      cls={cls}
                      expandedNodes={expandedNodes}
                      onToggleNode={onToggleNode}
                      onSelectEntity={onSelectEntity}
                      searchTerm={searchTerm}
                      matchesSearch={matchesSearch}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Component: Teacher Node Card (Expandable to Classes & Students)
// =============================================================================
function TeacherNodeCard({
  schoolId,
  teacher,
  expandedNodes,
  onToggleNode,
  onSelectEntity,
  searchTerm,
  matchesSearch
}) {
  const nodeKey = `teacher_${schoolId}_${teacher.id}`;
  const isExpanded = expandedNodes[nodeKey];
  const classes = teacher.classes || [];

  return (
    <div style={{
      border: '1px solid var(--border-subtle)',
      borderRadius: '12px',
      background: 'var(--bg-surface)',
      overflow: 'hidden'
    }}>
      {/* Teacher Bar */}
      <div
        onClick={(e) => onToggleNode(nodeKey, e)}
        style={{
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          background: isExpanded ? 'rgba(21, 94, 239, 0.03)' : 'transparent',
          borderBottom: isExpanded ? '1px solid var(--border-subtle)' : 'none',
          userSelect: 'none',
          flexWrap: 'wrap',
          gap: '10px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            background: 'var(--bg-app)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--brand-blue)'
          }}>
            {isExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          </div>

          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(21, 94, 239, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}>
            👩‍🏫
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>
                {teacher.full_name}
              </span>
              <span style={{
                background: 'rgba(16, 42, 86, 0.08)',
                color: 'var(--brand-navy)',
                fontSize: '10.5px',
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: '6px'
              }}>
                Faculty
              </span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
              {teacher.email || teacher.phone || 'Class Instructor'}
            </div>
          </div>
        </div>

        {/* Right Info & Profile button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            fontSize: '11.5px',
            color: 'var(--text-muted)',
            background: 'var(--bg-app)',
            padding: '3px 8px',
            borderRadius: '6px',
            fontWeight: 600
          }}>
            {classes.length} {classes.length === 1 ? 'Class' : 'Classes'} • {teacher.students_count} Children
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectEntity({ type: 'teacher', id: teacher.id, name: teacher.full_name });
            }}
            style={{
              background: 'none',
              border: '1px solid var(--border-subtle)',
              color: 'var(--brand-blue)',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Eye size={12} />
            <span>Profile</span>
          </button>
        </div>
      </div>

      {/* Expanded: Assigned Classes */}
      {isExpanded && (
        <div style={{ padding: '14px 16px 14px 44px', background: 'var(--bg-app)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {classes.length === 0 ? (
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', padding: '6px 0' }}>
              No specific classrooms assigned yet. Available as general school faculty.
            </div>
          ) : (
            classes.map(cls => (
              <ClassroomSubNode
                key={cls.id}
                parentKey={nodeKey}
                cls={cls}
                expandedNodes={expandedNodes}
                onToggleNode={onToggleNode}
                onSelectEntity={onSelectEntity}
                searchTerm={searchTerm}
                matchesSearch={matchesSearch}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Component: Classroom Node (Direct View Mode)
// =============================================================================
function ClassroomNodeCard({
  schoolId,
  cls,
  expandedNodes,
  onToggleNode,
  onSelectEntity,
  searchTerm,
  matchesSearch
}) {
  const nodeKey = `class_${schoolId}_${cls.id}`;
  const isExpanded = expandedNodes[nodeKey];
  const students = cls.students || [];

  return (
    <div style={{
      border: '1px solid var(--border-subtle)',
      borderRadius: '12px',
      background: 'var(--bg-surface)',
      overflow: 'hidden'
    }}>
      <div
        onClick={(e) => onToggleNode(nodeKey, e)}
        style={{
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          background: isExpanded ? 'rgba(108, 76, 232, 0.04)' : 'transparent',
          borderBottom: isExpanded ? '1px solid var(--border-subtle)' : 'none',
          userSelect: 'none',
          flexWrap: 'wrap',
          gap: '10px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            background: 'var(--bg-app)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--brand-blue)'
          }}>
            {isExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          </div>

          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(108, 76, 232, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}>
            🏫
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)' }}>
                Grade {cls.grade} - Section {cls.section}
              </span>
              {cls.room_number && (
                <span style={{
                  background: 'var(--bg-app)',
                  color: 'var(--text-muted)',
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '2px 7px',
                  borderRadius: '6px'
                }}>
                  {cls.room_number}
                </span>
              )}
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
              Academic Year {cls.academic_year || '2026-2027'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            fontSize: '11.5px',
            color: 'var(--text-muted)',
            background: 'var(--bg-app)',
            padding: '3px 8px',
            borderRadius: '6px',
            fontWeight: 600
          }}>
            {students.length} Enrolled Students
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectEntity({ type: 'class', id: cls.id, name: `Grade ${cls.grade}-${cls.section}` });
            }}
            style={{
              background: 'none',
              border: '1px solid var(--border-subtle)',
              color: 'var(--brand-blue)',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Eye size={12} />
            <span>Class Info</span>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div style={{ padding: '14px 16px 14px 44px', background: 'var(--bg-app)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {students.length === 0 ? (
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', padding: '6px 0' }}>
              No students enrolled in this class yet.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
              {students.map(st => (
                <StudentCard
                  key={st.id}
                  student={st}
                  onSelectEntity={onSelectEntity}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Component: Classroom Sub-Node (Inside Teacher View)
// =============================================================================
function ClassroomSubNode({
  parentKey,
  cls,
  expandedNodes,
  onToggleNode,
  onSelectEntity,
  searchTerm,
  matchesSearch
}) {
  const nodeKey = `${parentKey}_class_${cls.id}`;
  const isExpanded = expandedNodes[nodeKey] !== false; // default open
  const students = cls.students || [];

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '10px',
      overflow: 'hidden'
    }}>
      <div
        onClick={(e) => onToggleNode(nodeKey, e)}
        style={{
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          background: 'rgba(0, 0, 0, 0.01)',
          borderBottom: isExpanded ? '1px solid var(--border-subtle)' : 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isExpanded ? <ChevronDown size={14} color="var(--text-muted)" /> : <ChevronRight size={14} color="var(--text-muted)" />}
          <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-main)' }}>
            Grade {cls.grade}-{cls.section}
          </span>
          {cls.assigned_subject && (
            <span style={{
              background: 'rgba(21, 94, 239, 0.08)',
              color: 'var(--brand-blue)',
              fontSize: '11px',
              fontWeight: 600,
              padding: '1px 6px',
              borderRadius: '5px'
            }}>
              {cls.assigned_subject}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
            {students.length} Students
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectEntity({ type: 'class', id: cls.id, name: `Grade ${cls.grade}-${cls.section}` });
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--brand-blue)',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              padding: 0
            }}
          >
            Details
          </button>
        </div>
      </div>

      {isExpanded && (
        <div style={{ padding: '12px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '8px' }}>
          {students.length === 0 ? (
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', padding: '6px' }}>
              No students enrolled in this section.
            </div>
          ) : (
            students.map(st => (
              <StudentCard
                key={st.id}
                student={st}
                onSelectEntity={onSelectEntity}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Component: Student Mini Card (Click to open Profile Drawer)
// =============================================================================
function StudentCard({ student, onSelectEntity }) {
  const isPresent = student.today_attendance_status === 'PRESENT';
  const isLate = student.today_attendance_status === 'LATE';
  const isAbsent = student.today_attendance_status === 'ABSENT';

  const guardians = student.guardians || [];
  const primaryGuardian = guardians[0];

  return (
    <div
      onClick={() => onSelectEntity({ type: 'student', id: student.id, name: `${student.first_name} ${student.last_name}` })}
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        padding: '10px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--brand-blue)';
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = '0 4px 10px rgba(21, 94, 239, 0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
        {/* Roll Number Circle */}
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'rgba(18, 183, 106, 0.12)',
          color: '#027A48',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: 800,
          flexShrink: 0
        }}>
          #{student.roll_number || '•'}
        </div>

        <div style={{ minWidth: 0 }}>
          <div style={{
            fontSize: '13px',
            fontWeight: 700,
            color: 'var(--text-main)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {student.first_name} {student.last_name}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {primaryGuardian ? `${primaryGuardian.relationship}: ${primaryGuardian.full_name}` : `Adm: ${student.admission_number || 'N/A'}`}
          </div>
        </div>
      </div>

      {/* Today's Attendance Chip */}
      <div style={{ flexShrink: 0 }}>
        {isPresent ? (
          <span style={{
            background: 'rgba(18, 183, 106, 0.15)',
            color: '#027A48',
            fontSize: '10.5px',
            fontWeight: 700,
            padding: '2px 7px',
            borderRadius: '10px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px'
          }}>
            <CheckCircle2 size={11} /> Present
          </span>
        ) : isLate ? (
          <span style={{
            background: 'rgba(245, 158, 11, 0.15)',
            color: '#B45309',
            fontSize: '10.5px',
            fontWeight: 700,
            padding: '2px 7px',
            borderRadius: '10px'
          }}>
            Late
          </span>
        ) : isAbsent ? (
          <span style={{
            background: 'rgba(239, 68, 68, 0.15)',
            color: '#B91C1C',
            fontSize: '10.5px',
            fontWeight: 700,
            padding: '2px 7px',
            borderRadius: '10px'
          }}>
            Absent
          </span>
        ) : (
          <span style={{
            background: 'var(--bg-app)',
            color: 'var(--text-muted)',
            fontSize: '10px',
            fontWeight: 600,
            padding: '2px 6px',
            borderRadius: '6px'
          }}>
            Not Logged
          </span>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// Component: Slide-Over 360° Profile Drawer
// =============================================================================
function ProfileSlideOverDrawer({
  entity,
  profileData,
  loading,
  onClose,
  onCopy,
  copiedKey,
  onSwitchTab
}) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'flex-end',
      background: 'rgba(7, 21, 39, 0.55)',
      backdropFilter: 'blur(4px)',
      animation: 'fadeIn 0.2s ease-out'
    }}
    onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '520px',
          height: '100%',
          background: 'var(--bg-surface)',
          borderLeft: '1px solid var(--border-subtle)',
          boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.18)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Drawer Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-app)',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              background: 'var(--brand-blue)',
              color: '#FFFFFF',
              borderRadius: '6px',
              padding: '3px 8px',
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase'
            }}>
              {entity.type} 360°
            </span>
            <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)' }}>
              Complete Profile Dossier
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '6px',
              cursor: 'pointer',
              color: 'var(--text-muted)'
            }}
            title="Close Drawer (Esc)"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Content */}
        {loading ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 12px', color: 'var(--brand-blue)' }} />
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>Loading Profile Details...</div>
          </div>
        ) : !profileData ? (
          <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <AlertCircle size={32} style={{ margin: '0 auto 10px', color: '#EF4444' }} />
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>Profile Record Unavailable</div>
            <div style={{ fontSize: '13px', marginTop: '4px' }}>Could not fetch complete details for this entity ID.</div>
          </div>
        ) : (
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {/* Entity-specific Renderer */}
            {entity.type === 'student' && (
              <StudentProfileDossier data={profileData} onCopy={onCopy} copiedKey={copiedKey} onSwitchTab={onSwitchTab} />
            )}
            {(entity.type === 'teacher' || entity.type === 'admin') && (
              <StaffProfileDossier data={profileData} onCopy={onCopy} copiedKey={copiedKey} onSwitchTab={onSwitchTab} />
            )}
            {entity.type === 'school' && (
              <SchoolProfileDossier data={profileData} onCopy={onCopy} copiedKey={copiedKey} />
            )}
            {entity.type === 'class' && (
              <ClassProfileDossier data={profileData} onCopy={onCopy} copiedKey={copiedKey} />
            )}
            {entity.type === 'parent' && (
              <ParentProfileDossier data={profileData} onCopy={onCopy} copiedKey={copiedKey} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// Sub-view: Student Profile Dossier
// =============================================================================
function StudentProfileDossier({ data, onCopy, copiedKey, onSwitchTab }) {
  const p = data.profile || {};
  const att = data.attendance || {};
  const fees = data.fees || {};
  const guardians = data.guardians || [];

  return (
    <>
      {/* Top Banner Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(21, 94, 239, 0.08) 0%, rgba(16, 42, 86, 0.04) 100%)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '14px',
        padding: '18px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          fontWeight: 800,
          flexShrink: 0
        }}>
          🎒
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>
            {p.first_name} {p.last_name}
          </div>
          <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Grade {p.grade} - Section {p.section} • Roll #{p.roll_number || 'N/A'}
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--brand-blue)', fontWeight: 600, marginTop: '3px' }}>
            Admission No: {p.admission_number || 'N/A'}
          </div>
        </div>
      </div>

      {/* Attendance & Vitality Stats */}
      <div style={{
        background: 'var(--bg-app)',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>
          Attendance Status
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Today's Check-in</div>
            <div style={{
              fontSize: '15px',
              fontWeight: 800,
              marginTop: '4px',
              color: att.today?.status === 'PRESENT' ? '#10B981' : (att.today?.status === 'LATE' ? '#F59E0B' : '#EF4444')
            }}>
              {att.today?.status || 'NOT MARKED'}
            </div>
            {att.today?.check_in_time && (
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                🕒 {att.today.check_in_time}
              </div>
            )}
          </div>
          <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>30-Day Attendance Rate</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#155EEF', marginTop: '4px' }}>
              {att.thirty_day_rate || 100}%
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {att.present_days} of {att.total_logged_days || 0} days present
            </div>
          </div>
        </div>
      </div>

      {/* Class Teacher Information */}
      <div style={{
        background: 'var(--bg-surface)',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
          Assigned Class Teacher
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>
              {p.class_teacher_name || 'Class Teacher'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {p.class_teacher_phone || p.class_teacher_email || 'DPS Faculty'}
            </div>
          </div>
          {p.class_teacher_phone && (
            <a
              href={`tel:${p.class_teacher_phone}`}
              style={{
                background: 'rgba(21, 94, 239, 0.1)',
                color: 'var(--brand-blue)',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Phone size={13} /> Call
            </a>
          )}
        </div>
      </div>

      {/* Parents & Guardians Section */}
      <div style={{
        background: 'var(--bg-surface)',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>
          Registered Parents & Guardians ({guardians.length})
        </div>
        {guardians.length === 0 ? (
          <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            No parents linked yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {guardians.map((g, idx) => (
              <div key={idx} style={{
                background: 'var(--bg-app)',
                borderRadius: '10px',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
                      {g.full_name}
                    </span>
                    <span style={{
                      background: 'rgba(16, 42, 86, 0.08)',
                      color: 'var(--brand-navy)',
                      fontSize: '10.5px',
                      fontWeight: 600,
                      padding: '1px 6px',
                      borderRadius: '4px'
                    }}>
                      {g.relationship || 'Parent'}
                    </span>
                    {g.is_kyc_verified && (
                      <span style={{ color: '#10B981', fontSize: '11px', display: 'inline-flex', alignItems: 'center' }}>
                        <CheckCircle2 size={12} />
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    📞 {g.phone || 'Phone not registered'} • ✉️ {g.email || 'Email not registered'}
                  </div>
                </div>

                {g.phone && (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <a
                      href={`tel:${g.phone}`}
                      style={{
                        background: '#10B981',
                        color: '#FFFFFF',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Phone size={11} /> Call
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fee & Accounts Summary */}
      <div style={{
        background: 'var(--bg-surface)',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Fee Ledger & Invoices
          </div>
          {onSwitchTab && (
            <button
              onClick={() => onSwitchTab('fees')}
              style={{ background: 'none', border: 'none', color: 'var(--brand-blue)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
            >
              Open Fee Portal &rarr;
            </button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          <div style={{ background: 'var(--bg-app)', padding: '10px', borderRadius: '8px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Billed</div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
              ₹{fees.total_billed || 0}
            </div>
          </div>
          <div style={{ background: 'var(--bg-app)', padding: '10px', borderRadius: '8px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Paid (UPI)</div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#10B981', marginTop: '2px' }}>
              ₹{fees.total_paid || 0}
            </div>
          </div>
          <div style={{ background: 'var(--bg-app)', padding: '10px', borderRadius: '8px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Pending Dues</div>
            <div style={{
              fontSize: '14px',
              fontWeight: 800,
              color: (fees.pending_dues || 0) > 0 ? '#EF4444' : '#10B981',
              marginTop: '2px'
            }}>
              ₹{fees.pending_dues || 0}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// =============================================================================
// Sub-view: Staff Profile Dossier (Teacher or Admin)
// =============================================================================
function StaffProfileDossier({ data, onCopy, copiedKey, onSwitchTab }) {
  const p = data.profile || {};
  const classes = data.assigned_classes || [];
  const stats = data.stats || {};
  const isTeacher = p.role === 'TEACHER';

  return (
    <>
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 42, 86, 0.08) 0%, rgba(21, 94, 239, 0.05) 100%)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '14px',
        padding: '18px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: isTeacher ? 'linear-gradient(135deg, #155EEF 0%, #1E40AF 100%)' : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          fontWeight: 800,
          flexShrink: 0
        }}>
          {isTeacher ? '👩‍🏫' : '👔'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>
            {p.full_name}
          </div>
          <div style={{ fontSize: '12.5px', color: 'var(--brand-blue)', fontWeight: 700, marginTop: '2px' }}>
            {p.role} • {p.school_name || 'EduBandhan Campus'}
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Member since {p.created_at ? new Date(p.created_at).toLocaleDateString() : 'Active Session'}
          </div>
        </div>
      </div>

      {/* Contact Channels */}
      <div style={{
        background: 'var(--bg-surface)',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Contact Information
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
            <Mail size={15} color="var(--brand-blue)" />
            <span>{p.email || 'Email not listed'}</span>
          </div>
          {p.email && (
            <button
              onClick={() => onCopy(p.email, 'email')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--brand-blue)', fontSize: '12px', fontWeight: 600 }}
            >
              {copiedKey === 'email' ? 'Copied!' : 'Copy'}
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
            <Phone size={15} color="#10B981" />
            <span>{p.phone || 'Phone not listed'}</span>
          </div>
          {p.phone && (
            <a
              href={`tel:${p.phone}`}
              style={{ color: '#10B981', fontSize: '12px', fontWeight: 700, textDecoration: 'none' }}
            >
              Call Direct
            </a>
          )}
        </div>
      </div>

      {/* Teacher Assigned Classrooms Roster */}
      {isTeacher && (
        <div style={{
          background: 'var(--bg-surface)',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>
            Assigned Classrooms & Subjects ({classes.length})
          </div>

          {classes.length === 0 ? (
            <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              No classes currently mapped. Available for general subject substitutions.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {classes.map((cls, idx) => (
                <div key={idx} style={{
                  background: 'var(--bg-app)',
                  borderRadius: '10px',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--text-main)' }}>
                        Grade {cls.grade}-{cls.section}
                      </span>
                      {cls.is_primary_class_teacher && (
                        <span style={{
                          background: 'rgba(16, 185, 129, 0.15)',
                          color: '#059669',
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: '4px'
                        }}>
                          Class Teacher
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Subject: {cls.subject || 'Class Teacher'} • Room {cls.room_number || 'Main Building'}
                    </div>
                  </div>

                  <span style={{
                    fontSize: '11.5px',
                    fontWeight: 700,
                    color: 'var(--brand-blue)',
                    background: 'var(--bg-surface)',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    {cls.student_count || 0} Students
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* KPI Stats */}
      <div style={{
        background: 'var(--bg-app)',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
          Operational Workload
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Students Guided</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
              {stats.total_students_taught || stats.student_count || 0}
            </div>
          </div>
          <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Consultations Held</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-blue)', marginTop: '4px' }}>
              {stats.total_consultations || 0}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// =============================================================================
// Sub-view: School Profile Dossier
// =============================================================================
function SchoolProfileDossier({ data, onCopy, copiedKey }) {
  const s = data.profile || {};
  const admins = data.administrators || [];

  return (
    <>
      <div style={{
        background: 'linear-gradient(135deg, #102A56 0%, #155EEF 100%)',
        color: '#FFFFFF',
        borderRadius: '14px',
        padding: '20px',
        position: 'relative'
      }}>
        <div style={{ fontSize: '20px', fontWeight: 800 }}>{s.name}</div>
        <div style={{ fontSize: '13px', opacity: 0.85, marginTop: '4px' }}>
          School Code: {s.code || s.admin_id} • SaaS Tier: {s.saas_tier || 'Standard'}
        </div>
        <div style={{ fontSize: '12px', opacity: 0.75, marginTop: '4px' }}>
          📍 {s.address ? `${s.address}, ` : ''}{s.city}, {s.state} - {s.pincode}
        </div>
      </div>

      <div style={{
        background: 'var(--bg-surface)',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>
          Campus Vitality Metrics
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          <div style={{ background: 'var(--bg-app)', padding: '12px', borderRadius: '10px' }}>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Total Faculty</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>{s.teacher_count || 0}</div>
          </div>
          <div style={{ background: 'var(--bg-app)', padding: '12px', borderRadius: '10px' }}>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Total Students</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#10B981', marginTop: '2px' }}>{s.student_count || 0}</div>
          </div>
          <div style={{ background: 'var(--bg-app)', padding: '12px', borderRadius: '10px' }}>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Classrooms</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>{s.class_count || 0}</div>
          </div>
          <div style={{ background: 'var(--bg-app)', padding: '12px', borderRadius: '10px' }}>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Fee Collection</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#155EEF', marginTop: '2px' }}>₹{s.fee_collected || 0}</div>
          </div>
        </div>
      </div>

      <div style={{
        background: 'var(--bg-surface)',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
          Institutional Contact
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div>✉️ {s.contact_email || 'contact@school.edu'}</div>
          <div>📞 {s.contact_phone || '+91 9876543210'}</div>
          <div>⏰ Morning Cutoff: {s.morning_cutoff_time || '08:30:00'}</div>
        </div>
      </div>
    </>
  );
}

// =============================================================================
// Sub-view: Class Profile Dossier
// =============================================================================
function ClassProfileDossier({ data, onCopy, copiedKey }) {
  const c = data.profile || {};
  const teachers = data.subject_teachers || [];
  const students = data.students || [];

  return (
    <>
      <div style={{
        background: 'linear-gradient(135deg, rgba(108, 76, 232, 0.1) 0%, rgba(21, 94, 239, 0.05) 100%)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '14px',
        padding: '18px 20px'
      }}>
        <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>
          Grade {c.grade} - Section {c.section}
        </div>
        <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
          Room {c.room_number || 'Room 101'} • Academic Year {c.academic_year || '2026-2027'}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--brand-blue)', fontWeight: 600, marginTop: '4px' }}>
          Class Teacher: {c.class_teacher_name || 'Designated Class Teacher'}
        </div>
      </div>

      <div style={{
        background: 'var(--bg-surface)',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
          Faculty & Subject Teachers ({teachers.length})
        </div>
        {teachers.length === 0 ? (
          <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            No subject teachers mapped yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {teachers.map((t, idx) => (
              <div key={idx} style={{
                background: 'var(--bg-app)',
                padding: '10px 12px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>{t.full_name}</span>
                <span style={{ fontSize: '11.5px', color: 'var(--brand-blue)', fontWeight: 600 }}>{t.subject}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{
        background: 'var(--bg-surface)',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
          Enrolled Student Body ({students.length})
        </div>
        <div style={{ maxHeight: '240px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {students.map((st, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 10px',
              borderRadius: '6px',
              background: 'var(--bg-app)',
              fontSize: '12.5px'
            }}>
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                #{st.roll_number || idx + 1} {st.first_name} {st.last_name}
              </span>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                color: st.today_status === 'PRESENT' ? '#10B981' : '#EF4444'
              }}>
                {st.today_status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// =============================================================================
// Sub-view: Parent Profile Dossier
// =============================================================================
function ParentProfileDossier({ data, onCopy, copiedKey }) {
  const p = data.profile || {};
  const children = data.children || [];

  return (
    <>
      <div style={{
        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.08) 0%, rgba(108, 76, 232, 0.04) 100%)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '14px',
        padding: '18px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          fontWeight: 800,
          flexShrink: 0
        }}>
          👨‍👩‍👧
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>
            {p.full_name}
          </div>
          <div style={{ fontSize: '12.5px', color: '#EC4899', fontWeight: 700, marginTop: '2px' }}>
            {p.relationship || 'Guardian'} {p.is_kyc_verified ? '• KYC Verified' : ''}
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
            📞 {p.phone || 'Phone not listed'} • ✉️ {p.email || 'Email not listed'}
          </div>
        </div>
      </div>

      <div style={{
        background: 'var(--bg-surface)',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
          Linked Enrolled Children ({children.length})
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {children.map((child, idx) => (
            <div key={idx} style={{
              background: 'var(--bg-app)',
              padding: '10px 12px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-main)' }}>
                  {child.first_name} {child.last_name}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                  Grade {child.grade}-{child.section} • Roll #{child.roll_number}
                </div>
              </div>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                color: child.today_status === 'PRESENT' ? '#10B981' : '#EF4444'
              }}>
                {child.today_status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
