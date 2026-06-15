import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import Confetti from '../components/Confetti';
import {
  Gamepad2,
  Trophy,
  Timer,
  Award,
  Play,
  AlertTriangle,
  ChevronRight,
  Flame,
  Check,
  X,
  Code2
} from 'lucide-react';

interface CodeSnippet {
  id: string;
  language: string;
  title: string;
  code: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const snippets: CodeSnippet[] = [
  {
    id: 'js-fib',
    language: 'JavaScript',
    title: 'Recursive Fibonacci',
    difficulty: 'Easy',
    code: `const fibonacci = (n) => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
};`
  },
  {
    id: 'py-squares',
    language: 'Python',
    title: 'Even Squares List Comprehension',
    difficulty: 'Easy',
    code: `def get_even_squares(numbers):
    return [x**2 for x in numbers if x % 2 == 0]`
  },
  {
    id: 'java-singleton',
    language: 'Java',
    title: 'Thread-Safe Singleton',
    difficulty: 'Medium',
    code: `public class Singleton {
    private static Singleton instance;
    private Singleton() {}
    public static synchronized Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}`
  },
  {
    id: 'js-debounce',
    language: 'JavaScript',
    title: 'Debounce Function Utility',
    difficulty: 'Hard',
    code: `function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}`
  }
];

interface TriviaQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

const triviaQuestions: TriviaQuestion[] = [
  {
    id: 1,
    question: "Which of the following is NOT a primitive data type in Java?",
    options: ["int", "double", "String", "boolean"],
    correctAnswer: 2
  },
  {
    id: 2,
    question: "What is the average time complexity of looking up a key in a HashMap?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: 0
  },
  {
    id: 3,
    question: "Which SQL clause is used to filter rows after aggregate grouping?",
    options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"],
    correctAnswer: 1
  },
  {
    id: 4,
    question: "In JavaScript, what value does typeof null return?",
    options: ["'null'", "'undefined'", "'object'", "'function'"],
    correctAnswer: 2
  },
  {
    id: 5,
    question: "What does the 'S' in SOLID design principles stand for?",
    options: ["Single Responsibility", "State Management", "Static Scope", "Substitution"],
    correctAnswer: 0
  }
];

interface RegexPuzzle {
  id: number;
  title: string;
  description: string;
  matchStrings: string[];
  ignoreStrings: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  hint: string;
}

const regexPuzzles: RegexPuzzle[] = [
  {
    id: 1,
    title: 'Match Phone Numbers',
    description: 'Construct a regular expression pattern to match standard US phone numbers formatted as `XXX-XXX-XXXX` (where X is a digit).',
    matchStrings: ['123-456-7890', '987-654-3210', '555-555-5555'],
    ignoreStrings: ['1234567890', '12-34-56', 'abc-def-ghij', '123-456-789', '123-456-78901'],
    difficulty: 'Easy',
    hint: 'Use the digit shorthand \\d with braces for length: ^\\d{3}-\\d{3}-\\d{4}$'
  },
  {
    id: 2,
    title: 'Match HEX Colors',
    description: 'Construct a pattern to match valid HTML Hexadecimal color codes starting with a `#` character followed by exactly 3 or 6 hex characters (0-9, A-F, case-insensitive).',
    matchStrings: ['#fff', '#FF0000', '#a1b2c3', '#C0C0C0', '#000'],
    ignoreStrings: ['fff', '#12', '#12345', '#g12345', '#A1B2C3D4', '#xyz'],
    difficulty: 'Easy',
    hint: 'Use a range [A-Fa-f0-9] and optional groups: ^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$'
  },
  {
    id: 3,
    title: 'Match Dates (YYYY-MM-DD)',
    description: 'Create a pattern to match date strings formatted precisely as `YYYY-MM-DD` (where Y, M, D are numeric digits).',
    matchStrings: ['2026-06-13', '1999-12-31', '2000-01-01'],
    ignoreStrings: ['06-13-2026', '2026/06/13', '202-06-13', '2026-6-13', '2026-06-1'],
    difficulty: 'Medium',
    hint: 'Match 4 digits, a dash, 2 digits, another dash, and 2 digits: ^\\d{4}-\\d{2}-\\d{2}$'
  },
  {
    id: 4,
    title: 'Match Username Constraints',
    description: 'Match valid usernames that are between 3 and 16 characters long, containing only alphanumeric characters and underscores.',
    matchStrings: ['coder_123', 'alice', 'super_user', 'A1_b2_C3'],
    ignoreStrings: ['co', 'this_username_is_way_too_long', 'user-name', 'user name', 'admin@123', ''],
    difficulty: 'Medium',
    hint: 'Use alphanumeric/underscore range with a length quantifier: ^[a-zA-Z0-9_]{3,16}$'
  },
  {
    id: 5,
    title: 'Match Price Tags',
    description: 'Match valid US dollar price tag strings starting with a literal `$` followed by any number of digits, a period, and exactly two decimal digits.',
    matchStrings: ['$19.99', '$0.50', '$100.00', '$12345.67'],
    ignoreStrings: ['19.99', '$19', '$.50', '$19.999', '$19.', 'price: $10.00'],
    difficulty: 'Hard',
    hint: 'Escape the dollar sign with a backslash and specify two decimal places: ^\\$\\d+\\.\\d{2}$'
  }
];

const Games: React.FC = () => {
  const { refreshProfile } = useAuth();
  const { addToast } = useToast();

  const [activeGame, setActiveGame] = useState<'lobby' | 'coderush' | 'trivia' | 'regex' | 'binaryracer'>('lobby');
  const [showConfetti, setShowConfetti] = useState(false);

  const rewardXp = async (amount: number) => {
    try {
      const res = await api.post('/profile/add-xp', { amount });
      if (res.status === 200) {
        if (activeGame === 'coderush') setXpAwarded(true);
        if (activeGame === 'trivia') setTriviaXpAwarded(true);
        if (activeGame === 'regex') setRegexXpAwarded(true);
        addToast(`Victory! +${amount} XP Awarded!`, 'success');
        refreshProfile();
      }
    } catch (err) {
      console.error('Failed to reward XP:', err);
    }
  };

  // --- Regex Matcher game states ---
  const [regexStarted, setRegexStarted] = useState(false);
  const [currentRegexIdx, setCurrentRegexIdx] = useState(0);
  const [userRegexPattern, setUserRegexPattern] = useState('');
  const [regexFinished, setRegexFinished] = useState(false);
  const [regexTimer, setRegexTimer] = useState(90);
  const [regexXpAwarded, setRegexXpAwarded] = useState(false);
  const [showRegexHint, setShowRegexHint] = useState(false);

  // Real-time evaluation of the regex pattern
  const regexEvaluation = React.useMemo(() => {
    const activePuzzle = regexPuzzles[currentRegexIdx];
    if (!userRegexPattern) {
      return {
        compiles: true,
        error: null,
        matchedResults: activePuzzle.matchStrings.map(() => false),
        ignoredResults: activePuzzle.ignoreStrings.map(() => true),
        allPassed: false
      };
    }

    try {
      const regex = new RegExp(userRegexPattern);
      const matchedResults = activePuzzle.matchStrings.map((str) => regex.test(str));
      const ignoredResults = activePuzzle.ignoreStrings.map((str) => !regex.test(str));
      
      const allMatchPass = matchedResults.every(Boolean);
      const allIgnorePass = ignoredResults.every(Boolean);

      return {
        compiles: true,
        error: null,
        matchedResults,
        ignoredResults,
        allPassed: allMatchPass && allIgnorePass
      };
    } catch (err: any) {
      return {
        compiles: false,
        error: err.message as string,
        matchedResults: activePuzzle.matchStrings.map(() => false),
        ignoredResults: activePuzzle.ignoreStrings.map(() => false),
        allPassed: false
      };
    }
  }, [userRegexPattern, currentRegexIdx]);

  useEffect(() => {
    if (!regexStarted || regexFinished) return;

    if (regexTimer <= 0) {
      setRegexFinished(true);
      return;
    }

    const timer = setInterval(() => {
      setRegexTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [regexTimer, regexStarted, regexFinished]);

  const startRegexGame = () => {
    setRegexStarted(true);
    setCurrentRegexIdx(0);
    setUserRegexPattern('');
    setRegexFinished(false);
    setRegexTimer(90);
    setRegexXpAwarded(false);
    setShowRegexHint(false);
  };

  const handleNextRegexPuzzle = () => {
    setUserRegexPattern('');
    setShowRegexHint(false);
    if (currentRegexIdx < regexPuzzles.length - 1) {
      setCurrentRegexIdx((prev) => prev + 1);
    } else {
      setRegexFinished(true);
      if (regexTimer > 0) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
      rewardXp(20);
    }
  };

  // --- Code Rush typing game states ---
  const [selectedSnippet, setSelectedSnippet] = useState<CodeSnippet>(snippets[0]);
  const [inputVal, setInputVal] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [opponentProgress, setOpponentProgress] = useState(0);
  const [playerFinished, setPlayerFinished] = useState(false);
  const [victoryState, setVictoryState] = useState<'none' | 'win' | 'lose'>('none');
  const [xpAwarded, setXpAwarded] = useState(false);
  const [opponentWpm] = useState(55); // Bot speed WPM
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // --- Trivia states ---
  const [triviaStarted, setTriviaStarted] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [triviaScore, setTriviaScore] = useState(0);
  const [triviaFinished, setTriviaFinished] = useState(false);
  const [triviaTimer, setTriviaTimer] = useState(30);
  const [triviaXpAwarded, setTriviaXpAwarded] = useState(false);

  // --- Binary Racer game states ---
  const [binaryStarted, setBinaryStarted] = useState(false);
  const [binaryTimer, setBinaryTimer] = useState(60);
  const [binaryScore, setBinaryScore] = useState(0);
  const [binaryTarget, setBinaryTarget] = useState(0);
  const [binaryBits, setBinaryBits] = useState<boolean[]>([false, false, false, false, false, false, false, false]);
  const [binaryFinished, setBinaryFinished] = useState(false);
  const [binaryXpAwarded, setBinaryXpAwarded] = useState(false);

  useEffect(() => {
    if (!binaryStarted || binaryFinished) return;

    if (binaryTimer <= 0) {
      setBinaryFinished(true);
      if (binaryScore >= 5 && !binaryXpAwarded) {
        setBinaryXpAwarded(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
        rewardXp(20);
      }
      return;
    }

    const timer = setInterval(() => {
      setBinaryTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [binaryTimer, binaryStarted, binaryFinished, binaryScore, binaryXpAwarded]);

  const startBinaryGame = () => {
    setActiveGame('binaryracer');
    setBinaryStarted(true);
    setBinaryTimer(60);
    setBinaryScore(0);
    setBinaryFinished(false);
    setBinaryXpAwarded(false);
    setBinaryBits([false, false, false, false, false, false, false, false]);
    setBinaryTarget(Math.floor(Math.random() * 254) + 1);
  };

  const handleBitToggle = (index: number) => {
    const updatedBits = [...binaryBits];
    updatedBits[index] = !updatedBits[index];
    setBinaryBits(updatedBits);

    const weights = [128, 64, 32, 16, 8, 4, 2, 1];
    const newSum = updatedBits.reduce((sum, bit, idx) => sum + (bit ? weights[idx] : 0), 0);

    if (newSum === binaryTarget) {
      setBinaryScore((prev) => prev + 1);
      addToast('Correct Conversion! Next Target...', 'success');
      const nextTarget = Math.floor(Math.random() * 254) + 1;
      setBinaryTarget(nextTarget);
      setBinaryBits([false, false, false, false, false, false, false, false]);
    }
  };

  // --- Code Rush Handlers ---
  const startCodeRush = () => {
    setInputVal('');
    setGameStarted(true);
    setPlayerFinished(false);
    setVictoryState('none');
    setXpAwarded(false);
    setWpm(0);
    setAccuracy(100);
    setOpponentProgress(0);
    setStartTime(Date.now());
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  useEffect(() => {
    if (!gameStarted || playerFinished || victoryState !== 'none') return;

    // Opponent bot speed simulation
    const interval = setInterval(() => {
      setOpponentProgress((prev) => {
        const next = prev + (opponentWpm / 60) * 1.8; // incremental progress based on opponentWpm
        if (next >= 100) {
          clearInterval(interval);
          if (!playerFinished) {
            setVictoryState('lose');
          }
          return 100;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStarted, playerFinished, victoryState, opponentWpm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (playerFinished || victoryState !== 'none') return;
    setInputVal(val);

    // Calculate accuracy
    const target = selectedSnippet.code;
    let errors = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] !== target[i]) {
        errors++;
      }
    }
    const currentAccuracy = val.length === 0 ? 100 : Math.round(((val.length - errors) / val.length) * 100);
    setAccuracy(currentAccuracy);

    // Calculate live WPM
    if (startTime) {
      const timeElapsedMins = (Date.now() - startTime) / 60000;
      if (timeElapsedMins > 0) {
        // Standard WPM: (characters typed / 5) / time elapsed in minutes
        const currentWpm = Math.round((val.length / 5) / timeElapsedMins);
        setWpm(currentWpm);
      }
    }

    // Check finish condition
    if (val === target) {
      setPlayerFinished(true);
      if (victoryState === 'none') {
        setVictoryState('win');
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
        rewardXp(25);
      }
    }
  };


  const getOpponentAvatar = () => {
    return '🤖';
  };

  // --- Trivia Handlers ---
  const startTrivia = () => {
    setTriviaStarted(true);
    setCurrentQuestionIdx(0);
    setSelectedOptionIdx(null);
    setTriviaScore(0);
    setTriviaFinished(false);
    setTriviaTimer(30);
    setTriviaXpAwarded(false);
  };

  useEffect(() => {
    if (!triviaStarted || triviaFinished) return;

    if (triviaTimer <= 0) {
      handleNextTriviaQuestion();
      return;
    }

    const timer = setInterval(() => {
      setTriviaTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [triviaTimer, triviaStarted, triviaFinished]);

  const handleSelectTriviaOption = (optIdx: number) => {
    if (selectedOptionIdx !== null) return;
    setSelectedOptionIdx(optIdx);
    if (optIdx === triviaQuestions[currentQuestionIdx].correctAnswer) {
      setTriviaScore((prev) => prev + 1);
    }
  };

  const handleNextTriviaQuestion = () => {
    setSelectedOptionIdx(null);
    setTriviaTimer(30);
    if (currentQuestionIdx < triviaQuestions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      setTriviaFinished(true);
      // Award XP if accuracy is 80% or better
      const correctRatio = triviaScore / triviaQuestions.length;
      if (correctRatio >= 0.8) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
        rewardXp(15);
      }
    }
  };

  return (
    <div className="w-full space-y-6">
      {showConfetti && <Confetti />}
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Gamepad2 size={24} className="text-[#8a3ffc]" />
            Coding Game Arena
          </h1>
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
            Gamified interactive mini-games to practice coding and speed
          </span>
        </div>
      </div>

      {activeGame === 'lobby' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Code Rush */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md hover:shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8a3ffc] to-indigo-600 flex items-center justify-center text-white shadow-md">
                <Flame size={24} className="animate-pulse" />
              </div>
              <h2 className="text-lg font-bold text-slate-100 group-hover:text-[#8a3ffc] transition-colors">
                Code Rush Racer
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Race against a virtual opponent bot in a code-typing showdown! Type the code snippet character-by-character as fast as you can. Beat the bot to secure the victory and earn XP.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-[9px] font-bold bg-[#8a3ffc]/15 text-[#8a3ffc] px-2 py-0.5 rounded-full">Typing Speed</span>
                <span className="text-[9px] font-bold bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full">Opponent Duel</span>
                <span className="text-[9px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">+25 XP Reward</span>
              </div>
            </div>
            <button
              onClick={() => setActiveGame('coderush')}
              className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <Play size={14} />
              Enter Arena
            </button>
          </div>

          {/* Card 2: Trivia */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md hover:shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-md">
                <Trophy size={24} />
              </div>
              <h2 className="text-lg font-bold text-slate-100 group-hover:text-pink-500 transition-colors">
                Syntax Trivia Challenge
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                A rapid-fire quiz containing fundamental concepts of algorithms, data structures, Java, SQL, and Web development. Test your precision under pressure and score 4+ correct answers to claim XP.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-[9px] font-bold bg-pink-500/10 text-pink-400 px-2 py-0.5 rounded-full">Syntax Quiz</span>
                <span className="text-[9px] font-bold bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full">Timer-based</span>
                <span className="text-[9px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">+15 XP Reward</span>
              </div>
            </div>
            <button
              onClick={() => {
                setActiveGame('trivia');
                startTrivia();
              }}
              className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <Play size={14} />
              Start Trivia
            </button>
          </div>

          {/* Card 3: Regex Matcher */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md hover:shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
                <Code2 size={24} />
              </div>
              <h2 className="text-lg font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                Regex Matcher Puzzle
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Crack pattern matching puzzles by writing regular expressions! Match all the required strings and avoid matching the negative ones. Solve all levels under time pressure to claim XP.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-[9px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">Regex Puzzles</span>
                <span className="text-[9px] font-bold bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full">90s Timer</span>
                <span className="text-[9px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">+20 XP Reward</span>
              </div>
            </div>
            <button
              onClick={() => {
                setActiveGame('regex');
                startRegexGame();
              }}
              className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <Play size={14} />
              Start Puzzles
            </button>
          </div>

          {/* Card 4: Binary Racer */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md hover:shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8a3ffc] to-indigo-500 flex items-center justify-center text-white shadow-md">
                <Gamepad2 size={24} />
              </div>
              <h2 className="text-lg font-bold text-slate-100 group-hover:text-[#8a3ffc] transition-colors">
                Binary Speed Racer
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Convert target decimal numbers to their 8-bit binary equivalents in a race against time. Toggle bit switches dynamically and reach a score of 5+ to claim your XP reward!
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-[9px] font-bold bg-[#8a3ffc]/15 text-[#8a3ffc] px-2 py-0.5 rounded-full">Binary Math</span>
                <span className="text-[9px] font-bold bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full">Interactive Grid</span>
                <span className="text-[9px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">+20 XP Reward</span>
              </div>
            </div>
            <button
              onClick={startBinaryGame}
              className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <Play size={14} />
              Start Racer
            </button>
          </div>
        </div>
      )}

      {/* Game 1: Code Rush Arena */}
      {activeGame === 'coderush' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveGame('lobby')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-100 text-xs font-semibold rounded-xl border border-slate-700 transition-colors shadow-sm cursor-pointer"
            >
              Exit to Lobby
            </button>
            <div className="flex gap-2">
              {snippets.map((snip) => (
                <button
                  key={snip.id}
                  disabled={gameStarted && !playerFinished && victoryState === 'none'}
                  onClick={() => setSelectedSnippet(snip)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                    selectedSnippet.id === snip.id
                      ? 'bg-[#8a3ffc]/20 border-[#8a3ffc] text-slate-100'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  {snip.title} ({snip.language})
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md space-y-6">
            {/* Racer tracks */}
            <div className="space-y-4 bg-slate-950/40 border border-slate-800 rounded-2xl p-4">
              {/* Player Track */}
              <div className="space-y-1 relative">
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  <span>🚀 You (Player)</span>
                  <span>{inputVal.length} / {selectedSnippet.code.length} chars</span>
                </div>
                <div className="h-5 bg-slate-900 rounded-lg overflow-hidden relative border border-slate-800 flex items-center">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-[#8a3ffc] transition-all duration-100 flex justify-end items-center"
                    style={{ width: `${selectedSnippet.code.length > 0 ? (inputVal.length / selectedSnippet.code.length) * 100 : 0}%` }}
                  >
                    <span className="text-sm mr-1.5">🏎️</span>
                  </div>
                </div>
              </div>

              {/* Bot Track */}
              <div className="space-y-1 relative">
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  <span>{getOpponentAvatar()} Opponent Bot (DevBot 3000)</span>
                  <span>{opponentProgress.toFixed(0)}% Done</span>
                </div>
                <div className="h-5 bg-slate-900 rounded-lg overflow-hidden relative border border-slate-800 flex items-center">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-1000 flex justify-end items-center"
                    style={{ width: `${opponentProgress}%` }}
                  >
                    <span className="text-sm mr-1.5">🏎️</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Indicators */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-950/30 border border-slate-800 p-3 rounded-2xl text-center">
                <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Words Per Minute</span>
                <span className="text-xl font-extrabold text-[#8a3ffc]">{wpm}</span>
              </div>
              <div className="bg-slate-950/30 border border-slate-800 p-3 rounded-2xl text-center">
                <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Accuracy</span>
                <span className="text-xl font-extrabold text-emerald-400">{accuracy}%</span>
              </div>
              <div className="bg-slate-950/30 border border-slate-800 p-3 rounded-2xl text-center">
                <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Difficulty</span>
                <span className="text-xl font-extrabold text-amber-500">{selectedSnippet.difficulty}</span>
              </div>
            </div>

            {/* Snippet display area */}
            <div className="space-y-2">
              <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Target Code:</label>
              <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs leading-relaxed text-slate-400 select-none overflow-x-auto relative whitespace-pre">
                {selectedSnippet.code.split('').map((char, index) => {
                  let charClass = '';
                  if (index < inputVal.length) {
                    charClass = inputVal[index] === char ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'text-rose-400 font-bold bg-rose-500/20 underline';
                  }
                  return (
                    <span key={index} className={charClass}>
                      {char}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Input textarea */}
            <div className="space-y-2">
              <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Your Input:</label>
              <textarea
                ref={inputRef}
                disabled={!gameStarted || playerFinished || victoryState !== 'none'}
                value={inputVal}
                onChange={handleInputChange}
                placeholder={gameStarted ? "Start typing the code snippet above exactly as shown..." : "Click 'Start Race' below to begin the challenge."}
                className="w-full h-28 bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-[#8a3ffc] focus:border-transparent resize-none font-mono text-xs leading-relaxed transition-all"
              />
            </div>

            {/* Action buttons */}
            <div className="flex justify-center pt-2">
              {(!gameStarted || playerFinished || victoryState !== 'none') && (
                <button
                  onClick={startCodeRush}
                  className="flex items-center gap-2 px-6 py-3 bg-[#8a3ffc] hover:bg-violet-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#8a3ffc]/15 active:scale-95 cursor-pointer"
                >
                  <Play size={14} />
                  {gameStarted ? 'Play Again' : 'Start Race'}
                </button>
              )}
            </div>
          </div>

          {/* Victory / Defeat Overlay Modal */}
          {victoryState !== 'none' && (
            <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-sm w-full text-center relative overflow-hidden shadow-2xl flex flex-col items-center gap-4">
                <div className="absolute -top-12 -left-12 w-24 h-24 bg-[#8a3ffc]/10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />

                {victoryState === 'win' ? (
                  <>
                    <Trophy className="text-amber-400 animate-bounce" size={48} />
                    <h3 className="text-lg font-bold text-slate-100">Victory! You Beat the Bot!</h3>
                    <p className="text-xs text-slate-400">
                      You typed at <span className="text-slate-100 font-bold">{wpm} WPM</span> with <span className="text-slate-100 font-bold">{accuracy}% accuracy</span>!
                    </p>
                    <div className="py-2.5 px-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-1.5 justify-center mt-2 w-full">
                      <Award size={16} />
                      {xpAwarded ? '+25 XP Rewarded Successfully!' : 'Securing XP reward...'}
                    </div>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="text-rose-400 animate-pulse" size={48} />
                    <h3 className="text-lg font-bold text-slate-100">Defeat! DevBot Won</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      The Bot crossed the line before you! You typed at <span className="text-slate-100 font-bold">{wpm} WPM</span> with <span className="text-slate-100 font-bold">{accuracy}% accuracy</span>. Speed up and try again!
                    </p>
                  </>
                )}

                <div className="flex gap-3 w-full mt-4">
                  <button
                    onClick={() => {
                      setVictoryState('none');
                      setGameStarted(false);
                    }}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-755 text-slate-100 rounded-xl text-xs font-bold border border-slate-700 cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    onClick={startCodeRush}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Game 2: Syntax Trivia Challenge */}
      {activeGame === 'trivia' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveGame('lobby')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-755 text-slate-100 text-xs font-semibold rounded-xl border border-slate-700 transition-colors shadow-sm cursor-pointer"
            >
              Exit to Lobby
            </button>
            {triviaStarted && !triviaFinished && (
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl text-xs text-slate-350">
                <Timer size={14} className="text-[#8a3ffc]" />
                <span className="font-bold">Timer: {triviaTimer}s</span>
              </div>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md max-w-xl mx-auto space-y-6">
            {!triviaFinished ? (
              <div className="space-y-6">
                {/* Stepper progress */}
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span className="font-bold">Question {currentQuestionIdx + 1} of {triviaQuestions.length}</span>
                  <span>Score: {triviaScore} / {triviaQuestions.length}</span>
                </div>
                <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-[#8a3ffc] transition-all"
                    style={{ width: `${((currentQuestionIdx) / triviaQuestions.length) * 100}%` }}
                  />
                </div>

                {/* Question block */}
                <div className="space-y-2">
                  <span className="text-[10px] text-[#8a3ffc] font-bold block uppercase tracking-wider">Trivia Quiz</span>
                  <h3 className="text-sm font-semibold text-slate-200 leading-snug">
                    {triviaQuestions[currentQuestionIdx].question}
                  </h3>
                </div>

                {/* Options grid */}
                <div className="grid grid-cols-1 gap-2.5">
                  {triviaQuestions[currentQuestionIdx].options.map((option, idx) => {
                    const isSelected = selectedOptionIdx === idx;
                    const isCorrect = triviaQuestions[currentQuestionIdx].correctAnswer === idx;
                    let optionStyle = 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-250 hover:bg-slate-950/80 hover:border-slate-700';

                    if (selectedOptionIdx !== null) {
                      if (isCorrect) {
                        optionStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold';
                      } else if (isSelected) {
                        optionStyle = 'bg-rose-500/20 border-rose-500 text-rose-400 font-bold';
                      } else {
                        optionStyle = 'bg-slate-950/20 border-slate-800 text-slate-600 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={selectedOptionIdx !== null}
                        onClick={() => handleSelectTriviaOption(idx)}
                        className={`px-4 py-3 rounded-xl border text-xs font-medium text-left transition-all flex items-center justify-between ${optionStyle} ${
                          selectedOptionIdx === null ? 'cursor-pointer' : 'cursor-default'
                        }`}
                      >
                        {option}
                        {selectedOptionIdx !== null && isCorrect && <Check size={14} className="text-emerald-400" />}
                        {selectedOptionIdx !== null && isSelected && !isCorrect && <X size={14} className="text-rose-400" />}
                      </button>
                    );
                  })}
                </div>

                {/* Stepper footer */}
                {selectedOptionIdx !== null && (
                  <div className="flex justify-end">
                    <button
                      onClick={handleNextTriviaQuestion}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#8a3ffc] hover:bg-violet-600 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer active:scale-95"
                    >
                      Next
                      <ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Quiz Finished Card Summary
              <div className="space-y-6 text-center py-4">
                <Trophy className="mx-auto text-amber-400 animate-bounce" size={48} />
                <h3 className="text-xl font-bold text-slate-100">Trivia Complete!</h3>
                <p className="text-xs text-slate-400">
                  You scored <span className="text-slate-100 font-bold">{triviaScore} out of {triviaQuestions.length}</span> correct answers!
                </p>

                <div className="flex justify-center border-y border-slate-800 py-4 max-w-sm mx-auto">
                  <div className="w-1/2 text-center border-r border-slate-800">
                    <span className="text-xs text-slate-400 block font-medium">Accuracy</span>
                    <span className="text-base font-extrabold text-slate-100">
                      {Math.round((triviaScore / triviaQuestions.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-1/2 text-center">
                    <span className="text-xs text-slate-400 block font-medium">XP Reward</span>
                    <span className="text-base font-extrabold text-indigo-400 flex items-center justify-center gap-1">
                      <Award size={16} />
                      {triviaScore >= 4 ? '+15 XP' : '0 XP'}
                    </span>
                  </div>
                </div>

                {triviaScore >= 4 && (
                  <div className="py-2.5 px-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-1.5 justify-center mt-2 max-w-sm mx-auto">
                    <Award size={16} />
                    {triviaXpAwarded ? '+15 XP Added to Profile!' : 'Adding XP to profile...'}
                  </div>
                )}

                {triviaScore < 4 && (
                  <p className="text-[11px] text-amber-500 font-bold bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/10 max-w-sm mx-auto">
                    Note: You need at least 4 correct answers to claim the XP reward.
                  </p>
                )}

                <div className="flex gap-3 max-w-sm mx-auto mt-4">
                  <button
                    onClick={() => setActiveGame('lobby')}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-800 text-slate-100 rounded-xl text-xs font-bold border border-slate-700 cursor-pointer"
                  >
                    Back to Arena
                  </button>
                  <button
                    onClick={startTrivia}
                    className="flex-1 py-2.5 bg-[#8a3ffc] hover:bg-violet-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Game 3: Regex Matcher Arena */}
      {activeGame === 'regex' && (
        <div className="space-y-6">
          {/* Header Controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveGame('lobby')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-100 text-xs font-semibold rounded-xl border border-slate-750 transition-colors shadow-sm cursor-pointer"
            >
              Exit to Lobby
            </button>
            {regexStarted && !regexFinished && (
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl text-xs text-slate-350">
                <Timer size={14} className={regexTimer <= 15 ? 'text-rose-500 animate-pulse' : 'text-emerald-400'} />
                <span className={`font-bold ${regexTimer <= 15 ? 'text-rose-500' : 'text-slate-200'}`}>
                  Timer: {regexTimer}s
                </span>
              </div>
            )}
          </div>

          {!regexFinished && regexTimer > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Left Side: Instructions and Details */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md space-y-4 flex flex-col justify-between min-h-[380px]">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                      Level {currentRegexIdx + 1} of {regexPuzzles.length}
                    </span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                      regexPuzzles[currentRegexIdx].difficulty === 'Easy' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                      regexPuzzles[currentRegexIdx].difficulty === 'Medium' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                      'bg-rose-500/10 border-rose-500/20 text-rose-500'
                    }`}>
                      {regexPuzzles[currentRegexIdx].difficulty}
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-slate-100 leading-snug">
                    {regexPuzzles[currentRegexIdx].title}
                  </h2>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-2xl border border-slate-800">
                    {regexPuzzles[currentRegexIdx].description}
                  </p>

                  {/* Hint Toggle */}
                  <div className="pt-2">
                    <button
                      onClick={() => setShowRegexHint(!showRegexHint)}
                      className="text-xs text-indigo-400 hover:text-indigo-350 font-bold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {showRegexHint ? 'Hide Hint' : 'Show Hint'}
                    </button>
                    {showRegexHint && (
                      <p className="text-xs text-slate-400 italic bg-indigo-500/5 border border-indigo-500/15 p-3 rounded-xl mt-2">
                        💡 {regexPuzzles[currentRegexIdx].hint}
                      </p>
                    )}
                  </div>
                </div>

                {/* Progress dot indicator */}
                <div className="flex gap-1.5 pt-4 border-t border-slate-800">
                  {regexPuzzles.map((p, idx) => (
                    <div
                      key={p.id}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentRegexIdx
                          ? 'w-6 bg-emerald-500'
                          : idx < currentRegexIdx
                          ? 'w-2.5 bg-emerald-700'
                          : 'w-2.5 bg-slate-800'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Right Side: Interactive Test Cases & Pattern Inputs */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Positive Cases */}
                  <div className="space-y-3">
                    <label className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                      Must Match Strings
                    </label>
                    <div className="space-y-2 bg-slate-950/30 p-3 rounded-2xl border border-slate-800/60 min-h-[140px]">
                      {regexPuzzles[currentRegexIdx].matchStrings.map((str, idx) => {
                        const passed = regexEvaluation.matchedResults[idx];
                        return (
                          <div
                            key={idx}
                            className={`flex items-center justify-between text-xs px-3 py-2 rounded-xl border transition-all ${
                              passed
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-medium'
                                : 'bg-slate-900/60 border-slate-800 text-slate-400'
                            }`}
                          >
                            <span className="font-mono">{str}</span>
                            {passed ? <Check size={14} className="text-emerald-400" /> : <X size={14} className="text-slate-505" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Negative Cases */}
                  <div className="space-y-3">
                    <label className="text-[10px] text-rose-500 font-bold uppercase tracking-wider block">
                      Must Ignore Strings
                    </label>
                    <div className="space-y-2 bg-slate-950/30 p-3 rounded-2xl border border-slate-800/60 min-h-[140px]">
                      {regexPuzzles[currentRegexIdx].ignoreStrings.map((str, idx) => {
                        const passed = regexEvaluation.ignoredResults[idx];
                        return (
                          <div
                            key={idx}
                            className={`flex items-center justify-between text-xs px-3 py-2 rounded-xl border transition-all ${
                              passed
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-350'
                                : 'bg-rose-500/10 border-rose-500/30 text-rose-300 font-medium'
                            }`}
                          >
                            <span className="font-mono">{str}</span>
                            {passed ? <Check size={14} className="text-emerald-400" /> : <X size={14} className="text-rose-500" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Regex Pattern Input */}
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      Regular Expression Pattern
                    </label>
                    {regexEvaluation.allPassed && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold animate-pulse">
                        Level Solved!
                      </span>
                    )}
                  </div>

                  <div className="flex items-center bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-transparent transition-all">
                    <span className="text-slate-500 font-mono font-bold select-none text-sm mr-1.5">/</span>
                    <input
                      type="text"
                      value={userRegexPattern}
                      onChange={(e) => setUserRegexPattern(e.target.value)}
                      placeholder="e.g. ^\d{3}-\d{3}-\d{4}$"
                      className="bg-transparent text-slate-100 font-mono text-sm w-full outline-none"
                      autoFocus
                    />
                    <span className="text-slate-500 font-mono font-bold select-none text-sm ml-1.5">/</span>
                  </div>

                  {/* Regex Compilation Error Message */}
                  {!regexEvaluation.compiles && regexEvaluation.error && (
                    <div className="flex items-start gap-1.5 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-xs">
                      <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                      <span className="font-mono break-all">{regexEvaluation.error}</span>
                    </div>
                  )}
                </div>

                {/* Next Level Trigger */}
                {regexEvaluation.compiles && regexEvaluation.allPassed && (
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleNextRegexPuzzle}
                      className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer active:scale-95"
                    >
                      {currentRegexIdx < regexPuzzles.length - 1 ? 'Next Level' : 'Claim Victory'}
                      <ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Game End: Victory or Defeat Card
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md mx-auto text-center space-y-6 relative overflow-hidden shadow-2xl flex flex-col items-center gap-4">
              <div className="absolute -top-12 -left-12 w-24 h-24 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-teal-500/15 rounded-full blur-2xl pointer-events-none" />

              {regexTimer > 0 ? (
                <>
                  <Trophy className="text-amber-400 animate-bounce" size={48} />
                  <h3 className="text-xl font-bold text-slate-100">All Regex Solved!</h3>
                  <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                    Sensational! You matched all target patterns successfully with <span className="text-slate-100 font-bold">{regexTimer} seconds</span> remaining on the clock!
                  </p>
                  
                  <div className="flex justify-center border-y border-slate-800 py-4 w-full mt-2">
                    <div className="w-1/2 text-center border-r border-slate-800">
                      <span className="text-xs text-slate-400 block font-medium">Time Left</span>
                      <span className="text-base font-extrabold text-slate-100">{regexTimer}s</span>
                    </div>
                    <div className="w-1/2 text-center">
                      <span className="text-xs text-slate-400 block font-medium">Accuracy</span>
                      <span className="text-base font-extrabold text-emerald-400">100%</span>
                    </div>
                  </div>

                  <div className="py-2.5 px-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-1.5 justify-center w-full">
                    <Award size={16} />
                    {regexXpAwarded ? '+20 XP Rewarded Successfully!' : 'Crediting XP points...'}
                  </div>
                </>
              ) : (
                <>
                  <AlertTriangle className="text-rose-400 animate-pulse" size={48} />
                  <h3 className="text-xl font-bold text-slate-100">Time Expired!</h3>
                  <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                    You ran out of time! You completed <span className="text-slate-100 font-bold">{currentRegexIdx} out of {regexPuzzles.length}</span> regex puzzles before time expired.
                  </p>
                </>
              )}

              <div className="flex gap-3 w-full mt-4">
                <button
                  onClick={() => {
                    setActiveGame('lobby');
                    setRegexStarted(false);
                  }}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-755 text-slate-100 rounded-xl text-xs font-bold border border-slate-700 cursor-pointer"
                >
                  Back to Lobby
                </button>
                <button
                  onClick={startRegexGame}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Game 4: Binary Racer Arena */}
      {activeGame === 'binaryracer' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header Controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveGame('lobby')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-100 text-xs font-semibold rounded-xl border border-slate-700 transition-colors shadow-sm cursor-pointer"
            >
              Exit to Lobby
            </button>
            {binaryStarted && !binaryFinished && (
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl text-xs text-slate-350">
                <Timer size={14} className={binaryTimer <= 15 ? 'text-rose-500 animate-pulse' : 'text-[#8a3ffc]'} />
                <span className={`font-bold ${binaryTimer <= 15 ? 'text-rose-500' : 'text-slate-200'}`}>
                  Timer: {binaryTimer}s
                </span>
              </div>
            )}
          </div>

          {!binaryFinished ? (
            <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6 flex flex-col items-center">
              {/* Score & Progress */}
              <div className="w-full flex justify-between items-center border-b border-slate-800 pb-4">
                <span className="text-[10px] text-[#8a3ffc] font-bold uppercase tracking-wider">
                  Binary Racer Mode
                </span>
                <span className="text-xs font-bold text-slate-300">
                  Target Score: 5+ (Current: <span className="text-amber-400 font-extrabold">{binaryScore}</span>)
                </span>
              </div>

              {/* Number display */}
              <div className="text-center space-y-2 py-4">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">Target Decimal Number</p>
                <div className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#8a3ffc] to-indigo-400 select-none tracking-tight">
                  {binaryTarget}
                </div>
              </div>

              {/* 8-bit switch board */}
              <div className="w-full space-y-2">
                <div className="grid grid-cols-8 gap-2">
                  {[128, 64, 32, 16, 8, 4, 2, 1].map((weight, index) => {
                    const isToggled = binaryBits[index];
                    return (
                      <div
                        key={weight}
                        onClick={() => handleBitToggle(index)}
                        className={`py-4 rounded-xl border text-center transition-all duration-200 cursor-pointer select-none group flex flex-col justify-between h-24 ${
                          isToggled
                            ? 'bg-indigo-600/20 border-indigo-500 shadow-md shadow-indigo-500/10'
                            : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <span className={`text-[10px] font-bold ${isToggled ? 'text-indigo-400' : 'text-slate-500'}`}>
                          {weight}
                        </span>
                        <span className="text-2xl font-extrabold text-white block">
                          {isToggled ? '1' : '0'}
                        </span>
                        <span className={`text-[9px] font-semibold tracking-wider ${isToggled ? 'text-indigo-300' : 'text-slate-600'}`}>
                          {isToggled ? 'ON' : 'OFF'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Formula and sum */}
              <div className="w-full bg-slate-950/40 p-4 border border-slate-800 rounded-2xl flex flex-col items-center gap-1">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Active Sum Breakdown</span>
                <div className="text-sm font-semibold text-slate-300 font-mono text-center leading-relaxed">
                  {binaryBits.map((bit, idx) => {
                    const weights = [128, 64, 32, 16, 8, 4, 2, 1];
                    const term = bit ? `${weights[idx]}` : '0';
                    return (
                      <span key={idx}>
                        <span className={bit ? 'text-indigo-400 font-bold' : 'text-slate-600'}>{term}</span>
                        {idx < 7 && <span className="text-slate-700 mx-1">+</span>}
                      </span>
                    );
                  })}
                  <span className="text-slate-500 mx-1.5">=</span>
                  <span className={`font-extrabold ${
                    binaryBits.reduce((sum, b, i) => sum + (b ? [128, 64, 32, 16, 8, 4, 2, 1][i] : 0), 0) === binaryTarget
                      ? 'text-emerald-400 font-black animate-pulse'
                      : 'text-slate-200'
                  }`}>
                    {binaryBits.reduce((sum, b, i) => sum + (b ? [128, 64, 32, 16, 8, 4, 2, 1][i] : 0), 0)}
                  </span>
                </div>
              </div>

              {/* Instructions and Status */}
              <p className="text-center text-[10px] text-slate-400 max-w-sm">
                Toggle the bit switches (128 down to 1) so their sum equals the target number. The game will advance automatically on matches!
              </p>

            </div>
          ) : (
            // Game End: Victory or Defeat Card
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md mx-auto text-center space-y-6 relative overflow-hidden shadow-2xl flex flex-col items-center gap-4 animate-fade-in">
              <div className="absolute -top-12 -left-12 w-24 h-24 bg-[#8a3ffc]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

              {binaryScore >= 5 ? (
                <>
                  <Trophy className="text-amber-400 animate-bounce" size={48} />
                  <h3 className="text-xl font-bold text-slate-100">Racer Accomplished!</h3>
                  <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                    Splendid! You successfully converted <span className="text-slate-100 font-bold">{binaryScore} binary targets</span> before the timer ran out!
                  </p>
                  
                  <div className="flex justify-center border-y border-slate-800 py-4 w-full mt-2">
                    <div className="w-1/2 text-center border-r border-slate-800">
                      <span className="text-xs text-slate-400 block font-medium">Targets Converted</span>
                      <span className="text-base font-extrabold text-slate-100">{binaryScore}</span>
                    </div>
                    <div className="w-1/2 text-center">
                      <span className="text-xs text-slate-400 block font-medium">Target Threshold</span>
                      <span className="text-base font-extrabold text-emerald-450">5 Correct</span>
                    </div>
                  </div>

                  <div className="py-2.5 px-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-1.5 justify-center w-full">
                    <Award size={16} />
                    {binaryXpAwarded ? '+20 XP Rewarded Successfully!' : 'Crediting XP points...'}
                  </div>
                </>
              ) : (
                <>
                  <AlertTriangle className="text-rose-400 animate-pulse" size={48} />
                  <h3 className="text-xl font-bold text-slate-100">Duels Expired!</h3>
                  <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                    You only got <span className="text-slate-100 font-bold">{binaryScore} correct answers</span>. You need at least <span className="font-bold text-slate-100">5 correct</span> to win and claim the XP reward.
                  </p>
                </>
              )}

              <div className="flex gap-3 w-full mt-4">
                <button
                  onClick={() => {
                    setActiveGame('lobby');
                    setBinaryStarted(false);
                  }}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-755 text-slate-100 rounded-xl text-xs font-bold border border-slate-700 cursor-pointer"
                >
                  Back to Lobby
                </button>
                <button
                  onClick={startBinaryGame}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Games;
