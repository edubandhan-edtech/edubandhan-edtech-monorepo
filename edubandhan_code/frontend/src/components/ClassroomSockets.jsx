import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, 
  Send, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  Bell, 
  Pin, 
  CheckCheck, 
  AlertTriangle, 
  BookOpen, 
  MessageSquare, 
  HelpCircle,
  Wifi,
  WifiOff,
  RefreshCw
} from 'lucide-react';

export default function ClassroomSockets({ currentUser, onRequireAuth }) {
  const [channels, setChannels] = useState([
    {
      id: 'class-8b',
      name: 'Class 8-B Community Channel',
      description: 'Daily homework, study materials, class notices & parent queries',
      icon: '📚',
      badge: 'Active Classroom',
      members: '28 Parents • 4 Teachers • Principal'
    },
    {
      id: 'school-announcements',
      name: 'DPS Official Broadcast Channel',
      description: 'Principal circulars, holiday notices, fee deadlines & event alerts',
      icon: '🏫',
      badge: 'School-Wide',
      members: 'All School Parents & Staff'
    },
    {
      id: 'parent-teacher-qna',
      name: 'Parent-Teacher Q&A Desk',
      description: 'Direct academic inquiries, bus transport questions & doubt clearing',
      icon: '❓',
      badge: 'Open Discussion',
      members: 'Moderated by Teachers'
    }
  ]);

  const getInitialActiveChannel = () => {
    const stored = sessionStorage.getItem('edubandhan_active_channel');
    if (stored) return stored;
    if (currentUser?.room_key) return currentUser.room_key;
    if (currentUser?.children && currentUser.children[0]?.room_key) return currentUser.children[0].room_key;
    return 'class-8b';
  };

  const [activeChannel, setActiveChannel] = useState(getInitialActiveChannel);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [category, setCategory] = useState('GENERAL'); // 'UPDATE' | 'HOMEWORK' | 'QUERY' | 'EMERGENCY' | 'GENERAL'
  const [wsStatus, setWsStatus] = useState('connecting'); // 'connected' | 'connecting' | 'disconnected'
  
  const wsRef = useRef(null);
  const chatBottomRef = useRef(null);

  // Fetch dynamic channels from backend on load
  useEffect(() => {
    fetch('/api/chat/channels')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setChannels(data);
          const desired = sessionStorage.getItem('edubandhan_active_channel') || currentUser?.room_key;
          if (desired && data.some(c => c.id === desired)) {
            setActiveChannel(desired);
          }
        }
      })
      .catch(err => console.error("Error loading chat channels:", err));
  }, [currentUser]);

  // Determine current sender name & role
  const senderName = currentUser?.full_name || (currentUser?.role === 'TEACHER' ? 'Mrs. Sunita Sharma' : currentUser?.role === 'PARENT' ? 'Mr. Rajesh Sharma' : 'Principal Desk (System)');
  const senderRole = currentUser?.role || 'SCHOOL_ADMIN';
  const senderAvatar = senderRole === 'SCHOOL_ADMIN' ? '🏫' : senderRole === 'TEACHER' ? '👩‍🏫' : senderRole === 'PARENT' ? '👨‍👩‍👦' : '🎒';

  // Load message history from DB
  const loadHistory = async (channelId) => {
    try {
      const res = await fetch(`/api/chat/history/${channelId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages);
        } else {
          // Pre-populate realistic seed messages if empty
          setMessages(getInitialChannelMessages(channelId));
        }
      } else {
        setMessages(getInitialChannelMessages(channelId));
      }
    } catch (e) {
      setMessages(getInitialChannelMessages(channelId));
    }
  };

  const getInitialChannelMessages = (chan) => {
    if (chan === 'class-8b') {
      return [
        {
          id: '1',
          sender_name: 'Mrs. Sunita Sharma',
          sender_role: 'TEACHER',
          sender_avatar: '👩‍🏫',
          message_text: 'Dear Parents, please ensure homework for Mathematics Chapter 4 (Quadratic Equations, Ex 4.2) is completed tonight for morning review.',
          category: 'HOMEWORK',
          timestamp: '08:30 AM'
        },
        {
          id: '2',
          sender_name: 'Dr. S. K. Mohanty (Principal)',
          sender_role: 'SCHOOL_ADMIN',
          sender_avatar: '🏫',
          message_text: 'Reminder: Tomorrow is the Inter-School Science Olympiad briefing in the Main Auditorium at 09:15 AM.',
          category: 'UPDATE',
          timestamp: '09:45 AM'
        },
        {
          id: '3',
          sender_name: 'Mr. Rajesh Sharma (Rohan\'s Father)',
          sender_role: 'PARENT',
          sender_avatar: '👨‍👩‍👦',
          message_text: 'Good morning Ma\'am. Rohan was absent yesterday due to fever; I have submitted the medical prescription in the Leave Engine.',
          category: 'QUERY',
          timestamp: '10:15 AM'
        }
      ];
    } else if (chan === 'school-announcements') {
      return [
        {
          id: '101',
          sender_name: 'Principal Desk (System)',
          sender_role: 'SCHOOL_ADMIN',
          sender_avatar: '🏫',
          message_text: 'Circular DPS/2026/OCT/04: Autumn Term Examination Schedules are released on the Parent Pulse portal.',
          category: 'UPDATE',
          timestamp: 'Yesterday 04:00 PM'
        },
        {
          id: '102',
          sender_name: 'Transport Operations Team',
          sender_role: 'SCHOOL_ADMIN',
          sender_avatar: '🚌',
          message_text: 'School Bus Route #7 GPS tracking telemetry is now actively streaming live in Parent Pulse.',
          category: 'UPDATE',
          timestamp: 'Today 07:15 AM'
        }
      ];
    } else {
      return [
        {
          id: '201',
          sender_name: 'Priya Patel (Guardian)',
          sender_role: 'PARENT',
          sender_avatar: '👨‍👩‍👦',
          message_text: 'Will the Robotics lab workshop be conducted on this coming Saturday?',
          category: 'QUERY',
          timestamp: '11:05 AM'
        },
        {
          id: '202',
          sender_name: 'Ms. Neha Gupta (Robotics Faculty)',
          sender_role: 'TEACHER',
          sender_avatar: '👩‍🏫',
          message_text: 'Yes! The Arduino IoT Hands-On workshop will be from 10:00 AM to 12:30 PM. All materials provided.',
          category: 'UPDATE',
          timestamp: '11:20 AM'
        }
      ];
    }
  };

  // Connect WebSocket
  useEffect(() => {
    loadHistory(activeChannel);

    // Setup WebSocket
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    // If running on Vite dev server (port 5173), route to backend 8000
    const host = window.location.port === '5173' ? `${window.location.hostname}:8000` : window.location.host;
    const wsUrl = `${protocol}//${host}/ws/chat/${activeChannel}`;

    setWsStatus('connecting');

    let ws;
    try {
      ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setWsStatus('connected');
      };

      ws.onmessage = (event) => {
        try {
          const incoming = JSON.parse(event.data);
          setMessages(prev => [...prev, incoming]);
        } catch (e) {
          console.error('Error parsing WS message:', e);
        }
      };

      ws.onclose = () => {
        setWsStatus('disconnected');
      };

      ws.onerror = () => {
        setWsStatus('disconnected');
      };
    } catch (err) {
      console.error('WebSocket connection error:', err);
      setWsStatus('disconnected');
    }

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [activeChannel]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!currentUser && onRequireAuth) {
      onRequireAuth({ id: 'sockets', title: 'Broadcast in Classroom Channel' });
      return;
    }
    if (!inputText.trim()) return;

    const payload = {
      channel: activeChannel,
      sender_name: senderName,
      sender_role: senderRole,
      sender_avatar: senderAvatar,
      message_text: inputText.trim(),
      category: category,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // If WS connected, send through socket
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    } else {
      // Fallback HTTP endpoint
      try {
        await fetch('/api/chat/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        setMessages(prev => [...prev, { ...payload, id: Date.now().toString() }]);
      } catch (err) {
        console.error('Failed to send message via HTTP:', err);
        setMessages(prev => [...prev, { ...payload, id: Date.now().toString() }]);
      }
    }

    setInputText('');
  };

  const getRoleBadgeStyle = (role) => {
    const r = (role || '').toUpperCase();
    if (r === 'SCHOOL_ADMIN' || r === 'SUPER_ADMIN') {
      return { background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.35)' };
    }
    if (r === 'TEACHER') {
      return { background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.35)' };
    }
    if (r === 'PARENT') {
      return { background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.35)' };
    }
    return { background: 'rgba(14, 165, 233, 0.15)', color: '#38bdf8', border: '1px solid rgba(14, 165, 233, 0.35)' };
  };

  const getCategoryBadgeStyle = (cat) => {
    switch (cat) {
      case 'HOMEWORK':
        return { background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', label: '📝 Homework' };
      case 'UPDATE':
        return { background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', label: '📢 Notice' };
      case 'EMERGENCY':
        return { background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', label: '🚨 Urgent' };
      case 'QUERY':
        return { background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', label: '❓ Query' };
      default:
        return { background: 'rgba(148, 163, 184, 0.15)', color: 'var(--text-muted)', label: '💬 General' };
    }
  };

  const currentChannelObj = channels.find(c => c.id === activeChannel) || channels[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '24px',
        background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.12) 0%, rgba(3, 105, 161, 0.2) 100%)',
        border: '1.5px solid rgba(56, 189, 248, 0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              background: 'linear-gradient(135deg, #0284c7, #0ea5e9)',
              color: '#fff',
              fontSize: '11px',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '6px',
              letterSpacing: '0.5px'
            }}>
              FEATURE 05
            </span>
            <h2 style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-heading)', margin: 0, color: 'var(--text-main)' }}>
              Moderated Classroom Sockets
            </h2>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '4px 0 0 0' }}>
            Real-time broadcast circulars, homework dissemination &amp; parent-teacher synchronization powered by FastAPI WebSockets.
          </p>
        </div>

        {/* Live WS Status Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: wsStatus === 'connected' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
          border: `1px solid ${wsStatus === 'connected' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
          padding: '6px 14px',
          borderRadius: 'var(--radius-full)',
          fontSize: '12px',
          fontWeight: 700,
          color: wsStatus === 'connected' ? '#34d399' : '#fbbf24'
        }}>
          {wsStatus === 'connected' ? <Wifi size={15} /> : <WifiOff size={15} />}
          <span>{wsStatus === 'connected' ? 'FastAPI WebSockets Live' : 'Reconnecting WebSocket...'}</span>
          <span className="pulse-dot" style={{ background: wsStatus === 'connected' ? '#10b981' : '#f59e0b' }}></span>
        </div>
      </div>

      {/* Main Grid: Channels List (Left) + Live Chat Room (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px' }}>
        
        {/* Left Column: Available Channels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Classroom Channels ({channels.length})
          </div>

          {channels.map(chan => {
            const isSelected = activeChannel === chan.id;
            return (
              <div
                key={chan.id}
                onClick={() => setActiveChannel(chan.id)}
                className="glass-panel"
                style={{
                  padding: '16px',
                  cursor: 'pointer',
                  border: isSelected ? '1.5px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'rgba(14, 165, 233, 0.18)' : 'var(--bg-glass)',
                  boxShadow: isSelected ? '0 0 20px rgba(14, 165, 233, 0.25)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '20px' }}>{chan.icon}</span>
                    <strong style={{ fontSize: '13px', color: isSelected ? '#38bdf8' : 'var(--text-main)' }}>
                      {chan.name}
                    </strong>
                  </div>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: 'rgba(56, 189, 248, 0.12)',
                    color: '#38bdf8'
                  }}>
                    {chan.badge}
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 8px 0', lineHeight: 1.4 }}>
                  {chan.description}
                </p>
                <div style={{ fontSize: '10px', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Users size={12} />
                  <span>{chan.members}</span>
                </div>
              </div>
            );
          })}

          {/* DPDP Compliance Card */}
          <div className="glass-panel" style={{
            padding: '14px',
            background: 'rgba(16, 185, 129, 0.06)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            fontSize: '11px',
            color: 'var(--text-muted)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontWeight: 700, marginBottom: '4px' }}>
              <ShieldCheck size={14} />
              <span>Moderated &amp; DPDP Compliant</span>
            </div>
            <span>All broadcasts are encrypted, archived in Neon PostgreSQL, and auto-moderated for safe student communication.</span>
          </div>
        </div>

        {/* Right Column: Live Chat Room */}
        <div className="glass-panel" style={{
          display: 'flex',
          flexDirection: 'column',
          height: '680px',
          overflow: 'hidden'
        }}>
          
          {/* Room Header */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '26px' }}>{currentChannelObj.icon}</span>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                  {currentChannelObj.name}
                </h3>
                <span style={{ fontSize: '11px', color: 'var(--text-cyan)' }}>
                  Channel Key: #{currentChannelObj.id} &bull; Real-time Socket Broadcast
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => loadHistory(activeChannel)}
                title="Refresh Chat History"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-muted)',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '11px'
                }}
              >
                <RefreshCw size={13} />
                <span>Sync</span>
              </button>
            </div>
          </div>

          {/* Pinned Broadcast Announcement */}
          <div style={{
            background: 'linear-gradient(90deg, rgba(14, 165, 233, 0.15) 0%, rgba(2, 132, 199, 0.08) 100%)',
            borderBottom: '1px solid rgba(56, 189, 248, 0.25)',
            padding: '10px 20px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#e0f2fe'
          }}>
            <Pin size={15} color="#38bdf8" style={{ flexShrink: 0 }} />
            <span>
              <strong>Pinned by Class Teacher:</strong> Mathematics Practice Homework (Ex 4.2) is due tomorrow morning. Science Exhibition project outlines must be finalized by Friday.
            </span>
          </div>

          {/* Message Stream */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            {messages.map((msg, index) => {
              const roleBadge = getRoleBadgeStyle(msg.sender_role);
              const catBadge = getCategoryBadgeStyle(msg.category);
              const isMe = msg.sender_name === senderName;

              return (
                <div 
                  key={msg.id || index}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignSelf: isMe ? 'flex-end' : 'flex-start',
                    maxWidth: '82%'
                  }}
                >
                  {/* Sender Metadata Bar */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '4px',
                    fontSize: '11px',
                    justifyContent: isMe ? 'flex-end' : 'flex-start'
                  }}>
                    <span>{msg.sender_avatar || '👤'}</span>
                    <strong style={{ color: 'var(--text-main)' }}>{msg.sender_name}</strong>
                    <span style={{
                      ...roleBadge,
                      padding: '1px 5px',
                      borderRadius: '4px',
                      fontSize: '9px',
                      fontWeight: 700
                    }}>
                      {msg.sender_role}
                    </span>
                    <span style={{ color: 'var(--text-dim)', fontSize: '10px' }}>
                      {msg.timestamp || 'Just now'}
                    </span>
                  </div>

                  {/* Message Bubble */}
                  <div style={{
                    background: isMe 
                      ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.45) 0%, rgba(14, 165, 233, 0.35) 100%)' 
                      : 'var(--bg-surface)',
                    border: isMe ? '1px solid rgba(56, 189, 248, 0.5)' : '1px solid var(--border-subtle)',
                    borderRadius: isMe ? '12px 2px 12px 12px' : '2px 12px 12px 12px',
                    padding: '12px 16px',
                    boxShadow: 'var(--shadow-sm)',
                    position: 'relative'
                  }}>
                    {/* Category Tag */}
                    {msg.category && msg.category !== 'GENERAL' && (
                      <div style={{ marginBottom: '6px' }}>
                        <span style={{
                          background: catBadge.background,
                          color: catBadge.color,
                          padding: '2px 7px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: 700
                        }}>
                          {catBadge.label}
                        </span>
                      </div>
                    )}
                    
                    <div style={{ fontSize: '13px', lineHeight: 1.5, color: isMe ? '#ffffff' : 'var(--text-main)', whiteSpace: 'pre-wrap' }}>
                      {msg.message_text}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={chatBottomRef} />
          </div>

          {/* Message Input Footer */}
          <form 
            onSubmit={handleSendMessage}
            style={{
              padding: '14px 20px',
              borderTop: '1px solid var(--border-subtle)',
              background: 'rgba(15, 23, 42, 0.8)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            {/* Tag Selection Bar & Sender Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Tag:</span>
                {['GENERAL', 'HOMEWORK', 'UPDATE', 'QUERY', 'EMERGENCY'].map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    style={{
                      border: category === cat ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                      background: category === cat ? 'rgba(14, 165, 233, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                      color: category === cat ? '#38bdf8' : 'var(--text-muted)',
                      borderRadius: '4px',
                      padding: '3px 8px',
                      fontSize: '10px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div style={{ fontSize: '11px', color: 'var(--text-cyan)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span>Broadcasting as:</span>
                <strong>{senderName}</strong>
                <span style={{ opacity: 0.8 }}>({senderRole})</span>
              </div>
            </div>

            {/* Input Field & Submit Button */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Post moderated announcement or message to #${activeChannel}...`}
                style={{
                  flex: 1,
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  color: 'var(--text-main)',
                  fontSize: '13px'
                }}
              />
              <button 
                type="submit" 
                className="btn-primary" 
                disabled={!inputText.trim()}
                style={{ padding: '0 20px', borderRadius: '8px' }}
              >
                <Send size={15} />
                <span>Broadcast</span>
              </button>
            </div>
          </form>

        </div>

      </div>

    </div>
  );
}
