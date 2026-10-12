import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Lightbulb,
  GraduationCap,
  Award,
  HeartHandshake,
  BrainCircuit,
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import InteractiveAiResponse from './InteractiveAiResponse';

export default function AiSaathiChat({ currentUser, onRequireAuth }) {
  // 2 Dedicated Modes: 'child' (Child Doubt Clear) vs 'parent' (Parent Study Guide)
  const [activeSection, setActiveSection] = useState('child');
  const [inputMsg, setInputMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const childPrompts = [
    "Explain fractions step-by-step",
    "Why do plants need sunlight?",
    "How does gravity work?",
    "Give me a 3-question practice quiz"
  ];

  const parentPrompts = [
    "How can I explain fractions without frustration?",
    "What is an ideal study routine for Class 5?",
    "How to identify learning gaps in Science?",
    "Ways to reduce exam anxiety for young students"
  ];

  const initialMessages = {
    child: [
      {
        id: 1,
        sender: 'bot',
        text: "Hi Aarav! 🎒 I'm your Child Doubt Clear mentor. Stuck on a math problem, science question, or homework exercise? Ask me below and I'll break it down step-by-step with simple examples!"
      }
    ],
    parent: [
      {
        id: 1,
        sender: 'bot',
        text: "Welcome Pooja! 👨‍👩‍👦 I'm your Parent Study Guide co-pilot. I help parents guide their children at home without friction. Ask about homework coaching strategies, curriculum pacing, or stress-free concept explanation techniques."
      }
    ]
  };

  const [messages, setMessages] = useState(initialMessages.child);

  // Switch conversation when toggling section
  const handleSectionSwitch = (section) => {
    setActiveSection(section);
    setMessages(initialMessages[section]);
  };

  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendQuery = async (queryText) => {
    if (!currentUser && onRequireAuth) {
      onRequireAuth({ id: 'aichat', title: 'Chat with AI Mentor' });
      return;
    }
    const query = (queryText || inputMsg).trim();
    if (!query || isLoading) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: query
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMsg('');
    setIsLoading(true);

    try {
      // Connect to live backend AI endpoint with active section mode
      const response = await fetch('/api/parent/ai-chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          mode: activeSection // 'child' | 'parent'
        })
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data.reply || data.response;
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'bot',
          text: reply
        }]);
      } else {
        // Fallback pedagogical tailored answer
        setTimeout(() => {
          let customReply = "";
          if (activeSection === 'child') {
            customReply = `Great question on "${query}"! 🌟 Let's solve it together: 1. Imagine a pizza cut into 4 equal slices. If you eat 1 slice, you've eaten 1/4th of the whole pizza! 2. The bottom number (4) is total parts, and the top number (1) is your slice. Would you like to try one more problem?`;
            if (query.toLowerCase().includes("quiz")) {
              customReply = "🎯 Quick Quiz Question 1: If an apple is cut into 2 equal halves, what fraction represents 1 half? A) 1/4  B) 1/2  C) 2/1. Reply with your answer!";
            } else if (query.toLowerCase().includes("plant") || query.toLowerCase().includes("sunlight")) {
              customReply = "🌿 Plants use sunlight like a mini solar kitchen! Through Photosynthesis, they take sunlight + water + air (carbon dioxide) to make sweet food (glucose) and give us fresh oxygen to breathe!";
            }
          } else {
            // Parent perspective
            customReply = `Parent Coaching Tip for "${query}": When teaching fractions at home, avoid jumping straight into abstract symbols. Instead, use tangible objects like folding paper strips or chocolate bars. Ask: 'How many equal parts are there in total?' First build physical intuition, then connect it to numbers. This prevents math anxiety completely!`;
            if (query.toLowerCase().includes("routine") || query.toLowerCase().includes("schedule")) {
              customReply = "📋 Recommended Class 5 Daily Study Blueprint: 1. 20-min homework review right after evening snack. 2. 30-min focused concept practice (15 min math, 15 min reading). 3. 10-min active recall recap. Keep total daily desk time under 60 minutes with a 5-minute break in between.";
            } else if (query.toLowerCase().includes("anxiety")) {
              customReply = "🧘 3 Ways to Ease Exam Anxiety: 1. Praise consistency and curiosity, not just test scores. 2. Turn study sessions into low-stakes 5-minute games. 3. Ensure 8-9 hours of restful sleep and physical play every evening.";
            }
          }

          setMessages(prev => [...prev, {
            id: Date.now() + 1,
            sender: 'bot',
            text: customReply
          }]);
        }, 500);
      }
    } catch (err) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'bot',
          text: activeSection === 'child'
            ? `Let's tackle "${query}" step-by-step! What part feels trickiest to you right now?`
            : `Here is pedagogical guidance for "${query}": Focus on positive reinforcement and break down the topic into micro-steps.`
        }]);
      }, 400);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSendQuery(inputMsg);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: 'calc(100vh - 120px)' }}>

      {/* 1. Header Bar with Prominent 2-Section Switcher */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '12px',
        border: '1px solid var(--border-subtle)',
        padding: '16px 22px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 1px 3px rgba(18, 33, 58, 0.04)',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: 'var(--ai-bg-subtle)',
            border: '1.5px solid var(--ai-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px'
          }}>
            🤖
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                EduBandhan AI Mentor
              </h2>
              <span style={{
                fontSize: '10.5px',
                fontWeight: 700,
                backgroundColor: 'var(--ai-bg-subtle)',
                color: '#6C4CE8',
                border: '1px solid var(--ai-border)',
                padding: '2px 7px',
                borderRadius: '999px'
              }}>
                Dual-Perspective AI
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              {activeSection === 'child'
                ? "Child Doubt Clear • Simple explanations, problem solving & quiz coaching"
                : "Parent Study Guide • Home coaching techniques, anxiety reduction & syllabus benchmarks"}
            </p>
          </div>
        </div>

        {/* PROMINENT 2-SECTION TOGGLE PILLS */}
        <div style={{
          display: 'flex',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '10px',
          padding: '4px',
          gap: '4px',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => handleSectionSwitch('child')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '7px',
              border: 'none',
              backgroundColor: activeSection === 'child' ? '#6C4CE8' : 'transparent',
              color: activeSection === 'child' ? '#FFFFFF' : 'var(--text-muted)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: activeSection === 'child' ? '0 2px 6px rgba(108, 76, 232, 0.3)' : 'none',
              transition: 'all 0.18s ease'
            }}
          >
            <span>🎒 Child Doubt Clear</span>
          </button>

          <button
            onClick={() => handleSectionSwitch('parent')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '7px',
              border: 'none',
              backgroundColor: activeSection === 'parent' ? '#1677FF' : 'transparent',
              color: activeSection === 'parent' ? '#FFFFFF' : 'var(--text-muted)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: activeSection === 'parent' ? '0 2px 6px rgba(22, 119, 255, 0.3)' : 'none',
              transition: 'all 0.18s ease'
            }}
          >
            <span>👨‍👩‍👦 Parent Study Guide</span>
          </button>
        </div>
      </div>

      {/* 2. Main Two-Column Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 320px',
        gap: '20px',
        flex: 1,
        minHeight: 0
      }}>

        {/* Chat Area Container */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 1px 3px rgba(18, 33, 58, 0.04)',
          overflow: 'hidden'
        }}>

          {/* Active Mode Banner */}
          <div style={{
            padding: '10px 20px',
            backgroundColor: activeSection === 'child' ? 'var(--ai-bg-subtle)' : 'rgba(22, 119, 255, 0.12)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 700 }}>
              <span>{activeSection === 'child' ? '🎒 Student Mode Active:' : '👨‍👩‍👦 Parent Coaching Mode Active:'}</span>
              <span style={{ color: activeSection === 'child' ? '#6C4CE8' : '#1677FF' }}>
                {activeSection === 'child' ? 'Aarav Sharma (Class 5-B)' : 'Pooja Sharma(Aarav Sharma) (Parent Guardian)'}
              </span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              CBSE &bull; NCERT Framework
            </span>
          </div>

          {/* Messages Stream */}
          <div style={{
            flex: 1,
            padding: '22px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            backgroundColor: 'var(--bg-secondary)'
          }}>
            {messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: msg.sender === 'bot' ? '88%' : '75%'
                }}
              >
                {msg.sender === 'bot' && (
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    backgroundColor: activeSection === 'child' ? 'var(--ai-bg-subtle)' : 'rgba(22, 119, 255, 0.12)',
                    border: `1px solid ${activeSection === 'child' ? 'var(--ai-border)' : 'rgba(22, 119, 255, 0.3)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '17px',
                    flexShrink: 0
                  }}>
                    {activeSection === 'child' ? '🤖' : '🎓'}
                  </div>
                )}

                <div style={{
                  padding: msg.sender === 'bot' ? '16px 20px' : '12px 18px',
                  borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '16px 16px 16px 4px',
                  backgroundColor: msg.sender === 'user'
                    ? (activeSection === 'child' ? '#6C4CE8' : '#1677FF')
                    : 'var(--bg-surface)',
                  color: msg.sender === 'user' ? '#FFFFFF' : 'var(--text-main)',
                  border: msg.sender === 'user' ? 'none' : '1.5px solid var(--border-subtle)',
                  fontSize: '13.5px',
                  lineHeight: 1.55,
                  boxShadow: '0 2px 8px rgba(18, 33, 58, 0.05)',
                  width: msg.sender === 'bot' ? '100%' : 'auto'
                }}>
                  {msg.sender === 'bot' ? (
                    <InteractiveAiResponse
                      content={msg.text}
                      mode={activeSection}
                      onQuickQuery={handleSendQuery}
                      onFillInput={(text) => setInputMsg(text)}
                    />
                  ) : (
                    msg.text
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-nav)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 700,
                    flexShrink: 0
                  }}>
                    {activeSection === 'child' ? 'A' : 'P'}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--ai-bg-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '17px'
                }}>
                  🤖
                </div>
                <div style={{
                  backgroundColor: 'var(--ai-bg-subtle)',
                  border: '1px solid var(--ai-border)',
                  borderRadius: '12px',
                  padding: '10px 16px',
                  fontSize: '12.5px',
                  color: '#6C4CE8',
                  fontWeight: 600
                }}>
                  {activeSection === 'child' ? "Finding the simplest step-by-step explanation..." : "Formulating pedagogical home coaching strategy..."}
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Dynamic Suggested Question Pills for Active Mode */}
          <div style={{
            padding: '10px 20px',
            backgroundColor: 'var(--bg-surface)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }}>
            {(activeSection === 'child' ? childPrompts : parentPrompts).map((pill, idx) => (
              <button
                key={idx}
                onClick={() => handleSendQuery(pill)}
                style={{
                  border: `1px solid ${activeSection === 'child' ? 'var(--ai-border)' : 'rgba(22, 119, 255, 0.3)'}`,
                  backgroundColor: activeSection === 'child' ? 'var(--ai-bg-subtle)' : 'rgba(22, 119, 255, 0.12)',
                  color: activeSection === 'child' ? '#6C4CE8' : '#1677FF',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = activeSection === 'child' ? '#6C4CE8' : '#1677FF';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = activeSection === 'child' ? 'var(--ai-bg-subtle)' : 'rgba(22, 119, 255, 0.12)';
                  e.currentTarget.style.color = activeSection === 'child' ? '#6C4CE8' : '#1677FF';
                }}
              >
                {pill}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={handleFormSubmit}
            style={{
              padding: '14px 20px',
              backgroundColor: 'var(--bg-surface)',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              gap: '12px'
            }}
          >
            <input
              type="text"
              placeholder={activeSection === 'child' ? "Type your study question or math doubt..." : "Ask how to guide your child with this topic..."}
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-secondary)',
                outline: 'none',
                fontSize: '13.5px',
                fontFamily: 'var(--font-sans)',
                color: 'var(--text-main)'
              }}
              onFocus={(e) => e.target.style.borderColor = activeSection === 'child' ? '#6C4CE8' : '#1677FF'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
            />
            <button
              type="submit"
              disabled={isLoading || !inputMsg.trim()}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '8px',
                backgroundColor: inputMsg.trim() ? (activeSection === 'child' ? '#6C4CE8' : '#1677FF') : '#CBD5E1',
                color: '#FFFFFF',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: inputMsg.trim() ? 'pointer' : 'default',
                transition: 'background-color 0.15s ease'
              }}
            >
              <Send size={16} />
            </button>
          </form>

        </div>

        {/* Right Sidebar: Context-Aware Advice & Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Section 1 Insight Box */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)',
            padding: '18px',
            boxShadow: '0 1px 3px rgba(18, 33, 58, 0.04)'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 14px' }}>
              {activeSection === 'child' ? 'Concept Mastery Level' : 'Weekly Homework Routine'}
            </h3>

            {activeSection === 'child' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Fractions &amp; Decimals</span>
                    <span style={{ color: '#18B981', fontWeight: 700 }}>95% Mastery</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '95%', height: '100%', backgroundColor: '#18B981', borderRadius: '3px' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Photosynthesis &amp; Botany</span>
                    <span style={{ color: '#1677FF', fontWeight: 700 }}>88% Mastery</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '88%', height: '100%', backgroundColor: '#1677FF', borderRadius: '3px' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Word Problems &amp; Division</span>
                    <span style={{ color: '#F59E0B', fontWeight: 700 }}>74% (Needs Practice)</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '74%', height: '100%', backgroundColor: '#F59E0B', borderRadius: '3px' }}></div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px' }}>
                <div style={{ padding: '8px 10px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}>
                  <strong>⏰ 5:00 PM – 5:30 PM:</strong> Mathematics (Fractions Ex 4.2)
                </div>
                <div style={{ padding: '8px 10px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}>
                  <strong>⏰ 5:30 PM – 5:50 PM:</strong> Science Reading &amp; Lab Notes
                </div>
                <div style={{ padding: '8px 10px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}>
                  <strong>⚽ 6:00 PM – 7:00 PM:</strong> Outdoor Play &amp; Sports
                </div>
              </div>
            )}
          </div>

          {/* Section 2 Pedagogical Coaching Box */}
          <div style={{
            backgroundColor: activeSection === 'child' ? 'var(--ai-bg-subtle)' : 'rgba(22, 119, 255, 0.12)',
            borderRadius: '12px',
            border: `1px solid ${activeSection === 'child' ? 'var(--ai-border)' : 'rgba(22, 119, 255, 0.25)'}`,
            padding: '18px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <Sparkles size={15} color={activeSection === 'child' ? '#6C4CE8' : '#1677FF'} />
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: activeSection === 'child' ? '#6C4CE8' : '#1677FF', margin: 0 }}>
                {activeSection === 'child' ? "Child Quick Coach" : "Parent Guidance Principle"}
              </h3>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-main)', lineHeight: 1.45, margin: 0 }}>
              {activeSection === 'child'
                ? "💡 Stuck on a question? Break it down into what is given, what is asked, and try testing with small numbers first!"
                : "🌟 Keep praise specific: Instead of 'You are smart', say 'I love how hard you focused on solving those 4 fraction questions!'"}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
