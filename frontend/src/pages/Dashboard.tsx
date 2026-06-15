import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  Flame,
  Trophy,
  Target,
  Code2,
  CheckCircle2,
  Clock,
  Star,
  ArrowRight,
  Zap,
  BookOpen,
  Award,
  Activity,
  Coffee,
  Binary,
  Server,
  Monitor,
  Plus,
  Trash2,
  ListTodo,
  Check,
} from 'lucide-react';

interface RecentSubmission {
  id: number;
  problemId: number;
  title: string;
  difficulty: string;
  status: string;
  language: string;
  time: string;
}

interface RecommendedProblem {
  id: number;
  title: string;
  difficulty: string;
  category: string;
  xp: number;
}

interface CourseProgress {
  id: number;
  title: string;
  progress: number;
  lessons: number;
  color: string;
}

interface DashboardData {
  currentStreak: number;
  longestStreak: number;
  weeklyActivity: number[];
  recentSubmissions: RecentSubmission[];
  recommendedProblems: RecommendedProblem[];
  courses: CourseProgress[];
  activityHeatmap?: Record<string, number>;
}

const difficultyConfig = {
  Easy: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  Medium: { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  Hard: { color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
};

const courseConfig: Record<string, {
  gradient: string;
  borderColor: string;
  icon: React.ReactNode;
}> = {
  'Java Fundamentals': {
    gradient: 'from-orange-500 to-red-500',
    borderColor: 'hover:border-orange-500/30 hover:bg-orange-500/5',
    icon: <Coffee size={15} />
  },
  'Data Structures & Algorithms': {
    gradient: 'from-blue-600 to-cyan-500',
    borderColor: 'hover:border-blue-500/30 hover:bg-blue-500/5',
    icon: <Binary size={15} />
  },
  'System Design': {
    gradient: 'from-violet-600 to-indigo-500',
    borderColor: 'hover:border-violet-500/30 hover:bg-violet-500/5',
    icon: <Server size={15} />
  },
  'HTML & CSS': {
    gradient: 'from-pink-500 to-rose-500',
    borderColor: 'hover:border-pink-500/30 hover:bg-pink-500/5',
    icon: <Monitor size={15} />
  },
  'JavaScript': {
    gradient: 'from-yellow-500 to-amber-500',
    borderColor: 'hover:border-yellow-500/30 hover:bg-yellow-500/5',
    icon: <Code2 size={15} />
  }
};

const getCourseConfig = (title: string) => {
  return courseConfig[title] || {
    gradient: 'from-indigo-500 to-violet-600',
    borderColor: 'hover:border-indigo-500/30 hover:bg-indigo-500/5',
    icon: <Code2 size={15} />
  };
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  gradient: string;
  glow: string;
  className?: string;
}> = ({ icon, label, value, sub, gradient, glow, className = '' }) => (
  <div className={`relative bg-slate-900 border border-slate-800 rounded-3xl p-6 overflow-hidden group hover:border-slate-700 transition-all duration-300 hover:-translate-y-0.5 shadow-sm hover:shadow-md ${className}`}>
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${glow}`} />
    <div className="relative z-10">
      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-md text-white`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-slate-100 mb-0.5">{value}</p>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
      {sub && <p className="text-[11px] text-slate-500 mt-1">{sub}</p>}
    </div>
  </div>
);

const WeeklyActivityChart: React.FC<{ activity: number[] }> = ({ activity }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const maxVal = Math.max(...activity, 1);
  const totalContributions = activity.reduce((a, b) => a + b, 0);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <Activity size={16} className="text-[#8a3ffc]" />
            Weekly Engagement
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Your submission frequency over the past 7 days</p>
        </div>
        <div className="text-right">
          <span className="text-xl font-extrabold text-[#8a3ffc]">{totalContributions}</span>
          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Total Actions</span>
        </div>
      </div>

      {/* SVG Bar Chart */}
      <div className="h-28 w-full flex items-end justify-between px-2 sm:px-6 relative select-none">
        {activity.map((val, idx) => {
          const barHeightPct = (val / maxVal) * 100;
          
          return (
            <div key={idx} className="flex flex-col items-center flex-1 group relative">
              {/* Bar Column wrapper */}
              <div className="w-6 sm:w-8 h-20 bg-slate-950/40 rounded-lg relative overflow-hidden flex items-end border border-slate-800 hover:border-slate-800 transition-all duration-200">
                {/* Foreground Fill with Indigo-Violet gradient */}
                <div
                  className="w-full bg-gradient-to-t from-indigo-600 to-[#8a3ffc] rounded-md transition-all duration-500 origin-bottom"
                  style={{ height: `${barHeightPct}%` }}
                />
              </div>

              {/* Day Label */}
              <span className="text-[10px] text-slate-400 font-semibold mt-2 group-hover:text-slate-350 transition-colors uppercase tracking-wider">
                {days[idx]}
              </span>

              {/* Bar Tooltip */}
              <div className="absolute bottom-full mb-1.5 hidden group-hover:block bg-slate-950 border border-slate-800 text-[10px] text-slate-200 px-2 py-1 rounded shadow-xl whitespace-nowrap z-30 pointer-events-none">
                <span className="font-bold text-indigo-400">{val} contributions</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  interface Goal {
    id: number;
    title: string;
    targetValue: number;
    currentValue: number;
    type: string;
    isCompleted: boolean;
    createdAt: string;
  }

  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoalText, setNewGoalText] = useState('');
  const [newGoalType, setNewGoalType] = useState<'Custom' | 'XP' | 'Problems' | 'Course'>('Custom');
  const [newGoalTarget, setNewGoalTarget] = useState(1);

  const fetchGoals = async () => {
    try {
      const response = await api.get<Goal[]>('/goals');
      setGoals(response.data);
    } catch (err) {
      console.error('Failed to load goals:', err);
    }
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    try {
      const response = await api.post<Goal>('/goals', {
        title: newGoalText.trim(),
        type: newGoalType,
        targetValue: newGoalType === 'Custom' ? 1 : newGoalTarget,
      });
      setGoals((prev) => [response.data, ...prev]);
      setNewGoalText('');
      setNewGoalTarget(1);
      setNewGoalType('Custom');
    } catch (err) {
      console.error('Failed to add goal:', err);
    }
  };

  const handleToggleGoal = async (id: number) => {
    try {
      const response = await api.put<Goal>(`/goals/${id}/toggle`);
      setGoals((prev) =>
        prev.map((g) => (g.id === id ? response.data : g))
      );
    } catch (err) {
      console.error('Failed to toggle goal:', err);
    }
  };

  const handleDeleteGoal = async (id: number) => {
    try {
      await api.delete(`/goals/${id}`);
      setGoals((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      console.error('Failed to delete goal:', err);
    }
  };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get<DashboardData>('/dashboard');
        setData(response.data);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
    fetchGoals();
  }, []);

  // Compute heatmap days grid
  const heatmapDays = React.useMemo(() => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 365);
    // Align start to Monday
    const dayOfWeek = start.getDay();
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    start.setDate(start.getDate() - diffToMonday);

    const end = new Date(today);
    // Align end to Sunday to complete the last week
    const endDayOfWeek = end.getDay();
    const diffToSunday = endDayOfWeek === 0 ? 0 : 7 - endDayOfWeek;
    end.setDate(end.getDate() + diffToSunday);

    const days = [];
    const temp = new Date(start);
    const heatmap = data?.activityHeatmap || {};

    while (temp <= end) {
      const dateStr = temp.toISOString().split('T')[0];
      const count = heatmap[dateStr] || 0;
      days.push({
        date: new Date(temp),
        dateStr,
        count,
      });
      temp.setDate(temp.getDate() + 1);
    }
    return days;
  }, [data?.activityHeatmap]);

  const monthLabels = React.useMemo(() => {
    const labels: { name: string; offsetPct: number }[] = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let lastMonth = -1;

    for (let i = 0; i < heatmapDays.length; i += 7) {
      const date = heatmapDays[i].date;
      const month = date.getMonth();
      if (month !== lastMonth) {
        lastMonth = month;
        const totalWeeks = heatmapDays.length / 7;
        const colIndex = i / 7;
        const offsetPct = (colIndex / totalWeeks) * 100;
        labels.push({
          name: months[month],
          offsetPct: Math.min(offsetPct, 95),
        });
      }
    }
    return labels;
  }, [heatmapDays]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const defaultData: DashboardData = {
    currentStreak: 0,
    longestStreak: 0,
    weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
    recentSubmissions: [],
    recommendedProblems: [],
    courses: [],
    activityHeatmap: {},
  };

  const dashboardData = data ?? defaultData;
  const currentStreak = dashboardData.currentStreak;
  const longestStreak = dashboardData.longestStreak;

  // Dynamic milestone progression calculations
  const userXp = profile?.xp ?? 0;
  const currentLevel = profile?.level ?? 'Beginner';
  
  let minMilestoneXp = 0;
  let maxMilestoneXp = 500;
  
  if (currentLevel === 'Beginner') {
    minMilestoneXp = 0;
    maxMilestoneXp = 500;
  } else if (currentLevel === 'Intermediate') {
    minMilestoneXp = 500;
    maxMilestoneXp = 2000;
  } else if (currentLevel === 'Advanced') {
    minMilestoneXp = 2000;
    maxMilestoneXp = 5000;
  } else if (currentLevel === 'Expert') {
    minMilestoneXp = 5000;
    maxMilestoneXp = 10000;
  } else {
    minMilestoneXp = 10000;
    maxMilestoneXp = 10000;
  }

  const isMaxLevel = currentLevel === 'Master' || userXp >= 10000;
  const denominator = maxMilestoneXp - minMilestoneXp;
  const milestoneProgressPercent = isMaxLevel 
    ? 100 
    : (denominator === 0 ? 0 : Math.min(Math.max(((userXp - minMilestoneXp) / denominator) * 100, 0), 100));

  return (
    <div className="space-y-6 w-full">
      {/* ── Welcome Banner Card matching Mockup ──────────────── */}
      <div className="relative bg-gradient-to-r from-[#8a3ffc] to-[#a78bfa] rounded-3xl p-6 md:p-8 text-white overflow-hidden shadow-lg shadow-indigo-500/10">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-xl">
          <span className="text-[10px] font-bold text-white/80 bg-white/10 px-3 py-1 rounded-full uppercase tracking-wider">
            {new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-4 tracking-tight">
            {greeting}, {profile?.username ?? user?.username ?? 'Coder'}!
          </h1>
          <p className="text-sm text-white/90 mt-2 leading-relaxed max-w-md">
            Always stay updated in your coding portal. Keep the momentum going — you're on a {currentStreak}-day streak!
          </p>
          <div className="mt-5">
            <button
              onClick={() => navigate('/problems')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-white/90 text-[#8a3ffc] text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
            >
              <Code2 size={14} className="fill-[#8a3ffc]/10" />
              Solve a Problem
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
        {/* Floating icon design matching mockup illustration */}
        <div className="absolute right-6 md:right-16 bottom-4 md:bottom-6 opacity-30 md:opacity-40 animate-pulse pointer-events-none">
          <Zap size={80} className="text-white fill-white/10" />
        </div>
      </div>

      {/* ── Stat Cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Flame size={20} className={currentStreak > 0 ? 'animate-bounce text-orange-200' : 'text-white'} />}
          label="Day Streak"
          value={currentStreak}
          sub={`Personal best: ${longestStreak}`}
          gradient={currentStreak > 0 ? "from-orange-500 to-amber-500" : "from-orange-500 to-red-500"}
          glow={currentStreak > 0 ? "from-orange-500/15 to-amber-500/10" : "from-orange-500/5 to-transparent"}
          className={currentStreak > 0 ? "ring-2 ring-orange-500/30 shadow-lg shadow-orange-500/5 bg-slate-900 border-transparent" : ""}
        />
        <StatCard
          icon={<Trophy size={20} className="text-white" />}
          label="Problems Solved"
          value={profile?.problemsSolved ?? 0}
          sub="Practice makes perfect"
          gradient="from-amber-400 to-yellow-500"
          glow="bg-gradient-to-br from-amber-500/5 to-transparent"
        />
        <StatCard
          icon={<Zap size={20} className="text-white" />}
          label="Total XP"
          value={`${profile?.xp ?? 0}`}
          sub={`Level: ${profile?.level ?? 'Beginner'}`}
          gradient="from-[#8a3ffc] to-[#a78bfa]"
          glow="bg-gradient-to-br from-indigo-500/5 to-transparent"
          className="ring-2 ring-[#8a3ffc] shadow-lg shadow-indigo-500/5 bg-slate-900 border-transparent"
        />
        <StatCard
          icon={<Target size={20} className="text-white" />}
          label="Accuracy"
          value={`${Math.round((profile?.accuracy ?? 0) * 100) / 100}%`}
          sub="Accepted / Submissions"
          gradient="from-emerald-500 to-teal-600"
          glow="bg-gradient-to-br from-emerald-500/5 to-transparent"
        />
      </div>

      {/* ── Yearly Activity Heatmap ────────────────────────── */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Activity size={16} className="text-indigo-400 animate-pulse" />
              Annual Contribution Heatmap
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Your daily activity across course quizzes and coding challenges</p>
          </div>
          
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800 w-fit">
            <span>Less</span>
            <div className="w-2.5 h-2.5 rounded-sm bg-slate-950" />
            <div className="w-2.5 h-2.5 rounded-sm bg-indigo-500/20" />
            <div className="w-2.5 h-2.5 rounded-sm bg-indigo-500/40" />
            <div className="w-2.5 h-2.5 rounded-sm bg-indigo-500/70" />
            <div className="w-2.5 h-2.5 rounded-sm bg-indigo-500" />
            <span>More</span>
          </div>
        </div>

        <div className="flex gap-2">
          {/* Day of Week Labels on the Left */}
          <div className="flex flex-col justify-between text-[9px] text-slate-400 font-bold uppercase select-none w-7 h-[105px] mt-[22px] pr-1">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
            <span>Sun</span>
          </div>

          <div className="flex-1 overflow-x-auto pb-1 scrollbar-thin">
            <div className="min-w-[760px] flex flex-col gap-1.5">
              {/* Month Labels above grid */}
              <div className="flex text-[9px] text-slate-400 font-bold uppercase tracking-wider relative h-4 select-none mb-1">
                {monthLabels.map((ml, idx) => (
                  <span
                    key={idx}
                    className="absolute"
                    style={{ left: `${ml.offsetPct}%` }}
                  >
                    {ml.name}
                  </span>
                ))}
              </div>

              {/* Heatmap Grid */}
              <div className="grid grid-flow-col grid-rows-7 gap-[3.5px] py-1 select-none">
                {heatmapDays.map((d, index) => {
                  let color = 'bg-slate-950 hover:bg-slate-800/60 border border-slate-900/60';
                  if (d.count === 1) color = 'bg-indigo-500/20 border border-indigo-500/10 hover:bg-indigo-500/30';
                  else if (d.count === 2) color = 'bg-indigo-500/40 border border-indigo-500/25 hover:bg-indigo-500/50';
                  else if (d.count >= 3 && d.count <= 4) color = 'bg-indigo-500/70 border border-indigo-500/40 hover:bg-indigo-500/80';
                  else if (d.count >= 5) color = 'bg-indigo-500 border border-indigo-400/50 hover:bg-indigo-400';

                  const formattedDate = d.date.toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  return (
                    <div
                      key={index}
                      className={`w-[12px] h-[12px] rounded-[2px] transition-all duration-150 hover:scale-[1.3] hover:z-10 cursor-pointer relative group ${color}`}
                    >
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-950 border border-slate-800 text-[10px] text-slate-200 px-2 py-1 rounded shadow-2xl whitespace-nowrap z-50 pointer-events-none">
                        <span className="font-bold text-indigo-400">{d.count} contributions</span> on {formattedDate}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Labels under grid */}
              <div className="flex justify-between text-[10px] text-slate-500 px-1 font-medium mt-1">
                <span>{new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                <span>{new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, { month: 'short' })}</span>
                <span>Today</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Middle/Bottom Row ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        {/* Left Side Main Area (spanning 2 columns) */}
        <div className="lg:col-span-2 space-y-4 flex flex-col">
          {/* Weekly Activity Engagement Chart */}
          <WeeklyActivityChart activity={dashboardData.weeklyActivity} />

          {/* Recent Submissions */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col h-fit">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                  <Clock size={16} className="text-slate-400" />
                  Recent Submissions
                </h2>
                <button
                  onClick={() => navigate('/problems')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
                >
                  View all <ArrowRight size={12} />
                </button>
              </div>
              {dashboardData.recentSubmissions.length === 0 ? (
                <div className="text-center py-8 bg-slate-950/20 border border-slate-800/60 rounded-xl">
                  <Clock className="mx-auto text-slate-700 mb-2" size={24} />
                  <p className="text-xs text-slate-500">No submissions yet. Start coding!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {dashboardData.recentSubmissions.map((p) => {
                    const diff = difficultyConfig[p.difficulty as keyof typeof difficultyConfig] || difficultyConfig.Easy;
                    return (
                      <div
                        key={p.id}
                        onClick={() => navigate(`/problems/${p.problemId}`)}
                        className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/20 hover:bg-slate-800/50 transition-all group cursor-pointer border border-transparent hover:border-slate-700/30"
                      >
                        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                          p.status === 'Accepted' ? 'bg-emerald-500/15' : 'bg-amber-500/15'
                        }`}>
                          {p.status === 'Accepted'
                            ? <CheckCircle2 size={16} className="text-emerald-400" />
                            : <Clock size={16} className="text-amber-400" />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-100 group-hover:text-[#8a3ffc] truncate">{p.title}</p>
                          <p className="text-xs text-slate-500">{p.language} · {p.time}</p>
                        </div>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${diff.bg} ${diff.color}`}>
                          {p.difficulty}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Your Courses (moved here to prevent visual empty space on the left side) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                <BookOpen size={16} className="text-indigo-400" />
                Your Courses
              </h2>
              <button
                onClick={() => navigate('/learn')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
              >
                All courses <ArrowRight size={12} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {dashboardData.courses.map((course) => {
                const conf = getCourseConfig(course.title);
                return (
                  <div
                    key={course.id}
                    onClick={() => navigate(`/learn/course/${course.id}`)}
                    className={`p-4 rounded-2xl bg-slate-900 border border-slate-800 ${conf.borderColor} hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer group`}
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${conf.gradient} flex items-center justify-center mb-3 shadow-md text-white`}>
                      {conf.icon}
                    </div>
                    <p className="text-sm font-bold text-slate-100 group-hover:text-[#8a3ffc] mb-2 leading-snug truncate">{course.title}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <span>{course.progress}% complete</span>
                      <span>{course.lessons} lessons</span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${conf.gradient} rounded-full transition-all duration-700`}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Side Panel: Level Progress & Recommended stacked */}
        <div className="flex flex-col gap-4">
          {/* Level Progress */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col shadow-sm">
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2 mb-4">
              <Award size={16} className="text-[#8a3ffc]" />
              Level Progress
            </h2>
            <div className="flex-grow flex flex-col items-center justify-center py-2">
              {/* Circular progress */}
              <div className="relative w-32 h-32 mb-4">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#1E293B" strokeWidth="10" />
                  <circle
                    cx="60" cy="60" r="50"
                    fill="none"
                    stroke="url(#progressGrad)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 50}`}
                    strokeDashoffset={`${2 * Math.PI * 50 * (1 - milestoneProgressPercent / 100)}`}
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366F1" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold text-slate-100">{Math.round(milestoneProgressPercent)}%</span>
                  <span className="text-xs text-slate-400">{isMaxLevel ? 'maxed' : 'to next'}</span>
                </div>
              </div>
              <p className="text-sm font-semibold text-indigo-400 mb-1">{profile?.level ?? 'Beginner'}</p>
              <p className="text-xs text-slate-500">
                {isMaxLevel ? `${userXp} XP` : `${userXp} / ${maxMilestoneXp} XP`}
              </p>
            </div>

            {/* Level milestones */}
            <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
              {[
                { label: 'Beginner', xp: 0, done: true },
                { label: 'Intermediate', xp: 500, done: userXp >= 500 },
                { label: 'Advanced', xp: 2000, done: userXp >= 2000 },
                { label: 'Expert', xp: 5000, done: userXp >= 5000 },
                { label: 'Master', xp: 10000, done: userXp >= 10000 },
              ].map((m) => (
                <div key={m.label} className="flex items-center gap-2 text-xs">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${m.done ? 'bg-indigo-500' : 'bg-slate-700'}`} />
                  <span className={m.done ? 'text-slate-300' : 'text-slate-500'}>{m.label}</span>
                  <span className="ml-auto text-slate-500">{m.xp} XP</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Problems */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                <Star size={16} className="text-amber-400" />
                Recommended
              </h2>
            </div>
            <div className="space-y-3">
              {dashboardData.recommendedProblems.map((p) => {
                const diff = difficultyConfig[p.difficulty as keyof typeof difficultyConfig] || difficultyConfig.Easy;
                return (
                  <div
                    key={p.id}
                    onClick={() => navigate(`/problems/${p.id}`)}
                    className="p-3 rounded-2xl border border-slate-800/80 hover:border-[#8a3ffc]/50 hover:bg-[#8a3ffc]/5 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-100 group-hover:text-[#8a3ffc]">{p.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{p.category}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded border ${diff.bg} ${diff.color}`}>
                          {p.difficulty}
                        </span>
                        <span className="text-xs text-indigo-400 font-medium">+{p.xp} XP</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => navigate('/problems')}
              className="mt-3 w-full py-2 text-xs font-semibold text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/10 rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <Code2 size={13} />
              Browse all problems
            </button>
          </div>

          {/* Goals and Milestone Tracker Widget */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                <ListTodo size={16} className="text-indigo-400" />
                Tasks & Goals
              </h2>
              <span className="text-[10px] bg-slate-950 border border-slate-800 px-2 py-0.5 rounded-full text-slate-400 font-bold">
                {goals.filter((g) => g.isCompleted).length} / {goals.length} Completed
              </span>
            </div>

            {/* Goal Input form */}
            <form onSubmit={handleAddGoal} className="space-y-3 bg-slate-950/40 p-4 border border-slate-800/85 rounded-2xl">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newGoalText}
                  onChange={(e) => setNewGoalText(e.target.value)}
                  placeholder="Enter a milestone title..."
                  className="flex-1 bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                />
                <button
                  type="submit"
                  className="px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer shadow-md shadow-indigo-500/10 active:scale-95"
                >
                  <Plus size={14} />
                  Add
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                {/* Goal Type Selection */}
                <div className="flex-1 flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Goal Type</label>
                  <select
                    value={newGoalType}
                    onChange={(e) => setNewGoalType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer"
                  >
                    <option value="Custom">Custom Task (Checklist)</option>
                    <option value="XP">XP Metric Goal</option>
                    <option value="Problems">Problems Solved Goal</option>
                    <option value="Course">Course Completion Goal</option>
                  </select>
                </div>

                {/* Target Value (only visible for metrics) */}
                {newGoalType !== 'Custom' && (
                  <div className="w-full sm:w-28 flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Target Value</label>
                    <input
                      type="number"
                      min="1"
                      value={newGoalTarget}
                      onChange={(e) => setNewGoalTarget(parseInt(e.target.value, 10) || 1)}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-255 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                )}
              </div>
            </form>

            {/* Dynamic Metric Goals Section */}
            {goals.filter((g) => g.type !== 'Custom').length > 0 && (
              <div className="space-y-3">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Dynamic Metric Progress</h3>
                <div className="grid grid-cols-1 gap-2.5">
                  {goals.filter((g) => g.type !== 'Custom').map((g) => {
                    const progressPct = Math.min((g.currentValue / g.targetValue) * 100, 100);
                    return (
                      <div
                        key={g.id}
                        className="p-3 bg-slate-950/20 border border-slate-800 rounded-2xl flex flex-col gap-2 relative overflow-hidden group"
                      >
                        <div className="flex justify-between items-start">
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-slate-200 block truncate">{g.title}</span>
                            <span className="text-[9px] font-bold uppercase text-indigo-400 mt-0.5 block">{g.type} Metric Goal</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-350 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded-full">
                              {g.currentValue} / {g.targetValue}
                            </span>
                            <button
                              onClick={() => handleDeleteGoal(g.id)}
                              className="text-slate-550 hover:text-rose-500 p-1 rounded transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-900">
                          <div
                            className={`h-full rounded-full transition-all duration-700 bg-gradient-to-r from-indigo-500 to-[#8a3ffc]`}
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>

                        {g.isCompleted && (
                          <div className="absolute right-3 bottom-2 text-[9px] font-bold text-emerald-450 flex items-center gap-0.5 select-none">
                            <CheckCircle2 size={10} /> Completed
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Custom Checklist Tasks Section */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Milestone Tasks</h3>
              {goals.filter((g) => g.type === 'Custom').length === 0 ? (
                <div className="text-center py-6 border border-dashed border-slate-800 rounded-2xl bg-slate-950/20">
                  <p className="text-xs text-slate-500">No milestone tasks defined. Add one above!</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {goals.filter((g) => g.type === 'Custom').map((todo) => (
                    <div
                      key={todo.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/30 border border-slate-800 hover:border-slate-700/80 transition-all group"
                    >
                      <div
                        onClick={() => handleToggleGoal(todo.id)}
                        className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer select-none"
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all ${
                          todo.isCompleted
                            ? 'bg-indigo-600 border-indigo-500 text-white'
                            : 'border-slate-800 group-hover:border-slate-700 bg-slate-950'
                        }`}>
                          {todo.isCompleted && <Check size={10} strokeWidth={3} />}
                        </div>
                        <span className={`text-xs truncate ${
                          todo.isCompleted ? 'text-slate-500 line-through' : 'text-slate-200'
                        }`}>
                          {todo.title}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteGoal(todo.id)}
                        className="text-slate-500 hover:text-rose-500 p-1 rounded transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
