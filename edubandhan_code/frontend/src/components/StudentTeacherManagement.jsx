import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Plus, 
  Download, 
  Eye, 
  Mail, 
  CalendarOff,
  GraduationCap,
  School,
  FileText,
  Radio,
  MessageSquare,
  Sparkles,
  BookOpen,
  UserCheck,
  X,
  Send,
  AlertCircle
} from 'lucide-react';

export default function StudentTeacherManagement({ onSwitchTab, onRequireAuth, currentUser }) {
  const [activeTab, setActiveTab] = useState('students'); // 'students' | 'teachers' | 'class_rooms'
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [selectedProfile, setSelectedProfile] = useState(null);

  // Classroom Sockets State
  const [classRooms, setClassRooms] = useState([]);
  const [teachersList, setTeachersList] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(null); // room object
  const [submittingRoom, setSubmittingRoom] = useState(false);
  const [notification, setNotification] = useState(null);

  // Create Room Form State
  const [newGrade, setNewGrade] = useState('8');
  const [newSection, setNewSection] = useState('B');
  const [newRoomNo, setNewRoomNo] = useState('Room 204');
  const [newAcademicYear, setNewAcademicYear] = useState('2026-2027');
  const [newClassTeacherId, setNewClassTeacherId] = useState('');
  const [newSubjectTeachers, setNewSubjectTeachers] = useState([
    { teacher_id: '', subject: 'Mathematics' }
  ]);

  // Quick Assign Teacher Form State
  const [assignTeacherId, setAssignTeacherId] = useState('');
  const [assignSubject, setAssignSubject] = useState('Mathematics');
  const [assignIsPrimary, setAssignIsPrimary] = useState(false);

  // Fetch Class Rooms and Teachers
  const loadClassRooms = async () => {
    setLoadingRooms(true);
    try {
      const res = await fetch('/api/admin/class-rooms');
      if (res.ok) {
        const data = await res.json();
        setClassRooms(data.class_rooms || []);
      }
    } catch (err) {
      console.error('Error fetching class rooms:', err);
    } finally {
      setLoadingRooms(false);
    }
  };

  const loadTeachers = async () => {
    try {
      const res = await fetch('/api/admin/teachers');
      if (res.ok) {
        const data = await res.json();
        setTeachersList(data.teachers || []);
        if (data.teachers && data.teachers.length > 0 && !newClassTeacherId) {
          setNewClassTeacherId(data.teachers[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching teachers:', err);
    }
  };

  useEffect(() => {
    loadClassRooms();
    loadTeachers();
  }, []);

  const handleCreateClassRoom = async (e) => {
    e.preventDefault();
    if (!currentUser && onRequireAuth) {
      onRequireAuth({ id: 'management', title: 'Create Class Socket Room' });
      return;
    }
    setSubmittingRoom(true);
    try {
      const payload = {
        grade: newGrade.trim(),
        section: newSection.trim().toUpperCase(),
        room_number: newRoomNo.trim(),
        academic_year: newAcademicYear.trim(),
        class_teacher_id: newClassTeacherId || null,
        subject_teachers: newSubjectTeachers.filter(st => st.teacher_id && st.teacher_id.trim())
      };

      const res = await fetch('/api/admin/create-class-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to create classroom socket room');
      }

      setNotification(`🎉 Classroom Socket Room '${data.room_key}' created! Teachers assigned and parents can now auto-join.`);
      setShowCreateRoomModal(false);
      loadClassRooms();
      setTimeout(() => setNotification(null), 6000);
    } catch (err) {
      alert(err.message || 'Error creating classroom socket room');
    } finally {
      setSubmittingRoom(false);
    }
  };

  const handleAssignTeacher = async (e) => {
    e.preventDefault();
    if (!currentUser && onRequireAuth) {
      onRequireAuth({ id: 'management', title: 'Assign Teacher to Class Room' });
      return;
    }
    if (!showAssignModal || !assignTeacherId) return;
    try {
      const payload = {
        class_id: showAssignModal.id,
        teacher_id: assignTeacherId,
        subject: assignSubject.trim() || 'Subject Teacher',
        is_primary: assignIsPrimary
      };

      const res = await fetch('/api/admin/assign-teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to assign teacher');
      }

      setNotification(`✅ ${data.message}`);
      setShowAssignModal(null);
      loadClassRooms();
      setTimeout(() => setNotification(null), 5000);
    } catch (err) {
      alert(err.message || 'Error assigning teacher');
    }
  };

  const handleOpenSocket = (roomKey) => {
    sessionStorage.setItem('edubandhan_active_channel', roomKey);
    if (onSwitchTab) {
      onSwitchTab('sockets');
    }
  };

  const studentsData = [
    {
      id: "STU-101",
      name: "Aarav Sharma",
      rollNo: "14",
      grade: "Class 5-B",
      guardian: "Rajesh Sharma (Father)",
      phone: "+91 98765 43210",
      attendanceRate: "96.4%",
      status: "Active",
      kycVerified: true,
      pendingFee: 2500,
      avatar: "A"
    },
    {
      id: "STU-102",
      name: "Rohan Mehta",
      rollNo: "22",
      grade: "Class 8-A",
      guardian: "Sunil Mehta (Father)",
      phone: "+91 98765 11223",
      attendanceRate: "94.2%",
      status: "Active",
      kycVerified: true,
      pendingFee: 0,
      avatar: "R"
    },
    {
      id: "STU-103",
      name: "Aditi Singh",
      rollNo: "07",
      grade: "Class 5-B",
      guardian: "Vikram Singh (Father)",
      phone: "+91 98765 77889",
      attendanceRate: "88.0%",
      status: "On Leave",
      kycVerified: true,
      pendingFee: 4200,
      avatar: "A"
    },
    {
      id: "STU-104",
      name: "Priya Patel",
      rollNo: "31",
      grade: "Class 9-C",
      guardian: "Kiran Patel (Mother)",
      phone: "+91 98765 99001",
      attendanceRate: "98.1%",
      status: "Active",
      kycVerified: true,
      pendingFee: 0,
      avatar: "P"
    },
    {
      id: "STU-105",
      name: "Kabir Verma",
      rollNo: "18",
      grade: "Class 8-A",
      guardian: "Amit Verma (Father)",
      phone: "+91 98765 44556",
      attendanceRate: "91.5%",
      status: "Active",
      kycVerified: false,
      pendingFee: 1500,
      avatar: "K"
    }
  ];

  const teachersData = [
    {
      id: "TCH-201",
      name: "Mrs. Sunita Sharma",
      role: "Head Teacher & Mathematics",
      department: "Mathematics",
      assignedClass: "Class 8-B Head",
      experience: "12 Years",
      status: "Active",
      phone: "+91 98765 22334",
      avatar: "S"
    },
    {
      id: "TCH-202",
      name: "Dr. Ananya Roy",
      role: "Senior Science & Biology",
      department: "Science",
      assignedClass: "Class 9-A Science Lab",
      experience: "9 Years",
      status: "Active",
      phone: "+91 98765 33445",
      avatar: "A"
    },
    {
      id: "TCH-203",
      name: "Mr. Vikramaditya Sen",
      role: "Physics & STEM Robotics",
      department: "Physics",
      assignedClass: "Class 10-C Physics",
      experience: "7 Years",
      status: "On Leave",
      phone: "+91 98765 55667",
      avatar: "V"
    }
  ];

  const filteredStudents = studentsData.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.rollNo.includes(searchTerm) ||
                          s.guardian.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === 'all' || s.grade === classFilter;
    return matchesSearch && matchesClass;
  });

  const filteredTeachers = (teachersList.length > 0 ? teachersList : teachersData).filter(t => {
    const name = t.full_name || t.name || '';
    const dept = t.assigned_classes || t.department || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           dept.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      
      {/* Page Title & Controls */}
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
            letterSpacing: '-0.3px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span>Institutional Roster &amp; Classroom Sockets</span>
            <span style={{
              fontSize: '11px',
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              padding: '2px 8px',
              borderRadius: '999px',
              fontWeight: 700
            }}>
              Admin Controlled
            </span>
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
            Configure classroom WebSocket mediums &bull; Assign subject faculty &bull; Auto-join parents on registration
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => {
              if (!currentUser && onRequireAuth) {
                onRequireAuth({ id: 'management', title: 'Create Class Socket Room' });
                return;
              }
              setShowCreateRoomModal(true);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(14, 165, 233, 0.3)'
            }}
          >
            <Radio size={15} />
            <span>+ Create Class Socket Room</span>
          </button>

          <button
            onClick={() => alert("Roster CSV Export generated successfully!")}
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
            <Download size={15} color="var(--text-muted)" />
            <span>Export Roster</span>
          </button>
        </div>
      </div>

      {/* Live Celebratory Notification Banner */}
      {notification && (
        <div style={{
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          borderRadius: '10px',
          padding: '12px 16px',
          color: '#34d399',
          fontSize: '13px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 4px 15px rgba(16, 185, 129, 0.15)'
        }}>
          <Sparkles size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* Roster Switcher Tabs & Summary Counts */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '12px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('class_rooms')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'class_rooms' ? '#0284c7' : 'var(--bg-secondary)',
              color: activeTab === 'class_rooms' ? '#FFFFFF' : 'var(--text-muted)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Radio size={14} />
            <span>Classroom Sockets &amp; Rooms</span>
            <span style={{
              fontSize: '11px',
              backgroundColor: activeTab === 'class_rooms' ? 'rgba(255,255,255,0.25)' : 'var(--border-subtle)',
              padding: '1px 7px',
              borderRadius: '999px'
            }}>
              {classRooms.length || '2'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'students' ? '#1677FF' : 'var(--bg-secondary)',
              color: activeTab === 'students' ? '#FFFFFF' : 'var(--text-muted)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>Students Roster</span>
            <span style={{
              fontSize: '11px',
              backgroundColor: activeTab === 'students' ? 'rgba(255,255,255,0.25)' : 'var(--border-subtle)',
              padding: '1px 6px',
              borderRadius: '999px'
            }}>
              1,248
            </span>
          </button>

          <button
            onClick={() => setActiveTab('teachers')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'teachers' ? '#1677FF' : 'var(--bg-secondary)',
              color: activeTab === 'teachers' ? '#FFFFFF' : 'var(--text-muted)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>Teachers &amp; Faculty</span>
            <span style={{
              fontSize: '11px',
              backgroundColor: activeTab === 'teachers' ? 'rgba(255,255,255,0.25)' : 'var(--border-subtle)',
              padding: '1px 6px',
              borderRadius: '999px'
            }}>
              {teachersList.length || '74'}
            </span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {activeTab === 'students' && (
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)',
                fontSize: '13px',
                color: 'var(--text-main)',
                outline: 'none',
                fontFamily: 'var(--font-sans)'
              }}
            >
              <option value="all">All Classes</option>
              <option value="Class 5-B">Class 5-B</option>
              <option value="Class 8-A">Class 8-A</option>
              <option value="Class 9-C">Class 9-C</option>
            </select>
          )}

          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '6px 12px',
            gap: '8px'
          }}>
            <Search size={14} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder={`Search ${activeTab === 'class_rooms' ? 'rooms...' : activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                fontSize: '12.5px',
                color: 'var(--text-main)',
                fontFamily: 'var(--font-sans)'
              }}
            />
          </div>
        </div>
      </div>

      {/* TAB CONTENT 1: CLASSROOM SOCKETS & ROOMS */}
      {activeTab === 'class_rooms' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Informative Guidance Banner */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.12) 0%, rgba(14, 165, 233, 0.06) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: 'rgba(56, 189, 248, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8'
              }}>
                <Radio size={22} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: 'var(--text-main)' }}>
                  Single Unified Socket Medium: Teachers + Parents + Administration
                </h4>
                <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  Rooms created here appear dynamically in the Parent Registration dropdown. When a parent registers with your Admin ID, they auto-join this socket medium!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowCreateRoomModal(true)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#0284c7',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '12.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Plus size={14} />
              <span>New Socket Room</span>
            </button>
          </div>

          {/* Class Rooms Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
            gap: '16px'
          }}>
            {classRooms.map((room) => {
              const assignedTeachers = room.assigned_teachers || [];
              const roomKey = room.room_key || `class-${room.grade.toLowerCase()}${room.section.toLowerCase()}`;

              return (
                <div 
                  key={room.id}
                  className="glass-panel"
                  style={{
                    padding: '20px',
                    borderRadius: '14px',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '16px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    transition: 'transform 0.2s ease, border-color 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    
                    {/* Top Row: Class Title & Socket Pill */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '20px' }}>📚</span>
                          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>
                            Class {room.grade}-{room.section}
                          </h3>
                        </div>
                        <p style={{ margin: '3px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                          {room.room_number || 'Room 101'} &bull; {room.academic_year || '2026-2027'}
                        </p>
                      </div>

                      <div style={{
                        backgroundColor: 'rgba(16, 185, 129, 0.12)',
                        border: '1px solid rgba(16, 185, 129, 0.35)',
                        padding: '3px 8px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#10b981',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        <span className="pulse-dot" style={{ width: '6px', height: '6px' }}></span>
                        <span>#{roomKey}</span>
                      </div>
                    </div>

                    {/* Class Teacher Badge */}
                    <div style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: '1px solid var(--border-subtle)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(2, 132, 199, 0.2)',
                          color: '#0284c7',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: 700
                        }}>
                          👩‍🏫
                        </div>
                        <div>
                          <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>
                            Primary Class Teacher
                          </span>
                          <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
                            {room.primary_teacher_name || 'Pending Principal Assignment'}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setShowAssignModal(room);
                          setAssignIsPrimary(true);
                          setAssignSubject('Class Teacher');
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#0284c7',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                      >
                        Change
                      </button>
                    </div>

                    {/* Assigned Subject Teachers */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>
                          Assigned Subject Faculty:
                        </span>
                        <button
                          onClick={() => {
                            setShowAssignModal(room);
                            setAssignIsPrimary(false);
                            setAssignSubject('Mathematics');
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#38bdf8',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}
                        >
                          <Plus size={11} />
                          <span>Add Faculty</span>
                        </button>
                      </div>

                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {assignedTeachers.length > 0 ? (
                          assignedTeachers.map((t, idx) => (
                            <span 
                              key={idx}
                              style={{
                                backgroundColor: 'var(--bg-surface)',
                                border: '1px solid var(--border-subtle)',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                fontSize: '11px',
                                color: 'var(--text-main)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <span>{t.teacher_avatar || '👩‍🏫'}</span>
                              <strong>{t.teacher_name}</strong>
                              <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>({t.subject})</span>
                            </span>
                          ))
                        ) : (
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            No additional subject teachers assigned yet.
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Enrolled Counts in Socket */}
                    <div style={{
                      display: 'flex',
                      gap: '12px',
                      paddingTop: '8px',
                      borderTop: '1px dashed var(--border-subtle)',
                      fontSize: '12px',
                      color: 'var(--text-muted)'
                    }}>
                      <span>👥 <strong>{room.student_count || 0}</strong> Students</span>
                      <span>👨‍👩‍👦 <strong>{room.parent_count || 0}</strong> Parents</span>
                      <span>👩‍🏫 <strong>{assignedTeachers.length || 1}</strong> Teachers</span>
                    </div>

                  </div>

                  {/* Open Socket Stream Button */}
                  <button
                    onClick={() => handleOpenSocket(roomKey)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
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
                      boxShadow: '0 2px 8px rgba(14, 165, 233, 0.25)'
                    }}
                  >
                    <Radio size={14} />
                    <span>Enter Live Classroom Socket</span>
                  </button>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* TAB CONTENT 2: STUDENTS ROSTER */}
      {activeTab === 'students' && (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 1px 3px rgba(18, 33, 58, 0.04)',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontWeight: 600 }}>
                <th style={{ padding: '14px 20px' }}>Student &amp; ID</th>
                <th style={{ padding: '14px 16px' }}>Class / Roll</th>
                <th style={{ padding: '14px 16px' }}>Guardian Contact</th>
                <th style={{ padding: '14px 16px' }}>Attendance</th>
                <th style={{ padding: '14px 16px' }}>KYC Status</th>
                <th style={{ padding: '14px 16px' }}>Fee Balance</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((stu) => (
                <tr 
                  key={stu.id}
                  style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background-color 0.15s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--bg-nav)',
                        color: '#FFFFFF',
                        fontWeight: 800,
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {stu.avatar}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, color: 'var(--text-main)' }}>{stu.name}</p>
                        <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{stu.id}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{stu.grade}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Roll #{stu.rollNo}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <p style={{ margin: 0, color: 'var(--text-main)', fontWeight: 500 }}>{stu.guardian}</p>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{stu.phone}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: stu.status === 'Active' ? '#18B981' : '#F59E0B',
                      fontWeight: 700,
                      fontSize: '12px'
                    }}>
                      {stu.status === 'Active' ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                      <span>{stu.attendanceRate}</span>
                    </span>
                    <span style={{ fontSize: '10.5px', color: 'var(--text-dim)', display: 'block' }}>{stu.status}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {stu.kycVerified ? (
                      <span style={{
                        backgroundColor: 'rgba(24, 185, 129, 0.1)',
                        color: '#18B981',
                        padding: '3px 8px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}>
                        <ShieldCheck size={11} />
                        <span>Verified</span>
                      </span>
                    ) : (
                      <span style={{
                        backgroundColor: 'rgba(245, 158, 11, 0.12)',
                        color: '#F59E0B',
                        padding: '3px 8px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: 700
                      }}>
                        Pending
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {stu.pendingFee > 0 ? (
                      <span style={{ color: '#EF5350', fontWeight: 700 }}>
                        ₹{stu.pendingFee.toLocaleString()}
                      </span>
                    ) : (
                      <span style={{ color: '#18B981', fontWeight: 600, fontSize: '12px' }}>
                        Paid in Full
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <button
                      onClick={() => setSelectedProfile(stu)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-surface)',
                        color: 'var(--text-main)',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      Inspect Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB CONTENT 3: TEACHERS & FACULTY */}
      {activeTab === 'teachers' && (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 1px 3px rgba(18, 33, 58, 0.04)',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontWeight: 600 }}>
                <th style={{ padding: '14px 20px' }}>Faculty Name</th>
                <th style={{ padding: '14px 16px' }}>Designation / Department</th>
                <th style={{ padding: '14px 16px' }}>Assigned Classrooms</th>
                <th style={{ padding: '14px 16px' }}>Contact</th>
                <th style={{ padding: '14px 16px' }}>Status</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map((tch, idx) => (
                <tr 
                  key={tch.id || idx}
                  style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background-color 0.15s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: '#1677FF',
                        color: '#FFFFFF',
                        fontWeight: 800,
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {tch.avatar || (tch.full_name ? tch.full_name[0] : 'T')}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, color: 'var(--text-main)' }}>{tch.full_name || tch.name}</p>
                        <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{tch.email || tch.id}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{tch.role || tch.department || 'Faculty'}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      backgroundColor: 'rgba(2, 132, 199, 0.1)',
                      color: '#0284c7',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '11.5px',
                      fontWeight: 700
                    }}>
                      {tch.assigned_classes || tch.assignedClass || 'General Faculty'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-main)' }}>{tch.phone || 'Available'}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      backgroundColor: 'rgba(24, 185, 129, 0.1)',
                      color: '#18B981',
                      padding: '3px 8px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 700
                    }}>
                      Active
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <button
                      onClick={() => onSwitchTab('sockets')}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-surface)',
                        color: '#0284c7',
                        fontWeight: 700,
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      Socket Stream
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL 1: CREATE CLASS SOCKET ROOM */}
      {showCreateRoomModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(2, 6, 23, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '16px'
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '520px',
            padding: '28px',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '16px',
            border: '1.5px solid rgba(56, 189, 248, 0.4)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
            maxHeight: '92vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(2, 132, 199, 0.2)',
                  color: '#0284c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Radio size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>
                    Create Classroom Socket Room
                  </h3>
                  <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                    Live medium for Teachers + Parents + School Admin
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowCreateRoomModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateClassRoom} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* Grade & Section */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Grade / Standard *
                  </label>
                  <input
                    type="text"
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    placeholder="e.g. 8, 5, 10"
                    required
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-main)',
                      fontSize: '13px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Section *
                  </label>
                  <input
                    type="text"
                    value={newSection}
                    onChange={(e) => setNewSection(e.target.value.toUpperCase())}
                    placeholder="e.g. A, B, C"
                    required
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-main)',
                      fontSize: '13px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Room Number & Academic Year */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Room Number
                  </label>
                  <input
                    type="text"
                    value={newRoomNo}
                    onChange={(e) => setNewRoomNo(e.target.value)}
                    placeholder="e.g. Room 204"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-main)',
                      fontSize: '13px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Academic Year
                  </label>
                  <input
                    type="text"
                    value={newAcademicYear}
                    onChange={(e) => setNewAcademicYear(e.target.value)}
                    placeholder="2026-2027"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-main)',
                      fontSize: '13px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Class Teacher Dropdown */}
              <div>
                <label style={{ fontSize: '11px', color: '#0284c7', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Assign Primary Class Teacher *
                </label>
                <select
                  value={newClassTeacherId}
                  onChange={(e) => setNewClassTeacherId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid rgba(2, 132, 199, 0.4)',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-main)',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="">-- Select Class Teacher --</option>
                  {teachersList.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.full_name} ({t.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject Teachers Assignment List */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>
                    Assign Subject Teachers:
                  </label>
                  <button
                    type="button"
                    onClick={() => setNewSubjectTeachers(prev => [...prev, { teacher_id: '', subject: 'Science' }])}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#0284c7',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}
                  >
                    <Plus size={12} />
                    <span>Add Another Subject</span>
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {newSubjectTeachers.map((st, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr auto', gap: '8px', alignItems: 'center' }}>
                      <select
                        value={st.teacher_id}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewSubjectTeachers(prev => {
                            const copy = [...prev];
                            copy[i].teacher_id = val;
                            return copy;
                          });
                        }}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-subtle)',
                          backgroundColor: 'var(--bg-secondary)',
                          color: 'var(--text-main)',
                          fontSize: '12px',
                          outline: 'none'
                        }}
                      >
                        <option value="">Select Teacher</option>
                        {teachersList.map(t => (
                          <option key={t.id} value={t.id}>{t.full_name}</option>
                        ))}
                      </select>

                      <input
                        type="text"
                        value={st.subject}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewSubjectTeachers(prev => {
                            const copy = [...prev];
                            copy[i].subject = val;
                            return copy;
                          });
                        }}
                        placeholder="e.g. Science"
                        style={{
                          padding: '8px 10px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-subtle)',
                          backgroundColor: 'var(--bg-secondary)',
                          color: 'var(--text-main)',
                          fontSize: '12px'
                        }}
                      />

                      <button
                        type="button"
                        onClick={() => setNewSubjectTeachers(prev => prev.filter((_, idx) => idx !== i))}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Preview Box */}
              <div style={{
                backgroundColor: 'rgba(56, 189, 248, 0.08)',
                border: '1px dashed rgba(56, 189, 248, 0.35)',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '12px',
                color: 'var(--text-muted)'
              }}>
                <span style={{ color: '#38bdf8', fontWeight: 700, display: 'block', marginBottom: '3px' }}>
                  ⚡ Auto-Generated WebSocket Room Key:
                </span>
                <code style={{ color: '#bae6fd', fontWeight: 700, fontSize: '13px' }}>
                  class-{newGrade.toLowerCase().replace(/[^a-z0-9]/g, '')}{newSection.toLowerCase().replace(/[^a-z0-9]/g, '')}
                </code>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button
                  type="submit"
                  disabled={submittingRoom}
                  style={{
                    flex: 1,
                    padding: '11px',
                    background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: submittingRoom ? 'wait' : 'pointer'
                  }}
                >
                  {submittingRoom ? 'Creating & Initializing Socket...' : 'Create Class Room & Launch Socket'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateRoomModal(false)}
                  style={{
                    padding: '11px 18px',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-main)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ASSIGN FACULTY TO CLASS */}
      {showAssignModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(2, 6, 23, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '16px'
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '440px',
            padding: '24px',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '16px',
            border: '1.5px solid rgba(56, 189, 248, 0.4)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: 'var(--text-main)' }}>
                  Assign Faculty to Class {showAssignModal.grade}-{showAssignModal.section}
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                  Channel: #{showAssignModal.room_key}
                </p>
              </div>
              <button
                onClick={() => setShowAssignModal(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAssignTeacher} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Select Teacher *
                </label>
                <select
                  value={assignTeacherId}
                  onChange={(e) => setAssignTeacherId(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-main)',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="">-- Choose Teacher --</option>
                  {teachersList.map((t) => (
                    <option key={t.id} value={t.id}>{t.full_name} ({t.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Subject / Role *
                </label>
                <input
                  type="text"
                  value={assignSubject}
                  onChange={(e) => setAssignSubject(e.target.value)}
                  placeholder="e.g. Mathematics, Science, Class Teacher"
                  required
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-main)',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0' }}>
                <input
                  type="checkbox"
                  id="isPrimaryCheck"
                  checked={assignIsPrimary}
                  onChange={(e) => setAssignIsPrimary(e.target.checked)}
                />
                <label htmlFor="isPrimaryCheck" style={{ fontSize: '12px', color: 'var(--text-main)', cursor: 'pointer' }}>
                  Designate as Head Class Teacher
                </label>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: '#0284c7',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Confirm Assignment &amp; Broadcast
                </button>
                <button
                  type="button"
                  onClick={() => setShowAssignModal(null)}
                  style={{
                    padding: '10px 16px',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-main)',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Profile Drawer */}
      {selectedProfile && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            width: '440px',
            maxWidth: '90%',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-nav)',
                  color: '#FFFFFF',
                  fontSize: '18px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {selectedProfile.avatar}
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                    {selectedProfile.name}
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                    {selectedProfile.grade} &bull; Roll #{selectedProfile.rollNo}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedProfile(null)}
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', margin: '18px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Guardian:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{selectedProfile.guardian}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Attendance Rate:</span>
                <span style={{ fontWeight: 700, color: '#18B981' }}>{selectedProfile.attendanceRate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Fee Due:</span>
                <span style={{ fontWeight: 700, color: selectedProfile.pendingFee > 0 ? '#EF5350' : '#18B981' }}>
                  {selectedProfile.pendingFee > 0 ? `₹${selectedProfile.pendingFee}` : 'All Paid'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setSelectedProfile(null)}
                style={{
                  padding: '9px 16px',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-main)',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  flex: 1
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
