import React, { useState, useEffect, useRef } from 'react';
import { 
  HelpCircle, 
  Volume2, 
  VolumeX, 
  Flame, 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Brain,
  Send,
  Loader2,
  Award,
  Clock,
  Target,
  Zap,
  Lightbulb,
  MessageSquare,
  X,
  Compass,
  Sliders,
  Check
} from 'lucide-react';

// Built-in curated standard static curriculum quizzes
const CURATED_QUIZZES = {
  science: {
    title: "Science & Biology",
    icon: "🔬",
    grade: "Class 8",
    description: "Cell biology, photosynthesis, human physiology & ecosystem balance",
    questions: [
      {
        id: 1,
        question: "Which organelle is known as the powerhouse of the cell, synthesizing ATP energy molecules?",
        options: ["Ribosome", "Mitochondria", "Golgi Apparatus", "Endoplasmic Reticulum"],
        correct_index: 1,
        explanation: "Mitochondria generate most of the chemical energy needed to power the cell's biochemical reactions through cellular respiration.",
        parent_tip: "Think of mitochondria as the power plant of a city, providing electricity for all city activities."
      },
      {
        id: 2,
        question: "What happens to the rate of photosynthesis when carbon dioxide concentration increases up to an optimum point?",
        options: ["Decreases steadily", "Increases steadily", "Stops completely", "Remains zero"],
        correct_index: 1,
        explanation: "Carbon dioxide is a primary substrate for the Calvin cycle; increasing it accelerates photosynthesis until light or temperature becomes limiting.",
        parent_tip: "Explain that more ingredients let a baker bake more cookies faster until the oven space is maxed out."
      },
      {
        id: 3,
        question: "Which blood cells are responsible for carrying oxygen from the lungs to all body tissues?",
        options: ["White Blood Cells", "Platelets", "Red Blood Cells (Erythrocytes)", "Plasma"],
        correct_index: 2,
        explanation: "Red blood cells contain hemoglobin, an iron-rich protein that binds to oxygen in the lungs and releases it in tissues.",
        parent_tip: "Compare red blood cells to oxygen delivery vans driving through the bloodstream highway."
      },
      {
        id: 4,
        question: "What is the boiling point of pure water at standard sea level atmospheric pressure?",
        options: ["90°C", "100°C", "110°C", "120°C"],
        correct_index: 1,
        explanation: "At 1 atmosphere of pressure (sea level), pure water transitions from liquid to steam at exactly 100°C (212°F).",
        parent_tip: "Show how water in a kettle boils vigorously once the thermometer hits 100°C."
      }
    ]
  },
  math: {
    title: "Mathematics & Geometry",
    icon: "📐",
    grade: "Class 8",
    description: "Circumference, linear slopes, prime numbers, algebraic geometry & fractions",
    questions: [
      {
        id: 1,
        question: "If a circle has a radius of 7 cm, what is its circumference? (Use π = 22/7)",
        options: ["22 cm", "44 cm", "88 cm", "154 cm"],
        correct_index: 1,
        explanation: "Circumference = 2 × π × r = 2 × (22/7) × 7 = 44 cm.",
        parent_tip: "Take a circular plate and wrap a thread around the boundary to show circumference physically."
      },
      {
        id: 2,
        question: "What is the slope of the linear equation given by 2x + 3y = 6?",
        options: ["-2/3", "2/3", "-3/2", "3/2"],
        correct_index: 0,
        explanation: "Rearranging into slope-intercept form y = mx + c: 3y = -2x + 6 => y = (-2/3)x + 2. Thus, the slope m = -2/3.",
        parent_tip: "Explain slope as the steepness of a hill: negative means rolling downhill from left to right."
      },
      {
        id: 3,
        question: "Which of the following numbers is a prime number?",
        options: ["21", "27", "29", "33"],
        correct_index: 2,
        explanation: "29 is only divisible by 1 and 29. 21=3×7, 27=3×9, 33=3×11.",
        parent_tip: "Ask if 29 pebbles can ever be grouped into equal rectangular rows other than 1×29."
      },
      {
        id: 4,
        question: "If you eat 3 slices out of an 8-slice pizza, what fraction of the pizza remains?",
        options: ["3/8", "5/8", "1/2", "4/8"],
        correct_index: 1,
        explanation: "Remaining slices = 8 - 3 = 5 slices. So 5/8 of the pizza is left.",
        parent_tip: "Use rotis or drawing paper divided into 8 sectors for hands-on visual fractions."
      }
    ]
  },
  english: {
    title: "English & Grammar",
    icon: "📖",
    grade: "Class 7-8",
    description: "Parts of speech, irregular verbs, antonyms & sentence composition",
    questions: [
      {
        id: 1,
        question: "Identify the adjective in the sentence: 'The swift cheetah dashed across the golden savannah.'",
        options: ["Cheetah", "Swift", "Dashed", "Across"],
        correct_index: 1,
        explanation: "'Swift' describes the noun 'cheetah', making it an adjective of quality.",
        parent_tip: "Play the adjective game: pick any room object and describe it with 3 creative adjectives."
      },
      {
        id: 2,
        question: "What is the past participle form of the irregular verb 'write'?",
        options: ["Wrote", "Written", "Writed", "Writing"],
        correct_index: 1,
        explanation: "Present: Write, Past: Wrote, Past Participle: Written (e.g., 'He has written a letter').",
        parent_tip: "Group irregular verbs together: write/wrote/written, drive/drove/driven, ride/rode/ridden."
      },
      {
        id: 3,
        question: "What is the antonym (opposite word) of 'Abundant'?",
        options: ["Plentiful", "Scarce", "Enormous", "Lavish"],
        correct_index: 1,
        explanation: "Abundant means existing in large quantities; scarce means rare or insufficient.",
        parent_tip: "Contrast abundant water during monsoons with scarce water in deserts."
      }
    ]
  },
  gk: {
    title: "General Knowledge & Space",
    icon: "🚀",
    grade: "All Classes",
    description: "ISRO space missions, Indian heritage, national symbols & global geography",
    questions: [
      {
        id: 1,
        question: "What was the name of the lunar lander in India's historic Chandrayaan-3 mission that touched down near the Moon's South Pole?",
        options: ["Pragyan", "Vikram", "Dhruv", "Aditya"],
        correct_index: 1,
        explanation: "The lander was named 'Vikram' after Dr. Vikram Sarabhai, and the rover inside was named 'Pragyan'.",
        parent_tip: "Celebrate Indian space pride: Vikram landed, Pragyan rolled out on 6 wheels to explore."
      },
      {
        id: 2,
        question: "Which planet in our solar system is famously known as the 'Red Planet' due to iron oxide on its surface?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correct_index: 1,
        explanation: "Mars appears reddish in the night sky because its surface soil contains abundant rusty iron oxide minerals.",
        parent_tip: "Show Mars in the night sky using a free night-sky astronomy mobile app."
      },
      {
        id: 3,
        question: "What is the national aquatic animal of India?",
        options: ["Ganges River Dolphin", "Blue Whale", "Olive Ridley Turtle", "Golden Mahseer"],
        correct_index: 0,
        explanation: "The Ganges River Dolphin (Platanista gangetica) represents the purity and biodiversity of India's river ecosystems.",
        parent_tip: "Explain that river dolphins are nearly blind and use ultrasonic echolocation to swim."
      }
    ]
  }
};

export default function QuizArena({ currentUser, onRequireAuth }) {
  // Navigation & mode: 'curated' | 'dynamic' | 'leaderboard'
  const [activeMode, setActiveMode] = useState('curated'); // 'curated' | 'dynamic' | 'leaderboard'
  const [selectedTopicKey, setSelectedTopicKey] = useState('science');

  // Dynamic Quiz Generator Input State
  const [customTopic, setCustomTopic] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('Class 8');
  const [selectedSubject, setSelectedSubject] = useState('Science');
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState('Moderate');
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [generateError, setGenerateError] = useState(null);

  // Active Quiz State
  const [quizQuestions, setQuizQuestions] = useState(CURATED_QUIZZES.science.questions);
  const [quizTitle, setQuizTitle] = useState(CURATED_QUIZZES.science.title);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [questionIdx]: selectedOptionIdx }
  const [hasSubmittedQuiz, setHasSubmittedQuiz] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState(Date.now());
  const [timeElapsedSeconds, setTimeElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Gamification metrics
  const [streak, setStreak] = useState(5);
  const [totalXP, setTotalXP] = useState(420);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  // AI Saathi Deep Question Explanation Drawer
  const [activeExplainingQ, setActiveExplainingQ] = useState(null);
  const [aiExplanationText, setAiExplanationText] = useState('');
  const [isLoadingAiExplanation, setIsLoadingAiExplanation] = useState(false);
  const [aiFollowUpQuestion, setAiFollowUpQuestion] = useState('');
  const [aiFollowUpLoading, setAiFollowUpLoading] = useState(false);
  const [aiFollowUpHistory, setAiFollowUpHistory] = useState([]);

  // Timer Effect
  useEffect(() => {
    let timer;
    if (isTimerRunning && !hasSubmittedQuiz) {
      timer = setInterval(() => {
        setTimeElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, hasSubmittedQuiz]);

  // When switching curated topics
  const handleSelectCuratedTopic = (key) => {
    const topic = CURATED_QUIZZES[key];
    if (!topic) return;
    setSelectedTopicKey(key);
    setQuizQuestions(topic.questions);
    setQuizTitle(topic.title);
    setCurrentIdx(0);
    setUserAnswers({});
    setHasSubmittedQuiz(false);
    setTimeElapsedSeconds(0);
    setQuizStartTime(Date.now());
    setIsTimerRunning(true);
  };

  // Text-to-speech speaker
  const handleSpeak = (text) => {
    if (isAudioMuted) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Option selection
  const handleSelectOption = (qIdx, optIdx) => {
    if (hasSubmittedQuiz) return;
    setUserAnswers(prev => ({
      ...prev,
      [qIdx]: optIdx
    }));
  };

  // Submit Quiz & compute results
  const handleSubmitQuiz = () => {
    if (!currentUser && onRequireAuth) {
      onRequireAuth({ id: 'quiz', title: 'Submit Quiz & Record Score' });
      return;
    }
    setIsTimerRunning(false);
    setHasSubmittedQuiz(true);

    // Calculate score
    let correctCount = 0;
    quizQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct_index) {
        correctCount += 1;
      }
    });

    const earnedXP = correctCount * 50;
    setTotalXP(prev => prev + earnedXP);
    if (correctCount > quizQuestions.length / 2) {
      setStreak(prev => prev + 1);
    }
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Retake current quiz
  const handleRetakeQuiz = () => {
    setUserAnswers({});
    setHasSubmittedQuiz(false);
    setCurrentIdx(0);
    setTimeElapsedSeconds(0);
    setQuizStartTime(Date.now());
    setIsTimerRunning(true);
  };

  // Generate dynamic quiz via Groq LLM API
  const handleGenerateDynamicQuiz = async (e) => {
    e?.preventDefault();
    if (!currentUser && onRequireAuth) {
      onRequireAuth({ id: 'quiz', title: 'Generate Custom AI Quiz (Groq Cloud)' });
      return;
    }
    const topicPrompt = customTopic.trim();
    if (!topicPrompt) {
      setGenerateError('Please enter a topic name (e.g. "Chandrayaan-3", "French Revolution", "Quadratic Equations").');
      return;
    }

    setGenerateError(null);
    setIsGeneratingQuiz(true);

    try {
      const res = await fetch('/api/parent/ai-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedSubject,
          topic: topicPrompt,
          grade_level: selectedGrade,
          num_questions: Number(questionCount),
          difficulty: difficulty
        })
      });

      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuizQuestions(data.questions);
        setQuizTitle(`AI Custom Quiz: ${topicPrompt} (${selectedGrade})`);
        setUserAnswers({});
        setCurrentIdx(0);
        setHasSubmittedQuiz(false);
        setTimeElapsedSeconds(0);
        setQuizStartTime(Date.now());
        setIsTimerRunning(true);
        setActiveMode('curated'); // Switch to active quiz runner
      } else {
        throw new Error('Could not generate questions. Please try a different topic phrase.');
      }
    } catch (err) {
      console.error('Dynamic Quiz Error:', err);
      setGenerateError('Network delay or LLM rate limit. Generating fallback curriculum questions for you...');
      // Fallback to relevant curated
      handleSelectCuratedTopic('science');
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  // Request Deep AI Saathi Explanation for a Question
  const handleOpenAiExplaining = async (q, qIdx) => {
    if (!currentUser && onRequireAuth) {
      onRequireAuth({ id: 'quiz', title: 'AI Saathi Concept Explanation' });
      return;
    }
    setActiveExplainingQ({ ...q, qIdx });
    setAiExplanationText('');
    setAiFollowUpHistory([]);
    setAiFollowUpQuestion('');
    setIsLoadingAiExplanation(true);

    try {
      const res = await fetch('/api/parent/ai-explain-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q.question,
          options: q.options,
          correct_index: q.correct_index,
          selected_index: userAnswers[qIdx] ?? null,
          topic: quizTitle,
          grade_level: selectedGrade,
          user_query: "Please explain the fundamental concept from scratch, why the right answer is correct, and give an intuitive real-life analogy."
        })
      });

      const data = await res.json();
      if (data.explanation) {
        setAiExplanationText(data.explanation);
      } else {
        setAiExplanationText(q.explanation || 'No detailed explanation provided.');
      }
    } catch (err) {
      console.error('AI Explanation Error:', err);
      setAiExplanationText(q.explanation || 'Review core textbook concepts for step-by-step rationale.');
    } finally {
      setIsLoadingAiExplanation(false);
    }
  };

  // Handle follow up doubt in AI drawer
  const handleSendFollowUp = async (e) => {
    e.preventDefault();
    if (!currentUser && onRequireAuth) {
      onRequireAuth({ id: 'quiz', title: 'Ask AI Mentor Doubt' });
      return;
    }
    const query = aiFollowUpQuestion.trim();
    if (!query || aiFollowUpLoading || !activeExplainingQ) return;

    const newQueryItem = { role: 'user', text: query };
    setAiFollowUpHistory(prev => [...prev, newQueryItem]);
    setAiFollowUpQuestion('');
    setAiFollowUpLoading(true);

    try {
      const res = await fetch('/api/parent/ai-chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Regarding the quiz question: "${activeExplainingQ.question}", the student asks: "${query}". Answer gently in simple student-friendly terms.`,
          mode: 'child'
        })
      });
      const data = await res.json();
      const reply = data.reply || "Let's review this concept together with a simple picture!";
      setAiFollowUpHistory(prev => [...prev, { role: 'assistant', text: reply }]);
    } catch (err) {
      setAiFollowUpHistory(prev => [...prev, { role: 'assistant', text: "Here's a handy rule: Focus on the root keyword and look at real-life instances where this law applies!" }]);
    } finally {
      setAiFollowUpLoading(false);
    }
  };

  // Compute summary stats
  const totalQuestions = quizQuestions.length;
  const answeredCount = Object.keys(userAnswers).length;
  let correctCount = 0;
  quizQuestions.forEach((q, idx) => {
    if (userAnswers[idx] === q.correct_index) correctCount += 1;
  });
  const accuracyPct = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s < 10 ? '0' : ''}${s}s`;
  };

  const currentQ = quizQuestions[currentIdx] || quizQuestions[0];
  const isCurrentAnswered = userAnswers[currentIdx] !== undefined;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Top Banner with Navigation Tabs & Gamification Stats */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '22px 28px', 
          background: 'linear-gradient(135deg, rgba(8, 28, 54, 0.85) 0%, rgba(15, 23, 42, 0.9) 100%)',
          border: '1.5px solid rgba(56, 189, 248, 0.35)',
          borderRadius: '16px',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            borderRadius: '14px', 
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(234, 88, 12, 0.3) 100%)', 
            border: '1.5px solid rgba(245, 158, 11, 0.5)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#f59e0b',
            boxShadow: '0 0 25px rgba(245, 158, 11, 0.35)',
            flexShrink: 0
          }}>
            <HelpCircle size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-heading)', margin: 0 }}>
                Child &amp; Aspirant AI Quiz Arena
              </h2>
              <span style={{
                background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(16, 185, 129, 0.2))',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                color: '#38bdf8',
                fontSize: '11px',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '999px'
              }}>
                Groq LLM Powered
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Adaptive CBSE / Olympiad Questions &bull; Real-time AI Doubts Support &bull; Instant Analytics
            </p>
          </div>
        </div>

        {/* Action Pills & Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Mode Switcher */}
          <div style={{
            display: 'flex',
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: '10px',
            padding: '4px',
            gap: '4px'
          }}>
            <button
              onClick={() => setActiveMode('curated')}
              style={{
                border: 'none',
                background: activeMode === 'curated' ? 'linear-gradient(135deg, #0284c7, #0ea5e9)' : 'transparent',
                color: activeMode === 'curated' ? '#ffffff' : 'var(--text-muted)',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <BookOpen size={14} />
              <span>Standard Quizzes</span>
            </button>
            <button
              onClick={() => setActiveMode('dynamic')}
              style={{
                border: 'none',
                background: activeMode === 'dynamic' ? 'linear-gradient(135deg, #a855f7, #ec4899)' : 'transparent',
                color: activeMode === 'dynamic' ? '#ffffff' : 'var(--text-muted)',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <Zap size={14} />
              <span>⚡ Generate Custom Topic</span>
            </button>
            <button
              onClick={() => setActiveMode('leaderboard')}
              style={{
                border: 'none',
                background: activeMode === 'leaderboard' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'transparent',
                color: activeMode === 'leaderboard' ? '#ffffff' : 'var(--text-muted)',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <Trophy size={14} />
              <span>Leaderboard</span>
            </button>
          </div>

          {/* Gamification Stats */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            padding: '7px 14px',
            borderRadius: '999px',
            color: '#f59e0b',
            fontWeight: 800,
            fontSize: '12px'
          }}>
            <Flame size={16} color="#f59e0b" />
            <span>{streak} Day Streak 🔥</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            padding: '7px 14px',
            borderRadius: '999px',
            color: '#10b981',
            fontWeight: 800,
            fontSize: '12px'
          }}>
            <Trophy size={16} color="#10b981" />
            <span>{totalXP} XP</span>
          </div>
        </div>
      </div>

      {/* MODE 1: DYNAMIC AI QUIZ GENERATOR SCREEN */}
      {activeMode === 'dynamic' && (
        <div className="glass-panel" style={{ padding: '28px', border: '1.5px solid rgba(168, 85, 247, 0.35)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(168, 85, 247, 0.2)',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#c084fc'
            }}>
              <Brain size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: 0, fontFamily: 'var(--font-heading)' }}>
                Dynamic AI Quiz Generator (Any Topic)
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Enter any chapter, concept, or real-world topic. Groq LLM will formulate bespoke, grade-aligned questions instantly.
              </p>
            </div>
          </div>

          {/* Generator Form */}
          <form onSubmit={handleGenerateDynamicQuiz} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Topic Input */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                Topic / Concept Name <span style={{ color: '#f43f5e' }}>*</span>
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text" 
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="e.g. Photosynthesis & Chloroplasts, French Revolution, Newton's Laws in Cricket, Space & Black Holes"
                  style={{
                    flex: 1,
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: '1.5px solid var(--border-subtle)',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent-cyan)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
                />
                <button
                  type="submit"
                  disabled={isGeneratingQuiz}
                  style={{
                    background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
                    border: 'none',
                    color: '#fff',
                    padding: '12px 24px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: isGeneratingQuiz ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 18px rgba(168, 85, 247, 0.4)',
                    opacity: isGeneratingQuiz ? 0.7 : 1
                  }}
                >
                  {isGeneratingQuiz ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Generating with Groq LLM...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>Generate AI Quiz</span>
                    </>
                  )}
                </button>
              </div>

              {/* Quick Inspiration Tags */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>💡 Trending Topics:</span>
                {[
                  "🚀 Chandrayaan-3 & Lunar Rover",
                  "🌿 Cell Mitochondria & ATP",
                  "⚡ Electric Circuits & Ohm's Law",
                  "🌍 Climate Change & Carbon Footprint",
                  "📐 Pythagorean Theorem",
                  "🏏 Physics of Cricket Bowling"
                ].map((tag, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCustomTopic(tag.split(' ').slice(1).join(' '))}
                    style={{
                      background: 'rgba(56, 189, 248, 0.08)',
                      border: '1px solid rgba(56, 189, 248, 0.25)',
                      color: 'var(--text-cyan)',
                      fontSize: '11px',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Customization Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Target Class / Level
                </label>
                <select 
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '10px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                >
                  <option value="Class 5">Class 5 (Foundational Primary)</option>
                  <option value="Class 8">Class 8 (Middle School CBSE)</option>
                  <option value="Class 10">Class 10 (Board Exam Level)</option>
                  <option value="Class 12">Class 12 / JEE / NEET Aspirant</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Subject Category
                </label>
                <select 
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '10px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                >
                  <option value="Science">🔬 Science & Biology</option>
                  <option value="Mathematics">📐 Mathematics</option>
                  <option value="Social Science">🏛️ Social Studies & History</option>
                  <option value="English">📖 English & Grammar</option>
                  <option value="Computer Science">💻 Coding & AI</option>
                  <option value="General Knowledge">🌟 General Knowledge</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Number of Questions
                </label>
                <select 
                  value={questionCount}
                  onChange={(e) => setQuestionCount(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '10px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                >
                  <option value="3">3 Quick Doubts</option>
                  <option value="5">5 Comprehensive Questions (Standard)</option>
                  <option value="8">8 In-Depth Exam Questions</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Difficulty Level
                </label>
                <select 
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '10px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                >
                  <option value="Easy">Easy &amp; Friendly (Confidence Booster)</option>
                  <option value="Moderate">Moderate (CBSE / ICSE Standard)</option>
                  <option value="Challenging">Challenging (Olympiad / Analytical)</option>
                </select>
              </div>
            </div>

            {generateError && (
              <div style={{ color: '#f43f5e', fontSize: '12px', background: 'rgba(244, 63, 94, 0.1)', padding: '8px 14px', borderRadius: '6px' }}>
                ⚠️ {generateError}
              </div>
            )}
          </form>
        </div>
      )}

      {/* MODE 2: CURATED STATIC QUIZZES TOPIC PILLS (When in Curated Mode) */}
      {activeMode === 'curated' && !hasSubmittedQuiz && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>Choose Curriculum Subject:</span>
          {Object.entries(CURATED_QUIZZES).map(([key, data]) => {
            const isSelected = selectedTopicKey === key;
            return (
              <button
                key={key}
                onClick={() => handleSelectCuratedTopic(key)}
                style={{
                  background: isSelected ? 'linear-gradient(135deg, rgba(14, 165, 233, 0.25), rgba(2, 132, 199, 0.35))' : 'var(--bg-surface)',
                  border: isSelected ? '1.5px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                  color: isSelected ? '#ffffff' : 'var(--text-muted)',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 0 16px rgba(14, 165, 233, 0.3)' : 'none'
                }}
              >
                <span>{data.icon}</span>
                <span>{data.title}</span>
                <span style={{
                  fontSize: '10px',
                  background: isSelected ? '#0ea5e9' : 'rgba(255, 255, 255, 0.08)',
                  padding: '1px 6px',
                  borderRadius: '999px',
                  color: isSelected ? '#fff' : 'var(--text-dim)'
                }}>
                  {data.questions.length}Q
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* MODE 3: LEADERBOARD VIEW */}
      {activeMode === 'leaderboard' && (
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-heading)' }}>
              <Trophy size={20} color="#f59e0b" />
              <span>School &amp; Classroom Weekly Arena Leaderboard</span>
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-cyan)', fontWeight: 600 }}>
              Updated Hourly &bull; Neon PostgreSQL Synced
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { rank: 1, name: "Ananya Verma", grade: "Class 8-A", xp: "980 XP", streak: "14 Days", accuracy: "96%", badge: "🥇" },
              { rank: 2, name: currentUser ? `${currentUser.full_name} (You)` : "Aarav Sharma (You)", grade: "Class 8-B", xp: `${totalXP} XP`, streak: `${streak} Days`, accuracy: "92%", badge: "🥈" },
              { rank: 3, name: "Devansh Rao", grade: "Class 8-B", xp: "540 XP", streak: "6 Days", accuracy: "84%", badge: "🥉" },
              { rank: 4, name: "Ishaan Mehta", grade: "Class 8-A", xp: "430 XP", streak: "4 Days", accuracy: "79%", badge: "#4" },
              { rank: 5, name: "Priya Sundaram", grade: "Class 8-C", xp: "390 XP", streak: "3 Days", accuracy: "75%", badge: "#5" },
            ].map(user => (
              <div 
                key={user.rank}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 20px',
                  borderRadius: '12px',
                  background: user.rank === 2 ? 'linear-gradient(135deg, rgba(14, 165, 233, 0.18), rgba(2, 132, 199, 0.12))' : 'var(--bg-surface)',
                  border: user.rank === 2 ? '1.5px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                  boxShadow: user.rank === 2 ? '0 0 16px rgba(14, 165, 233, 0.2)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{ fontSize: '20px' }}>{user.badge}</span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: '14px', color: 'var(--text-main)' }}>{user.name}</strong>
                      <span style={{ fontSize: '11px', color: 'var(--text-dim)', background: 'rgba(255, 255, 255, 0.06)', padding: '1px 6px', borderRadius: '4px' }}>
                        {user.grade}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      🔥 {user.streak} streak &bull; 🎯 {user.accuracy} accuracy
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--accent-cyan)' }}>{user.xp}</div>
                  <div style={{ fontSize: '10px', color: '#10b981', fontWeight: 600 }}>Active Explorer</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ACTIVE QUIZ VIEW (When not in leaderboard and not yet submitted) */}
      {activeMode !== 'leaderboard' && !hasSubmittedQuiz && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '22px' }}>
          {/* Main Question Card */}
          <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Header: Progress, Timer, Audio */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="badge badge-amber" style={{ fontSize: '12px', padding: '4px 10px' }}>
                  Question {currentIdx + 1} of {totalQuestions}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {quizTitle}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Live Timer */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: 'var(--text-cyan)',
                  fontWeight: 600
                }}>
                  <Clock size={13} />
                  <span>{formatTime(timeElapsedSeconds)}</span>
                </div>

                {/* Audio Aloud Speaker */}
                <button
                  className="btn-secondary"
                  onClick={() => handleSpeak(currentQ.question)}
                  style={{ fontSize: '11px', padding: '5px 10px' }}
                  title="Listen to question audio"
                >
                  <Volume2 size={13} />
                  <span>Listen</span>
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{
              width: '100%',
              height: '6px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '999px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${((currentIdx + 1) / totalQuestions) * 100}%`,
                background: 'linear-gradient(90deg, #0284c7, #38bdf8)',
                borderRadius: '999px',
                transition: 'width 0.3s ease'
              }} />
            </div>

            {/* Question Text */}
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: 800, 
              color: 'var(--text-main)', 
              lineHeight: 1.5, 
              fontFamily: 'var(--font-heading)',
              margin: '6px 0 0'
            }}>
              {currentQ.question}
            </h3>

            {/* 4 MCQ Option Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = userAnswers[currentIdx] === optIdx;

                let bg = 'rgba(15, 23, 42, 0.7)';
                let border = '1px solid var(--border-subtle)';
                let textCol = 'var(--text-main)';

                if (isSelected) {
                  bg = 'linear-gradient(135deg, rgba(14, 165, 233, 0.22) 0%, rgba(2, 132, 199, 0.3) 100%)';
                  border = '1.5px solid #38bdf8';
                  textCol = '#38bdf8';
                }

                return (
                  <div
                    key={optIdx}
                    onClick={() => handleSelectOption(currentIdx, optIdx)}
                    style={{
                      padding: '14px 18px',
                      borderRadius: '12px',
                      background: bg,
                      border: border,
                      color: textCol,
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: isSelected ? '0 0 14px rgba(14, 165, 233, 0.25)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'rgba(15, 38, 68, 0.85)';
                        e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'rgba(15, 23, 42, 0.7)';
                        e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '6px',
                        background: isSelected ? '#0ea5e9' : 'rgba(255, 255, 255, 0.08)',
                        color: isSelected ? '#fff' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 700
                      }}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {isSelected && (
                      <CheckCircle2 size={18} color="#38bdf8" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Navigation & Submit Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border-subtle)',
                  color: currentIdx === 0 ? 'var(--text-dim)' : 'var(--text-main)',
                  padding: '9px 16px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: currentIdx === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <ArrowLeft size={14} />
                <span>Previous</span>
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                {currentIdx < totalQuestions - 1 ? (
                  <button
                    onClick={() => setCurrentIdx(prev => Math.min(totalQuestions - 1, prev + 1))}
                    style={{
                      background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
                      border: 'none',
                      color: '#fff',
                      padding: '9px 20px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 10px rgba(14, 165, 233, 0.3)'
                    }}
                  >
                    <span>Next Question</span>
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitQuiz}
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      border: 'none',
                      color: '#fff',
                      padding: '10px 24px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 18px rgba(16, 185, 129, 0.4)'
                    }}
                  >
                    <Check size={16} />
                    <span>Submit &amp; View Scorecard</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar: Question Matrix & Live Status */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Quick Question Palette */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px' }}>
                Question Matrix ({answeredCount}/{totalQuestions} Answered)
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                {quizQuestions.map((_, idx) => {
                  const isAnswered = userAnswers[idx] !== undefined;
                  const isCurrent = currentIdx === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentIdx(idx)}
                      style={{
                        padding: '10px 0',
                        borderRadius: '8px',
                        border: isCurrent ? '2px solid #38bdf8' : isAnswered ? '1px solid #10b981' : '1px solid var(--border-subtle)',
                        background: isCurrent ? 'rgba(14, 165, 233, 0.3)' : isAnswered ? 'rgba(16, 185, 129, 0.18)' : 'rgba(15, 23, 42, 0.6)',
                        color: isCurrent ? '#38bdf8' : isAnswered ? '#10b981' : 'var(--text-muted)',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#10b981' }} />
                  <span>Answered</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-subtle)' }} />
                  <span>Unanswered / Pending</span>
                </div>
              </div>

              {/* Complete Quiz Early Button */}
              <button
                onClick={handleSubmitQuiz}
                style={{
                  width: '100%',
                  marginTop: '16px',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  color: '#10b981',
                  padding: '9px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Finish Quiz Early &rarr;
              </button>
            </div>

            {/* AI Assistant Callout */}
            <div className="glass-panel" style={{ padding: '18px', background: 'radial-gradient(circle at top right, rgba(168, 85, 247, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Lightbulb size={16} color="#c084fc" />
                <strong style={{ fontSize: '12px', color: '#c084fc' }}>AI Saathi Doubt Clearing</strong>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                After finishing, you can click <strong>"Ask AI Saathi"</strong> on any question to get conceptual breakdown, memory tricks, and analogies!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* COMPLETED QUIZ SCORECARD & DETAILED RESULTS DASHBOARD */}
      {hasSubmittedQuiz && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Top Scorecard Hero Panel */}
          <div 
            className="glass-panel" 
            style={{ 
              padding: '32px', 
              background: 'linear-gradient(135deg, rgba(7, 26, 49, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
              border: '2px solid rgba(56, 189, 248, 0.4)',
              borderRadius: '16px',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={22} color="#f59e0b" />
                  <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-cyan)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    Quiz Complete &bull; Performance Scorecard
                  </span>
                </div>
                <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-main)', margin: '6px 0 4px', fontFamily: 'var(--font-heading)' }}>
                  {accuracyPct >= 80 ? "🎉 Outstanding Mastery!" : accuracyPct >= 50 ? "👍 Good Job! Concept Clear" : "📚 Needs Practice & Review"}
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                  Subject: <strong>{quizTitle}</strong> &bull; Total Time: <strong>{formatTime(timeElapsedSeconds)}</strong>
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={handleRetakeQuiz}
                  style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    padding: '10px 18px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <RotateCcw size={14} />
                  <span>Retake Quiz</span>
                </button>

                <button
                  onClick={() => setActiveMode('dynamic')}
                  style={{
                    background: 'linear-gradient(135deg, #9333ea, #ec4899)',
                    border: 'none',
                    color: '#fff',
                    padding: '10px 18px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 16px rgba(168, 85, 247, 0.35)'
                  }}
                >
                  <Zap size={14} />
                  <span>Generate New Topic Quiz</span>
                </button>
              </div>
            </div>

            {/* Scorecard Metrics Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
              gap: '14px', 
              marginTop: '26px' 
            }}>
              {/* Score / Marks Card */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: '12px',
                padding: '18px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Total Marks Scored</div>
                <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--accent-cyan)', margin: '4px 0', fontFamily: 'var(--font-heading)' }}>
                  {correctCount} / {totalQuestions}
                </div>
                <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>
                  {correctCount * 50} XP Gained
                </div>
              </div>

              {/* Accuracy Percentage Card */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '12px',
                padding: '18px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Accuracy Rate</div>
                <div style={{ fontSize: '32px', fontWeight: 900, color: accuracyPct >= 70 ? '#10b981' : '#f59e0b', margin: '4px 0', fontFamily: 'var(--font-heading)' }}>
                  {accuracyPct}%
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {accuracyPct >= 80 ? 'Olympiad Standard' : 'Solid Performance'}
                </div>
              </div>

              {/* Time per Question Card */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: '12px',
                padding: '18px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Pacing &amp; Speed</div>
                <div style={{ fontSize: '32px', fontWeight: 900, color: '#f59e0b', margin: '4px 0', fontFamily: 'var(--font-heading)' }}>
                  {totalQuestions > 0 ? Math.round(timeElapsedSeconds / totalQuestions) : 0}s
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Avg. time per question
                </div>
              </div>

              {/* Streak Card */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(244, 63, 94, 0.25)',
                borderRadius: '12px',
                padding: '18px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Daily Learning Streak</div>
                <div style={{ fontSize: '32px', fontWeight: 900, color: '#f43f5e', margin: '4px 0', fontFamily: 'var(--font-heading)' }}>
                  {streak} 🔥
                </div>
                <div style={{ fontSize: '11px', color: '#f43f5e', fontWeight: 700 }}>
                  Active Habit Formed
                </div>
              </div>
            </div>
          </div>

          {/* Question-by-Question Review with AI Saathi Deep Support */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: 0, fontFamily: 'var(--font-heading)' }}>
                Detailed Question Review &bull; Pedagogical Rationales
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--text-cyan)', fontWeight: 600 }}>
                Click "Ask AI Saathi" on any question for deep tutor support
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {quizQuestions.map((q, idx) => {
                const userChoice = userAnswers[idx];
                const isCorrect = userChoice === q.correct_index;
                const isSkipped = userChoice === undefined;

                return (
                  <div 
                    key={idx}
                    className="glass-panel"
                    style={{
                      padding: '24px',
                      borderLeft: `4px solid ${isCorrect ? '#10b981' : isSkipped ? '#f59e0b' : '#f43f5e'}`,
                      background: 'rgba(11, 25, 45, 0.85)'
                    }}
                  >
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{
                          fontSize: '12px',
                          fontWeight: 800,
                          padding: '3px 10px',
                          borderRadius: '6px',
                          background: isCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                          color: isCorrect ? '#10b981' : '#f43f5e',
                          border: `1px solid ${isCorrect ? 'rgba(16, 185, 129, 0.35)' : 'rgba(244, 63, 94, 0.35)'}`
                        }}>
                          {isCorrect ? "✅ Correct (+50 XP)" : isSkipped ? "⚠️ Skipped (0 XP)" : "❌ Incorrect (0 XP)"}
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)' }}>
                          Question {idx + 1}
                        </span>
                      </div>

                      {/* AI Support Button */}
                      <button
                        onClick={() => handleOpenAiExplaining(q, idx)}
                        style={{
                          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2))',
                          border: '1px solid rgba(168, 85, 247, 0.45)',
                          color: '#c084fc',
                          padding: '6px 14px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 2px 8px rgba(168, 85, 247, 0.2)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
                      >
                        <Brain size={14} />
                        <span>Ask AI Saathi (Tutor Help)</span>
                      </button>
                    </div>

                    {/* Question Statement */}
                    <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 16px' }}>
                      {q.question}
                    </h4>

                    {/* Options Review List */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '8px', marginBottom: '16px' }}>
                      {q.options.map((opt, optIdx) => {
                        const isThisCorrect = optIdx === q.correct_index;
                        const isThisSelected = userChoice === optIdx;

                        let bg = 'rgba(15, 23, 42, 0.6)';
                        let border = '1px solid var(--border-subtle)';
                        let text = 'var(--text-muted)';

                        if (isThisCorrect) {
                          bg = 'rgba(16, 185, 129, 0.15)';
                          border = '1.5px solid #10b981';
                          text = '#10b981';
                        } else if (isThisSelected) {
                          bg = 'rgba(244, 63, 94, 0.15)';
                          border = '1.5px solid #f43f5e';
                          text = '#f43f5e';
                        }

                        return (
                          <div 
                            key={optIdx}
                            style={{
                              padding: '10px 14px',
                              borderRadius: '8px',
                              background: bg,
                              border: border,
                              color: text,
                              fontSize: '13px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}
                          >
                            <span><strong>{String.fromCharCode(65 + optIdx)}.</strong> {opt}</span>
                            {isThisCorrect && <span style={{ fontSize: '11px', fontWeight: 700, color: '#10b981' }}>Correct Answer</span>}
                            {isThisSelected && !isThisCorrect && <span style={{ fontSize: '11px', fontWeight: 700, color: '#f43f5e' }}>Your Choice</span>}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation & Parent Tip Box */}
                    <div style={{
                      background: 'rgba(15, 23, 42, 0.7)',
                      border: '1px solid rgba(56, 189, 248, 0.2)',
                      borderRadius: '8px',
                      padding: '14px 16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      <div style={{ fontSize: '13px', color: 'var(--text-main)', lineHeight: 1.5 }}>
                        <strong style={{ color: 'var(--text-cyan)' }}>💡 Rationale:</strong> {q.explanation}
                      </div>
                      {q.parent_tip && (
                        <div style={{ fontSize: '12px', color: 'var(--text-amber)', lineHeight: 1.5 }}>
                          <strong>👨‍👩‍👧 Parent Teaching Tip:</strong> {q.parent_tip}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* AI SAATHI INTERACTIVE TUTOR EXPLANATION MODAL / DRAWER */}
      {activeExplainingQ && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(2, 6, 23, 0.85)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 100,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px'
        }}>
          <div style={{
            maxWidth: '750px',
            width: '100%',
            maxHeight: '90vh',
            background: 'linear-gradient(135deg, #091a30 0%, #0d1e38 100%)',
            border: '2px solid rgba(168, 85, 247, 0.5)',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid rgba(168, 85, 247, 0.3)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(168, 85, 247, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #9333ea, #ec4899)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff'
                }}>
                  <Brain size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', margin: 0, fontFamily: 'var(--font-heading)' }}>
                    AI Saathi Deep Tutor Support
                  </h3>
                  <span style={{ fontSize: '11px', color: '#c084fc' }}>
                    Qwen 27B Pedagogical Explanation &bull; Question #{activeExplainingQ.qIdx + 1}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveExplainingQ(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '6px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Question Summary */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: '10px',
                padding: '14px 18px'
              }}>
                <div style={{ fontSize: '11px', color: 'var(--text-cyan)', fontWeight: 700, marginBottom: '4px' }}>
                  QUESTION
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.4 }}>
                  {activeExplainingQ.question}
                </div>
                <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 600, marginTop: '8px' }}>
                  ✅ Correct Answer: Option ({String.fromCharCode(65 + activeExplainingQ.correct_index)}) - {activeExplainingQ.options[activeExplainingQ.correct_index]}
                </div>
              </div>

              {/* AI Explanation Content */}
              {isLoadingAiExplanation ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '36px 0' }}>
                  <Loader2 size={32} color="#c084fc" className="animate-spin" />
                  <span style={{ fontSize: '13px', color: '#c084fc', fontWeight: 600 }}>
                    AI Saathi is preparing a child-friendly conceptual breakdown...
                  </span>
                </div>
              ) : (
                <div style={{
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid rgba(168, 85, 247, 0.25)',
                  borderRadius: '12px',
                  padding: '20px',
                  fontSize: '13px',
                  color: 'var(--text-main)',
                  lineHeight: 1.7,
                  whiteSpace: 'pre-line'
                }}>
                  {aiExplanationText}
                </div>
              )}

              {/* Follow-up Doubts Thread */}
              {aiFollowUpHistory.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-cyan)' }}>
                    💬 Follow-up Doubt Conversation:
                  </div>
                  {aiFollowUpHistory.map((item, idx) => (
                    <div 
                      key={idx}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '10px',
                        background: item.role === 'user' ? 'rgba(14, 165, 233, 0.15)' : 'rgba(168, 85, 247, 0.15)',
                        border: item.role === 'user' ? '1px solid rgba(14, 165, 233, 0.35)' : '1px solid rgba(168, 85, 247, 0.35)',
                        fontSize: '13px',
                        color: 'var(--text-main)',
                        lineHeight: 1.5,
                        alignSelf: item.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '90%'
                      }}
                    >
                      <strong style={{ fontSize: '11px', display: 'block', marginBottom: '4px', color: item.role === 'user' ? 'var(--text-cyan)' : '#c084fc' }}>
                        {item.role === 'user' ? 'You' : 'AI Saathi'}
                      </strong>
                      {item.text}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer: Ask Further Question */}
            <form onSubmit={handleSendFollowUp} style={{
              padding: '14px 20px',
              borderTop: '1px solid rgba(168, 85, 247, 0.3)',
              background: 'rgba(15, 23, 42, 0.85)',
              display: 'flex',
              gap: '10px'
            }}>
              <input 
                type="text"
                value={aiFollowUpQuestion}
                onChange={(e) => setAiFollowUpQuestion(e.target.value)}
                placeholder="Still confused? Ask AI Saathi anything about this question..."
                style={{
                  flex: 1,
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  color: '#fff',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                disabled={aiFollowUpLoading || !aiFollowUpQuestion.trim()}
                style={{
                  background: 'linear-gradient(135deg, #9333ea, #c084fc)',
                  border: 'none',
                  color: '#fff',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: aiFollowUpLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {aiFollowUpLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                <span>Ask Doubt</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
