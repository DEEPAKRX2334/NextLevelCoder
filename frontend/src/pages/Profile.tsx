import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Avatar } from '../components/Avatar';
import {
  Mail,
  Flame,
  Trophy,
  Target,
  Zap,
  Settings,
  BookOpen,
  Calendar,
  Award,
  Bookmark,
  ArrowRight,
} from 'lucide-react';

const Profile: React.FC = () => {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<{
    currentStreak: number;
    longestStreak: number;
  } | null>(null);

  interface BackendAchievement {
    title: string;
    desc: string;
    badgeUrl: string;
    unlocked: boolean;
    progress: string;
    earnedAt?: string;
  }

  interface BookmarkItem {
    id: number;
    type: 'CODING' | 'QUIZ';
    targetId: number;
    title: string;
    description: string;
    createdAt: string;
  }

  const [achievements, setAchievements] = useState<BackendAchievement[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [problems, setProblems] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardAndAchievements = async () => {
      try {
        const [dashRes, achRes, bookRes, probRes] = await Promise.all([
          api.get('/dashboard'),
          api.get('/achievements'),
          api.get('/bookmarks'),
          api.get('/problems')
        ]);
        setDashboardData(dashRes.data);
        setAchievements(achRes.data);
        setBookmarks(bookRes.data);
        setProblems(probRes.data);
      } catch (err) {
        console.error('Failed to load data on profile:', err);
      }
    };
    fetchDashboardAndAchievements();
  }, []);

  const categoryStats = React.useMemo(() => {
    const codingProblems = problems.filter((p) => p.category !== 'SQL' && p.category !== 'HTML & CSS' && p.category !== 'HTML' && p.category !== 'CSS');
    const sqlProblems = problems.filter((p) => p.category === 'SQL');
    const htmlCssProblems = problems.filter((p) => p.category === 'HTML & CSS' || p.category === 'HTML' || p.category === 'CSS');

    const getStats = (list: any[]) => {
      const total = list.length;
      const solved = list.filter((p) => p.solved).length;
      const pct = total === 0 ? 0 : Math.round((solved / total) * 100);
      return { total, solved, pct };
    };

    return {
      coding: getStats(codingProblems),
      sql: getStats(sqlProblems),
      htmlcss: getStats(htmlCssProblems),
    };
  }, [problems]);

  const levelColors: Record<string, string> = {
    Beginner: 'from-slate-400 to-slate-500 bg-slate-500/10 border-slate-500/20 text-slate-400',
    Intermediate: 'from-blue-400 to-indigo-500 bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
    Advanced: 'from-violet-400 to-purple-600 bg-purple-500/10 border-purple-500/20 text-purple-400',
    Expert: 'from-amber-400 to-orange-500 bg-amber-500/10 border-amber-500/20 text-amber-400',
    Master: 'from-rose-400 to-red-600 bg-red-500/10 border-red-500/20 text-red-400',
  };

  const currentLevel = profile?.level ?? 'Beginner';
  const levelStyle = levelColors[currentLevel] ?? levelColors.Beginner;

  const getAchievementIcon = (title: string) => {
    switch (title) {
      case 'First Step':
        return <BookOpen size={16} />;
      case 'Code Warrior':
        return <Trophy size={16} />;
      case 'XP Tycoon':
        return <Zap size={16} />;
      case 'Hot Streak':
        return <Flame size={16} />;
      default:
        return <Award size={16} />;
    }
  };

  // Dynamic Milestone calculation based on current level
  const userXp = profile?.xp ?? 0;
  let nextLevelName = 'Intermediate';
  let minMilestoneXp = 0;
  let maxMilestoneXp = 500;
  
  if (currentLevel === 'Beginner') {
    nextLevelName = 'Intermediate';
    minMilestoneXp = 0;
    maxMilestoneXp = 500;
  } else if (currentLevel === 'Intermediate') {
    nextLevelName = 'Advanced';
    minMilestoneXp = 500;
    maxMilestoneXp = 2000;
  } else if (currentLevel === 'Advanced') {
    nextLevelName = 'Expert';
    minMilestoneXp = 2000;
    maxMilestoneXp = 5000;
  } else if (currentLevel === 'Expert') {
    nextLevelName = 'Master';
    minMilestoneXp = 5000;
    maxMilestoneXp = 10000;
  } else {
    nextLevelName = 'Max Level';
    minMilestoneXp = 10000;
    maxMilestoneXp = 10000;
  }

  const isMaxLevel = currentLevel === 'Master' || userXp >= 10000;
  const remainingXp = isMaxLevel ? 0 : maxMilestoneXp - userXp;
  const milestoneProgressPercent = isMaxLevel 
    ? 100 
    : Math.min(Math.max(((userXp - minMilestoneXp) / (maxMilestoneXp - minMilestoneXp)) * 100, 0), 100);

  return (
    <div className="w-full space-y-6">
      {/* Cover Profile Card */}
      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
          {/* Avatar */}
          <div className="relative">
            <Avatar
              url={profile?.avatarUrl}
              username={profile?.username}
              size={96}
              className="border-4 border-slate-800 shadow-xl bg-slate-950"
            />
            <span className={`absolute -bottom-1 -right-1 px-2.5 py-0.5 rounded-full border text-xs font-bold bg-slate-950 ${levelStyle.split(' ').slice(2).join(' ')}`}>
              {currentLevel}
            </span>
          </div>

          {/* User details */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-col md:flex-row md:items-center gap-3 justify-center md:justify-start">
              <h1 className="text-2xl font-bold text-white">
                {profile?.firstName || profile?.lastName
                  ? `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim()
                  : profile?.username ?? user?.username ?? 'Coder'}
              </h1>
              <span className="text-slate-500 text-sm hidden md:inline">·</span>
              <span className="text-slate-400 font-medium text-sm">@{profile?.username}</span>
            </div>

            <p className="text-slate-300 text-sm max-w-xl italic">
              {profile?.bio || "This coder hasn't written a bio yet."}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Mail size={14} className="text-slate-500" />
                {profile?.email ?? user?.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-slate-500" />
                Joined June 2026
              </span>
            </div>
          </div>

          {/* Edit Settings Button */}
          <Link
            to="/settings"
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition-colors shadow-sm self-center md:self-start"
          >
            <Settings size={14} />
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700/60 transition-all">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center mb-3">
            <Flame size={16} className="text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-white">{dashboardData ? `${dashboardData.currentStreak} Days` : '0 Days'}</p>
          <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Current Streak</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700/60 transition-all">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-3">
            <Zap size={16} className="text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-white">{profile?.xp ?? 0}</p>
          <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Total XP</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700/60 transition-all">
          <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center mb-3">
            <Trophy size={16} className="text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white">{profile?.problemsSolved ?? 0}</p>
          <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Solved Problems</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700/60 transition-all">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3">
            <Target size={16} className="text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-white">
            {profile?.accuracy ? `${Math.round(profile.accuracy * 100) / 100}%` : '0%'}
          </p>
          <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Accuracy Rate</p>
        </div>
      </div>

      {/* Domain Mastery Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Award size={18} className="text-[#8a3ffc]" />
            Skill Domain Mastery
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Your solved problems distribution by category domain</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Coding Problems Domain */}
          <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-4 flex items-center gap-4 hover:border-[#8a3ffc]/30 hover:bg-slate-950/60 transition-all duration-300">
            <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" fill="none" stroke="#1E293B" strokeWidth="6" />
                <circle
                  cx="40" cy="40" r="32"
                  fill="none"
                  stroke="#8a3ffc"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 32}`}
                  strokeDashoffset={`${2 * Math.PI * 32 * (1 - categoryStats.coding.pct / 100)}`}
                  className="transition-all duration-1000"
                />
              </svg>
              <span className="absolute text-xs font-extrabold text-slate-100">{categoryStats.coding.pct}%</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200 uppercase tracking-wider">Coding Problems</p>
              <p className="text-sm font-semibold text-slate-400 mt-1">
                Solved: <span className="font-extrabold text-slate-200">{categoryStats.coding.solved}</span> / {categoryStats.coding.total}
              </p>
            </div>
          </div>

          {/* SQL / Database Domain */}
          <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-4 flex items-center gap-4 hover:border-indigo-500/30 hover:bg-slate-950/60 transition-all duration-300">
            <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" fill="none" stroke="#1E293B" strokeWidth="6" />
                <circle
                  cx="40" cy="40" r="32"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 32}`}
                  strokeDashoffset={`${2 * Math.PI * 32 * (1 - categoryStats.sql.pct / 100)}`}
                  className="transition-all duration-1000"
                />
              </svg>
              <span className="absolute text-xs font-extrabold text-slate-100">{categoryStats.sql.pct}%</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200 uppercase tracking-wider">SQL & Databases</p>
              <p className="text-sm font-semibold text-slate-400 mt-1">
                Solved: <span className="font-extrabold text-slate-200">{categoryStats.sql.solved}</span> / {categoryStats.sql.total}
              </p>
            </div>
          </div>

          {/* HTML & CSS Domain */}
          <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-4 flex items-center gap-4 hover:border-pink-500/30 hover:bg-slate-950/60 transition-all duration-300">
            <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" fill="none" stroke="#1E293B" strokeWidth="6" />
                <circle
                  cx="40" cy="40" r="32"
                  fill="none"
                  stroke="#ec4899"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 32}`}
                  strokeDashoffset={`${2 * Math.PI * 32 * (1 - categoryStats.htmlcss.pct / 100)}`}
                  className="transition-all duration-1000"
                />
              </svg>
              <span className="absolute text-xs font-extrabold text-slate-100">{categoryStats.htmlcss.pct}%</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200 uppercase tracking-wider">HTML & CSS</p>
              <p className="text-sm font-semibold text-slate-400 mt-1">
                Solved: <span className="font-extrabold text-slate-200">{categoryStats.htmlcss.solved}</span> / {categoryStats.htmlcss.total}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Achievements Card */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Award size={18} className="text-indigo-400" />
            Achievements & Badges
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {achievements.map((ach) => {
              const borderStyle = ach.unlocked
                ? 'border-indigo-500/30 bg-indigo-500/5 hover:border-indigo-500/50'
                : 'border-slate-800 bg-slate-900/30 opacity-60';
              const iconColor = ach.unlocked ? 'text-indigo-400' : 'text-slate-500';
              const iconBg = ach.unlocked ? 'bg-indigo-500/10' : 'bg-slate-800/40';

              return (
                <div
                  key={ach.title}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all ${borderStyle}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${iconBg} ${iconColor}`}>
                    {getAchievementIcon(ach.title)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-200">{ach.title}</p>
                      {ach.unlocked ? (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                          Unlocked
                        </span>
                      ) : (
                        <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">
                          Locked
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 leading-normal mt-0.5 mb-1.5">{ach.desc}</p>
                    <span className="text-[10px] text-slate-500 font-semibold bg-slate-950 px-2 py-0.5 rounded">
                      Progress: {ach.progress}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Skill Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Zap size={18} className="text-amber-400" />
            Level Milestone
          </h2>

          <div className="space-y-4">
            <div className="text-center py-2">
              <p className="text-xs text-slate-400">
                {isMaxLevel ? 'All Milestones Completed' : `Remaining to ${nextLevelName}`}
              </p>
              <p className="text-3xl font-extrabold text-white mt-1">
                {isMaxLevel ? (
                  <span className="text-2xl text-amber-400">Master Coder</span>
                ) : (
                  <>
                    {remainingXp} <span className="text-sm font-normal text-slate-500">XP</span>
                  </>
                )}
              </p>
            </div>

            <div className="space-y-2">
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                  style={{ width: `${milestoneProgressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>{minMilestoneXp} XP</span>
                <span>{maxMilestoneXp} XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bookmarked Items Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <Bookmark size={18} className="text-amber-500" />
          Saved Bookmarks
        </h2>
        {bookmarks.length === 0 ? (
          <p className="text-xs text-slate-500">You haven't bookmarked any questions or coding problems yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookmarks.map((bm) => (
              <div
                key={bm.id}
                onClick={() => {
                  if (bm.type === 'CODING') {
                    navigate(`/problems/${bm.targetId}`);
                  } else {
                    navigate(`/learn/topic/${bm.targetId}`);
                  }
                }}
                className="p-3.5 bg-slate-950/40 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-950/80 transition-all rounded-xl cursor-pointer flex items-start justify-between group"
              >
                <div className="space-y-1">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                    bm.type === 'CODING'
                      ? 'bg-indigo-500/10 border-indigo-500/25 text-indigo-400'
                      : 'bg-pink-500/10 border-pink-500/25 text-pink-400'
                  }`}>
                    {bm.type}
                  </span>
                  <h3 className="text-xs font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors pt-1.5">
                    {bm.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{bm.description.replace(/[#*`]/g, '')}</p>
                </div>
                <ArrowRight size={14} className="text-slate-500 group-hover:text-indigo-400 transition-all mt-1" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
