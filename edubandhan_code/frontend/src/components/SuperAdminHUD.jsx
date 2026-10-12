import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  School, 
  Users, 
  GraduationCap, 
  CreditCard, 
  Plus, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Building2, 
  Key, 
  Copy, 
  Check, 
  Sparkles,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Network
} from 'lucide-react';

export default function SuperAdminHUD({ onSwitchTab, onSwitchRole, currentUser, onRequireAuth }) {
  const [stats, setStats] = useState({
    total_schools: 1,
    total_admins: 1,
    total_teachers: 3,
    total_students: 5,
    total_parents: 2,
    platform_escrow_volume: 14500,
    system_health: '100% Operational (Neon PostgreSQL + pgvector)'
  });
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // New School Admin form state
  const [formData, setFormData] = useState({
    school_name: '',
    admin_id: '',
    principal_name: '',
    contact_email: '',
    contact_phone: '',
    city: 'Rourkela',
    state: 'Odisha',
    code: '',
    password: 'edubandhan2026'
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formMsg, setFormMsg] = useState({ type: '', text: '' });

  const fetchSuperAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, schoolsRes] = await Promise.all([
        fetch('/api/super-admin/stats'),
        fetch('/api/super-admin/schools')
      ]);

      if (statsRes.ok) {
        const sData = await statsRes.json();
        setStats(sData);
      }
      if (schoolsRes.ok) {
        const scData = await schoolsRes.json();
        setSchools(scData.schools || []);
      }
    } catch (err) {
      console.error('Failed to load Super Admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuperAdminData();
  }, []);

  const handleCopyAdminId = (adminId) => {
    navigator.clipboard.writeText(adminId);
    setCopiedId(adminId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormMsg({ type: '', text: '' });

    try {
      const res = await fetch('/api/super-admin/create-school-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Failed to create School Admin.');
      }

      setFormMsg({
        type: 'success',
        text: `✅ Authorized! School Admin with Admin ID '${formData.admin_id.toUpperCase()}' has been registered in the database!`
      });

      // Refresh list
      fetchSuperAdminData();

      setTimeout(() => {
        setShowCreateModal(false);
        setFormMsg({ type: '', text: '' });
        setFormData({
          school_name: '',
          admin_id: '',
          principal_name: '',
          contact_email: '',
          contact_phone: '',
          city: 'Rourkela',
          state: 'Odisha',
          code: '',
          password: 'edubandhan2026'
        });
      }, 1800);

    } catch (err) {
      setFormMsg({ type: 'error', text: err.message });
    } finally {
      setFormLoading(false);
    }
  };

  const filteredSchools = schools.filter(s => {
    const term = searchTerm.toLowerCase();
    return (
      (s.school_name || '').toLowerCase().includes(term) ||
      (s.admin_id || '').toLowerCase().includes(term) ||
      (s.code || '').toLowerCase().includes(term) ||
      (s.principal_name || '').toLowerCase().includes(term) ||
      (s.city || '').toLowerCase().includes(term)
    );
  });

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 1. Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #102A56 0%, #0A1A35 100%)',
        borderRadius: '16px',
        padding: '28px 32px',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        boxShadow: '0 8px 24px rgba(16, 42, 86, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ maxWidth: '720px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: '20px',
              textTransform: 'uppercase',
              letterSpacing: '0.8px'
            }}>
              Tier 1 • Root Control
            </span>
            <span style={{ fontSize: '12px', color: '#94A3B8' }}>
              Platform Multi-Tenant Authority
            </span>
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.5px' }}>
            ⚡ Super Admin Command Center
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: '#CBD5E1', lineHeight: 1.5 }}>
            Platform owner hub. Under your authority, all school administrators are authorized with unique 
            <strong> Admin IDs</strong>. Teachers and parents cannot register or enter without an Admin ID created here.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => onSwitchTab('organization')}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '9px',
              padding: '12px 18px',
              fontSize: '13.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'transform 0.15s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
          >
            <Network size={18} />
            <span>Org Hierarchy Tree</span>
          </button>

          <button
            onClick={() => {
              if (!currentUser && onRequireAuth) {
                onRequireAuth({ id: 'super_admin', title: 'Authorize & Deploy School Admin' });
                return;
              }
              setShowCreateModal(true);
            }}
            style={{
              backgroundColor: '#155EEF',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '9px',
              padding: '12px 20px',
              fontSize: '13.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(21, 94, 239, 0.4)',
              transition: 'transform 0.15s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
          >
            <Plus size={18} />
            <span>Authorize School Admin</span>
          </button>

          <button
            onClick={fetchSuperAdminData}
            title="Refresh database records"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '9px',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={17} />
          </button>
        </div>
      </div>

      {/* 2. Platform Overview Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '16px'
      }}>
        {[
          { label: 'Authorized Schools', val: stats.total_schools, icon: School, color: '#38BDF8', bg: 'rgba(56, 189, 248, 0.12)' },
          { label: 'School Principals', val: stats.total_admins, icon: ShieldCheck, color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)' },
          { label: 'Teaching Faculty', val: stats.total_teachers, icon: Users, color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.12)' },
          { label: 'Enrolled Students', val: stats.total_students, icon: GraduationCap, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)' },
          { label: 'Verified Parents', val: stats.total_parents, icon: Users, color: '#EC4899', bg: 'rgba(236, 72, 153, 0.12)' },
          { label: 'Total Escrow Fees', val: `₹${(stats.platform_escrow_volume || 0).toLocaleString('en-IN')}`, icon: CreditCard, color: '#06B6D4', bg: 'rgba(6, 182, 212, 0.12)' }
        ].map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '18px 20px',
              boxShadow: 'var(--shadow-xs)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px'
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: m.bg,
                color: m.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Icon size={22} />
              </div>
              <div>
                <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontWeight: 600 }}>{m.label}</span>
                <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '2px 0 0', color: 'var(--text-primary)' }}>{m.val}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Authorized School Admins Table */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: '14px',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        {/* Table Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          marginBottom: '20px'
        }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Authorized Schools &amp; Issued Admin IDs
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
              Admins, teachers, and parents can only enter the portal if their credentials resolve against these authorized Admin IDs.
            </p>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '6px 12px',
            width: '280px',
            gap: '8px'
          }}>
            <Search size={15} color="var(--text-secondary)" />
            <input 
              type="text" 
              placeholder="Search school name or Admin ID..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '12.5px',
                width: '100%',
                color: 'var(--text-primary)'
              }}
            />
          </div>
        </div>

        {/* Table Content */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>School &amp; Location</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Unique Admin ID</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Principal (School Admin)</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Enrolled Stats</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Status</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchools.map((s, idx) => (
                <tr key={s.id || idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  
                  {/* School Name & Location */}
                  <td style={{ padding: '14px', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: '#E8F1FF',
                        color: '#155EEF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800
                      }}>
                        🏫
                      </div>
                      <div>
                        <strong style={{ display: 'block', color: 'var(--text-primary)', fontSize: '13.5px' }}>
                          {s.school_name}
                        </strong>
                        <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                          {s.city}, {s.state}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Unique Admin ID Badge */}
                  <td style={{ padding: '14px', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        backgroundColor: '#102A56',
                        color: '#38BDF8',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontWeight: 800,
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        letterSpacing: '0.5px'
                      }}>
                        {s.admin_id || s.code || 'ADM-DPS-001'}
                      </span>
                      <button
                        onClick={() => handleCopyAdminId(s.admin_id || s.code)}
                        title="Copy Admin ID for sharing with Principal"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: copiedId === (s.admin_id || s.code) ? '#10B981' : 'var(--text-secondary)',
                          cursor: 'pointer',
                          padding: '2px'
                        }}
                      >
                        {copiedId === (s.admin_id || s.code) ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                  </td>

                  {/* Principal Details */}
                  <td style={{ padding: '14px', verticalAlign: 'middle' }}>
                    <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                      {s.principal_name || 'Dr. S. K. Mohanty'}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {s.contact_email || s.principal_email}
                    </div>
                  </td>

                  {/* Enrolled Counts */}
                  <td style={{ padding: '14px', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', gap: '10px', fontSize: '12px' }}>
                      <span title="Teachers registered" style={{ color: '#155EEF', fontWeight: 600 }}>
                        👩‍🏫 {s.teacher_count || 3} Faculty
                      </span>
                      <span title="Students enrolled" style={{ color: '#10B981', fontWeight: 600 }}>
                        🎒 {s.student_count || 5} Students
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td style={{ padding: '14px', verticalAlign: 'middle' }}>
                    <span style={{
                      backgroundColor: 'rgba(16, 185, 129, 0.12)',
                      color: '#059669',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '12px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                      Authorized
                    </span>
                  </td>

                  {/* Action */}
                  <td style={{ padding: '14px', verticalAlign: 'middle' }}>
                    <button
                      onClick={() => {
                        if (onSwitchRole) onSwitchRole('admin');
                        if (onSwitchTab) onSwitchTab('admin');
                      }}
                      title="Inspect this school's full command center and sub-tree"
                      style={{
                        backgroundColor: 'transparent',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#155EEF',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <span>Inspect School</span>
                      <ArrowRight size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Modal: Authorize & Create School Admin */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(2, 6, 23, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '520px',
            padding: '28px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Authorize New School Admin
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Tier 1 Super Admin generation of unique Admin ID
                </span>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
              >
                ✕
              </button>
            </div>

            {formMsg.text && (
              <div style={{
                padding: '10px 14px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '12.5px',
                backgroundColor: formMsg.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                color: formMsg.type === 'success' ? '#059669' : '#DC2626',
                border: `1px solid ${formMsg.type === 'success' ? '#10B981' : '#EF4444'}`
              }}>
                {formMsg.text}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: 'var(--text-primary)' }}>
                  School Name *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Kendriya Vidyalaya Rourkela"
                  value={formData.school_name}
                  onChange={e => {
                    const name = e.target.value;
                    const autoCode = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 4) || 'SCH';
                    setFormData(prev => ({
                      ...prev,
                      school_name: name,
                      code: prev.code || `${autoCode}-002`,
                      admin_id: prev.admin_id || `ADM-${autoCode}-002`
                    }));
                  }}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: 'var(--text-primary)' }}>
                    Unique Admin ID * (Required)
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. ADM-KV-002"
                    value={formData.admin_id}
                    onChange={e => setFormData({ ...formData, admin_id: e.target.value.toUpperCase() })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #155EEF',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      fontSize: '13px',
                      boxSizing: 'border-box'
                    }}
                  />
                  <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>
                    Admin, Teachers &amp; Parents will use this ID to sign in
                  </span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: 'var(--text-primary)' }}>
                    Principal Name *
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Dr. Rajesh Behera"
                    value={formData.principal_name}
                    onChange={e => setFormData({ ...formData, principal_name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: 'var(--text-primary)' }}>
                    Principal Email *
                  </label>
                  <input 
                    type="email" 
                    required
                    placeholder="principal@school.edu.in"
                    value={formData.contact_email}
                    onChange={e => setFormData({ ...formData, contact_email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: 'var(--text-primary)' }}>
                    Contact Phone *
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="+919876543299"
                    value={formData.contact_phone}
                    onChange={e => setFormData({ ...formData, contact_phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: 'var(--text-primary)' }}>
                    City
                  </label>
                  <input 
                    type="text" 
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: 'var(--text-primary)' }}>
                    State
                  </label>
                  <input 
                    type="text" 
                    value={formData.state}
                    onChange={e => setFormData({ ...formData, state: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  style={{
                    backgroundColor: '#155EEF',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(21, 94, 239, 0.3)'
                  }}
                >
                  {formLoading ? 'Authorizing in DB...' : 'Authorize & Issue Admin ID'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
