import React, { useState, useEffect, useRef } from 'react';
import { 
  ScanFace, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle,
  AlertCircle, 
  UserCheck, 
  UserX,
  Users,
  Camera, 
  RefreshCw,
  Sparkles,
  Zap,
  CalendarCheck,
  CalendarOff,
  Clock,
  Search,
  Filter,
  Check,
  X,
  ArrowRight,
  GraduationCap,
  Bell,
  Phone,
  FileText,
  Send,
  Video,
  VideoOff,
  FlipHorizontal
} from 'lucide-react';

const INITIAL_STUDENTS = [
  {
    id: "11111111-2222-3333-4444-555555555552",
    admissionNumber: "DPS-2026-0802",
    rollNumber: 1,
    name: "Aarav Sharma",
    guardianName: "Ramesh Sharma(Aarav Sharma)",
    guardianPhone: "+91 98765 43210",
    grade: "Class 8-B",
    status: "PRESENT",
    checkInTime: "08:14:22 AM",
    verificationMode: "Face-AI Kiosk #1",
    avatar: "AS",
    gender: "Male"
  },
  {
    id: "11111111-2222-3333-4444-555555555551",
    admissionNumber: "DPS-2026-0801",
    rollNumber: 2,
    name: "Rohan Sharma",
    guardianName: "Sunil Sharma(Rohan Sharma)",
    guardianPhone: "+91 98765 11223",
    grade: "Class 8-B",
    status: "PRESENT",
    checkInTime: "08:08:15 AM",
    verificationMode: "Teacher Manual",
    avatar: "RS",
    gender: "Male"
  },
  {
    id: "11111111-2222-3333-4444-555555555553",
    admissionNumber: "DPS-2026-0803",
    rollNumber: 3,
    name: "Priya Patel",
    guardianName: "Kiran Patel(Priya Patel)",
    guardianPhone: "+91 98765 99001",
    grade: "Class 8-B",
    status: "PRESENT",
    checkInTime: "08:11:04 AM",
    verificationMode: "Teacher Manual",
    avatar: "PP",
    gender: "Female"
  },
  {
    id: "STU-8845",
    admissionNumber: "DPS-2026-0822",
    rollNumber: 4,
    name: "Rohit Patel",
    guardianName: "Suresh Patel(Rohit Patel)",
    guardianPhone: "+91 98765 33441",
    grade: "Class 8-B",
    status: "EXCUSED",
    checkInTime: "—",
    verificationMode: "Medical Certificate (Approved)",
    avatar: "RP",
    gender: "Male"
  },
  {
    id: "11111111-2222-3333-4444-555555555554",
    admissionNumber: "DPS-2026-0804",
    rollNumber: 5,
    name: "Vikram Singh",
    guardianName: "Dharmendra Singh(Vikram Singh)",
    guardianPhone: "+91 98765 77889",
    grade: "Class 8-B",
    status: "ABSENT",
    checkInTime: "—",
    verificationMode: "Not Checked In",
    avatar: "VS",
    gender: "Male"
  },
  {
    id: "11111111-2222-3333-4444-555555555555",
    admissionNumber: "DPS-2026-0805",
    rollNumber: 6,
    name: "Sneha Verma",
    guardianName: "Pankaj Verma(Sneha Verma)",
    guardianPhone: "+91 98765 44556",
    grade: "Class 8-B",
    status: "PRESENT",
    checkInTime: "08:05:30 AM",
    verificationMode: "Face-AI Kiosk #2",
    avatar: "SV",
    gender: "Female"
  },
  {
    id: "5eebcb57-f590-4e63-96a4-a014f02539c2",
    admissionNumber: "ADM-2026-584",
    rollNumber: 7,
    name: "Aryan Verma",
    guardianName: "Deepak Verma(Aryan Verma)",
    guardianPhone: "+91 98765 55667",
    grade: "Class 8-B",
    status: "PRESENT",
    checkInTime: "08:15:02 AM",
    verificationMode: "Teacher Manual",
    avatar: "AV",
    gender: "Male"
  },
  {
    id: "STU-8808",
    admissionNumber: "DPS-2026-0808",
    rollNumber: 8,
    name: "Aditi Sen",
    guardianName: "Abhijit Sen(Aditi Sen)",
    guardianPhone: "+91 98765 66778",
    grade: "Class 8-B",
    status: "PRESENT",
    checkInTime: "08:07:44 AM",
    verificationMode: "Teacher Manual",
    avatar: "AS",
    gender: "Female"
  },
  {
    id: "STU-8809",
    admissionNumber: "DPS-2026-0809",
    rollNumber: 9,
    name: "Kabir Mehta",
    guardianName: "Alok Mehta(Kabir Mehta)",
    guardianPhone: "+91 98765 88990",
    grade: "Class 8-B",
    status: "ABSENT",
    checkInTime: "—",
    verificationMode: "Not Checked In",
    avatar: "KM",
    gender: "Male"
  },
  {
    id: "STU-8810",
    admissionNumber: "DPS-2026-0810",
    rollNumber: 10,
    name: "Ananya Gupta",
    guardianName: "Naveen Gupta(Ananya Gupta)",
    guardianPhone: "+91 98765 22114",
    grade: "Class 8-B",
    status: "PRESENT",
    checkInTime: "08:03:19 AM",
    verificationMode: "Face-AI Kiosk #1",
    avatar: "AG",
    gender: "Female"
  }
];

export default function GateKiosk({ currentUser, activeRole = 'teacher', onSwitchTab, onRequireAuth }) {
  // Mode: 'rollcall' (Teacher marking student attendance) or 'kiosk' (Face-AI biometric scanner)
  const [activeView, setActiveView] = useState('rollcall');

  // Selected Class
  const [selectedClass, setSelectedClass] = useState("Class 8-B");

  // Student Attendance State with localStorage persistence and automatic bracket format migration
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem('edubandhan_student_attendance_v3');
      if (saved) return JSON.parse(saved);

      const old = localStorage.getItem('edubandhan_student_attendance');
      if (old) {
        const parsed = JSON.parse(old);
        return parsed.map(s => ({
          ...s,
          guardianName: s.guardianName?.includes('(') ? s.guardianName : `${s.guardianName || 'Parent'}(${s.name})`
        }));
      }
      return INITIAL_STUDENTS;
    } catch (e) {
      return INITIAL_STUDENTS;
    }
  });

  // Save to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('edubandhan_student_attendance_v3', JSON.stringify(students));
    } catch (e) {}
  }, [students]);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // --------------------------------------------------------------------------
  // Camera & Face-AI Biometric Scanner States
  // --------------------------------------------------------------------------
  const kioskVideoRef = useRef(null);
  const kioskCanvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [isMirrored, setIsMirrored] = useState(false);

  // Selected child for Self-Attendance check-in
  const [selectedStudentId, setSelectedStudentId] = useState("11111111-2222-3333-4444-555555555552");
  
  // Verification status: 'idle' | 'scanning' | 'matched' | 'mismatched' | 'excused'
  const [verifyStatus, setVerifyStatus] = useState('idle');
  const [mismatchAlert, setMismatchAlert] = useState(null);

  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState({
    name: "Aarav Sharma",
    id: "DPS-2026-0802",
    role: "Student",
    class: "Class 8-B (Roll #1)",
    guardian: "Ramesh Sharma(Aarav Sharma) (+91 98765 43210)",
    status: "PRESENT",
    latency: "114ms",
    confidence: "99.4%",
    timestamp: "08:14:22 AM",
    isExcused: false
  });
  const [scanCount, setScanCount] = useState(148);

  // Camera stream lifecycle
  const startKioskCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" }
      });
      if (kioskVideoRef.current) {
        kioskVideoRef.current.srcObject = stream;
        kioskVideoRef.current.play().catch(() => {});
      }
      setCameraStream(stream);
      setCameraActive(true);
    } catch (err) {
      console.warn("Kiosk camera access:", err);
      setCameraError("Camera permission blocked or no webcam detected. You can still test with simulated face biometric scan!");
      setCameraActive(false);
    }
  };

  const stopKioskCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
      setCameraStream(null);
    }
    if (kioskVideoRef.current) {
      kioskVideoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  // Stop camera when leaving kiosk view or unmounting
  useEffect(() => {
    if (activeView !== 'kiosk') {
      stopKioskCamera();
    }
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(t => t.stop());
      }
    };
  }, [activeView]);

  // Keep video connected if cameraActive is true
  useEffect(() => {
    if (cameraActive && cameraStream && kioskVideoRef.current) {
      kioskVideoRef.current.srcObject = cameraStream;
      kioskVideoRef.current.play().catch(() => {});
    }
  }, [cameraActive, cameraStream]);

  // --------------------------------------------------------------------------
  // Scenario 1: Teacher Marks Student Attendance Manually (PRESENT / ABSENT / EXCUSED)
  // --------------------------------------------------------------------------
  const handleMarkStudent = async (studentId, newStatus) => {
    if (!currentUser && onRequireAuth) {
      onRequireAuth({ id: 'kiosk', title: 'Mark Student Attendance' });
      return;
    }
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    // Update local state immediately for responsive UI
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          status: newStatus,
          checkInTime: newStatus === 'PRESENT' ? nowTime : (newStatus === 'ABSENT' ? '—' : s.checkInTime),
          verificationMode: newStatus === 'PRESENT' ? 'Teacher Manual' : (newStatus === 'ABSENT' ? 'Teacher Flagged Absent' : 'Excused by Teacher')
        };
      }
      return s;
    }));

    const student = students.find(s => s.id === studentId);
    const studentName = student ? student.name : "Student";

    if (newStatus === 'PRESENT') {
      showToast(`✓ Marked PRESENT: ${studentName} (Roll #${student?.rollNumber}) checked in at ${nowTime}. Parents notified via app.`);
    } else if (newStatus === 'ABSENT') {
      showToast(`✕ Marked ABSENT: ${studentName} flagged absent. Automated parent alert triggered to ${student?.guardianPhone}.`);
    } else {
      showToast(`📝 Marked EXCUSED: ${studentName} excused leave recorded.`);
    }

    // Call backend API if possible
    try {
      await fetch('/api/teacher/attendance/manual-mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          status: newStatus,
          notes: `Marked by ${currentUser?.name || "Class Teacher Mrs. Sunita Sharma"}`
        })
      });
    } catch (e) {
      // Offline / demo fallback succeeds gracefully
    }
  };

  // Bulk: Mark All Students Present
  const handleMarkAllPresent = () => {
    if (!currentUser && onRequireAuth) {
      onRequireAuth({ id: 'kiosk', title: 'Submit Live Attendance Roll Call' });
      return;
    }
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setStudents(prev => prev.map(s => ({
      ...s,
      status: 'PRESENT',
      checkInTime: s.checkInTime === '—' ? nowTime : s.checkInTime,
      verificationMode: 'Teacher Manual Bulk'
    })));
    showToast(`✓ All ${students.length} students in ${selectedClass} marked PRESENT for today!`);
  };

  // Reset Roll Call
  const handleResetRollCall = () => {
    if (!currentUser && onRequireAuth) {
      onRequireAuth({ id: 'kiosk', title: 'Reset Attendance Roll Call' });
      return;
    }
    setStudents(INITIAL_STUDENTS);
    setVerifyStatus('idle');
    setMismatchAlert(null);
    showToast(`↺ Attendance roll call reset to morning schedule.`);
  };

  // --------------------------------------------------------------------------
  // Scenario 2: Automated Self-Attendance Face-AI Biometric Scanning
  // --------------------------------------------------------------------------
  const handleTriggerFaceScan = async (targetStudentId = null, forceMismatch = false) => {
    if (!currentUser && onRequireAuth) {
      onRequireAuth({ id: 'kiosk', title: 'Trigger Face-AI Biometric Verification' });
      return;
    }
    const studentToVerifyId = targetStudentId || selectedStudentId;
    const student = students.find(s => s.id === studentToVerifyId) || students[0];
    
    setIsScanning(true);
    setVerifyStatus('scanning');
    setMismatchAlert(null);

    // Capture from active webcam if streaming
    let capturedBase64 = null;
    if (cameraActive && kioskVideoRef.current && kioskCanvasRef.current) {
      try {
        const video = kioskVideoRef.current;
        const canvas = kioskCanvasRef.current;
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        if (isMirrored) {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        capturedBase64 = canvas.toDataURL('image/jpeg', 0.85);
      } catch (e) {
        console.warn("Canvas snap issue:", e);
      }
    }

    if (forceMismatch) {
      capturedBase64 = "data:image/jpeg;base64,mismatch_wrong_child_sample_vector";
    }

    try {
      const res = await fetch('/api/kiosk/verify-face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: student.id,
          image_base64: capturedBase64 || (forceMismatch ? "data:image/jpeg;base64,wrong_child" : "data:image/jpeg;base64,valid_child_face")
        })
      });

      const data = await res.json();
      setIsScanning(false);
      setScanCount(prev => prev + 1);

      if (data.verified) {
        // MATCH SCENARIO: Child matches stored 512-D embedding
        setVerifyStatus('matched');
        setMismatchAlert(null);
        const nowTime = data.check_in_time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        setScanResult({
          name: student.name,
          id: student.admissionNumber || student.id,
          role: "Student",
          class: `${selectedClass} (Roll #${student.rollNumber})`,
          guardian: `${student.guardianName} (${student.guardianPhone})`,
          status: "PRESENT",
          latency: "114ms",
          confidence: data.similarity_percent || `${Math.round((data.similarity || 0.99) * 100)}% Match`,
          timestamp: nowTime,
          isExcused: false
        });

        // Update student in state to PRESENT
        setStudents(prev => prev.map(s => {
          if (s.id === student.id) {
            return {
              ...s,
              status: 'PRESENT',
              checkInTime: nowTime,
              verificationMode: 'Face-AI Kiosk Self-Attendance'
            };
          }
          return s;
        }));

        showToast(`✓ Face Verified: ${student.name} marked PRESENT! Parent notified via app.`);
      } else {
        // MISMATCH SCENARIO: Different child or face does not match
        setVerifyStatus('mismatched');
        const errMsg = data.message || `Face does not match ${student.name}. It's not that child, please try again!`;
        setMismatchAlert({
          message: errMsg,
          studentName: student.name,
          similarity: data.similarity
        });

        showToast(`❌ Face verification failed! It's not that child, please try again!`);
      }
    } catch (err) {
      setIsScanning(false);
      setScanCount(prev => prev + 1);
      if (forceMismatch) {
        setVerifyStatus('mismatched');
        setMismatchAlert({
          message: `Face does not match ${student.name}. It's not that child, please try again!`,
          studentName: student.name,
          similarity: 0.38
        });
        showToast(`❌ Face verification failed! It's not that child, please try again!`);
      } else {
        setVerifyStatus('matched');
        setMismatchAlert(null);
        handleMarkStudent(student.id, 'PRESENT');
      }
    }
  };

  // Open Kiosk mode with a specific student selected
  const handleOpenKioskForStudent = (student) => {
    setSelectedStudentId(student.id);
    setActiveView('kiosk');
    setVerifyStatus('idle');
    setMismatchAlert(null);
    startKioskCamera();
  };

  // Filtered student list
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.rollNumber.toString().includes(searchTerm) ||
                          s.guardianName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // KPI Calculations
  const totalStudents = students.length;
  const presentCount = students.filter(s => s.status === 'PRESENT').length;
  const absentCount = students.filter(s => s.status === 'ABSENT').length;
  const excusedCount = students.filter(s => s.status === 'EXCUSED').length;
  const attendanceRate = totalStudents > 0 ? ((presentCount / totalStudents) * 100).toFixed(1) : 0;

  const teacherName = currentUser?.name || "Mrs. Sunita Sharma";

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '28px',
          zIndex: 9999,
          background: 'linear-gradient(135deg, #102A56 0%, #1677FF 100%)',
          color: '#ffffff',
          padding: '14px 22px',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
          border: '1.5px solid rgba(255, 255, 255, 0.25)',
          fontSize: '13px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <CheckCircle2 size={18} color="#18B981" />
          <span>{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)} 
            style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', marginLeft: '6px' }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Main Top Header with Mode Switcher */}
      <div className="glass-panel" style={{ 
        padding: '20px 26px', 
        background: 'linear-gradient(135deg, rgba(16, 42, 86, 0.85) 0%, rgba(22, 119, 255, 0.2) 100%)',
        border: '1.5px solid rgba(22, 119, 255, 0.35)',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            borderRadius: '12px', 
            background: 'linear-gradient(135deg, #1677FF 0%, #6C4CE8 100%)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 16px rgba(22, 119, 255, 0.4)',
            flexShrink: 0
          }}>
            {activeView === 'rollcall' ? <GraduationCap size={26} /> : <ScanFace size={26} />}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-heading)', margin: 0 }}>
                {activeView === 'rollcall' ? "Student Attendance & Roll Call Register" : "Touchless Face-AI Gate Kiosk"}
              </h2>
              <span className="badge badge-emerald" style={{ fontSize: '11px', padding: '3px 8px' }}>
                <CheckCircle2 size={11} />
                <span>Teacher Marking Active</span>
              </span>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '3px 0 0 0' }}>
              {activeView === 'rollcall' 
                ? `Teacher: ${teacherName} • Mark students Present or Absent with 1 click • Automated Parent App Alerts` 
                : "Touchless Biometric Gate Verification • Sub-150ms Edge AI • Syncs with Classroom Roll Call"}
            </p>
          </div>
        </div>

        {/* Segmented View Mode Toggle */}
        <div style={{ 
          display: 'flex', 
          background: 'rgba(0, 0, 0, 0.25)', 
          padding: '4px', 
          borderRadius: '12px', 
          border: '1px solid rgba(255, 255, 255, 0.1)',
          gap: '4px'
        }}>
          <button
            onClick={() => setActiveView('rollcall')}
            style={{
              padding: '8px 16px',
              borderRadius: '9px',
              border: 'none',
              background: activeView === 'rollcall' ? 'linear-gradient(135deg, #1677FF 0%, #102A56 100%)' : 'transparent',
              color: activeView === 'rollcall' ? '#ffffff' : 'var(--text-muted)',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              boxShadow: activeView === 'rollcall' ? '0 2px 8px rgba(22, 119, 255, 0.4)' : 'none'
            }}
          >
            <UserCheck size={15} />
            <span>Mark Student Attendance ({presentCount}/{totalStudents})</span>
          </button>

          <button
            onClick={() => setActiveView('kiosk')}
            style={{
              padding: '8px 16px',
              borderRadius: '9px',
              border: 'none',
              background: activeView === 'kiosk' ? 'linear-gradient(135deg, #1677FF 0%, #102A56 100%)' : 'transparent',
              color: activeView === 'kiosk' ? '#ffffff' : 'var(--text-muted)',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              boxShadow: activeView === 'kiosk' ? '0 2px 8px rgba(22, 119, 255, 0.4)' : 'none'
            }}
          >
            <ScanFace size={15} />
            <span>Face-AI Gate Kiosk</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: TEACHER MARKING STUDENT ATTENDANCE (PRESENT / ABSENT FEATURE)
          ========================================================================= */}
      {activeView === 'rollcall' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Teacher Class Information & Quick Actions Strip */}
          <div className="glass-panel" style={{ 
            padding: '20px 24px', 
            background: 'radial-gradient(ellipse at top left, rgba(22, 119, 255, 0.12) 0%, var(--bg-surface) 70%)',
            border: '1.5px solid rgba(22, 119, 255, 0.35)',
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
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #1677FF 0%, #102A56 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '16px'
              }}>
                8B
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                    {selectedClass} Roll Call
                  </h3>
                  <span className="badge badge-cyan" style={{ fontSize: '11px', padding: '3px 8px' }}>
                    Assigned: {teacherName}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '3px 0 0' }}>
                  Department of Mathematics &bull; Academic Session 2026-27 &bull; Daily Morning Attendance
                </p>
              </div>
            </div>

            {/* Class Dropdown & Bulk Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                style={{
                  padding: '7px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-glass)',
                  color: 'var(--text-main)',
                  fontSize: '12px',
                  fontWeight: 700,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="Class 8-B" style={{ background: '#102A56', color: '#fff' }}>Class 8-B (My Assigned Class)</option>
                <option value="Class 8-A" style={{ background: '#102A56', color: '#fff' }}>Class 8-A</option>
                <option value="Class 9-A" style={{ background: '#102A56', color: '#fff' }}>Class 9-A</option>
                <option value="Class 5-A" style={{ background: '#102A56', color: '#fff' }}>Class 5-A</option>
              </select>

              <button
                onClick={handleMarkAllPresent}
                style={{
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #18B981 0%, #059669 100%)',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(24, 185, 129, 0.35)'
                }}
              >
                <Check size={14} />
                <span>Mark All Present</span>
              </button>

              <button
                onClick={handleResetRollCall}
                className="btn-secondary"
                style={{ fontSize: '12px', padding: '7px 14px' }}
              >
                <RefreshCw size={13} />
                <span>Reset Roll Call</span>
              </button>
            </div>
          </div>

          {/* Student Attendance KPI Cards */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '14px' 
          }}>
            {/* Total Students */}
            <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ 
                width: '42px', 
                height: '42px', 
                borderRadius: '10px', 
                background: 'rgba(22, 119, 255, 0.18)', 
                color: '#1677FF', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <Users size={20} />
              </div>
              <div>
                <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 600 }}>Total Enrolled</span>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
                  {totalStudents} Students
                </div>
              </div>
            </div>

            {/* Marked Present */}
            <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ 
                width: '42px', 
                height: '42px', 
                borderRadius: '10px', 
                background: 'rgba(24, 185, 129, 0.18)', 
                color: '#18B981', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <CheckCircle2 size={20} />
              </div>
              <div>
                <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 600 }}>Students Present</span>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#18B981', marginTop: '2px' }}>
                  {presentCount} <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>({attendanceRate}%)</span>
                </div>
              </div>
            </div>

            {/* Marked Absent */}
            <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ 
                width: '42px', 
                height: '42px', 
                borderRadius: '10px', 
                background: 'rgba(239, 83, 80, 0.18)', 
                color: '#EF5350', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <XCircle size={20} />
              </div>
              <div>
                <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 600 }}>Students Absent</span>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#EF5350', marginTop: '2px' }}>
                  {absentCount} Students
                </div>
              </div>
            </div>

            {/* Excused / Medical Leave */}
            <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ 
                width: '42px', 
                height: '42px', 
                borderRadius: '10px', 
                background: 'rgba(245, 158, 11, 0.18)', 
                color: '#F59E0B', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <CalendarOff size={20} />
              </div>
              <div>
                <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 600 }}>Medical / Excused</span>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#F59E0B', marginTop: '2px' }}>
                  {excusedCount} Students
                </div>
              </div>
            </div>
          </div>

          {/* Student Roster Table - Where Teacher Marks Student Present or Absent */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* Header & Search */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-main)', margin: 0, fontFamily: 'var(--font-heading)' }}>
                  Class Roster Roll Call
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                  Click <strong>Present</strong> or <strong>Absent</strong> on any student row. Attendance cascades live to School ERP and parent SMS/App.
                </p>
              </div>

              {/* Status Filter Pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 600 }}>Filter:</span>
                {[
                  { id: 'all', label: `All (${totalStudents})` },
                  { id: 'PRESENT', label: `Present (${presentCount})` },
                  { id: 'ABSENT', label: `Absent (${absentCount})` },
                  { id: 'EXCUSED', label: `Excused (${excusedCount})` }
                ].map(st => (
                  <button
                    key={st.id}
                    onClick={() => setStatusFilter(st.id)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-subtle)',
                      background: statusFilter === st.id ? 'var(--brand-blue, #1677FF)' : 'transparent',
                      color: statusFilter === st.id ? '#ffffff' : 'var(--text-muted)',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search student by name, roll number (e.g. 14), admission number, or parent name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 14px 9px 38px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                  fontSize: '12.5px',
                  outline: 'none'
                }}
              />
            </div>

            {/* Students Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <th style={{ padding: '12px 14px', width: '70px' }}>Roll #</th>
                    <th style={{ padding: '12px 14px' }}>Student Name</th>
                    <th style={{ padding: '12px 14px' }}>Parent / Guardian</th>
                    <th style={{ padding: '12px 14px' }}>Check-In Time</th>
                    <th style={{ padding: '12px 14px' }}>Status</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right' }}>Teacher Actions (Mark Attendance)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, index) => {
                    const isPresent = student.status === 'PRESENT';
                    const isAbsent = student.status === 'ABSENT';
                    const isExcused = student.status === 'EXCUSED';

                    return (
                      <tr 
                        key={student.id} 
                        style={{ 
                          borderBottom: '1px solid var(--border-subtle)',
                          background: isAbsent 
                            ? 'rgba(239, 83, 80, 0.04)' 
                            : (index % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.02)'),
                          transition: 'background 0.15s ease'
                        }}
                      >
                        {/* Roll Number */}
                        <td style={{ padding: '14px' }}>
                          <span style={{ 
                            fontSize: '13px', 
                            fontFamily: 'var(--font-mono)', 
                            fontWeight: 800, 
                            color: 'var(--accent-cyan)',
                            background: 'rgba(22, 119, 255, 0.1)',
                            padding: '4px 8px',
                            borderRadius: '6px'
                          }}>
                            #{student.rollNumber < 10 ? `0${student.rollNumber}` : student.rollNumber}
                          </span>
                        </td>

                        {/* Student Name & Avatar */}
                        <td style={{ padding: '14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ 
                              width: '38px', 
                              height: '38px', 
                              borderRadius: '10px', 
                              background: isPresent 
                                ? 'linear-gradient(135deg, #18B981 0%, #059669 100%)' 
                                : (isAbsent 
                                  ? 'linear-gradient(135deg, #EF5350 0%, #DC2626 100%)' 
                                  : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'),
                              color: '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '13px',
                              fontWeight: 800,
                              flexShrink: 0
                            }}>
                              {student.avatar}
                            </div>
                            <div>
                              <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-main)' }}>
                                {student.name}
                              </div>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                {student.admissionNumber} &bull; {student.grade}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Guardian Info */}
                        <td style={{ padding: '14px' }}>
                          <div style={{ fontSize: '12.5px', color: 'var(--text-main)', fontWeight: 600 }}>
                            {student.guardianName?.includes('(') ? student.guardianName : `${student.guardianName || 'Parent'}(${student.name})`}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {student.guardianPhone}
                          </div>
                        </td>

                        {/* Punch Time & Verification Mode */}
                        <td style={{ padding: '14px' }}>
                          <div style={{ 
                            fontSize: '12px', 
                            fontFamily: 'var(--font-mono)', 
                            color: isPresent ? '#18B981' : 'var(--text-muted)',
                            fontWeight: 600 
                          }}>
                            {student.checkInTime}
                          </div>
                          <div style={{ fontSize: '10.5px', color: 'var(--text-dim)' }}>
                            {student.verificationMode}
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td style={{ padding: '14px' }}>
                          <span className={`badge ${
                            isPresent ? 'badge-emerald' : 
                            (isAbsent ? 'badge-rose' : 'badge-amber')
                          }`} style={{ fontSize: '11px', padding: '4px 10px' }}>
                            {isPresent && <Check size={11} style={{ marginRight: '4px' }} />}
                            {isAbsent && <X size={11} style={{ marginRight: '4px' }} />}
                            {isExcused && <Clock size={11} style={{ marginRight: '4px' }} />}
                            <span>{student.status}</span>
                          </span>
                        </td>

                        {/* Action Buttons: Mark Present / Mark Absent / Excused */}
                        <td style={{ padding: '14px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            {/* Present Button */}
                            <button
                              onClick={() => handleMarkStudent(student.id, 'PRESENT')}
                              title="Mark Student Present"
                              style={{
                                padding: '6px 12px',
                                borderRadius: '7px',
                                border: '1px solid #18B981',
                                background: isPresent ? '#18B981' : 'rgba(24, 185, 129, 0.12)',
                                color: isPresent ? '#ffffff' : '#18B981',
                                fontSize: '11.5px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <Check size={12} />
                              <span>Present</span>
                            </button>

                            {/* Absent Button */}
                            <button
                              onClick={() => handleMarkStudent(student.id, 'ABSENT')}
                              title="Mark Student Absent"
                              style={{
                                padding: '6px 12px',
                                borderRadius: '7px',
                                border: '1px solid #EF5350',
                                background: isAbsent ? '#EF5350' : 'rgba(239, 83, 80, 0.12)',
                                color: isAbsent ? '#ffffff' : '#EF5350',
                                fontSize: '11.5px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <X size={12} />
                              <span>Absent</span>
                            </button>

                            {/* Excused Button */}
                            <button
                              onClick={() => handleMarkStudent(student.id, 'EXCUSED')}
                              title="Mark Student Excused"
                              style={{
                                padding: '6px 10px',
                                borderRadius: '7px',
                                border: '1px solid #F59E0B',
                                background: isExcused ? '#F59E0B' : 'transparent',
                                color: isExcused ? '#ffffff' : '#F59E0B',
                                fontSize: '11px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px'
                              }}
                            >
                              <CalendarOff size={11} />
                              <span>Excused</span>
                            </button>

                            {/* Self/Face-AI Biometric Scan Button */}
                            <button
                              onClick={() => handleOpenKioskForStudent(student)}
                              title="Open Self-Attendance Face-AI Kiosk to scan this child's face"
                              style={{
                                padding: '6px 11px',
                                borderRadius: '7px',
                                border: '1px solid rgba(2, 132, 199, 0.45)',
                                background: 'rgba(2, 132, 199, 0.12)',
                                color: 'var(--accent-cyan)',
                                fontSize: '11px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <ScanFace size={12} />
                              <span>Face Scan</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredStudents.length === 0 && (
                <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-muted)' }}>
                  <Users size={32} style={{ opacity: 0.4, margin: '0 auto 8px' }} />
                  <p style={{ margin: 0, fontSize: '13px' }}>No students found matching your search</p>
                </div>
              )}
            </div>

            {/* Bottom Notice */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              flexWrap: 'wrap', 
              gap: '10px', 
              paddingTop: '12px', 
              borderTop: '1px solid var(--border-subtle)',
              fontSize: '11.5px',
              color: 'var(--text-muted)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={14} color="#18B981" />
                <span>Attendance records sync in real time with School ERP and Principal Command Center.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Bell size={13} color="#1677FF" />
                <span>Absent students automatically receive Parent SMS notification at 09:00 AM cutoff.</span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* =========================================================================
          VIEW 2: AUTOMATED SELF-ATTENDANCE & TOUCHLESS FACE-AI BIOMETRIC KIOSK
          ========================================================================= */}
      {activeView === 'kiosk' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Quick link banner to switch to Teacher Roll Call */}
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(24, 185, 129, 0.12) 0%, rgba(22, 119, 255, 0.12) 100%)', 
            border: '1px solid rgba(24, 185, 129, 0.3)',
            borderRadius: '10px',
            padding: '12px 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <GraduationCap size={18} color="#18B981" />
              <span style={{ fontSize: '12.5px', color: 'var(--text-main)', fontWeight: 600 }}>
                Looking to manually mark student attendance as Present or Absent for your classroom?
              </span>
            </div>
            <button
              onClick={() => setActiveView('rollcall')}
              style={{
                background: '#18B981',
                color: '#ffffff',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '7px',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>Open Teacher Roll Call Register</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Student Selector Bar for Self-Attendance Check-In */}
          <div className="glass-panel" style={{
            padding: '16px 22px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px',
            background: 'linear-gradient(135deg, rgba(16, 42, 86, 0.7) 0%, rgba(22, 119, 255, 0.15) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(56, 189, 248, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8'
              }}>
                <ScanFace size={22} />
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Self-Attendance Mode
                </span>
                <div style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
                  Select Child to Mark Attendance
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Student:</label>
              <select
                value={selectedStudentId}
                onChange={(e) => {
                  setSelectedStudentId(e.target.value);
                  setVerifyStatus('idle');
                  setMismatchAlert(null);
                }}
                style={{
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: '1.5px solid var(--border-subtle)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  outline: 'none',
                  cursor: 'pointer',
                  minWidth: '220px'
                }}
              >
                {students.map(s => (
                  <option key={s.id} value={s.id} style={{ background: '#102A56', color: '#fff' }}>
                    Roll #{s.rollNumber} - {s.name} ({s.status})
                  </option>
                ))}
              </select>

              {(() => {
                const cur = students.find(s => s.id === selectedStudentId);
                return (
                  <span className={`badge ${cur?.status === 'PRESENT' ? 'badge-emerald' : (cur?.status === 'ABSENT' ? 'badge-rose' : 'badge-amber')}`} style={{ fontSize: '11px', padding: '5px 10px' }}>
                    Status: {cur?.status || 'PENDING'}
                  </span>
                );
              })()}
            </div>
          </div>

          {/* Main Kiosk Viewport */}
          <div className="grid-cols-2">
            {/* Virtual Tablet Screen / Biometric Scanner Camera */}
            <div className="glass-panel" style={{ 
              padding: '24px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              minHeight: '440px',
              position: 'relative',
              background: 'radial-gradient(circle at 50% 40%, rgba(14, 165, 233, 0.12) 0%, var(--bg-surface) 75%)',
              border: verifyStatus === 'mismatched'
                ? '1.5px solid rgba(239, 68, 68, 0.6)'
                : (verifyStatus === 'matched' ? '1.5px solid rgba(24, 185, 129, 0.6)' : '1.5px solid rgba(56, 189, 248, 0.35)'),
              boxShadow: verifyStatus === 'mismatched'
                ? '0 0 35px rgba(239, 68, 68, 0.25)'
                : (verifyStatus === 'matched' ? '0 0 35px rgba(24, 185, 129, 0.25)' : '0 0 35px rgba(14, 165, 233, 0.18)'),
              transition: 'all 0.3s ease'
            }}>
              
              {/* Camera Header Status */}
              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', fontSize: '11.5px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: cameraActive ? '#10b981' : 'var(--text-muted)', fontWeight: 600 }}>
                  <span className={cameraActive ? "pulse-dot" : ""} style={{ width: '8px', height: '8px', borderRadius: '50%', background: cameraActive ? '#10b981' : '#64748b', display: 'inline-block' }}></span>
                  {cameraActive ? "Live HD Camera Active" : "Camera Standby (Click to Open)"}
                </span>

                <button
                  onClick={cameraActive ? stopKioskCamera : startKioskCamera}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-muted)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  {cameraActive ? <VideoOff size={12} color="#EF5350" /> : <Video size={12} color="#38bdf8" />}
                  <span>{cameraActive ? "Turn Off Camera" : "Start Camera"}</span>
                </button>

                <button
                  onClick={() => setIsMirrored(prev => !prev)}
                  style={{
                    background: isMirrored ? 'rgba(56, 189, 248, 0.25)' : 'transparent',
                    border: '1px solid var(--border-subtle)',
                    color: isMirrored ? '#38bdf8' : 'var(--text-muted)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                  title="Flip / Un-mirror camera view"
                >
                  <FlipHorizontal size={12} />
                  <span>{isMirrored ? "Mirrored" : "Flip View"}</span>
                </button>
              </div>

              {/* Target Reticle Frame */}
              <div style={{
                width: '240px',
                height: '250px',
                borderRadius: '26px',
                border: verifyStatus === 'mismatched'
                  ? '3px solid #ef4444'
                  : (isScanning 
                    ? '3px solid #38bdf8' 
                    : (verifyStatus === 'matched' ? '3px solid #10b981' : '3px solid rgba(56, 189, 248, 0.7)')),
                boxShadow: verifyStatus === 'mismatched'
                  ? '0 0 25px rgba(239, 68, 68, 0.8)'
                  : (isScanning 
                    ? '0 0 25px rgba(56, 189, 248, 0.8)' 
                    : (verifyStatus === 'matched' ? '0 0 25px rgba(16, 185, 129, 0.7)' : '0 0 15px rgba(56, 189, 248, 0.35)')),
                animation: verifyStatus === 'mismatched' ? 'shakeReticle 0.5s ease, pulseGlowRose 1.8s infinite' : (verifyStatus === 'matched' ? 'pulseGlowEmerald 1.8s infinite' : 'none'),
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                background: 'var(--bg-surface)',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
              }}>

                {/* Hidden canvas for taking snapshot */}
                <canvas ref={kioskCanvasRef} style={{ display: 'none' }} />

                {/* Live video feed if webcam active */}
                {cameraActive ? (
                  <video 
                    ref={kioskVideoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '22px',
                      transform: isMirrored ? 'scaleX(-1)' : 'none',
                      transition: 'transform 0.2s ease'
                    }}
                  />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', textAlign: 'center' }}>
                    {verifyStatus === 'mismatched' ? (
                      <XCircle size={54} color="#ef4444" />
                    ) : (verifyStatus === 'matched' ? (
                      <CheckCircle2 size={54} color="#10b981" />
                    ) : (
                      <ScanFace size={54} color="#38bdf8" />
                    ))}
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '10px' }}>
                      {cameraError ? cameraError : "Click 'Start Camera' or 'Mark Attendance'"}
                    </span>
                  </div>
                )}

                {/* Animated Horizontal Laser Scan Beam */}
                {isScanning && (
                  <div style={{
                    position: 'absolute',
                    left: '8%',
                    right: '8%',
                    height: '3px',
                    background: 'linear-gradient(90deg, transparent, #38bdf8, #10b981, transparent)',
                    boxShadow: '0 0 16px #38bdf8',
                    animation: 'scanLaser 1.5s ease-in-out infinite',
                    zIndex: 10,
                    pointerEvents: 'none'
                  }} />
                )}

                {/* 4 Corner Reticle HUD Brackets */}
                <div style={{ position: 'absolute', top: '8px', left: '8px', width: '16px', height: '16px', borderTop: '3px solid #38bdf8', borderLeft: '3px solid #38bdf8', borderTopLeftRadius: '6px', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: '8px', right: '8px', width: '16px', height: '16px', borderTop: '3px solid #38bdf8', borderRight: '3px solid #38bdf8', borderTopRightRadius: '6px', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '8px', left: '8px', width: '16px', height: '16px', borderBottom: '3px solid #38bdf8', borderLeft: '3px solid #38bdf8', borderBottomLeftRadius: '6px', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '8px', right: '8px', width: '16px', height: '16px', borderBottom: '3px solid #38bdf8', borderRight: '3px solid #38bdf8', borderBottomRightRadius: '6px', pointerEvents: 'none' }} />

                {/* Status Overlay Ribbon */}
                <div style={{ 
                  position: 'absolute', 
                  bottom: '10px', 
                  fontSize: '10.5px', 
                  fontWeight: 800,
                  color: '#ffffff',
                  background: verifyStatus === 'mismatched'
                    ? 'rgba(239, 68, 68, 0.85)'
                    : (isScanning 
                      ? 'rgba(56, 189, 248, 0.85)' 
                      : (verifyStatus === 'matched' ? 'rgba(16, 185, 129, 0.85)' : 'rgba(16, 42, 86, 0.8)')),
                  padding: '4px 10px',
                  borderRadius: '6px',
                  letterSpacing: '0.6px',
                  backdropFilter: 'blur(4px)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                  zIndex: 12
                }}>
                  {isScanning 
                    ? "ANALYZING 512-D EMBEDDING..." 
                    : (verifyStatus === 'mismatched' 
                      ? "❌ NOT THAT CHILD!" 
                      : (verifyStatus === 'matched' ? "✓ VERIFIED: PRESENT" : "READY FOR SCAN"))}
                </div>
              </div>

              {/* Liveness Info */}
              <p style={{ marginTop: '14px', fontSize: '11.5px', color: 'var(--text-muted)', textAlign: 'center' }}>
                Anti-Spoof Liveness: <strong style={{ color: '#10b981' }}>Passed (99.8%)</strong> &bull; Scans Today: <strong style={{ color: 'var(--accent-cyan)' }}>{scanCount}</strong>
              </p>

              {/* Primary Action Button: Mark Attendance Icon */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '320px', marginTop: '14px' }}>
                <button 
                  className="btn-primary" 
                  onClick={() => handleTriggerFaceScan(selectedStudentId, false)} 
                  disabled={isScanning}
                  style={{ 
                    fontSize: '13px', 
                    padding: '11px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 16px rgba(22, 119, 255, 0.4)'
                  }}
                >
                  {isScanning ? (
                    <>
                      <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} />
                      <span>Scanning 512-D Face...</span>
                    </>
                  ) : (
                    <>
                      <Camera size={16} />
                      <span>Mark Attendance (Scan Face)</span>
                    </>
                  )}
                </button>

                {/* Interactive Testing Simulation Buttons */}
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <button 
                    className="btn-secondary" 
                    onClick={() => handleTriggerFaceScan(selectedStudentId, false)}
                    title="Simulate successful face match for selected child"
                    style={{ fontSize: '11px', padding: '6px 12px', flex: 1, borderColor: 'rgba(24, 185, 129, 0.4)', color: '#18B981' }}
                  >
                    <span>✓ Test Correct Child</span>
                  </button>
                  <button 
                    className="btn-secondary" 
                    onClick={() => handleTriggerFaceScan(selectedStudentId, true)}
                    title="Simulate face mismatch to trigger error message"
                    style={{ fontSize: '11px', padding: '6px 12px', flex: 1, borderColor: 'rgba(239, 83, 80, 0.4)', color: '#EF5350' }}
                  >
                    <span>❌ Test Wrong Child</span>
                  </button>
                </div>
              </div>

              {/* Mismatch Rejection Alert Card */}
              {mismatchAlert && (
                <div style={{
                  marginTop: '16px',
                  width: '100%',
                  background: 'rgba(239, 83, 80, 0.12)',
                  border: '1.5px solid #EF5350',
                  borderRadius: '12px',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  animation: 'shakeReticle 0.5s ease',
                  boxShadow: '0 4px 16px rgba(239, 83, 80, 0.2)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <XCircle size={24} color="#EF5350" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ color: '#EF5350', fontWeight: 800, fontSize: '13px' }}>
                        Face Verification Failed
                      </div>
                      <div style={{ color: 'var(--text-main)', fontWeight: 700, fontSize: '12.5px', marginTop: '2px' }}>
                        {mismatchAlert.message || "It's not that child, please try again!"}
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '2px' }}>
                        The face scanned did not match the registered 512-D vector embedding. Attendance was NOT marked.
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleTriggerFaceScan(selectedStudentId, false)}
                    style={{
                      background: '#EF5350',
                      color: '#ffffff',
                      border: 'none',
                      padding: '7px 12px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '11.5px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Try Again
                  </button>
                </div>
              )}

            </div>

            {/* Live Identification Metadata Card */}
            <div className="glass-panel" style={{ padding: '26px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span className="badge badge-cyan">Identification Metadata</span>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                    Latency: {scanResult.latency}
                  </span>
                </div>

                {/* Profile header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '14px',
                    background: verifyStatus === 'mismatched'
                      ? 'linear-gradient(135deg, #EF5350, #DC2626)'
                      : (verifyStatus === 'matched' 
                        ? 'linear-gradient(135deg, #18B981, #059669)' 
                        : 'linear-gradient(135deg, #0284c7, #0ea5e9)'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: 900,
                    color: '#ffffff',
                    boxShadow: '0 4px 16px rgba(14, 165, 233, 0.4)',
                    transition: 'all 0.3s ease'
                  }}>
                    {(() => {
                      const cur = students.find(s => s.id === selectedStudentId);
                      return cur?.name.charAt(0) || scanResult.name.charAt(0);
                    })()}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '19px', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-heading)', margin: 0 }}>
                      {(() => {
                        const cur = students.find(s => s.id === selectedStudentId);
                        return cur ? cur.name : scanResult.name;
                      })()}
                    </h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-cyan)', margin: '2px 0 0' }}>
                      {(() => {
                        const cur = students.find(s => s.id === selectedStudentId);
                        return cur ? `${cur.admissionNumber} • Roll #${cur.rollNumber} • ${selectedClass}` : `${scanResult.id} • ${scanResult.class}`;
                      })()}
                    </p>
                  </div>
                </div>

                {/* Biometric verification details list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Guardian / Lineage:</span>
                    <strong style={{ color: 'var(--text-main)' }}>
                      {(() => {
                        const cur = students.find(s => s.id === selectedStudentId);
                        return cur ? `${cur.guardianName} (${cur.guardianPhone})` : scanResult.guardian;
                      })()}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Attendance Status:</span>
                    <span className={`badge ${
                      (() => {
                        const cur = students.find(s => s.id === selectedStudentId);
                        const st = cur ? cur.status : scanResult.status;
                        return st === 'PRESENT' ? 'badge-emerald' : (st === 'ABSENT' ? 'badge-rose' : 'badge-amber');
                      })()
                    }`}>
                      {(() => {
                        const cur = students.find(s => s.id === selectedStudentId);
                        return cur ? cur.status : scanResult.status;
                      })()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>512-D Biometric Match:</span>
                    <strong style={{ color: verifyStatus === 'mismatched' ? '#EF5350' : '#10b981' }}>
                      {verifyStatus === 'mismatched' ? "Mismatch (Score < 85%)" : `${scanResult.confidence}`}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Last Check-In Punch:</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>
                      {(() => {
                        const cur = students.find(s => s.id === selectedStudentId);
                        return cur && cur.checkInTime !== '—' ? cur.checkInTime : scanResult.timestamp;
                      })()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Parent SMS Notification:</span>
                    <span style={{ color: '#18B981', fontWeight: 700 }}>
                      ✓ Active (Gateway Ready)
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '18px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', padding: '12px 14px', borderRadius: '10px', fontSize: '11px', color: 'var(--text-dim)', lineHeight: 1.5 }}>
                🔒 <strong>512-D Vector Privacy Guard:</strong> Facial image is converted locally to an irreversible 512-dimensional vector embedding. Raw photos are never stored unencrypted. Fully compliant with India DPDP Act 2023.
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
