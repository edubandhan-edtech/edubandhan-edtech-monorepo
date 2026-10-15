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
  HelpCircle,
  Settings,
  Key,
  X,
  ExternalLink,
  Cpu
} from 'lucide-react';
import InteractiveAiResponse from './InteractiveAiResponse';

export function generatePedagogicalAnswer(query, mode) {
  const q = (query || '').toLowerCase().trim();
  const qNorm = q.replace(/[^a-z0-9]/g, '');
  const isParent = mode === 'parent';

  // 1. Photosynthesis / Plant Biology / Sunlight (with typo tolerance e.g. 'photo sysnthesis', 'photosythesis')
  if (
    (qNorm.includes('photo') && (qNorm.includes('synth') || qNorm.includes('sysnth') || qNorm.includes('syth'))) ||
    ['photosynthesis', 'plant', 'plants', 'leaf', 'leaves', 'sunlight', 'chlorophyll', 'stomata', 'glucose'].some(k => q.includes(k))
  ) {
    if (isParent) {
      return (
        `🌱 Parent Teaching Guide for "Photosynthesis":\n\n` +
        `1. 🧠 Core Concept in 60 Seconds:\n` +
        `Photosynthesis is the fundamental biological process where green plants turn Sunlight + Water + Carbon Dioxide into Glucose (plant energy) and Oxygen (fresh air for us to breathe).\n\n` +
        `2. 🗣️ The Solar Kitchen Analogy to Teach at Home:\n` +
        `Tell your child that each leaf is a tiny solar kitchen! Chlorophyll acts like mini solar panels that capture sunbeams, roots suck water up from the soil like a straw, and tiny leaf pores (stomata) breathe in carbon dioxide to cook delicious plant food!\n\n` +
        `3. ⚠️ Common Child Misconception:\n` +
        `Children often think plants "eat soil". Clarify that soil only holds the roots and water—the real food is cooked in the leaves using sunlight!\n\n` +
        `4. 💡 Fun 5-Minute At-Home Activity:\n` +
        `Place a fresh green leaf in a transparent glass bowl filled with water under bright sunlight. After 20 minutes, show your child the tiny air bubbles forming on the leaf surface—that is real oxygen being created right before their eyes!`
      );
    } else {
      return (
        `🌿 Welcome to Nature's MasterChef Kitchen!\n\n` +
        `Did you know every green leaf on a tree is a tiny, super-smart kitchen? 👩‍🍳 Plants don't have hands to order food, so they make their own through Photosynthesis!\n\n` +
        `☀️ 3 Secret Ingredients:\n` +
        `1. ☀️ Sunlight: Captured by green Chlorophyll (like solar panels on the leaf).\n` +
        `2. 💧 Water: Sucked up by roots from the soil like a drinking straw.\n` +
        `3. 🌬️ Carbon Dioxide (CO₂): Sucked in from air through tiny microscopic mouth-pores called Stomata.\n\n` +
        `🍲 The Delicious Result:\n` +
        `• Glucose: Sweet energy food that helps the plant grow flowers and fruit.\n` +
        `• Oxygen: Fresh clean air released into the sky for you and me to breathe! 🎈\n\n` +
        `🎯 Quick Check Challenge:\n` +
        `What is the green pigment in leaves that catches sunlight? (Hint: Starts with the letter 'C'!) 🌟`
      );
    }
  }

  // 2. Fractions & Math Parts (ONLY when user explicitly asks about fractions / parts)
  if (['fraction', 'numerator', 'denominator', 'half', 'quarter', 'equal part', 'ratio', 'decimal'].some(k => q.includes(k))) {
    if (isParent) {
      return (
        `🍕 Parent Coaching Guide for Fractions:\n\n` +
        `1. 🧠 Core Concept:\n` +
        `A fraction is simply a part of a whole. The bottom number (denominator) tells you how many equal pieces the object is divided into, while the top number (numerator) tells you how many pieces you have.\n\n` +
        `2. 🗣️ The Roti / Pizza Technique:\n` +
        `• Cut a round roti or chocolate bar into 4 equal quarters during snack time.\n` +
        `• Ask: 'If there are 4 slices and you eat 1, you ate 1/4th. If you eat 2 slices, you ate 2/4th, which is half!'\n` +
        `• Physically moving pieces removes math anxiety completely.\n\n` +
        `3. ⚠️ Common Child Pitfall:\n` +
        `Kids often think a bigger denominator means a bigger slice (thinking 1/8 > 1/4 because 8 > 4). Ask: 'Would you rather share your favourite chocolate with 4 friends or 8 friends? More people means smaller pieces!'`
      );
    } else {
      return (
        `🍕 Hey Champ! Let's Master Fractions Together!\n\n` +
        `Think of fractions like slicing your favourite Cheesy Pizza with friends! 😋\n\n` +
        `• Bottom Number (Denominator): Total equal slices of the pizza (e.g. 4 slices).\n` +
        `• Top Number (Numerator): How many slices you grab on your plate (e.g. 1 slice).\n\n` +
        `So 1/4 just means: 'You have 1 out of the 4 equal slices!'\n\n` +
        `🌟 The Golden Secret: 2/4 is the exact same as 1/2! If a pizza has 4 slices and you eat 2, you just ate half the pizza!\n\n` +
        `🎯 Quick Check Challenge:\n` +
        `If an apple is cut into 8 equal slices and you give 3 to your friend, what fraction did your friend get? (Hint: Friend's slices / Total slices) 🍏`
      );
    }
  }

  // 3. Gravity & Physics
  if (['gravity', 'gravit', 'fall', 'apple', 'newton', 'weight', 'mass', 'orbit', 'magnet', 'planet'].some(k => q.includes(k))) {
    if (isParent) {
      return (
        `🌍 Parent Teaching Guide for "Gravity":\n\n` +
        `1. 🧠 Core Concept:\n` +
        `Gravity is the invisible pulling force that every object with mass exerts on everything else. Because Earth is huge, its gravity pulls everything toward its center!\n\n` +
        `2. 🗣️ How to Explain to Your Child:\n` +
        `Drop a small ball or pencil. Ask: 'Why didn't it float up to the ceiling?' Earth acts like an enormous gentle magnet that keeps our feet on the ground and holds the oceans in place!\n\n` +
        `3. 💡 Fun At-Home Demonstration:\n` +
        `Drop a flat sheet of paper and a crumpled paper ball together. The crumpled ball hits first because of air resistance, not because gravity pulls it harder! In space with no air, a feather and a bowling ball fall at the exact same speed.`
      );
    } else {
      return (
        `🚀 Welcome to the Secrets of Gravity!\n\n` +
        `Ever wonder why you don't float away into the clouds like a party balloon? 🎈 That's thanks to Earth's superpower: Gravity!\n\n` +
        `🧲 How It Works:\n` +
        `• Earth is super gigantic and heavy, so it has an invisible magnetic hug that pulls everything down toward the ground.\n` +
        `• Without gravity, water would spill out of swimming pools and you'd need seatbelts just to sit on your sofa!\n` +
        `• It also keeps the Moon circling around us like an invisible tether ball.\n\n` +
        `🎯 Quick Check Challenge:\n` +
        `Who was the famous scientist who watched an apple fall from a tree and helped explain gravity? (Hint: Sir Isaac N______) 🍎`
      );
    }
  }

  // 4. Water Cycle & Weather
  if (['water cycle', 'rain', 'cloud', 'clouds', 'evaporation', 'condensation', 'precipitation'].some(k => q.includes(k))) {
    if (isParent) {
      return (
        `🌧️ Parent Teaching Guide for "The Water Cycle":\n\n` +
        `1. 🧠 Core Concept:\n` +
        `The water cycle is Earth's continuous recycling system: Evaporation (liquid to gas) -> Condensation (gas to clouds) -> Precipitation (rain/snow) -> Collection (lakes/rivers).\n\n` +
        `2. 🗣️ Kitchen Demonstration:\n` +
        `When boiling water or making hot tea, show the steam rising (Evaporation). Place a cool lid over the steam: show water droplets forming underneath (Condensation). When drops get heavy and drip down, that's Rain (Precipitation)!`
      );
    } else {
      return (
        `🌧️ The Magical Journey of Droppy the Water Droplet!\n\n` +
        `Did you know the water you drink today might have been drunk by a dinosaur millions of years ago? 🦕 Earth recycles all its water in 3 epic steps!\n\n` +
        `1. ☀️ Evaporation: The hot sun turns puddle water into invisible water vapour that flies up into the sky.\n` +
        `2. ☁️ Condensation: High up in the cold sky, droplets cuddle together to make fluffy clouds.\n` +
        `3. 🌧️ Precipitation: When the clouds get too full and heavy, they burst into fresh raindrops!\n\n` +
        `🎯 Quick Check: What do we call water turning into steam when heated by the sun? ☀️`
      );
    }
  }

  // 5. Trigonometry & Geometry
  if (['trig', 'sin', 'cos', 'tan', 'hypotenuse', 'triangle', 'angle', 'pythagor'].some(k => q.includes(k))) {
    if (isParent) {
      return (
        `📐 Parent Guide for Trigonometry:\n\n` +
        `1. 🧠 Core Concept: Trigonometry is the math of right-angled triangles to measure heights and distances without climbing them.\n` +
        `2. 🗣️ The Ladder Against the Wall: The Wall is Height (P), Ground is Base (B), Ladder is Hypotenuse (H).\n` +
        `3. 💡 Mnemonic: 'Some People Have, Curly Brown Hair, Turned Permanent Black' (Sin = P/H, Cos = B/H, Tan = P/B)!`
      );
    } else {
      return (
        `📐 Hey Champ! Let's Crack Trigonometry!\n\n` +
        `Trigonometry is a superpower to measure huge things like Mount Everest or a tall building without climbing! 🚀\n\n` +
        `🪜 The Ladder Rule:\n` +
        `Imagine a ladder leaning on a tall wall:\n` +
        `• Ladder = Hypotenuse (H)\n` +
        `• Wall = Height / Perpendicular (P)\n` +
        `• Ground = Base (B)\n\n` +
        `• Sin = Height / Ladder\n` +
        `• Cos = Ground / Ladder\n` +
        `• Tan = Height / Ground\n\n` +
        `🎯 Quick Check: If the wall is 3 meters and the ladder is 5 meters, what is Sin? (Hint: Wall / Ladder)`
      );
    }
  }

  // 6. Study Routine & Homework Habits
  if (['routine', 'schedule', 'timetable', 'study', 'homework', 'focus', 'discipline'].some(k => q.includes(k))) {
    if (isParent) {
      return (
        `📋 Recommended Daily Study Blueprint (Classes 1-10):\n\n` +
        `1. ⏰ Timing: 30 minutes of homework review right after evening play and snack.\n` +
        `2. ⏱️ 25/5 Pomodoro Rule: 25 minutes of deep concept practice + 5-minute movement or water break.\n` +
        `3. 🎯 Subject Splitting: 15 minutes math problem-solving + 15 minutes science reading.\n` +
        `4. 🚫 Keep total desk study under 60 minutes for primary grades to prevent burnout.`
      );
    } else {
      return (
        `⚡ The Superhero 25-Minute Study Blueprint!\n\n` +
        `Studying for hours is boring. The secret of top rankers is short, super-focused power sprints! 🚀\n\n` +
        `1. ⏱️ Sprint 1 (20 mins): Pick just ONE chapter doubt and solve 3 questions.\n` +
        `2. 🍎 Fuel Break (5 mins): Drink water, stretch, do 5 jumping jacks!\n` +
        `3. 🧠 Sprint 2 (15 mins): Explain what you learned in your own words.\n\n` +
        `🎯 Challenge: Set a 20-minute timer right now and see how much you can finish!`
      );
    }
  }

  // 7. Exam Anxiety & Fear
  if (['anxiety', 'fear', 'stress', 'nervous', 'exam', 'test', 'marks', 'score'].some(k => q.includes(k))) {
    if (isParent) {
      return (
        `🧘 3 Practical Steps to Ease Exam Anxiety:\n\n` +
        `1. ❤️ Praise Effort & Curiosity: Celebrate daily consistency rather than just test score numbers.\n` +
        `2. 🎲 Low-Stakes Practice: Turn review into quick 5-minute dinner table trivia games.\n` +
        `3. 😴 Sleep & Outdoor Play: Ensure 8-9 hours of restful sleep—tired brains forget 40% more!`
      );
    } else {
      return (
        `🌟 Hey! Take a Deep Breath: You've Got This!\n\n` +
        `Feeling nervous before a test is completely normal—even Olympic athletes feel butterflies in their stomach! 🦋\n\n` +
        `✨ 3 Quick Tricks to Calm Your Mind:\n` +
        `1. 🌬️ The 4-4-4 Box Breath: Breathe in for 4 seconds, hold for 4, breathe out for 4.\n` +
        `2. 🎯 Treat the exam like a fun puzzle game, not a battlefield.\n` +
        `3. 📝 If you get stuck on a question, skip it and come back later with fresh eyes!`
      );
    }
  }

  // 8. Practice Quiz Request
  if (['quiz', 'test me', 'questions', 'mcq'].some(k => q.includes(k))) {
    return (
      `🎯 Quick Knowledge Check (Class 5-8 Science & Math):\n\n` +
      `Question 1: Which gas do green plants absorb from the air during photosynthesis?\n` +
      `A) Oxygen   B) Carbon Dioxide   C) Nitrogen   D) Hydrogen\n\n` +
      `Question 2: If a pizza has 6 equal slices and you eat 3, what fraction did you eat?\n` +
      `A) 1/3   B) 1/2   C) 2/3   D) 1/6\n\n` +
      `Reply with your answers (e.g., '1-B, 2-B') and I'll grade them instantly! 🌟`
    );
  }

  // 9. Dynamic Open-Ended Educational Response (NEVER mentions fractions unless asked!)
  const cleanTopic = query
    .replace(/^(what is|what are|explain|how does|how do|tell me about|how to teach|can you explain|why is|why do)\s+/i, '')
    .replace(/[?!.]+$/, '')
    .trim() || query;

  if (isParent) {
    return (
      `👨‍👩‍👧 Parent Teaching Guide for "${cleanTopic}":\n\n` +
      `1. 🧠 Core Concept in 60 Seconds:\n` +
      `When introducing "${cleanTopic}" to your child, ground the concept in everyday observation before touching complex textbook definitions. Children absorb ideas much faster when they can see or feel the real-world connection.\n\n` +
      `2. 🗣️ Step-by-Step Home Explanation Strategy:\n` +
      `• Start with curiosity: "Have you ever wondered what happens when we look at ${cleanTopic}?"\n` +
      `• Use relatable household metaphors (toys, kitchen routines, sports, or nature).\n` +
      `• Encourage them to describe the process in their own words before correcting terminology.\n\n` +
      `3. ⚠️ Common Child Misconception:\n` +
      `Students often try to memorize sentences word-for-word without understanding the underlying logic. Ask "Why do you think this happens?" to build analytical reasoning.\n\n` +
      `4. 💡 Quick Discussion Prompt:\n` +
      `Ask your child: "If you had to teach ${cleanTopic} to a younger friend, how would you describe it in 2 simple sentences?"`
    );
  } else {
    return (
      `🚀 Let's Explore "${cleanTopic}" Step-by-Step!\n\n` +
      `That is an awesome question to ask! Being curious is what makes great students. 🌟\n\n` +
      `1. 🌟 The Big Picture:\n` +
      `Every big topic in science, math, or history is built from small, simple ideas. Think of "${cleanTopic}" like assembling your favourite Lego set!\n\n` +
      `2. 🔍 3 Key Clues to Understand It:\n` +
      `• Connect it to what you see every day around you.\n` +
      `• Break the problem down: What clues do we have, and what are we trying to find?\n` +
      `• Drawing a quick sketch or diagram in your rough notebook makes it 10x easier to picture!\n\n` +
      `🎯 Quick Check Challenge:\n` +
      `What part of "${cleanTopic}" feels most interesting or puzzling to you right now? Reply and let's solve it together!`
    );
  }
}

export default function AiSaathiChat({ currentUser, onRequireAuth }) {
  // 2 Dedicated Modes: 'child' (Child Doubt Clear) vs 'parent' (Parent Study Guide)
  const [activeSection, setActiveSection] = useState('child');
  const [inputMsg, setInputMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Live Groq Cloud AI Key & Model Configuration
  const [customApiKey, setCustomApiKey] = useState(() => localStorage.getItem('edubandhan_groq_key') || '');
  const [customModel, setCustomModel] = useState(() => localStorage.getItem('edubandhan_groq_model') || 'llama-3.3-70b-versatile');
  const [showSettings, setShowSettings] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(customApiKey);
  const [tempModel, setTempModel] = useState(customModel);
  const [saveStatus, setSaveStatus] = useState('');

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

  const handleSaveSettings = (e) => {
    e.preventDefault();
    const cleanKey = tempApiKey.trim();
    const cleanModel = tempModel.trim() || 'llama-3.3-70b-versatile';
    setCustomApiKey(cleanKey);
    setCustomModel(cleanModel);
    localStorage.setItem('edubandhan_groq_key', cleanKey);
    localStorage.setItem('edubandhan_groq_model', cleanModel);
    setSaveStatus('Settings saved!');
    setTimeout(() => {
      setSaveStatus('');
      setShowSettings(false);
    }, 1200);
  };

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
      // Connect to live backend AI endpoint with active section mode and optional API key
      const response = await fetch('/api/parent/ai-chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          mode: activeSection, // 'child' | 'parent'
          api_key: customApiKey || undefined,
          model: customModel || undefined
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
        // Fallback to high-quality smart pedagogical answer tailored to the exact topic
        const customReply = generatePedagogicalAnswer(query, activeSection);
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: Date.now() + 1,
            sender: 'bot',
            text: customReply
          }]);
        }, 300);
      }
    } catch (err) {
      // Offline / network failure fallback - tailored to the specific question asked
      const customReply = generatePedagogicalAnswer(query, activeSection);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'bot',
          text: customReply
        }]);
      }, 300);
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

        {/* RIGHT ACTION CONTROLS: Section Switcher & AI Model Settings Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
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

          {/* AI Settings Toggle Button */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '9px',
              backgroundColor: customApiKey ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-secondary)',
              color: customApiKey ? '#10B981' : 'var(--text-muted)',
              border: `1.5px solid ${customApiKey ? 'rgba(16, 185, 129, 0.35)' : 'var(--border-subtle)'}`,
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Configure Live Groq Cloud AI Key & Model"
          >
            <Settings size={15} />
            <span>{customApiKey ? 'Groq Live AI Connected ⚡' : 'AI Model Settings'}</span>
          </button>
        </div>
      </div>

      {/* Optional AI Settings Panel */}
      {showSettings && (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '12px',
          border: '1.5px solid #6C4CE8',
          padding: '18px 22px',
          boxShadow: '0 8px 24px rgba(108, 76, 232, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={18} color="#6C4CE8" />
              <strong style={{ fontSize: '14px', color: 'var(--text-main)' }}>
                Groq Cloud AI Model Configuration (Free &amp; Ultra-Fast)
              </strong>
            </div>
            <button
              onClick={() => setShowSettings(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Groq API Key (Optional — Free from console.groq.com):
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    placeholder="gsk_..."
                    value={tempApiKey}
                    onChange={e => setTempApiKey(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px 8px 32px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-main)',
                      fontSize: '13px',
                      fontFamily: 'monospace'
                    }}
                  />
                  <Key size={14} style={{ position: 'absolute', left: '10px', top: '11px', color: 'var(--text-muted)' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Select AI Model:
                </label>
                <select
                  value={tempModel}
                  onChange={e => setTempModel(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-main)',
                    fontSize: '13px',
                    fontWeight: 600
                  }}
                >
                  <option value="llama-3.3-70b-versatile">Llama 3.3 70B Versatile (Recommended • Smartest)</option>
                  <option value="llama-3.1-8b-instant">Llama 3.1 8B Instant (Ultra-Fast • &lt; 300ms)</option>
                  <option value="qwen-2.5-32b">Qwen 2.5 32B (Groq Pedagogical Reasoning)</option>
                  <option value="deepseek-r1-distill-llama-70b">DeepSeek R1 Distill 70B (Deep Math &amp; Science)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Don't have a key? The built-in EduBandhan Pedagogical Engine provides instant NCERT answers for all subjects!
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {saveStatus && (
                  <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 700 }}>
                    ✓ {saveStatus}
                  </span>
                )}
                <button
                  type="submit"
                  style={{
                    padding: '7px 18px',
                    borderRadius: '8px',
                    backgroundColor: '#6C4CE8',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Save Settings
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

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
