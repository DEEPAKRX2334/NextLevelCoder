import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { CodingProblem } from '../types';
import {
  Code2,
  Search,
  ArrowRight,
  Sparkles,
  Lock,
  CheckCircle2,
  Hash,
  Type,
  Layers,
  LayoutGrid,
  Database,
} from 'lucide-react';

const categoryConfig: Record<
  string,
  { label: string; icon: React.ReactNode; color: string; bg: string }
> = {
  Digits: {
    label: 'Numbers',
    icon: <Hash size={16} />,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10 border-indigo-500/20',
  },
  String: {
    label: 'Strings',
    icon: <Type size={16} />,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
  },
  Array: {
    label: 'Arrays',
    icon: <Layers size={16} />,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
  },
  Pattern: {
    label: 'Patterns',
    icon: <LayoutGrid size={16} />,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/20',
  },
  SQL: {
    label: 'SQL / Databases',
    icon: <Database size={16} />,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/20',
  },
  'HTML & CSS': {
    label: 'HTML & CSS',
    icon: <LayoutGrid size={16} />,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10 border-pink-500/20',
  },
};

const Problems: React.FC = () => {
  const [problems, setProblems] = useState<CodingProblem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<CodingProblem[]>([]);
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [mainTab, setMainTab] = useState<'coding' | 'htmlcss' | 'sql'>('coding');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await api.get<CodingProblem[]>('/problems');
        setProblems(response.data);
        setFilteredProblems(response.data);
      } catch (err) {
        console.error('Failed to fetch coding problems:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  useEffect(() => {
    setCategoryFilter('All');
  }, [mainTab]);

  useEffect(() => {
    let result = problems;

    // First filter by Main Tab
    if (mainTab === 'coding') {
      result = result.filter((p) => 
        p.category !== 'SQL' && p.category !== 'HTML & CSS'
      );
    } else if (mainTab === 'htmlcss') {
      result = result.filter((p) => p.category === 'HTML & CSS');
    } else if (mainTab === 'sql') {
      result = result.filter((p) => p.category === 'SQL');
    }

    if (search.trim() !== '') {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (difficultyFilter !== 'All') {
      result = result.filter((p) => p.difficulty === difficultyFilter);
    }

    if (mainTab === 'coding' && categoryFilter !== 'All') {
      result = result.filter((p) => p.category === categoryFilter);
    }

    setFilteredProblems(result);
  }, [search, difficultyFilter, categoryFilter, mainTab, problems]);

  const difficultyConfig = {
    Easy: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    Medium: { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    Hard: { color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
  };

  const activeTabProblems = problems.filter((p) => {
    if (mainTab === 'coding') {
      return p.category !== 'SQL' && p.category !== 'HTML & CSS';
    } else if (mainTab === 'htmlcss') {
      return p.category === 'HTML & CSS';
    } else if (mainTab === 'sql') {
      return p.category === 'SQL';
    }
    return false;
  });

  const totalInTab = activeTabProblems.length;
  const solvedInTab = activeTabProblems.filter((p) => p.solved).length;
  const progressPercent = totalInTab > 0 ? Math.round((solvedInTab / totalInTab) * 100) : 0;

  return (
    <div className="space-y-6 w-full">
      {/* Header Banner */}
      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="text-indigo-400" size={20} />
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Coding Practice</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-100">Interactive Coding Challenges</h1>
        <p className="text-slate-400 text-sm mt-1 max-w-xl">
          Sharpen your coding skills in Java, Web Design, and SQL. Choose a problem below, write your solution, and verify against test cases.
        </p>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex border-b border-slate-800 gap-6">
        {[
          { key: 'coding', label: 'Coding Problems', icon: <Code2 size={16} /> },
          { key: 'htmlcss', label: 'HTML & CSS', icon: <LayoutGrid size={16} /> },
          { key: 'sql', label: 'SQL / Databases', icon: <Database size={16} /> },
        ].map((tab) => {
          const isActive = mainTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setMainTab(tab.key as any)}
              className={`flex items-center gap-2 pb-3 text-sm font-semibold transition-all border-b-2 -mb-px cursor-pointer ${
                isActive
                  ? 'border-indigo-500 text-slate-100'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Horizontal Filters and Progress Dashboard Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
              <Search size={14} />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search problems..."
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Solved Progress Bar */}
          <div className="flex items-center gap-3 flex-1 min-w-[240px] max-w-sm">
            <div className="flex-shrink-0">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Solved</span>
              <span className="text-emerald-400 text-xs font-bold">{solvedInTab} / {totalInTab}</span>
            </div>
            <div className="flex-1 h-2 bg-slate-950 rounded-full border border-slate-800 overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Difficulty Filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {['All', 'Easy', 'Medium', 'Hard'].map((diff) => {
              const isActive = difficultyFilter === diff;
              const dotColor = diff === 'Easy' ? 'bg-emerald-400' : diff === 'Medium' ? 'bg-amber-400' : diff === 'Hard' ? 'bg-rose-400' : 'bg-indigo-400';
              return (
                <button
                  key={diff}
                  onClick={() => setDifficultyFilter(diff)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-500/15 border-indigo-500 text-indigo-400 font-bold'
                      : 'bg-slate-950/40 border-slate-800/60 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                  {diff}
                </button>
              );
            })}
          </div>

          {/* Categories Filter (Only when mainTab is coding) */}
          {mainTab === 'coding' && (
            <div className="flex gap-1 overflow-x-auto scrollbar-none max-w-full">
              {[
                { key: 'All', label: 'All', icon: <Code2 size={12} /> },
                { key: 'Digits', label: 'Numbers', icon: <Hash size={12} /> },
                { key: 'String', label: 'Strings', icon: <Type size={12} /> },
                { key: 'Array', label: 'Arrays', icon: <Layers size={12} /> },
                { key: 'Pattern', label: 'Patterns', icon: <LayoutGrid size={12} /> },
              ].map((cat) => {
                const isActive = categoryFilter === cat.key;
                const count = cat.key === 'All'
                  ? problems.filter((p) => p.category !== 'SQL' && p.category !== 'HTML & CSS').length
                  : problems.filter((p) => p.category === cat.key).length;

                return (
                  <button
                    key={cat.key}
                    onClick={() => setCategoryFilter(cat.key)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-indigo-500/15 border-indigo-500 text-indigo-400 font-bold'
                        : 'bg-slate-950/40 border-slate-800/60 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {cat.icon}
                    {cat.label}
                    <span className={`text-[9px] px-1 rounded font-bold ${
                      isActive ? 'bg-indigo-500/30 text-indigo-300' : 'bg-slate-950/60 text-slate-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Clear Filters Indicator */}
        {(search || difficultyFilter !== 'All' || categoryFilter !== 'All') && (
          <div className="flex justify-end pt-2 border-t border-slate-800 mt-3">
            <button
              onClick={() => {
                setSearch('');
                setDifficultyFilter('All');
                setCategoryFilter('All');
              }}
              className="text-[10px] font-bold text-slate-500 hover:text-indigo-400 transition-colors uppercase tracking-wider py-1 cursor-pointer"
            >
              Clear Active Filters
            </button>
          </div>
        )}
      </div>

      {/* Problem Cards List (Full width) */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/40 border border-slate-800 rounded-2xl">
            <Code2 className="mx-auto text-slate-600 mb-3" size={32} />
            <p className="text-slate-400 text-sm">No coding problems found matching the criteria.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(
              filteredProblems.reduce<Record<string, CodingProblem[]>>((groups, prob) => {
                const cat = prob.category || 'Digits';
                if (!groups[cat]) groups[cat] = [];
                groups[cat].push(prob);
                return groups;
              }, {})
            ).sort(([a], [b]) => {
              const order = ['Digits', 'String', 'Array', 'Pattern', 'HTML & CSS', 'SQL'];
              return order.indexOf(a) - order.indexOf(b);
            }).map(([catKey, catProblems]) => {
              const config = categoryConfig[catKey] || {
                label: 'General',
                icon: <Code2 size={16} />,
                color: 'text-indigo-400',
                bg: 'bg-indigo-500/10 border-indigo-500/20',
              };
              const solvedCount = catProblems.filter(p => p.solved).length;

              return (
                <div key={catKey} className="space-y-3">
                  {/* Category Header */}
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg border ${config.bg} ${config.color}`}>
                        {config.icon}
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                          {config.label}
                        </h2>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {solvedCount} / {catProblems.length} Solved
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Problem Cards in Category */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800">
                    {[...catProblems]
                      .sort((a, b) => {
                        if (a.solved && !b.solved) return 1;
                        if (!a.solved && b.solved) return -1;
                        return 0;
                      })
                      .map((prob) => {
                        const conf = difficultyConfig[prob.difficulty] || difficultyConfig.Easy;
                        const xpReward = prob.difficulty === 'Hard' ? 150 : prob.difficulty === 'Medium' ? 100 : 50;
                        const isUnlocked = prob.unlocked !== false;
                        const isSolved = !!prob.solved;

                        return (
                          <div
                            key={prob.id}
                            onClick={() => isUnlocked && navigate(`/problems/${prob.id}`)}
                            className={`flex items-center justify-between p-4 transition-colors ${
                              isUnlocked 
                                ? 'hover:bg-slate-800/40 cursor-pointer group' 
                                : 'opacity-55 cursor-not-allowed bg-slate-950/20'
                            }`}
                          >
                            <div className="flex items-center gap-4 min-w-0">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                                !isUnlocked 
                                  ? 'bg-slate-950 text-slate-600'
                                  : isSolved
                                    ? 'bg-emerald-500/10 text-emerald-400'
                                    : 'bg-slate-800/60 group-hover:bg-indigo-500/15 text-slate-400 group-hover:text-indigo-400'
                              }`}>
                                {isSolved ? <CheckCircle2 size={18} /> : <Code2 size={18} />}
                              </div>
                              <div className="min-w-0">
                                <p className={`text-sm font-semibold truncate ${
                                  isUnlocked ? 'text-slate-200 group-hover:text-indigo-400' : 'text-slate-500'
                                }`}>
                                  {prob.title}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${conf.bg} ${conf.color}`}>
                                    {prob.difficulty}
                                  </span>
                                  <span className="text-[10px] text-slate-500 font-medium">+{xpReward} XP</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              {!isUnlocked ? (
                                <div className="h-8 w-8 rounded-lg bg-slate-950 border border-slate-800/60 flex items-center justify-center text-slate-600 shadow-sm">
                                  <Lock size={14} />
                                </div>
                              ) : (
                                <button className="h-8 w-8 rounded-lg bg-slate-800 border border-slate-700/60 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:border-indigo-500 group-hover:text-white transition-all shadow-sm cursor-pointer">
                                  <ArrowRight size={14} />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Problems;
