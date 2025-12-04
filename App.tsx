import React, { useState, useEffect, useRef } from 'react';
import { generateEducationalContent } from './services/geminiService';
import { Mascot } from './components/Mascot';
import { AccessibilityMenu } from './components/AccessibilityMenu';
import { Rewards } from './components/Rewards';
import { 
  AppSettings, 
  AccessibilitySettings, 
  Question, 
  UserStats, 
  Subject,
  Grade,
  Difficulty,
  QuestionType 
} from './types';
import { COLORS, MASCOT_MESSAGES, BADGES } from './constants';

const App: React.FC = () => {
  // --- STATE ---
  const [step, setStep] = useState<'setup' | 'quiz'>('setup');
  const [showRewards, setShowRewards] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [settings, setSettings] = useState<AppSettings>({
    grade: '4',
    subject: 'Mathematics',
    difficulty: 'Medium',
    questionType: 'Multiple Choice'
  });

  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    largeText: false,
    highContrast: false,
    simpleMode: false,
    audioEnabled: true
  });

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedbackState, setFeedbackState] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [showHint, setShowHint] = useState(false);
  
  const [stats, setStats] = useState<UserStats>({
    score: 0,
    questionsAnswered: 0,
    streak: 0,
    badges: [],
    history: [
      { day: 'Mon', score: 20 },
      { day: 'Tue', score: 45 },
      { day: 'Wed', score: 30 },
      { day: 'Thu', score: 60 },
      { day: 'Fri', score: 10 },
    ]
  });

  const [mascotState, setMascotState] = useState({
    message: MASCOT_MESSAGES.welcome[0],
    emotion: 'happy' as const
  });

  // --- LOGIC ---

  const getRandomMessage = (list: string[]) => list[Math.floor(Math.random() * list.length)];

  const handleGenerate = async () => {
    setLoading(true);
    setMascotState({ message: getRandomMessage(MASCOT_MESSAGES.loading), emotion: 'thinking' });
    setFeedbackState('idle');
    setUserAnswer('');
    setShowHint(false);

    try {
      const question = await generateEducationalContent(settings);
      setCurrentQuestion(question);
      setStep('quiz');
      setMascotState({ message: "Here's a new challenge!", emotion: 'happy' });
    } catch (e) {
      setMascotState({ message: "Oops! My brain got fuzzy. Try again?", emotion: 'neutral' });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerCheck = () => {
    if (!currentQuestion) return;

    const isCorrect = userAnswer.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase().trim();

    if (isCorrect) {
      setFeedbackState('correct');
      const newScore = stats.score + 10;
      const newStreak = stats.streak + 1;
      
      // Update stats
      const newBadges = [...stats.badges];
      
      // Check Badge Logic
      if (settings.subject === 'Mathematics' && stats.questionsAnswered % 5 === 4) {
         if(!newBadges.includes('math_star')) newBadges.push('math_star');
      }
      if (newStreak >= 3 && !newBadges.includes('streak_master')) {
        newBadges.push('streak_master');
      }

      setStats(prev => ({
        ...prev,
        score: newScore,
        streak: newStreak,
        questionsAnswered: prev.questionsAnswered + 1,
        badges: newBadges
      }));

      setMascotState({ message: getRandomMessage(MASCOT_MESSAGES.correct), emotion: 'celebrating' });
      
      // Play sound if enabled
      if (accessibility.audioEnabled) {
        // Placeholder for a sound effect logic
      }

    } else {
      setFeedbackState('incorrect');
      setStats(prev => ({ ...prev, streak: 0 }));
      setMascotState({ message: getRandomMessage(MASCOT_MESSAGES.incorrect), emotion: 'neutral' });
    }
  };

  const speakText = (text: string) => {
    if (!accessibility.audioEnabled) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(u);
  };

  // --- RENDER HELPERS ---

  const baseClasses = `min-h-screen transition-colors duration-300 flex flex-col font-sans selection:bg-yellow-200
    ${accessibility.highContrast ? 'bg-white text-black' : 'bg-[#F0F9FF] text-gray-800'}
    ${accessibility.largeText ? 'text-xl' : 'text-base'}
  `;

  return (
    <div className={baseClasses} style={{ backgroundColor: accessibility.highContrast ? '#fff' : COLORS.bgLight }}>
      
      {/* HEADER */}
      <header className="p-4 flex justify-between items-center shadow-sm bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl" style={{ backgroundColor: COLORS.primaryBlue }}>
            LM
          </div>
          <div className="flex flex-col">
            <h1 className={`font-bold leading-none ${accessibility.largeText ? 'text-3xl' : 'text-2xl'}`} style={{ color: COLORS.primaryBlue }}>
              La-Mila Mind
            </h1>
            <span className="text-sm font-bold text-orange-400">Smart Learning, Happy Minds!</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="font-bold text-gray-600">Score: {stats.score}</span>
            <div className="flex gap-1 text-sm text-orange-500">
              {Array.from({length: Math.min(stats.streak, 3)}).map((_, i) => <span key={i}>🔥</span>)}
            </div>
          </div>
          <button 
            onClick={() => setShowRewards(true)}
            className="p-2 rounded-full hover:bg-gray-100 transition"
            title="My Rewards"
          >
            🏆
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8 relative">
        
        {step === 'setup' && (
          <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 md:p-10 shadow-xl animate-fade-in border-4 border-b-8" style={{ borderColor: COLORS.primaryBlue }}>
            {/* "Let's Start Learning!" removed as requested */}
            
            <div className="space-y-6">
              {/* Grade Selection */}
              <div>
                <label className="block font-bold mb-2">I am in Grade:</label>
                <div className="flex gap-4">
                  {(['4', '5', '6'] as Grade[]).map((g) => (
                    <button
                      key={g}
                      onClick={() => setSettings({...settings, grade: g})}
                      className={`flex-1 py-3 rounded-xl font-bold border-b-4 transition-transform active:scale-95
                        ${settings.grade === g ? 'text-white translate-y-1 border-transparent' : 'bg-gray-100 border-gray-300 text-gray-600'}
                      `}
                      style={{ backgroundColor: settings.grade === g ? COLORS.primaryGreen : undefined }}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject Selection */}
              <div>
                <label className="block font-bold mb-2">I want to practice:</label>
                <div className="grid grid-cols-1 gap-3">
                  {(['Mathematics', 'English FAL', 'Life Skills', 'Fill-in-the-missing-words'] as Subject[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSettings({...settings, subject: s})}
                      className={`w-full py-3 px-4 rounded-xl font-bold text-left border-2 transition-colors
                        ${settings.subject === s ? 'bg-yellow-50 border-yellow-400' : 'bg-white border-gray-200'}
                      `}
                    >
                      {s} {s === 'Mathematics' ? '🧮' : s.includes('English') ? '📖' : s.includes('Life') ? '🌱' : '✍️'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block font-bold mb-2">Challenge Level:</label>
                <input 
                  type="range" 
                  min="0" max="2" 
                  step="1"
                  value={settings.difficulty === 'Easy' ? 0 : settings.difficulty === 'Medium' ? 1 : 2}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    const diff: Difficulty = val === 0 ? 'Easy' : val === 1 ? 'Medium' : 'Hard';
                    setSettings({...settings, difficulty: diff});
                  }}
                  className="w-full accent-[#6ECFF6] h-4 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-sm font-bold text-gray-500 mt-1">
                  <span>Easy</span>
                  <span>Medium</span>
                  <span>Hard</span>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-white text-xl shadow-lg hover:brightness-110 active:scale-95 transition-all mt-4"
                style={{ backgroundColor: COLORS.primaryBlue }}
              >
                {loading ? 'Generating...' : 'Go! 🚀'}
              </button>
            </div>
          </div>
        )}

        {step === 'quiz' && currentQuestion && (
          <div className="max-w-2xl mx-auto">
            {/* Cultural Context Tag */}
            {currentQuestion.culturalContext && (
               <div className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-4 shadow-sm" style={{ backgroundColor: COLORS.accentPurple }}>
                 🌍 {currentQuestion.culturalContext}
               </div>
            )}

            <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border-4 border-b-8 relative overflow-hidden" style={{ borderColor: COLORS.primaryYellow }}>
              
              {/* Question Audio Button - Optional visibility based on accessibility settings */}
              {accessibility.audioEnabled && (
                <button 
                  onClick={() => speakText(currentQuestion.text)}
                  className="absolute top-4 right-4 text-2xl hover:scale-110 transition p-2 bg-blue-50 rounded-full"
                  title="Read question"
                >
                  🔊
                </button>
              )}

              <h2 className={`font-bold mb-8 leading-relaxed ${accessibility.largeText ? 'text-3xl' : 'text-2xl'}`}>
                {currentQuestion.text}
              </h2>

              {/* Question Input Area */}
              <div className="space-y-4 mb-8">
                {currentQuestion.type === 'multiple-choice' && currentQuestion.options?.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setUserAnswer(opt)}
                    disabled={feedbackState !== 'idle'}
                    className={`w-full p-4 rounded-xl text-left font-semibold border-2 transition-all
                      ${userAnswer === opt ? 'bg-blue-100 border-blue-400 ring-2 ring-blue-200' : 'bg-gray-50 border-gray-200 hover:border-blue-300'}
                      ${feedbackState !== 'idle' && opt === currentQuestion.correctAnswer ? 'bg-green-100 border-green-500' : ''}
                      ${feedbackState === 'incorrect' && userAnswer === opt ? 'bg-red-100 border-red-300' : ''}
                    `}
                  >
                    {String.fromCharCode(65 + idx)}. {opt}
                  </button>
                ))}

                {(currentQuestion.type === 'short-answer' || currentQuestion.type === 'fill-blank') && (
                   <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    disabled={feedbackState !== 'idle'}
                    className="w-full p-4 text-xl border-2 border-gray-300 rounded-xl focus:border-blue-400 focus:outline-none"
                   />
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                {feedbackState === 'idle' ? (
                  <>
                    <button
                      onClick={handleAnswerCheck}
                      disabled={!userAnswer}
                      className="w-full py-4 rounded-xl font-bold text-white text-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: COLORS.primaryGreen }}
                    >
                      Check Answer
                    </button>
                    
                    <button
                      onClick={() => setShowHint(true)}
                      className="text-sm font-bold text-gray-400 hover:text-gray-600 underline decoration-dotted"
                    >
                      Help Me Understand 💡
                    </button>

                    {showHint && (
                      <div className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200 animate-fade-in text-gray-700">
                        <strong>Hint:</strong> {currentQuestion.hint}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="animate-fade-in">
                    <div className={`p-4 rounded-xl mb-4 text-center font-bold ${feedbackState === 'correct' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                      {feedbackState === 'correct' ? '🎉 Correct!' : `❌ Not quite. The correct answer is: ${currentQuestion.correctAnswer}`}
                    </div>
                    <div className="flex gap-4">
                       <button
                        onClick={() => setStep('setup')}
                        className="flex-1 py-3 rounded-xl font-bold border-2 border-gray-200 text-gray-600 hover:bg-gray-50"
                      >
                        Change Topic
                      </button>
                      <button
                        onClick={handleGenerate}
                        className="flex-1 py-3 rounded-xl font-bold text-white shadow-md hover:brightness-105"
                        style={{ backgroundColor: COLORS.primaryBlue }}
                      >
                        Next Question ➡️
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Floating Elements */}
      <Mascot 
        message={mascotState.message} 
        emotion={mascotState.emotion} 
        isSpeaking={accessibility.audioEnabled} 
      />
      
      <AccessibilityMenu settings={accessibility} onUpdate={setAccessibility} />

      {showRewards && <Rewards stats={stats} onClose={() => setShowRewards(false)} />}

      {/* Confetti Effect CSS (Simple) */}
      {feedbackState === 'correct' && !accessibility.simpleMode && (
         <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
            {[...Array(20)].map((_, i) => (
               <div 
                 key={i}
                 className="absolute animate-confetti"
                 style={{
                   left: `${Math.random() * 100}%`,
                   top: `-10%`,
                   backgroundColor: [COLORS.primaryBlue, COLORS.primaryGreen, COLORS.primaryYellow, COLORS.accentRed][Math.floor(Math.random()*4)],
                   width: '10px',
                   height: '10px',
                   animationDelay: `${Math.random() * 2}s`,
                   animationDuration: `${2 + Math.random() * 3}s`
                 }}
               />
            ))}
         </div>
      )}

      {/* Inline Styles for animations without CSS file */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        
        @keyframes bounceSlight { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        .animate-bounce-slight { animation: bounceSlight 2s infinite ease-in-out; }

        @keyframes confetti { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
        .animate-confetti { animation: confetti 3s linear forwards; }
        
        .font-comic { font-family: 'Comic Sans MS', 'Chalkboard SE', sans-serif; }
      `}</style>
    </div>
  );
};

export default App;