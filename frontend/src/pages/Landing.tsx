import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowRight, 
  Star, 
  Gamepad2, 
  Trophy, 
  MessageSquare, 
  Sparkles, 
  Code, 
  Activity, 
  CheckCircle 
} from 'lucide-react';
import logo from '../assets/logo.png';

const Landing: React.FC = () => {
  const { user } = useAuth();
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [userRating, setUserRating] = useState<number>(5);
  const [submittedRating, setSubmittedRating] = useState(false);

  const testimonials = [
    {
      name: "Alex Chen",
      role: "Software Engineer at TechCorp",
      rating: 5,
      comment: "The coding Arena games completely transformed how I visualize binary math. NextLevelCoder is highly interactive and addictive!",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
    },
    {
      name: "Sara Al-Jamil",
      role: "Computer Science Student",
      rating: 5,
      comment: "The study notes hub with markdown auto-saving is a lifesaver. Taking notes side-by-side with Java exercises makes revision incredibly easy.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
    },
    {
      name: "Liam O'Connor",
      role: "Self-taught Developer",
      rating: 5,
      comment: "The dynamic goals checklist kept me on track every day. Watching my XP rise and earning achievement badges kept my motivation at 100%.",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150"
    }
  ];

  const benefits = [
    {
      icon: <Code className="text-indigo-400" size={24} />,
      title: "Interactive Syllabus",
      desc: "Learn Java OOP, JavaScript reductions, and SQL query creation with instant editor compiles and automated evaluations."
    },
    {
      icon: <Gamepad2 className="text-amber-400" size={24} />,
      title: "Coding Arena",
      desc: "Practice algorithmic and systems problems inside gamified challenges like the Binary Speed Racer to earn rapid XP."
    },
    {
      icon: <Activity className="text-emerald-400" size={24} />,
      title: "Dynamic Goal Checklists",
      desc: "Create and persist customized target indicators for topics read, problems completed, and XP milestones in real-time."
    },
    {
      icon: <MessageSquare className="text-violet-400" size={24} />,
      title: "Markdown Study Hub",
      desc: "Write detailed topic study guides with inline code blocks, utilizing continuous cloud auto-saving and full catalog search."
    }
  ];

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedRating(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden font-sansSelection">
      {/* Background aurora blurs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '14s' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-slate-900/60 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 overflow-hidden flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800">
            <img src={logo} alt="Logo" className="w-14 h-14 max-w-none object-cover object-top" />
          </div>
          <div>
            <span className="text-lg font-bold text-white tracking-tight">NextLevel</span>
            <span className="text-lg font-bold text-indigo-400 tracking-tight">Coder</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#syllabus" className="hover:text-white transition-colors">Syllabus</a>
          <a href="#ratings" className="hover:text-white transition-colors">Reviews & Ratings</a>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <Link 
              to="/dashboard" 
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-500/10 flex items-center gap-1.5"
            >
              Dashboard
              <ArrowRight size={14} />
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-xs font-bold text-slate-350 hover:text-white px-3 py-2 transition-colors">
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-500/10 flex items-center gap-1.5"
              >
                Get Started
                <ArrowRight size={14} />
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-20 text-center lg:text-left lg:grid lg:grid-cols-12 lg:gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
            <Sparkles size={13} className="animate-spin" style={{ animationDuration: '4s' }} />
            <span>Redesigned Interactive Coding Hub</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
            Master Coding. <br />
            Accelerate Your <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Engineering Path.</span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-2xl leading-relaxed">
            Gain computer science proficiency through hands-on challenges, live notes catalog systems, code sandbox workspace execution, and interactive speed racing mini-games.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            {user ? (
              <Link 
                to="/dashboard" 
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3.5 rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/20 text-sm transition-all"
              >
                Go to Dashboard
                <ArrowRight size={15} />
              </Link>
            ) : (
              <>
                <Link 
                  to="/register" 
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3.5 rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/20 text-sm transition-all"
                >
                  Create Free Account
                  <ArrowRight size={15} />
                </Link>
                <Link 
                  to="/login" 
                  className="w-full sm:w-auto bg-slate-900 border border-slate-800 text-slate-350 hover:text-white font-bold px-6 py-3.5 rounded-xl flex items-center justify-center text-sm transition-all hover:bg-slate-850"
                >
                  Explore Platform
                </Link>
              </>
            )}
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center lg:justify-start gap-6 pt-8 border-t border-slate-900/60 max-w-lg">
            <div>
              <div className="flex items-center justify-center lg:justify-start gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Avg Rating <span className="font-bold text-white">4.9/5</span> from 10k+ reviews
              </p>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div>
              <p className="text-xl font-bold text-white">150k+</p>
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Problems Solved</p>
            </div>
          </div>
        </div>

        {/* Hero Visual Block */}
        <div className="hidden lg:block lg:col-span-5 relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-violet-500/10 rounded-3xl blur-2xl pointer-events-none" />
          
          <div className="bg-slate-900/40 border border-slate-800 backdrop-blur-xl rounded-3xl p-6 relative">
            {/* Terminal simulation */}
            <div className="w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-850 font-mono text-[11px] text-indigo-300">
              <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-850">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Interactive_Workspace.java</span>
              </div>
              <div className="p-4 leading-relaxed whitespace-pre-wrap">
                <span className="text-slate-500">// Solve coding challenges instantly</span>{'\n'}
                <span className="text-violet-400">import</span> com.nextlevelcoder.learning;{'\n'}{'\n'}
                <span className="text-amber-400">class</span> <span className="text-emerald-400">NextLevelJourney</span> {'{'} {'\n'}
                {'  '}<span className="text-amber-400">public static void</span> main(String[] args) {'{'} {'\n'}
                {'    '}System.out.println(<span className="text-slate-400">"Leveling Up Coder..."</span>);{'\n'}
                {'    '}int progress = <span className="text-indigo-400">98</span>;{'\n'}
                {'    '}System.out.println(<span className="text-slate-400">"Success status: Ready!"</span>);{'\n'}
                {'  '}{'}'}{'\n'}
                {'}'}
              </div>
            </div>

            {/* Achievement Widget overlay */}
            <div className="absolute bottom-[-15px] left-[-20px] bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex items-center gap-3 backdrop-blur-xl">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center border border-amber-500/25">
                <Trophy size={18} className="text-amber-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Achievement Unlocked!</p>
                <p className="text-[10px] text-slate-400">Fast Solver - Answered under 10 seconds</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section id="features" className="relative z-10 bg-slate-900/20 border-y border-slate-900/40 py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Engineered For Rapid Mastery</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              We ditched generic text documents. Our platform balances structural academic concepts with direct interactive sandboxes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, idx) => (
              <div 
                key={idx} 
                className="bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl rounded-2xl p-6 hover:border-slate-700/60 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800 mb-5 group-hover:scale-105 transition-transform">
                  {b.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{b.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Syllabus Showcase */}
      <section id="syllabus" className="relative z-10 py-20 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">What You Will Learn</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Our curated courses and topic syllabus are structured to help students start writing clean code from day one.
          </p>

          <div className="space-y-3">
            {[
              "Java Object Oriented programming principles (Classes, Methods, Interfaces)",
              "JavaScript functional programming paradigm structures (Reducers, Palindromes, Closures)",
              "SQL relational database modeling and analytical note query creation",
              "Algorithmic complexities, recursion, and variable memory limits"
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-slate-350 text-xs">
                <CheckCircle size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-900/35 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-400 font-bold">JAVA</span>
              <h4 className="text-sm font-bold text-white">OOP Curriculums</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">Master structures like abstraction, inheritance, polymorphism, encapsulation, and interface integrations.</p>
          </div>

          <div className="bg-slate-900/35 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 font-bold">JS</span>
              <h4 className="text-sm font-bold text-white">Advanced JS & Logic</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">Develop clean functional solutions, asynchronous loops, array filters/reducers, and complex calculations.</p>
          </div>

          <div className="bg-slate-900/35 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded bg-violet-500/15 text-violet-400 font-bold">SQL</span>
              <h4 className="text-sm font-bold text-white">Relational Queries</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">Learn mapping schemas, foreign key structures, inner/outer joins, filters, grouping criteria, and sort order parameters.</p>
          </div>

          <div className="bg-slate-900/35 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold">CORE</span>
              <h4 className="text-sm font-bold text-white">Complexity Systems</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">Understand runtime structures, constraints, testing vectors, edge cases, and optimization benchmarks.</p>
          </div>
        </div>
      </section>

      {/* Ratings & Testimonials Section */}
      <section id="ratings" className="relative z-10 bg-slate-900/20 border-t border-slate-900/40 py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Student Testimonials</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Read how NextLevelCoder empowers software developers, college students, and self-taught learners to accelerate their learning rates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div 
                key={idx} 
                className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4 relative flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed italic">"{t.comment}"</p>
                </div>
                
                <div className="flex items-center gap-3 pt-4 border-t border-slate-800/60 mt-4">
                  <img 
                    src={t.avatar} 
                    alt={t.name} 
                    className="w-9 h-9 rounded-full object-cover border border-slate-750" 
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{t.name}</h4>
                    <p className="text-[10px] text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Rating submission */}
          <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 mt-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
            
            <h3 className="text-base font-bold text-white mb-2">How much did this platform help you?</h3>
            <p className="text-slate-400 text-xs mb-6">Submit your rating and help us improve the curriculum experience.</p>
            
            {submittedRating ? (
              <div className="flex flex-col items-center justify-center space-y-2 py-4 animate-scale-in">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400">
                  <CheckCircle size={24} />
                </div>
                <p className="text-sm font-bold text-white">Thank you for rating us {userRating} Stars!</p>
                <p className="text-[10px] text-slate-400">Your feedback helps shape the NextLevelCoder platform.</p>
              </div>
            ) : (
              <form onSubmit={handleRatingSubmit} className="space-y-4">
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((starValue) => (
                    <button
                      key={starValue}
                      type="button"
                      className="text-slate-600 hover:text-amber-400 transition-colors cursor-pointer"
                      onClick={() => setUserRating(starValue)}
                      onMouseEnter={() => setHoveredRating(starValue)}
                      onMouseLeave={() => setHoveredRating(null)}
                    >
                      <Star 
                        size={28} 
                        fill={starValue <= (hoveredRating ?? userRating) ? "currentColor" : "none"} 
                        className={starValue <= (hoveredRating ?? userRating) ? "text-amber-400" : "text-slate-650"}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500">
                  Selected score: <span className="font-bold text-slate-350">{userRating} / 5</span>
                </p>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-5 rounded-xl text-xs transition-all mt-2 cursor-pointer shadow-md shadow-indigo-500/15"
                >
                  Submit Review
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900/60 max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 overflow-hidden flex items-center justify-center rounded-lg bg-slate-900 border border-slate-800">
            <img src={logo} alt="Logo" className="w-10 h-10 max-w-none object-cover object-top" />
          </div>
          <span className="font-bold text-slate-450">&copy; 2026 NextLevelCoder. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#features" className="hover:text-slate-350 transition-colors">Privacy Policy</a>
          <a href="#syllabus" className="hover:text-slate-350 transition-colors">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
