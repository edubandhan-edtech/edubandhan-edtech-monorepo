import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  HelpCircle, 
  Lightbulb, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Award, 
  Send,
  MessageCircle,
  ThumbsUp,
  BookOpen,
  ArrowRight
} from 'lucide-react';

export default function InteractiveAiResponse({ content, mode = 'child', onQuickQuery, onFillInput }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [solvedCelebration, setSolvedCelebration] = useState(false);
  const [liked, setLiked] = useState(false);

  // Clean raw speech text (strip markdown symbols for speech synthesis)
  const getCleanSpeechText = (text) => {
    return text
      .replace(/###|####|\*\*|\*|\$|\\sin|\\cos|\\tan|\\theta/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Text-To-Speech handler
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const cleanText = getCleanSpeechText(content);
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = mode === 'child' ? 0.95 : 1.0; // Friendly, paced speech for kids
      utterance.pitch = mode === 'child' ? 1.05 : 1.0;
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Copy notes to clipboard
  const handleCopyNotes = () => {
    navigator.clipboard?.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  // Helper to parse markdown-like bold/italic/latex in a text string
  const formatInlineText = (text) => {
    if (!text) return null;
    
    // Replace latex \sin(\theta), etc with clean readable math
    let formatted = text
      .replace(/\\\$/g, '')
      .replace(/\$\\sin\\\(theta\\\)\$/gi, 'sin(θ)')
      .replace(/\$\\cos\\\(theta\\\)\$/gi, 'cos(θ)')
      .replace(/\$\\tan\\\(theta\\\)\$/gi, 'tan(θ)')
      .replace(/\$\\sin\(\\theta\)\$/gi, 'sin(θ)')
      .replace(/\$\\cos\(\\theta\)\$/gi, 'cos(θ)')
      .replace(/\$\\tan\(\\theta\)\$/gi, 'tan(θ)')
      .replace(/\$([a-zA-Z0-9\\()^+-/*= ]+)\$/g, '$1');

    // Split on **bold**
    const parts = formatted.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={idx} style={{ color: 'var(--text-main)', fontWeight: 800 }}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  // Parse structured blocks from AI response
  const parseResponseSections = (text) => {
    // Break on headers like ### or ####
    const rawParagraphs = text.split(/(?=### |#### )/g);

    return rawParagraphs.map((para, pIdx) => {
      const trimmed = para.trim();
      if (!trimmed) return null;

      const isH3 = trimmed.startsWith('### ');
      const isH4 = trimmed.startsWith('#### ');

      if (isH3 || isH4) {
        const lines = trimmed.split('\n');
        const headerLine = lines[0].replace(/^### |^#### /, '').trim();
        const bodyLines = lines.slice(1).join('\n').trim();

        // Check if this is the Quick Check Challenge
        const isChallenge = headerLine.toLowerCase().includes('challenge') || 
                            headerLine.toLowerCase().includes('quick check') ||
                            headerLine.includes('🎯');

        // Check if this is a Story / Analogy card
        const isStory = headerLine.toLowerCase().includes('story') || 
                        headerLine.toLowerCase().includes('kitchen') ||
                        headerLine.toLowerCase().includes('analogy') ||
                        headerLine.includes('🪜') || headerLine.includes('🍲');

        return {
          id: pIdx,
          type: isChallenge ? 'challenge' : (isStory ? 'story' : 'concept'),
          title: headerLine,
          body: bodyLines
        };
      }

      // Normal introductory or concluding paragraph
      return {
        id: pIdx,
        type: 'intro',
        title: null,
        body: trimmed
      };
    }).filter(Boolean);
  };

  const sections = parseResponseSections(content);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
      
      {/* Top Interactive Controls Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '10px',
        borderBottom: '1px solid rgba(226, 232, 240, 0.7)',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.4px',
            color: mode === 'child' ? '#6C4CE8' : '#1677FF',
            backgroundColor: mode === 'child' ? 'rgba(108, 76, 232, 0.1)' : 'rgba(22, 119, 255, 0.1)',
            padding: '3px 8px',
            borderRadius: '6px'
          }}>
            {mode === 'child' ? '🎒 Student Interactive Solution' : '👨‍👩‍👦 Parent Teaching Guide'}
          </span>
        </div>

        {/* Action Buttons: Listen Audio, Copy Notes */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={handleToggleSpeech}
            title={isSpeaking ? "Stop listening" : "Listen to explanation out loud"}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 10px',
              borderRadius: '7px',
              border: `1px solid ${isSpeaking ? '#EF4444' : (mode === 'child' ? 'rgba(108, 76, 232, 0.3)' : 'rgba(22, 119, 255, 0.3)')}`,
              backgroundColor: isSpeaking ? 'rgba(239, 68, 68, 0.12)' : 'var(--bg-surface)',
              color: isSpeaking ? '#EF4444' : (mode === 'child' ? '#6C4CE8' : '#1677FF'),
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {isSpeaking ? <VolumeX size={13} /> : <Volume2 size={13} />}
            <span>{isSpeaking ? "Stop Listening" : "Listen Out Loud"}</span>
          </button>

          <button
            onClick={handleCopyNotes}
            title="Copy explanation notes"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 10px',
              borderRadius: '7px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)',
              color: copied ? '#10B981' : 'var(--text-muted)',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {copied ? <Check size={13} color="#10B981" /> : <Copy size={13} />}
            <span>{copied ? "Copied ✓" : "Copy Notes"}</span>
          </button>
        </div>
      </div>

      {/* Render Parsed Interactive Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {sections.map(section => {
          
          // 1. Interactive Challenge / Quiz Widget Card
          if (section.type === 'challenge') {
            const hasHint = section.body.toLowerCase().includes('hint');
            const hintMatch = section.body.match(/\(Hint:([^)]+)\)/i);
            const hintText = hintMatch ? hintMatch[1].trim() : "Review the formula or story above to find the answer!";
            const cleanQuestion = section.body.replace(/\(Hint:[^)]+\)/i, '').replace(/🌟.*/, '').trim();

            return (
              <div 
                key={section.id} 
                style={{
                  background: 'linear-gradient(135deg, rgba(108, 76, 232, 0.08) 0%, rgba(22, 119, 255, 0.08) 100%)',
                  border: '1.5px solid rgba(108, 76, 232, 0.35)',
                  borderRadius: '12px',
                  padding: '16px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  boxShadow: '0 2px 8px rgba(108, 76, 232, 0.06)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>🎯</span>
                    <strong style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: 800 }}>
                      {section.title}
                    </strong>
                  </div>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    backgroundColor: '#6C4CE8',
                    color: '#FFFFFF',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    letterSpacing: '0.4px'
                  }}>
                    TRY THIS CHALLENGE
                  </span>
                </div>

                <div style={{ fontSize: '13px', color: 'var(--text-main)', lineHeight: 1.55 }}>
                  {formatInlineText(cleanQuestion)}
                </div>

                {/* Collapsible Hint Drawer */}
                {hasHint && (
                  <div>
                    <button
                      onClick={() => setShowHint(prev => !prev)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#6C4CE8',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: 0
                      }}
                    >
                      <Lightbulb size={13} color="#F59E0B" />
                      <span>{showHint ? "Hide Hint" : "Need a Hint?"}</span>
                      {showHint ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>

                    {showHint && (
                      <div style={{
                        marginTop: '6px',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        fontSize: '12px',
                        color: '#F59E0B',
                        lineHeight: 1.4
                      }}>
                        💡 <strong>Hint:</strong> {hintText}
                      </div>
                    )}
                  </div>
                )}

                {/* Interactive Action Buttons for the Challenge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                  <button
                    onClick={() => {
                      if (onFillInput) {
                        onFillInput(`My answer to the challenge "${section.title}": `);
                      }
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: '1px solid #6C4CE8',
                      backgroundColor: '#6C4CE8',
                      color: '#FFFFFF',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <Send size={12} />
                    <span>Answer in Chat</span>
                  </button>

                  <button
                    onClick={() => setSolvedCelebration(true)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(24, 185, 129, 0.5)',
                      backgroundColor: solvedCelebration ? '#18B981' : 'rgba(24, 185, 129, 0.12)',
                      color: solvedCelebration ? '#FFFFFF' : '#10B981',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Award size={13} />
                    <span>{solvedCelebration ? "⭐ Awesome! You Got It!" : "I Solved It!"}</span>
                  </button>
                </div>

                {solvedCelebration && (
                  <div style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(24, 185, 129, 0.15)',
                    border: '1px solid #18B981',
                    fontSize: '12px',
                    color: '#34D399',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    animation: 'fadeIn 0.2s ease'
                  }}>
                    <span>🎉 Outstanding work, champ! Keep exploring and asking brilliant questions! 🌟</span>
                  </div>
                )}
              </div>
            );
          }

          // 2. Story / Real-World Analogy Card
          if (section.type === 'story') {
            return (
              <div 
                key={section.id} 
                style={{
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, var(--bg-surface) 100%)',
                  border: '1.5px solid rgba(245, 158, 11, 0.35)',
                  borderRadius: '12px',
                  padding: '14px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>📖</span>
                  <h4 style={{ margin: 0, fontSize: '13.5px', color: '#F59E0B', fontWeight: 800 }}>
                    {section.title}
                  </h4>
                </div>

                <div style={{ fontSize: '13px', color: 'var(--text-main)', lineHeight: 1.6 }}>
                  {section.body.split('\n').map((line, lIdx) => {
                    const trimmedLine = line.trim();
                    if (!trimmedLine) return null;

                    // Bulleted or numbered item
                    if (/^[0-9]+\.|\*/.test(trimmedLine)) {
                      return (
                        <div key={lIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', margin: '4px 0' }}>
                          <span style={{ color: '#D97706', fontWeight: 800 }}>&bull;</span>
                          <span>{formatInlineText(trimmedLine.replace(/^[0-9]+\.\s*|\*\s*/, ''))}</span>
                        </div>
                      );
                    }

                    return <p key={lIdx} style={{ margin: '3px 0' }}>{formatInlineText(trimmedLine)}</p>;
                  })}
                </div>
              </div>
            );
          }

          // 3. Core Concept Card
          if (section.type === 'concept') {
            return (
              <div 
                key={section.id} 
                style={{
                  background: 'var(--bg-surface)',
                  border: '1.5px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '14px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                  <Sparkles size={15} color={mode === 'child' ? '#6C4CE8' : '#1677FF'} />
                  <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--text-main)', fontWeight: 800 }}>
                    {section.title}
                  </h4>
                </div>

                <div style={{ fontSize: '13px', color: 'var(--text-main)', lineHeight: 1.6 }}>
                  {section.body.split('\n').map((line, lIdx) => {
                    const trimmedLine = line.trim();
                    if (!trimmedLine) return null;

                    // Check if it's a step card: Step 1, Step 2, etc.
                    const isStep = /^\*?\s*\*\*Step\s*[0-9]+:/i.test(trimmedLine);
                    if (isStep) {
                      return (
                        <div 
                          key={lIdx} 
                          style={{
                            margin: '6px 0',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            backgroundColor: mode === 'child' ? 'rgba(108, 76, 232, 0.08)' : 'rgba(22, 119, 255, 0.08)',
                            borderLeft: `3px solid ${mode === 'child' ? '#6C4CE8' : '#1677FF'}`
                          }}
                        >
                          {formatInlineText(trimmedLine.replace(/^\*\s*/, ''))}
                        </div>
                      );
                    }

                    // Bulleted or numbered item
                    if (/^[0-9]+\.|\*/.test(trimmedLine)) {
                      return (
                        <div key={lIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', margin: '4px 0' }}>
                          <span style={{ color: mode === 'child' ? '#6C4CE8' : '#1677FF', fontWeight: 800 }}>✓</span>
                          <span>{formatInlineText(trimmedLine.replace(/^[0-9]+\.\s*|\*\s*/, ''))}</span>
                        </div>
                      );
                    }

                    return <p key={lIdx} style={{ margin: '3px 0' }}>{formatInlineText(trimmedLine)}</p>;
                  })}
                </div>
              </div>
            );
          }

          // 4. Default Introductory or Concluding Paragraph
          return (
            <div key={section.id} style={{ fontSize: '13.5px', color: 'var(--text-main)', lineHeight: 1.6 }}>
              {section.body.split('\n').map((line, lIdx) => {
                const trimmedLine = line.trim();
                if (!trimmedLine) return null;
                return <p key={lIdx} style={{ margin: '4px 0' }}>{formatInlineText(trimmedLine)}</p>;
              })}
            </div>
          );
        })}
      </div>

      {/* Interactive Quick Follow-Up Chips */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        flexWrap: 'wrap',
        paddingTop: '6px',
        borderTop: '1px dashed var(--border-subtle)'
      }}>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Try Next:</span>

        <button
          onClick={() => onQuickQuery && onQuickQuery("Can you explain this with a simpler cartoon or sports story?")}
          style={{
            fontSize: '11px',
            padding: '4px 10px',
            borderRadius: '999px',
            border: '1px solid rgba(108, 76, 232, 0.25)',
            backgroundColor: 'var(--bg-surface)',
            color: '#6C4CE8',
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'background 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(108, 76, 232, 0.15)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface)'}
        >
          💡 Simpler Story
        </button>

        <button
          onClick={() => onQuickQuery && onQuickQuery("Give me 1 practice question with a hint to test my understanding!")}
          style={{
            fontSize: '11px',
            padding: '4px 10px',
            borderRadius: '999px',
            border: '1px solid rgba(22, 119, 255, 0.25)',
            backgroundColor: 'var(--bg-surface)',
            color: '#1677FF',
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'background 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(22, 119, 255, 0.15)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface)'}
        >
          🎯 1 Practice Quiz
        </button>

        <button
          onClick={() => onQuickQuery && onQuickQuery("Can you show a step-by-step solved calculation example?")}
          style={{
            fontSize: '11px',
            padding: '4px 10px',
            borderRadius: '999px',
            border: '1px solid rgba(24, 185, 129, 0.3)',
            backgroundColor: 'var(--bg-surface)',
            color: '#10B981',
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'background 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(24, 185, 129, 0.15)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface)'}
        >
          📝 Solved Example
        </button>

        <button
          onClick={() => setLiked(prev => !prev)}
          title="Mark explanation helpful"
          style={{
            fontSize: '11px',
            padding: '4px 8px',
            borderRadius: '999px',
            border: `1px solid ${liked ? '#18B981' : 'var(--border-subtle)'}`,
            backgroundColor: liked ? 'rgba(24, 185, 129, 0.12)' : 'var(--bg-surface)',
            color: liked ? '#10B981' : 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '3px'
          }}
        >
          <ThumbsUp size={11} color={liked ? '#18B981' : 'var(--text-muted)'} />
          <span>{liked ? "Helpful!" : "Helpful"}</span>
        </button>
      </div>

    </div>
  );
}
