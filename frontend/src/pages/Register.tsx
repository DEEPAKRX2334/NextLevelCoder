import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight, BookOpen, Trophy, Gamepad2, Sparkles } from 'lucide-react';
import logo from '../assets/logo.png';

const codeSnippets = [
  `// Learn Java OOP concepts interactively\nclass CodeWizard {\n  public static void main(String[] args) {\n    System.out.println("XP Gained: +50!");\n  }\n}`,
  `// Challenge yourself in the Arena\nfunction isPalindrome(num) {\n  const str = String(num);\n  return str === [...str].reverse().join('');\n}`,
  `// Organize notes in your central hub\nSELECT course, count(note)\nFROM personal_study_notes\nGROUP BY course\nORDER BY count DESC;`
];

const TypewriterTerminal: React.FC = () => {
  const [snippetIndex, setSnippetIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentCode = codeSnippets[snippetIndex];
    let timer: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (charIndex < currentCode.length) {
        timer = setTimeout(() => {
          setDisplayText((prev) => prev + currentCode[charIndex]);
          setCharIndex((prev) => prev + 1);
        }, 45); // typing speed
      } else {
        // finished typing, wait before deleting
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2500);
      }
    } else {
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText((prev) => prev.slice(0, -1));
        }, 15); // deleting speed
      } else {
        // finished deleting, move to next snippet
        setIsDeleting(false);
        setCharIndex(0);
        setSnippetIndex((prev) => (prev + 1) % codeSnippets.length);
      }
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, snippetIndex, displayText]);

  const getFileName = () => {
    if (snippetIndex === 0) return 'Solution.java';
    if (snippetIndex === 1) return 'Arena.js';
    return 'Query.sql';
  };

  return (
    <div className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden font-mono text-xs text-indigo-300">
      {/* Terminal Titlebar */}
      <div className="bg-slate-900 border-b border-slate-800/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-500/80" />
          <span className="w-3 h-3 rounded-full bg-amber-500/80" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
        </div>
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{getFileName()}</span>
        <div className="w-12" /> {/* spacer */}
      </div>

      {/* Terminal Body */}
      <div className="p-5 min-h-[140px] leading-relaxed whitespace-pre-wrap flex flex-col justify-start relative select-none">
        <div>
          {displayText}
          <span className="inline-block w-1.5 h-3.5 bg-indigo-400 ml-0.5 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const passwordStrength = (() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  })();

  const strengthConfig = [
    { label: 'Weak', color: 'bg-red-500' },
    { label: 'Fair', color: 'bg-amber-500' },
    { label: 'Good', color: 'bg-yellow-400' },
    { label: 'Strong', color: 'bg-emerald-500' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await register({ username, email, password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 lg:p-8 relative overflow-hidden">
      {/* Background glowing aurora blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '12s' }} />
      </div>

      <div className="relative w-full max-w-5xl z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* LEFT COLUMN: BRANDING & INTERACTIVE TERMINAL (HIDDEN ON MOBILE) */}
        <div className="hidden lg:flex lg:col-span-7 flex-col justify-between bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-8 relative overflow-hidden">
          {/* Subtle accent glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 overflow-hidden flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30 flex-shrink-0">
              <img src={logo} alt="Logo" className="w-16 h-16 max-w-none object-cover object-top" />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight">NextLevel</span>
              <span className="text-lg font-bold text-indigo-400 tracking-tight">Coder</span>
            </div>
          </div>

          {/* Slogan */}
          <div className="space-y-4 my-8">
            <h2 className="text-3xl font-extrabold text-slate-100 leading-tight">
              Start Learning, <br />
              Code Your Future <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Today.</span>
            </h2>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              Unlock interactive coding lessons, customized goal roadmaps, personalized coding hubs, and competitive coding games designed to build your engineering career.
            </p>
          </div>

          {/* Interactive Code Terminal */}
          <div className="my-6">
            <TypewriterTerminal />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-indigo-400">
                <BookOpen size={14} />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Learn</span>
              </div>
              <p className="text-sm font-extrabold text-white">150+ Topics</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400">
                <Gamepad2 size={14} />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Arena</span>
              </div>
              <p className="text-sm font-extrabold text-white">Mini Games</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Trophy size={14} />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Rewards</span>
              </div>
              <p className="text-sm font-extrabold text-white">Badges & XP</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: REGISTER FORM CONTAINER */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 lg:p-10 shadow-2xl shadow-black/60 relative overflow-hidden">
            {/* Mobile-only branding */}
            <div className="flex items-center justify-center gap-2.5 mb-6 lg:hidden">
              <div className="w-9 h-9 overflow-hidden flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg flex-shrink-0">
                <img src={logo} alt="Logo" className="w-12 h-12 max-w-none object-cover object-top" />
              </div>
              <span className="text-lg font-bold">
                <span className="text-white">NextLevel</span>
                <span className="text-indigo-400">Coder</span>
              </span>
            </div>

            <div className="space-y-2 mb-8">
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                Create account
                <Sparkles size={18} className="text-amber-400 animate-pulse" />
              </h1>
              <p className="text-slate-400 text-xs leading-normal">
                Join our student learning community and begin coding!
              </p>
            </div>

            {/* Error alerts */}
            {error && (
              <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs mb-5 animate-shake">
                <AlertCircle size={14} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success alerts */}
            {success && (
              <div className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs mb-5">
                <CheckCircle2 size={14} className="flex-shrink-0" />
                <span>Account created! Redirecting to login…</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Input */}
              <div className="space-y-1.5">
                <label htmlFor="reg-username" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Username
                </label>
                <input
                  id="reg-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder="your_username"
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-650 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Email Input */}
              <div className="space-y-1.5">
                <label htmlFor="reg-email" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-650 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label htmlFor="reg-password" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-650 rounded-xl px-4 py-2.5 pr-10 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200 transition-colors cursor-pointer"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>

                {/* Password strength indicator */}
                {password.length > 0 && (
                  <div className="mt-2 bg-slate-950/40 p-2.5 border border-slate-800/60 rounded-xl space-y-1.5">
                    <div className="flex gap-1.5">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            i < passwordStrength ? strengthConfig[passwordStrength - 1].color : 'bg-slate-850'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Password strength:{' '}
                      <span className={`font-bold ${
                        passwordStrength <= 1 ? 'text-rose-400'
                        : passwordStrength === 2 ? 'text-amber-400'
                        : passwordStrength === 3 ? 'text-yellow-400'
                        : 'text-emerald-400'
                      }`}>
                        {passwordStrength > 0 ? strengthConfig[passwordStrength - 1].label : 'Too short'}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || success}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-850 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 text-xs transition-all shadow-md shadow-indigo-500/10 mt-6 cursor-pointer"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-xs text-slate-500 mt-8 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
