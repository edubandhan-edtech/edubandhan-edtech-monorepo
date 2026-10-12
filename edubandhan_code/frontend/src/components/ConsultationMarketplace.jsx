import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  User, 
  Sparkles, 
  Mic, 
  MicOff, 
  VideoOff, 
  PhoneOff, 
  MessageSquare,
  Award,
  CreditCard,
  FileText,
  Monitor,
  Share2,
  Lock,
  Key,
  X,
  AlertCircle,
  Send,
  RefreshCw,
  Info,
  ChevronRight,
  ExternalLink,
  FlipHorizontal
} from 'lucide-react';

export default function ConsultationMarketplace({ currentUser, activeRole, onRequireAuth }) {
  // Preset 30-minute consultation slots strictly between 12:00 PM and 3:00 PM
  const CONSULTATION_SLOTS = [
    '12:00 PM - 12:30 PM',
    '12:30 PM - 01:00 PM',
    '01:00 PM - 01:30 PM',
    '01:30 PM - 02:00 PM',
    '02:00 PM - 02:30 PM',
    '02:30 PM - 03:00 PM'
  ];

  const [teachers] = useState([
    {
      id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
      name: 'Mrs. Sunita Sharma',
      role: 'Class Teacher & Senior Academic Faculty',
      subject: 'Mathematics & Science (Class 8-B)',
      rating: '4.9 ★ (142 sessions)',
      avatar: '👩‍🏫',
      email: 'sunita.sharma@dps-rourkela.edu.in'
    },
    {
      id: 'anand-maths-001',
      name: 'Mr. Anand Kumar',
      role: 'Olympiad & Quantitative Specialist',
      subject: 'Advanced Maths & Logic Aptitude',
      rating: '5.0 ★ (89 sessions)',
      avatar: '👨‍🏫',
      email: 'anand.kumar@dps-rourkela.edu.in'
    },
    {
      id: 'neha-robotics-002',
      name: 'Ms. Neha Gupta',
      role: 'STEM & Robotics Lab Incharge',
      subject: 'Robotics, IoT & English Communication',
      rating: '4.8 ★ (67 sessions)',
      avatar: '👩‍💻',
      email: 'neha.gupta@dps-rourkela.edu.in'
    }
  ]);

  // Determine user perspective strictly from authenticated session:
  // Teachers ONLY see Teacher Desk (no parent portal).
  // Parents ONLY see Parent Portal.
  const isTeacherUser = activeRole === 'teacher' || !!currentUser?.role?.toUpperCase().includes('TEACH');
  const activeViewRole = isTeacherUser ? 'teacher' : 'parent';

  // Booking Form States (Parent)
  const [selectedTeacher, setSelectedTeacher] = useState(teachers[0]);
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedSlot, setSelectedSlot] = useState(CONSULTATION_SLOTS[0]);
  const [queryTopic, setQueryTopic] = useState('');
  const [isSubmittingQuery, setIsSubmittingQuery] = useState(false);
  const [bookingFeedback, setBookingFeedback] = useState(null);

  // Active Consultations List & Report Filter
  const [consultations, setConsultations] = useState([]);
  const [loadingConsultations, setLoadingConsultations] = useState(false);
  const [recordsFilter, setRecordsFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'COMPLETED'
  const [reportModalBooking, setReportModalBooking] = useState(null);

  // Rejection Modal State (Teacher)
  const [rejectModalData, setRejectModalData] = useState(null); // { booking }
  const [rejectionRemarks, setRejectionRemarks] = useState('');
  const [isDeciding, setIsDeciding] = useState(false);

  // Active In-Call Video Conference Chamber
  const [activeCallSession, setActiveCallSession] = useState(null);
  const [passcodeModalData, setPasscodeModalData] = useState(null); // { booking, enteredPasscode }
  const [passcodeError, setPasscodeError] = useState('');

  // Media Controls for Video Call
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isMirrored, setIsMirrored] = useState(false); // Default to FALSE (natural, un-mirrored)
  const [callSeconds, setCallSeconds] = useState(1800); // 30 minutes countdown (1800s)
  const [inCallChat, setInCallChat] = useState([]);
  const [chatInput, setChatInput] = useState('');

  // Remote participant live video feed state
  const [remotePeerInfo, setRemotePeerInfo] = useState(null);
  const [remoteLiveFrame, setRemoteLiveFrame] = useState(null);
  const [hasRemoteWebRtcStream, setHasRemoteWebRtcStream] = useState(false);

  // Unique client ID for WebSockets peer connection signaling
  const clientIdRef = useRef('client_' + Math.random().toString(36).substring(2, 9));

  // Video Refs
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const wsRef = useRef(null);
  const frameIntervalRef = useRef(null);

  // Fetch Consultations from Backend
  const fetchConsultations = async () => {
    setLoadingConsultations(true);
    try {
      const endpoint = activeViewRole === 'teacher' 
        ? '/api/teacher/consultations' 
        : '/api/parent/consultations';
      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        setConsultations(data.consultations || []);
      }
    } catch (e) {
      console.warn("Could not load backend consultations:", e);
    } finally {
      setLoadingConsultations(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, [activeViewRole]);

  // Handle Parent Booking Submission
  const handleRaiseConsultationQuery = async (e) => {
    e.preventDefault();
    if (!currentUser && onRequireAuth) {
      onRequireAuth({ id: 'consultation', title: 'Schedule 1-on-1 Teacher Consultation' });
      return;
    }
    if (!queryTopic.trim()) {
      alert("Please enter a consultation discussion topic or query.");
      return;
    }

    setIsSubmittingQuery(true);
    setBookingFeedback(null);
    try {
      const res = await fetch('/api/parent/request-consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacher_id: selectedTeacher.id,
          teacher_name: selectedTeacher.name,
          slot_date: selectedDate,
          slot_time: selectedSlot,
          query_topic: queryTopic.trim(),
          fee_amount: 0.0
        })
      });

      const data = await res.json();
      if (res.ok) {
        setBookingFeedback({
          type: 'success',
          message: `Consultation request for ${selectedSlot} (${selectedDate}) submitted! Waiting for ${selectedTeacher.name} to accept.`,
          bookingId: data.booking_id,
          passcode: data.room_passcode
        });
        setQueryTopic('');
        fetchConsultations();
      } else {
        setBookingFeedback({
          type: 'error',
          message: data.detail || 'Failed to submit query. Please try again.'
        });
      }
    } catch (err) {
      setBookingFeedback({
        type: 'error',
        message: 'Network error submitting consultation request.'
      });
    } finally {
      setIsSubmittingQuery(false);
    }
  };

  // Teacher Decision: Accept
  const handleAcceptConsultation = async (booking) => {
    if (!currentUser && onRequireAuth) {
      onRequireAuth({ id: 'consultation', title: 'Accept Consultation Booking' });
      return;
    }
    setIsDeciding(true);
    try {
      const res = await fetch('/api/teacher/consultation/decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_id: booking.id,
          decision: 'ACCEPT'
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Consultation Confirmed!\nRoom ID: ${data.room_id}\nRoom Passcode: ${data.room_passcode}\nNotification dispatched to Parent.`);
        fetchConsultations();
      } else {
        alert(data.detail || 'Error accepting consultation');
      }
    } catch (e) {
      alert('Error accepting consultation');
    } finally {
      setIsDeciding(false);
    }
  };

  // Teacher Decision: Reject with Remarks
  const handleConfirmRejection = async () => {
    if (!currentUser && onRequireAuth) {
      onRequireAuth({ id: 'consultation', title: 'Reject Consultation Booking' });
      return;
    }
    if (!rejectModalData?.booking) return;
    if (!rejectionRemarks.trim()) {
      alert("Please provide the reason / remarks for cancelling this consultation.");
      return;
    }

    setIsDeciding(true);
    try {
      const res = await fetch('/api/teacher/consultation/decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_id: rejectModalData.booking.id,
          decision: 'REJECT',
          remarks: rejectionRemarks.trim()
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Consultation Cancelled with Remarks: "${rejectionRemarks}"\nParent notified with reason.`);
        setRejectModalData(null);
        setRejectionRemarks('');
        fetchConsultations();
      } else {
        alert(data.detail || 'Error rejecting consultation');
      }
    } catch (e) {
      alert('Error rejecting consultation');
    } finally {
      setIsDeciding(false);
    }
  };

  // Join Room Validation
  const handleInitiateJoin = (booking) => {
    if (!currentUser && onRequireAuth) {
      onRequireAuth({ id: 'consultation', title: 'Join 1-on-1 Video Consultation Room' });
      return;
    }
    setPasscodeError('');
    setPasscodeModalData({
      booking,
      enteredPasscode: booking.room_passcode || ''
    });
  };

  const handleVerifyAndEnterRoom = async () => {
    const { booking, enteredPasscode } = passcodeModalData;
    if (!enteredPasscode.trim()) {
      setPasscodeError("Please enter the system room passcode to join.");
      return;
    }

    // Verify passcode matches
    if (booking.room_passcode && enteredPasscode.trim().toUpperCase() !== booking.room_passcode.toUpperCase()) {
      setPasscodeError("Invalid room passcode. Please check the notification received.");
      return;
    }

    setPasscodeModalData(null);
    setCallSeconds(1800);
    setRemoteLiveFrame(null);
    setHasRemoteWebRtcStream(false);
    setRemotePeerInfo(null);

    const sessionData = {
      booking,
      roomId: booking.webrtc_room_id,
      passcode: booking.room_passcode,
      role: activeViewRole
    };
    setActiveCallSession(sessionData);

    // Initialize media streams & WebRTC signaling
    await initializeMediaStream();
    initializeWebSocketRoom(booking.webrtc_room_id);
  };

  // Real WebRTC / Camera & Mic Setup
  const initializeMediaStream = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: { ideal: 1280 }, height: { ideal: 720 } }, 
          audio: true 
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      }
    } catch (err) {
      console.warn("Could not capture physical camera/mic (fallback mode):", err);
    }
  };

  // WebRTC PeerConnection Management
  const getOrCreatePeerConnection = () => {
    if (peerConnectionRef.current) return peerConnectionRef.current;

    try {
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      });

      // Add local audio/video tracks
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => {
          pc.addTrack(track, localStreamRef.current);
        });
      }

      // Handle receiving remote tracks
      pc.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
          setHasRemoteWebRtcStream(true);
        }
      };

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: 'webrtc_ice',
            senderId: clientIdRef.current,
            candidate: event.candidate
          }));
        }
      };

      peerConnectionRef.current = pc;
      return pc;
    } catch (e) {
      console.warn("WebRTC RTCPeerConnection initialization error:", e);
      return null;
    }
  };

  // WebSocket In-Room Connection with WebRTC Signaling & Live Video Frame Broadcast
  const initializeWebSocketRoom = (roomId) => {
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/consultation/${roomId}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      const myName = currentUser?.full_name || (activeViewRole === 'teacher' ? 'Mrs. Sunita Sharma' : 'Mr. Rajesh Sharma (Parent)');

      ws.onopen = () => {
        // Announce presence
        ws.send(JSON.stringify({
          type: 'peer_joined',
          senderId: clientIdRef.current,
          senderName: myName,
          senderRole: activeViewRole
        }));

        // Start broadcasting live video frame snapshots every 500ms
        // This ensures that even when testing in 2 tabs on the same computer (where OS camera lock prevents duplicate capture), BOTH cameras will show live video!
        if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
        const canvas = document.createElement('canvas');
        canvas.width = 360;
        canvas.height = 270;
        const ctx = canvas.getContext('2d');

        frameIntervalRef.current = setInterval(() => {
          if (localVideoRef.current && localVideoRef.current.videoWidth > 0 && isVideoOn) {
            try {
              ctx.drawImage(localVideoRef.current, 0, 0, 360, 270);
              const dataUrl = canvas.toDataURL('image/jpeg', 0.5);
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                  type: 'camera_frame',
                  senderId: clientIdRef.current,
                  senderName: myName,
                  senderRole: activeViewRole,
                  frame: dataUrl
                }));
              }
            } catch (err) {}
          }
        }, 500);

        // Initiate WebRTC offer if teacher/host
        if (activeViewRole === 'teacher') {
          setTimeout(async () => {
            const pc = getOrCreatePeerConnection();
            if (pc) {
              try {
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                ws.send(JSON.stringify({
                  type: 'webrtc_offer',
                  senderId: clientIdRef.current,
                  sdp: offer
                }));
              } catch (e) {}
            }
          }, 800);
        }
      };

      ws.onmessage = async (event) => {
        try {
          const msg = JSON.parse(event.data);
          // Ignore own messages
          if (msg.senderId === clientIdRef.current) return;

          if (msg.type === 'peer_joined') {
            setRemotePeerInfo({
              name: msg.senderName,
              role: msg.senderRole
            });
            // Other peer joined: initiate offer
            const pc = getOrCreatePeerConnection();
            if (pc && activeViewRole === 'teacher') {
              const offer = await pc.createOffer();
              await pc.setLocalDescription(offer);
              ws.send(JSON.stringify({
                type: 'webrtc_offer',
                senderId: clientIdRef.current,
                sdp: offer
              }));
            }
          } else if (msg.type === 'camera_frame') {
            // Live camera frame received from the other participant!
            setRemoteLiveFrame(msg.frame);
            setRemotePeerInfo({
              name: msg.senderName,
              role: msg.senderRole
            });
          } else if (msg.type === 'webrtc_offer') {
            const pc = getOrCreatePeerConnection();
            if (pc) {
              await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              ws.send(JSON.stringify({
                type: 'webrtc_answer',
                senderId: clientIdRef.current,
                sdp: answer
              }));
            }
          } else if (msg.type === 'webrtc_answer') {
            const pc = getOrCreatePeerConnection();
            if (pc) {
              await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
            }
          } else if (msg.type === 'webrtc_ice') {
            const pc = getOrCreatePeerConnection();
            if (pc && msg.candidate) {
              try {
                await pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
              } catch (e) {}
            }
          } else if (msg.type === 'chat_message') {
            // Ignore own broadcasted message
            if (msg.senderId === clientIdRef.current) return;
            setInCallChat(prev => {
              if (msg.id && prev.some(m => m.id === msg.id)) return prev;
              return [...prev, msg];
            });
          } else if (msg.type === 'call_ended') {
            alert("The other participant has left and ended the consultation call.\nThis session has been recorded in the database as a COMPLETED MEETING for academic report criteria.");
            handleEndCall(false);
          } else if (msg.type === 'peer_disconnected') {
            setRemoteLiveFrame(null);
            setHasRemoteWebRtcStream(false);
            setRemotePeerInfo(null);
          }
        } catch (e) {}
      };
    } catch (e) {
      console.warn("WebSocket room connection fallback:", e);
    }
  };

  // Screen Sharing
  const handleToggleScreenShare = async () => {
    if (isScreenSharing) {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(t => t.stop());
        screenStreamRef.current = null;
      }
      setIsScreenSharing(false);
      if (localVideoRef.current && localStreamRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'screen_share_stopped' }));
      }
    } else {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
          screenStreamRef.current = screenStream;
          setIsScreenSharing(true);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = screenStream;
          }

          screenStream.getVideoTracks()[0].onended = () => {
            setIsScreenSharing(false);
            if (localVideoRef.current && localStreamRef.current) {
              localVideoRef.current.srcObject = localStreamRef.current;
            }
          };

          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'screen_share_started' }));
          }
        }
      } catch (err) {
        console.warn("Screen share cancelled or unsupported:", err);
      }
    }
  };

  // Toggle Microphone Mute
  const handleToggleMic = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !isMicOn;
      });
    }
    setIsMicOn(!isMicOn);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'mic_toggle', state: !isMicOn }));
    }
  };

  // Toggle Camera Video
  const handleToggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !isVideoOn;
      });
    }
    setIsVideoOn(!isVideoOn);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'video_toggle', state: !isVideoOn }));
    }
  };

  // End Call & Cleanup (Marks consultation as COMPLETED in DB)
  const handleEndCall = async (shouldBroadcast = true) => {
    const bookingId = activeCallSession?.booking?.id;
    const roomId = activeCallSession?.roomId;

    if (shouldBroadcast && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify({
          type: 'call_ended',
          senderId: clientIdRef.current,
          bookingId: bookingId,
          roomId: roomId
        }));
      } catch (e) {}
    }

    // Call backend API to persist COMPLETED status in database
    if (bookingId || roomId) {
      try {
        const endpoint = activeViewRole === 'teacher'
          ? '/api/teacher/consultation/complete'
          : '/api/parent/consultation/complete';
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ booking_id: bookingId, room_id: roomId })
        });
      } catch (e) {
        console.warn("Could not mark consultation as complete via API:", e);
      }
    }

    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop());
      localStreamRef.current = null;
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(t => t.stop());
      screenStreamRef.current = null;
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setActiveCallSession(null);
    setIsScreenSharing(false);
    setIsMicOn(true);
    setIsVideoOn(true);
    setRemoteLiveFrame(null);
    setHasRemoteWebRtcStream(false);
    setRemotePeerInfo(null);
    setInCallChat([]);
    await fetchConsultations();
  };

  // Send In-Call Chat Message (Fix: assigns unique ID and senderId to prevent duplicate self-chat)
  const handleSendInCallChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const msgId = 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    const newMsg = {
      id: msgId,
      type: 'chat_message',
      senderId: clientIdRef.current,
      sender: currentUser?.full_name || (activeViewRole === 'teacher' ? 'Mrs. Sunita Sharma' : 'Parent'),
      role: activeViewRole,
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setInCallChat(prev => {
      if (prev.some(m => m.id === msgId)) return prev;
      return [...prev, newMsg];
    });

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(newMsg));
    }
    setChatInput('');
  };

  // In-Call 30-min Timer
  useEffect(() => {
    let timer;
    if (activeCallSession) {
      timer = setInterval(() => {
        setCallSeconds(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeCallSession]);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Render Live Video Room Chamber if in-call
  if (activeCallSession) {
    const { booking, roomId, passcode } = activeCallSession;
    const hasRemoteFeed = hasRemoteWebRtcStream || !!remoteLiveFrame;

    return (
      <div style={{
        backgroundColor: '#050D1A',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1.5px solid rgba(22, 119, 255, 0.3)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '680px',
        color: '#FFFFFF'
      }}>
        {/* Call Header Bar */}
        <div style={{
          padding: '16px 24px',
          backgroundColor: 'rgba(7, 21, 39, 0.95)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              boxShadow: '0 0 10px #10B981',
              animation: 'pulse 1.5s infinite'
            }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#F8FAFC' }}>
                  1-on-1 Video Conference Chamber
                </span>
                <span style={{
                  fontSize: '11px',
                  backgroundColor: 'rgba(22, 119, 255, 0.25)',
                  color: '#38BDF8',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontWeight: 700
                }}>
                  30-Min Focused Slot
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
                Topic: <strong>{booking.query_topic || 'Academic & Performance Consultation'}</strong>
              </div>
            </div>
          </div>

          {/* Room Security Badges & Countdown Timer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <Lock size={13} color="#F59E0B" />
              <span>Room: <strong style={{ color: '#38BDF8' }}>{roomId}</strong></span>
              <span style={{ color: '#64748B' }}>•</span>
              <span>Passcode: <strong style={{ color: '#10B981' }}>{passcode}</strong></span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: callSeconds < 300 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.15)',
              border: `1px solid ${callSeconds < 300 ? '#EF4444' : '#10B981'}`,
              color: callSeconds < 300 ? '#FCA5A5' : '#34D399',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 800,
              fontVariantNumeric: 'tabular-nums'
            }}>
              <Clock size={15} />
              <span>{formatTimer(callSeconds)} Remaining</span>
            </div>
          </div>
        </div>

        {/* Video Stage Area & In-Call Chat Sidebar */}
        <div style={{ display: 'flex', flex: 1, minHeight: '520px' }}>
          
          {/* Main Video Viewport Grid - Shows TWO Cameras Side by Side */}
          <div style={{
            flex: 1,
            padding: '20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '16px',
            backgroundColor: '#071527',
            position: 'relative'
          }}>
            {/* 1. Remote Participant Video Card (Camera 1) */}
            <div style={{
              backgroundColor: '#0F2744',
              borderRadius: '14px',
              overflow: 'hidden',
              border: hasRemoteFeed ? '1.5px solid #10B981' : '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              minHeight: '280px'
            }}>
              {/* Remote Live Video / Stream View */}
              <div style={{
                flex: 1,
                backgroundColor: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* A: WebRTC Stream Video (if P2P track active) */}
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: hasRemoteWebRtcStream ? 'block' : 'none',
                    transform: 'none' // Remote is always natural orientation
                  }}
                />

                {/* B: Live Video Frame Broadcast (Active when other person streams over WebSockets) */}
                {(!hasRemoteWebRtcStream && remoteLiveFrame) && (
                  <img
                    src={remoteLiveFrame}
                    alt="Remote Camera Feed"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transform: 'none' // Unmirrored natural
                    }}
                  />
                )}

                {/* C: Waiting Placeholder (Before remote person connects) */}
                {!hasRemoteFeed && (
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'radial-gradient(circle, #153760 0%, #0A1B30 100%)',
                    padding: '24px',
                    textAlign: 'center',
                    width: '100%',
                    height: '100%'
                  }}>
                    <div style={{
                      width: '84px',
                      height: '84px',
                      borderRadius: '50%',
                      backgroundColor: '#1E4976',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '38px',
                      marginBottom: '12px',
                      border: '3px solid #38BDF8',
                      boxShadow: '0 0 20px rgba(56, 189, 248, 0.25)'
                    }}>
                      {activeViewRole === 'teacher' ? '👨‍👩‍👦' : '👩‍🏫'}
                    </div>
                    <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#F8FAFC' }}>
                      {remotePeerInfo?.name || (activeViewRole === 'teacher' ? (booking.student_name ? `Parent of ${booking.student_name}` : 'Parent (Aarav)') : (booking.teacher_name || 'Mrs. Sunita Sharma'))}
                    </h4>
                    <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#94A3B8' }}>
                      {activeViewRole === 'teacher' ? 'Waiting for Parent to enter room...' : 'Waiting for Teacher to enter room...'}
                    </p>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginTop: '12px',
                      backgroundColor: 'rgba(245, 158, 11, 0.15)',
                      color: '#FBBF24',
                      padding: '3px 12px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: 700
                    }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                      Room: {roomId} (Passcode: {passcode})
                    </div>
                  </div>
                )}

                {/* Live Stream Active Badge */}
                {hasRemoteFeed && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: 'rgba(16, 185, 129, 0.9)',
                    color: '#FFFFFF',
                    padding: '3px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FFFFFF', animation: 'pulse 1s infinite' }} />
                    <span>Live Camera Active</span>
                  </div>
                )}
              </div>

              {/* Bottom Remote Participant Bar */}
              <div style={{
                padding: '10px 14px',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '12px'
              }}>
                <span style={{ fontWeight: 700, color: '#F8FAFC' }}>
                  {remotePeerInfo?.name || (activeViewRole === 'teacher' ? 'Parent (Remote)' : 'Mrs. Sunita Sharma (Teacher)')}
                </span>
                <span style={{ color: hasRemoteFeed ? '#34D399' : '#94A3B8', fontSize: '11px', fontWeight: 600 }}>
                  {hasRemoteFeed ? 'Connected Live' : 'Awaiting Peer'}
                </span>
              </div>
            </div>

            {/* 2. Local Participant Video Card (Camera 2) */}
            <div style={{
              backgroundColor: '#0F2744',
              borderRadius: '14px',
              overflow: 'hidden',
              border: isScreenSharing ? '2px solid #F59E0B' : '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              minHeight: '280px'
            }}>
              {/* Local Video Stream Tag */}
              <div style={{
                flex: 1,
                backgroundColor: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: isScreenSharing ? 'contain' : 'cover',
                    display: isVideoOn || isScreenSharing ? 'block' : 'none',
                    // User fix: Mirror Image control (defaults to false / un-mirrored)
                    transform: isMirrored ? 'scaleX(-1)' : 'none',
                    transition: 'transform 0.2s ease'
                  }}
                />

                {/* Video Off Fallback Avatar */}
                {(!isVideoOn && !isScreenSharing) && (
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      backgroundColor: '#1E293B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '36px',
                      margin: '0 auto 10px',
                      border: '2px dashed #94A3B8'
                    }}>
                      {activeViewRole === 'teacher' ? '👩‍🏫' : '👤'}
                    </div>
                    <div style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 600 }}>
                      Camera Paused
                    </div>
                  </div>
                )}

                {/* Top Quick Badges on Local Video Card */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  display: 'flex',
                  gap: '6px'
                }}>
                  {isScreenSharing ? (
                    <div style={{
                      backgroundColor: 'rgba(245, 158, 11, 0.9)',
                      color: '#000000',
                      padding: '3px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <Monitor size={13} />
                      <span>Screen Share</span>
                    </div>
                  ) : (
                    <div style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      color: '#38BDF8',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 700
                    }}>
                      Your Camera
                    </div>
                  )}

                  {/* Mirror status badge */}
                  <button
                    onClick={() => setIsMirrored(prev => !prev)}
                    title="Click to toggle camera mirror orientation"
                    style={{
                      backgroundColor: isMirrored ? 'rgba(56, 189, 248, 0.25)' : 'rgba(0, 0, 0, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: isMirrored ? '#38BDF8' : '#CBD5E1',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '10.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <FlipHorizontal size={12} />
                    <span>{isMirrored ? 'Mirrored' : 'Normal View'}</span>
                  </button>
                </div>
              </div>

              {/* Bottom Self Participant Bar */}
              <div style={{
                padding: '10px 14px',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '12px'
              }}>
                <span style={{ fontWeight: 700, color: '#F8FAFC' }}>
                  You ({activeViewRole === 'teacher' ? 'Mrs. Sunita Sharma' : 'Parent'})
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {!isMicOn && <MicOff size={14} color="#EF4444" />}
                  {!isVideoOn && <VideoOff size={14} color="#EF4444" />}
                  {isScreenSharing && <Monitor size={14} color="#F59E0B" />}
                </div>
              </div>
            </div>
          </div>

          {/* In-Call Live Chat Drawer */}
          <div style={{
            width: '280px',
            backgroundColor: '#091A30',
            borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              padding: '12px 16px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <MessageSquare size={15} color="#38BDF8" />
              <span>In-Call Minutes & Chat</span>
            </div>

            {/* Chat Messages Stream */}
            <div style={{
              flex: 1,
              padding: '12px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              fontSize: '12px'
            }}>
              <div style={{
                backgroundColor: 'rgba(22, 119, 255, 0.1)',
                border: '1px solid rgba(22, 119, 255, 0.25)',
                padding: '8px 10px',
                borderRadius: '8px',
                color: '#93C5FD'
              }}>
                Session started. Live camera & microphones active.
              </div>

              {inCallChat.map((msg, idx) => (
                <div key={idx} style={{
                  backgroundColor: msg.role === activeViewRole ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${msg.role === activeViewRole ? 'rgba(56, 189, 248, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
                  padding: '8px 10px',
                  borderRadius: '8px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: '#94A3B8', marginBottom: '2px' }}>
                    <strong style={{ color: msg.role === 'teacher' ? '#34D399' : '#38BDF8' }}>{msg.sender}</strong>
                    <span>{msg.time}</span>
                  </div>
                  <div style={{ color: '#F8FAFC' }}>{msg.text}</div>
                </div>
              ))}
            </div>

            {/* In-Call Chat Input */}
            <form onSubmit={handleSendInCallChat} style={{
              padding: '10px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              gap: '6px'
            }}>
              <input
                type="text"
                placeholder="Type note or question..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                style={{
                  flex: 1,
                  backgroundColor: '#071527',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: '#1677FF',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  color: '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                <Send size={13} />
              </button>
            </form>
          </div>
        </div>

        {/* Video Call Master Control Bar */}
        <div style={{
          padding: '16px 24px',
          backgroundColor: '#071527',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '14px',
          flexWrap: 'wrap'
        }}>
          {/* 1. Mic Toggle */}
          <button
            onClick={handleToggleMic}
            title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: isMicOn ? 'rgba(255, 255, 255, 0.12)' : '#EF4444',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
          </button>

          {/* 2. Video Toggle */}
          <button
            onClick={handleToggleVideo}
            title={isVideoOn ? "Turn Camera Off" : "Turn Camera On"}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: isVideoOn ? 'rgba(255, 255, 255, 0.12)' : '#EF4444',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
          </button>

          {/* 3. Screen Share Toggle */}
          <button
            onClick={handleToggleScreenShare}
            title={isScreenSharing ? "Stop Screen Sharing" : "Share Your Screen"}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0 18px',
              height: '46px',
              borderRadius: '23px',
              border: `1.5px solid ${isScreenSharing ? '#F59E0B' : 'rgba(255, 255, 255, 0.2)'}`,
              backgroundColor: isScreenSharing ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.12)',
              color: isScreenSharing ? '#FBBF24' : '#FFFFFF',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Monitor size={18} />
            <span>{isScreenSharing ? "Sharing Screen" : "Share Screen"}</span>
          </button>

          {/* 4. Mirror Image Toggle Button (Addresses user request explicitly) */}
          <button
            onClick={() => setIsMirrored(prev => !prev)}
            title="Toggle video mirror orientation"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0 16px',
              height: '46px',
              borderRadius: '23px',
              border: `1.5px solid ${isMirrored ? '#38BDF8' : 'rgba(255, 255, 255, 0.2)'}`,
              backgroundColor: isMirrored ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.12)',
              color: isMirrored ? '#38BDF8' : '#FFFFFF',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <FlipHorizontal size={18} />
            <span>{isMirrored ? "Mirrored" : "Normal Video"}</span>
          </button>

          {/* 5. End Call Button */}
          <button
            onClick={handleEndCall}
            title="Leave and End Consultation Call"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0 22px',
              height: '46px',
              borderRadius: '23px',
              border: 'none',
              backgroundColor: '#EF4444',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)',
              transition: 'all 0.15s ease'
            }}
          >
            <PhoneOff size={18} />
            <span>End Call</span>
          </button>
        </div>
      </div>
    );
  }

  // Master Marketplace View: Booking + Active Requests Management
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div style={{
        padding: '24px',
        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(14, 165, 233, 0.12) 100%)',
        border: '1.5px solid rgba(168, 85, 247, 0.35)',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              color: '#fff',
              fontSize: '11px',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '6px',
              letterSpacing: '0.5px'
            }}>
              FEATURE 04
            </span>
            <h2 style={{ fontSize: '24px', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
              1-on-1 Video Conference Consultation
            </h2>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '4px 0 0 0' }}>
            Direct 30-minute peer-to-peer video consultations between parents & educators (12:00 PM – 03:00 PM slots).
          </p>
        </div>

        {/* Role Identity Badge (Strict role separation: Teachers only see Teacher Desk) */}
        {isTeacherUser ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            border: '1.5px solid rgba(16, 185, 129, 0.35)',
            padding: '8px 18px',
            borderRadius: '12px',
            color: '#34D399',
            fontSize: '13px',
            fontWeight: 800
          }}>
            <span style={{ fontSize: '18px' }}>👩‍🏫</span>
            <span>Teacher Consultation Desk • {currentUser?.full_name || 'Mrs. Sunita Sharma'}</span>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(22, 119, 255, 0.12)',
            border: '1.5px solid rgba(22, 119, 255, 0.35)',
            padding: '8px 18px',
            borderRadius: '12px',
            color: '#38BDF8',
            fontSize: '13px',
            fontWeight: 800
          }}>
            <span style={{ fontSize: '18px' }}>👨‍👩‍👦</span>
            <span>Parent Consultation Portal</span>
          </div>
        )}
      </div>

      {/* =========================================================================
          VIEW 1: PARENT VIEW (Book Query + My Appointments Stream)
          ========================================================================= */}
      {activeViewRole === 'parent' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: '24px', alignItems: 'start' }}>
          
          {/* Booking Request Card */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '14px',
            border: '1px solid var(--border-subtle)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'rgba(22, 119, 255, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Video size={18} color="#1677FF" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>
                  Request Video Conference
                </h3>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Slot options: 12:00 PM – 03:00 PM (30 Mins)
                </span>
              </div>
            </div>

            {bookingFeedback && (
              <div style={{
                padding: '12px 14px',
                borderRadius: '8px',
                fontSize: '12.5px',
                backgroundColor: bookingFeedback.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                border: `1px solid ${bookingFeedback.type === 'success' ? '#10B981' : '#EF4444'}`,
                color: bookingFeedback.type === 'success' ? (document.documentElement.getAttribute('data-theme') === 'dark' ? '#34D399' : '#065F46') : '#EF4444'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                  {bookingFeedback.type === 'success' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                  <span>{bookingFeedback.message}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleRaiseConsultationQuery} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* Select Educator */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Target Educator / Teacher
                </label>
                <select
                  value={selectedTeacher.id}
                  onChange={(e) => {
                    const found = teachers.find(t => t.id === e.target.value);
                    if (found) setSelectedTeacher(found);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-main)',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.avatar} {t.name} — {t.subject}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Day */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Consultation Day
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['Today', 'Tomorrow', 'Friday'].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSelectedDate(d)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '8px',
                        border: `1.5px solid ${selectedDate === d ? '#1677FF' : 'var(--border-subtle)'}`,
                        backgroundColor: selectedDate === d ? 'rgba(22, 119, 255, 0.12)' : 'var(--bg-secondary)',
                        color: selectedDate === d ? '#1677FF' : 'var(--text-muted)',
                        fontSize: '12px',
                        fontWeight: selectedDate === d ? 700 : 500,
                        cursor: 'pointer'
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* 30-Min Slot Grid (12 PM to 3 PM) */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Select 30-Min Slot (12:00 PM – 03:00 PM)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {CONSULTATION_SLOTS.map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: `1.5px solid ${selectedSlot === slot ? '#1677FF' : 'var(--border-subtle)'}`,
                        backgroundColor: selectedSlot === slot ? 'rgba(22, 119, 255, 0.15)' : 'var(--bg-secondary)',
                        color: selectedSlot === slot ? '#1677FF' : 'var(--text-main)',
                        fontSize: '11.5px',
                        fontWeight: selectedSlot === slot ? 800 : 500,
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Discussion Query / Topic */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Consultation Query / Discussion Topic *
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Discuss Aarav's Mathematics Term-1 test mistakes, homework guidance, and Olympiad prep."
                  value={queryTopic}
                  onChange={(e) => setQueryTopic(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-main)',
                    fontSize: '12.5px',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Submit Query Button */}
              <button
                type="submit"
                disabled={isSubmittingQuery}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  borderRadius: '9px',
                  border: 'none',
                  backgroundColor: '#1677FF',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: isSubmittingQuery ? 'not-allowed' : 'pointer',
                  boxShadow: '0 2px 8px rgba(22, 119, 255, 0.35)',
                  marginTop: '4px'
                }}
              >
                {isSubmittingQuery ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    <span>Transmitting Query...</span>
                  </>
                ) : (
                  <>
                    <Video size={16} />
                    <span>Submit Query for Teacher Approval</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Parent Appointments & Report Records Stream */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>
                  My 1-on-1 Video Consultations & Records
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Track approval status, room credentials, completed meetings & report criteria
                </span>
              </div>
              <button
                onClick={fetchConsultations}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-muted)',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                <RefreshCw size={13} />
                <span>Refresh</span>
              </button>
            </div>

            {/* Records Filter Navigation Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setRecordsFilter('ALL')}
                style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: recordsFilter === 'ALL' ? '#1677FF' : 'var(--bg-surface)',
                  color: recordsFilter === 'ALL' ? '#FFFFFF' : 'var(--text-muted)',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                All Records ({consultations.length})
              </button>
              <button
                onClick={() => setRecordsFilter('ACTIVE')}
                style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: recordsFilter === 'ACTIVE' ? '#F59E0B' : 'var(--bg-surface)',
                  color: recordsFilter === 'ACTIVE' ? '#FFFFFF' : 'var(--text-muted)',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Active / In-Queue ({consultations.filter(c => c.status === 'PENDING' || c.status === 'CONFIRMED' || c.status === 'ACCEPTED').length})
              </button>
              <button
                onClick={() => setRecordsFilter('COMPLETED')}
                style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  border: '1.5px solid #10B981',
                  backgroundColor: recordsFilter === 'COMPLETED' ? '#10B981' : 'rgba(16, 185, 129, 0.1)',
                  color: recordsFilter === 'COMPLETED' ? '#FFFFFF' : '#10B981',
                  fontSize: '11.5px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <CheckCircle2 size={13} />
                <span>Completed Meetings (Reports) ({consultations.filter(c => c.status === 'COMPLETED').length})</span>
              </button>
            </div>

            {loadingConsultations ? (
              <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                Loading consultation records...
              </div>
            ) : consultations.filter(c => {
              if (recordsFilter === 'COMPLETED') return c.status === 'COMPLETED';
              if (recordsFilter === 'ACTIVE') return c.status === 'PENDING' || c.status === 'CONFIRMED' || c.status === 'ACCEPTED';
              return true;
            }).length === 0 ? (
              <div style={{
                padding: '40px',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '12px',
                border: '1px dashed var(--border-subtle)',
                textAlign: 'center',
                color: 'var(--text-muted)'
              }}>
                <Video size={36} color="var(--border-subtle)" style={{ marginBottom: '8px' }} />
                <p style={{ margin: 0, fontWeight: 600 }}>No consultation records matching selected filter.</p>
                <p style={{ margin: '4px 0 0', fontSize: '12px' }}>
                  {recordsFilter === 'COMPLETED' 
                    ? 'Completed consultations will appear here automatically once both participants leave the call chamber.'
                    : 'Use the left form to schedule a 30-min slot between 12:00 PM – 03:00 PM.'}
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {consultations.filter(c => {
                  if (recordsFilter === 'COMPLETED') return c.status === 'COMPLETED';
                  if (recordsFilter === 'ACTIVE') return c.status === 'PENDING' || c.status === 'CONFIRMED' || c.status === 'ACCEPTED';
                  return true;
                }).map(c => {
                  const isCompleted = c.status === 'COMPLETED';
                  const isConfirmed = c.status === 'CONFIRMED' || c.status === 'ACCEPTED';
                  const isRejected = c.status === 'REJECTED' || c.status === 'CANCELLED';
                  const isPending = c.status === 'PENDING';

                  return (
                    <div
                      key={c.id}
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        borderRadius: '12px',
                        border: `1.5px solid ${isCompleted ? '#10B981' : isConfirmed ? '#38BDF8' : isRejected ? '#EF4444' : 'var(--border-subtle)'}`,
                        padding: '16px 20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        boxShadow: isCompleted ? '0 4px 18px rgba(16, 185, 129, 0.15)' : isConfirmed ? '0 4px 14px rgba(56, 189, 248, 0.1)' : 'none'
                      }}
                    >
                      {/* Top Bar: Teacher & Status Pill */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '20px' }}>{isCompleted ? '📋' : '👩‍🏫'}</span>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)' }}>
                              {c.teacher_name || 'Mrs. Sunita Sharma'}
                            </div>
                            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                              Scheduled: <strong>{c.query_topic ? c.query_topic.split(']')[0].replace('[', '') : '12:00 PM - 12:30 PM'}</strong>
                            </div>
                          </div>
                        </div>

                        {/* Status Badges */}
                        <div>
                          {isCompleted && (
                            <span style={{
                              backgroundColor: 'rgba(16, 185, 129, 0.15)',
                              color: '#10B981',
                              border: '1px solid rgba(16, 185, 129, 0.4)',
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '11px',
                              fontWeight: 800,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}>
                              <CheckCircle2 size={13} color="#10B981" /> Completed Meeting
                            </span>
                          )}
                          {isPending && (
                            <span style={{
                              backgroundColor: 'rgba(245, 158, 11, 0.15)',
                              color: '#D97706',
                              padding: '4px 10px',
                              borderRadius: '20px',
                              fontSize: '11px',
                              fontWeight: 800,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <Clock size={12} /> Pending Teacher Review
                            </span>
                          )}
                          {isConfirmed && !isCompleted && (
                            <span style={{
                              backgroundColor: 'rgba(56, 189, 248, 0.15)',
                              color: '#38BDF8',
                              padding: '4px 10px',
                              borderRadius: '20px',
                              fontSize: '11px',
                              fontWeight: 800,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <CheckCircle2 size={12} /> Accepted & Room Ready
                            </span>
                          )}
                          {isRejected && (
                            <span style={{
                              backgroundColor: 'rgba(239, 68, 68, 0.15)',
                              color: '#EF4444',
                              padding: '4px 10px',
                              borderRadius: '20px',
                              fontSize: '11px',
                              fontWeight: 800,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <X size={12} /> Rejected by Teacher
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Parent Query Topic Note */}
                      <div style={{
                        padding: '10px 12px',
                        backgroundColor: 'var(--bg-secondary)',
                        borderRadius: '8px',
                        fontSize: '12.5px',
                        color: 'var(--text-main)'
                      }}>
                        <strong style={{ color: 'var(--text-muted)' }}>Query Topic: </strong>
                        {c.query_topic ? c.query_topic.replace(/\[.*?\]\s*/, '') : 'General Academic Follow-up'}
                      </div>

                      {/* Rejection Remarks Box */}
                      {isRejected && c.rejection_remarks && (
                        <div style={{
                          padding: '10px 14px',
                          backgroundColor: 'rgba(239, 68, 68, 0.08)',
                          border: '1px solid rgba(239, 68, 68, 0.25)',
                          borderRadius: '8px',
                          fontSize: '12px',
                          color: '#EF4444'
                        }}>
                          <strong style={{ display: 'block', marginBottom: '2px' }}>
                            Teacher's Cancellation Remarks:
                          </strong>
                          <span>"{c.rejection_remarks}"</span>
                        </div>
                      )}

                      {/* Completed Meeting Record & Report Criteria (Addresses user requirement) */}
                      {isCompleted && (
                        <div style={{
                          padding: '12px 16px',
                          backgroundColor: 'rgba(16, 185, 129, 0.08)',
                          border: '1.5px solid rgba(16, 185, 129, 0.3)',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '12px'
                        }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 800, color: '#10B981' }}>
                              <ShieldCheck size={16} />
                              <span>Official Academic Report Record: Completed Meeting</span>
                            </div>
                            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                              • 30-Min Consultation concluded & logged in student progression dossier.
                            </div>
                          </div>

                          <button
                            onClick={() => setReportModalBooking(c)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '7px 14px',
                              borderRadius: '8px',
                              border: '1px solid #10B981',
                              backgroundColor: 'rgba(16, 185, 129, 0.15)',
                              color: '#10B981',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            <FileText size={14} />
                            <span>View Report Criteria</span>
                          </button>
                        </div>
                      )}

                      {/* Confirmed Room Credentials & Join Action */}
                      {isConfirmed && !isCompleted && (
                        <div style={{
                          padding: '12px 14px',
                          backgroundColor: 'rgba(16, 185, 129, 0.06)',
                          border: '1px solid rgba(16, 185, 129, 0.2)',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '12px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <Lock size={13} color="#1677FF" />
                              <span>Room: <strong>{c.webrtc_room_id}</strong></span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <Key size={13} color="#10B981" />
                              <span>Passcode: <strong style={{ color: '#10B981' }}>{c.room_passcode}</strong></span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleInitiateJoin(c)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '8px 16px',
                              borderRadius: '8px',
                              border: 'none',
                              backgroundColor: '#10B981',
                              color: '#FFFFFF',
                              fontSize: '12.5px',
                              fontWeight: 800,
                              cursor: 'pointer',
                              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.35)'
                            }}
                          >
                            <Video size={15} />
                            <span>Join Video Call</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: TEACHER VIEW (Review, Accept, Reject & Completed Report Records)
          ========================================================================= */}
      {activeViewRole === 'teacher' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>
                Consultation Requests Queue & Audit Records (Mrs. Sunita Sharma)
              </h3>
              <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                Review incoming queries, accept/reject requests, and inspect completed meetings for academic report criteria.
              </p>
            </div>
            <button
              onClick={fetchConsultations}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-muted)',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={13} />
              <span>Refresh Queue</span>
            </button>
          </div>

          {/* Teacher Records Filter Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setRecordsFilter('ALL')}
              style={{
                padding: '4px 12px',
                borderRadius: '20px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: recordsFilter === 'ALL' ? '#18B981' : 'var(--bg-surface)',
                color: recordsFilter === 'ALL' ? '#FFFFFF' : 'var(--text-muted)',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              All Consultations ({consultations.length})
            </button>
            <button
              onClick={() => setRecordsFilter('ACTIVE')}
              style={{
                padding: '4px 12px',
                borderRadius: '20px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: recordsFilter === 'ACTIVE' ? '#F59E0B' : 'var(--bg-surface)',
                color: recordsFilter === 'ACTIVE' ? '#FFFFFF' : 'var(--text-muted)',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Pending / Active Queue ({consultations.filter(c => c.status === 'PENDING' || c.status === 'CONFIRMED' || c.status === 'ACCEPTED').length})
            </button>
            <button
              onClick={() => setRecordsFilter('COMPLETED')}
              style={{
                padding: '4px 12px',
                borderRadius: '20px',
                border: '1.5px solid #10B981',
                backgroundColor: recordsFilter === 'COMPLETED' ? '#10B981' : 'rgba(16, 185, 129, 0.1)',
                color: recordsFilter === 'COMPLETED' ? '#FFFFFF' : '#10B981',
                fontSize: '11.5px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <CheckCircle2 size={13} />
              <span>Completed Meetings (Reports) ({consultations.filter(c => c.status === 'COMPLETED').length})</span>
            </button>
          </div>

          {loadingConsultations ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading queue...
            </div>
          ) : consultations.filter(c => {
            if (recordsFilter === 'COMPLETED') return c.status === 'COMPLETED';
            if (recordsFilter === 'ACTIVE') return c.status === 'PENDING' || c.status === 'CONFIRMED' || c.status === 'ACCEPTED';
            return true;
          }).length === 0 ? (
            <div style={{
              padding: '40px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '12px',
              border: '1px dashed var(--border-subtle)',
              textAlign: 'center',
              color: 'var(--text-muted)'
            }}>
              <Calendar size={36} color="var(--border-subtle)" style={{ marginBottom: '8px' }} />
              <p style={{ margin: 0, fontWeight: 600 }}>No consultation requests found for this filter.</p>
              <p style={{ margin: '4px 0 0', fontSize: '12px' }}>
                {recordsFilter === 'COMPLETED'
                  ? 'Completed consultations will be indexed here once both parent and teacher end the call.'
                  : 'New incoming parent queries will appear here in real-time.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '16px' }}>
              {consultations.filter(c => {
                if (recordsFilter === 'COMPLETED') return c.status === 'COMPLETED';
                if (recordsFilter === 'ACTIVE') return c.status === 'PENDING' || c.status === 'CONFIRMED' || c.status === 'ACCEPTED';
                return true;
              }).map(c => {
                const isCompleted = c.status === 'COMPLETED';
                const isPending = c.status === 'PENDING';
                const isConfirmed = c.status === 'CONFIRMED' || c.status === 'ACCEPTED';
                const isRejected = c.status === 'REJECTED' || c.status === 'CANCELLED';

                return (
                  <div
                    key={c.id}
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderRadius: '12px',
                      border: `1.5px solid ${isCompleted ? '#10B981' : isPending ? '#F59E0B' : isConfirmed ? '#38BDF8' : 'var(--border-subtle)'}`,
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                      boxShadow: isCompleted ? '0 4px 18px rgba(16, 185, 129, 0.15)' : isPending ? '0 4px 18px rgba(245, 158, 11, 0.1)' : 'none'
                    }}
                  >
                    {/* Header: Student & Parent Identity */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          backgroundColor: isCompleted ? '#065F46' : '#1E293B',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '15px'
                        }}>
                          {isCompleted ? '✓' : (c.student_name?.charAt(0) || 'A')}
                        </div>
                        <div>
                          <div style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--text-main)' }}>
                            {c.student_name || 'Aarav Sharma'}
                          </div>
                          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                            Roll: <strong>{c.roll_number || '08'}</strong> • Class 8-B • Parent: <strong>{c.parent_name || 'Rajesh Sharma'}</strong>
                          </div>
                        </div>
                      </div>

                      {/* Status Tag */}
                      <div>
                        {isCompleted && (
                          <span style={{
                            backgroundColor: 'rgba(16, 185, 129, 0.15)',
                            color: '#10B981',
                            border: '1px solid rgba(16, 185, 129, 0.4)',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 800,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <CheckCircle2 size={12} color="#10B981" /> Completed Meeting
                          </span>
                        )}
                        {isPending && (
                          <span style={{
                            backgroundColor: 'rgba(245, 158, 11, 0.15)',
                            color: '#D97706',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 800
                          }}>
                            Pending Review
                          </span>
                        )}
                        {isConfirmed && !isCompleted && (
                          <span style={{
                            backgroundColor: 'rgba(56, 189, 248, 0.15)',
                            color: '#38BDF8',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 800
                          }}>
                            Accepted & Active
                          </span>
                        )}
                        {isRejected && (
                          <span style={{
                            backgroundColor: 'rgba(239, 68, 68, 0.15)',
                            color: '#EF4444',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 800
                          }}>
                            Rejected
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Slot & Time Window */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '12.5px',
                      color: 'var(--text-main)',
                      backgroundColor: 'var(--bg-secondary)',
                      padding: '8px 12px',
                      borderRadius: '8px'
                    }}>
                      <Clock size={14} color="#1677FF" />
                      <span>Slot: <strong>{c.query_topic ? c.query_topic.split(']')[0].replace('[', '') : '12:00 PM - 12:30 PM'}</strong></span>
                      <span style={{ color: 'var(--text-muted)' }}>• 30 Mins</span>
                    </div>

                    {/* Query Topic Content */}
                    <div style={{ fontSize: '12.5px', color: 'var(--text-main)', lineHeight: 1.5 }}>
                      <strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px' }}>
                        Parent Discussion Query:
                      </strong>
                      <p style={{ margin: '3px 0 0', fontWeight: 500 }}>
                        {c.query_topic ? c.query_topic.replace(/\[.*?\]\s*/, '') : 'General Academic Follow-up'}
                      </p>
                    </div>

                    {/* Rejection Remarks display */}
                    {isRejected && c.rejection_remarks && (
                      <div style={{
                        padding: '8px 12px',
                        backgroundColor: 'rgba(239, 68, 68, 0.08)',
                        borderRadius: '6px',
                        fontSize: '12px',
                        color: '#EF4444'
                      }}>
                        <strong>Your Cancellation Remarks: </strong>
                        <span>{c.rejection_remarks}</span>
                      </div>
                    )}

                    {/* Action Bar (Requirement 3: Accept and Reject with Remarks) */}
                    {isPending && (
                      <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '8px' }}>
                        <button
                          onClick={() => handleAcceptConsultation(c)}
                          disabled={isDeciding}
                          style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            padding: '9px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: '#10B981',
                            color: '#FFFFFF',
                            fontSize: '12.5px',
                            fontWeight: 700,
                            cursor: isDeciding ? 'not-allowed' : 'pointer',
                            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                          }}
                        >
                          <CheckCircle2 size={15} />
                          <span>Accept & Create Room</span>
                        </button>

                        <button
                          onClick={() => {
                            setRejectModalData({ booking: c });
                            setRejectionRemarks('');
                          }}
                          disabled={isDeciding}
                          style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            padding: '9px',
                            borderRadius: '8px',
                            border: '1px solid rgba(239, 68, 68, 0.4)',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            color: '#EF4444',
                            fontSize: '12.5px',
                            fontWeight: 700,
                            cursor: isDeciding ? 'not-allowed' : 'pointer'
                          }}
                        >
                          <X size={15} />
                          <span>Reject with Remarks</span>
                        </button>
                      </div>
                    )}

                    {/* Completed Meeting Record: Audit Report Criteria */}
                    {isCompleted && (
                      <div style={{
                        marginTop: 'auto',
                        paddingTop: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: 'rgba(16, 185, 129, 0.08)',
                        border: '1px solid rgba(16, 185, 129, 0.25)',
                        padding: '10px 14px',
                        borderRadius: '8px'
                      }}>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                          Report Criteria: <strong style={{ color: '#10B981' }}>Completed Meeting Logged</strong>
                        </div>
                        <button
                          onClick={() => setReportModalBooking(c)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '6px 14px',
                            borderRadius: '7px',
                            border: '1px solid #10B981',
                            backgroundColor: 'rgba(16, 185, 129, 0.15)',
                            color: '#10B981',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          <FileText size={13} />
                          <span>Audit Report</span>
                        </button>
                      </div>
                    )}

                    {/* If Confirmed, Teacher can also Join */}
                    {isConfirmed && !isCompleted && (
                      <div style={{
                        marginTop: 'auto',
                        paddingTop: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: 'rgba(16, 185, 129, 0.08)',
                        padding: '10px 12px',
                        borderRadius: '8px'
                      }}>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-main)' }}>
                          Passcode: <strong style={{ color: '#10B981' }}>{c.room_passcode}</strong>
                        </div>
                        <button
                          onClick={() => handleInitiateJoin(c)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '7px 14px',
                            borderRadius: '7px',
                            border: 'none',
                            backgroundColor: '#10B981',
                            color: '#FFFFFF',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          <Video size={14} />
                          <span>Join Session</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          MODAL 1: TEACHER REJECTION REMARKS MODAL (Requirement 6)
          ========================================================================= */}
      {rejectModalData && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(5, 12, 24, 0.75)',
          backdropFilter: 'blur(6px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '480px',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '16px',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <X size={20} color="#EF4444" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>
                    Reject Consultation Request
                  </h3>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    State the cancellation remarks sent to parent
                  </span>
                </div>
              </div>
              <button
                onClick={() => setRejectModalData(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              You are declining the consultation requested for <strong>{rejectModalData.booking.student_name || 'Aarav Sharma'}</strong>.
              Please provide explicit remarks so the parent understands the reason.
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                Cancellation Remarks / Explanation *
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Scheduled for CBSE Exam Duty from 12:00 PM to 01:30 PM. Kindly book the 02:00 PM - 02:30 PM slot instead."
                value={rejectionRemarks}
                onChange={(e) => setRejectionRemarks(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-main)',
                  fontSize: '12.5px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setRejectModalData(null)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-main)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRejection}
                disabled={isDeciding || !rejectionRemarks.trim()}
                style={{
                  padding: '9px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: (isDeciding || !rejectionRemarks.trim()) ? 'not-allowed' : 'pointer',
                  boxShadow: '0 2px 10px rgba(239, 68, 68, 0.35)'
                }}
              >
                {isDeciding ? 'Submitting...' : 'Confirm Rejection & Notify Parent'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: ROOM PASSCODE VERIFICATION (Requirement 4)
          ========================================================================= */}
      {passcodeModalData && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(5, 12, 24, 0.75)',
          backdropFilter: 'blur(6px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '440px',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Key size={20} color="#10B981" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>
                    Enter Room Passcode
                  </h3>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    System generated encrypted room password
                  </span>
                </div>
              </div>
              <button
                onClick={() => setPasscodeModalData(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Room ID: <strong style={{ color: '#1677FF' }}>{passcodeModalData.booking.webrtc_room_id}</strong>
              <br />
              Enter the system room passcode sent via your notification to join the live session.
            </div>

            {passcodeError && (
              <div style={{
                padding: '8px 12px',
                borderRadius: '8px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#EF4444',
                fontSize: '12px',
                fontWeight: 600
              }}>
                {passcodeError}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                Room Passcode (e.g. {passcodeModalData.booking.room_passcode || 'EDU-7842'})
              </label>
              <input
                type="text"
                value={passcodeModalData.enteredPasscode}
                onChange={(e) => setPasscodeModalData({
                  ...passcodeModalData,
                  enteredPasscode: e.target.value
                })}
                placeholder="Enter passcode..."
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1.5px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-main)',
                  fontSize: '15px',
                  fontWeight: 800,
                  letterSpacing: '1px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setPasscodeModalData(null)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-main)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyAndEnterRoom}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#10B981',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(16, 185, 129, 0.35)'
                }}
              >
                <Video size={15} />
                <span>Verify & Enter Call</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: OFFICIAL ACADEMIC REPORT CRITERIA MODAL (Requirement: Completed Meeting Report)
          ========================================================================= */}
      {reportModalBooking && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(5, 12, 24, 0.8)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '560px',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '16px',
            border: '1.5px solid #10B981',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            {/* Report Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #10B981'
                }}>
                  <ShieldCheck size={22} color="#10B981" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16.5px', fontWeight: 800, color: 'var(--text-main)' }}>
                    1-on-1 Consultation Academic Report
                  </h3>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Delhi Public School, Rourkela • Official Parent-Teacher Council
                  </span>
                </div>
              </div>
              <button
                onClick={() => setReportModalBooking(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Status & Audit Stamp */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: '10px 14px',
              borderRadius: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 800, color: '#10B981' }}>
                <CheckCircle2 size={16} />
                <span>AUDIT STATUS: COMPLETED MEETING</span>
              </div>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#34D399',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                padding: '2px 8px',
                borderRadius: '4px'
              }}>
                Report Criteria Verified
              </span>
            </div>

            {/* Report Detail Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              backgroundColor: 'var(--bg-secondary)',
              padding: '14px',
              borderRadius: '10px',
              fontSize: '12px'
            }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>Student Name</span>
                <strong style={{ color: 'var(--text-main)', fontSize: '13px' }}>
                  {reportModalBooking.student_name || 'Aarav Sharma'}
                </strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>Roll & Class</span>
                <strong style={{ color: 'var(--text-main)', fontSize: '13px' }}>
                  Roll: {reportModalBooking.roll_number || '08'} • Class 8-B
                </strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>Educator Faculty</span>
                <strong style={{ color: 'var(--text-main)', fontSize: '13px' }}>
                  {reportModalBooking.teacher_name || 'Mrs. Sunita Sharma'}
                </strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>Parent Representative</span>
                <strong style={{ color: 'var(--text-main)', fontSize: '13px' }}>
                  {reportModalBooking.parent_name || 'Mr. Rajesh Sharma'}
                </strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>Consultation Slot</span>
                <strong style={{ color: '#1677FF', fontSize: '12.5px' }}>
                  {reportModalBooking.query_topic ? reportModalBooking.query_topic.split(']')[0].replace('[', '') : '12:00 PM - 12:30 PM (30 Mins)'}
                </strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>WebRTC Room ID</span>
                <strong style={{ color: 'var(--text-main)', fontSize: '12px', fontFamily: 'monospace' }}>
                  {reportModalBooking.webrtc_room_id || 'room-ptm-completed'}
                </strong>
              </div>
            </div>

            {/* Query Discussion / Agenda Notes */}
            <div style={{
              padding: '12px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              fontSize: '12.5px'
            }}>
              <strong style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontSize: '11px' }}>
                Academic Consultation Agenda / Query Topic:
              </strong>
              <div style={{ color: 'var(--text-main)', fontWeight: 500 }}>
                {reportModalBooking.query_topic ? reportModalBooking.query_topic.replace(/\[.*?\]\s*/, '') : 'General Academic Follow-up and Performance Consultation'}
              </div>
            </div>

            {/* Official Report Compliance Footnote */}
            <div style={{
              fontSize: '11.5px',
              color: 'var(--text-muted)',
              lineHeight: 1.5,
              padding: '8px 12px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '6px',
              borderLeft: '3px solid #10B981'
            }}>
              ✓ This consultation meets statutory CBSE / NEP 2020 Parent-Teacher engagement criteria.
              Both participants joined live with microphone and camera encryption over WebSockets.
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '4px' }}>
              <button
                onClick={() => setReportModalBooking(null)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-main)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#10B981',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(16, 185, 129, 0.35)'
                }}
              >
                <FileText size={15} />
                <span>Print / Save PDF Report</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
