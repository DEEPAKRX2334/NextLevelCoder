import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  BookOpen,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Search,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';

interface TopicSummary {
  id: number;
  title: string;
  sequenceOrder: number;
  completed: boolean;
}

interface Course {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  lessonsCount: number;
  progress: number;
  topics: TopicSummary[];
}

const Learn: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [expandedCourseId, setExpandedCourseId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get<Course[]>('/courses');
        setCourses(response.data);
      } catch (err) {
        console.error('Failed to load courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const difficultyColors: Record<string, { badge: string; text: string; bg: string }> = {
    Basic: { badge: 'border-emerald-500/20 text-emerald-400 bg-emerald-500/10', text: 'text-emerald-400', bg: 'from-emerald-500/10 to-teal-600/5' },
    Medium: { badge: 'border-indigo-500/20 text-indigo-400 bg-indigo-500/10', text: 'text-indigo-400', bg: 'from-indigo-500/10 to-violet-600/5' },
    Advanced: { badge: 'border-amber-500/20 text-amber-400 bg-amber-500/10', text: 'text-amber-400', bg: 'from-amber-500/10 to-orange-600/5' },
  };

  const courseGradients: Record<string, string> = {
    'Java Fundamentals': 'from-emerald-500 to-teal-600',
    'HTML & CSS': 'from-blue-500 to-indigo-600',
    'JavaScript': 'from-purple-500 to-pink-600',
    'Data Structures & Algorithms': 'from-violet-500 to-fuchsia-600',
    'System Design': 'from-amber-500 to-orange-600',
  };

  const handleToggleExpand = (e: React.MouseEvent, courseId: number) => {
    e.stopPropagation();
    setExpandedCourseId(expandedCourseId === courseId ? null : courseId);
  };

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchesDiff = difficultyFilter === 'All' || c.difficulty === difficultyFilter;
    return matchesSearch && matchesDiff;
  });

  const renderCircularProgress = (progress: number) => {
    const radius = 18;
    const stroke = 3;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;
    const isCompleted = progress === 100;
    const colorClass = isCompleted ? 'text-emerald-400' : 'text-indigo-500';

    return (
      <div className="relative flex items-center justify-center w-10 h-10 flex-shrink-0">
        <svg className="w-10 h-10 transform -rotate-90">
          <circle
            className="stroke-slate-800"
            strokeWidth={stroke}
            fill="transparent"
            r={radius}
            cx="20"
            cy="20"
          />
          <circle
            className={`${colorClass} transition-all duration-500`}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx="20"
            cy="20"
          />
        </svg>
        {isCompleted ? (
          <CheckCircle2 size={11} className="absolute text-emerald-400 font-bold" />
        ) : (
          <span className="absolute text-[8px] font-extrabold text-slate-200">
            {progress}%
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header Banner */}
      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="text-violet-400" size={20} />
          <span className="text-xs font-bold uppercase tracking-wider text-violet-400">Curriculum Path</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white">Interactive Learning Paths</h1>
        <p className="text-slate-400 text-sm mt-1 max-w-xl">
          Progress from basic Java syntax to production-grade algorithms and web scale system design models.
        </p>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
            <Search size={15} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="w-full bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          {['All', 'Basic', 'Medium', 'Advanced'].map((diff) => (
            <button
              key={diff}
              onClick={() => setDifficultyFilter(diff)}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                difficultyFilter === diff
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/40 border border-slate-800 rounded-2xl">
          <BookOpen className="mx-auto text-slate-600 mb-3" size={32} />
          <p className="text-slate-400 text-sm">No interactive courses found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const colors = difficultyColors[course.difficulty] || difficultyColors.Basic;
            const grad = courseGradients[course.title] || 'from-indigo-500 to-violet-600';
            const hasStarted = course.progress > 0;
            const isCompleted = course.progress === 100;

            return (
              <div
                key={course.id}
                onClick={() => navigate(`/learn/course/${course.id}`)}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700/60 transition-all hover:-translate-y-0.5 cursor-pointer group flex flex-col justify-between relative overflow-hidden shadow-md"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-20 pointer-events-none`} />

                <div className="relative z-10 space-y-4">
                  {/* Top line layout: Icon and progress gauge */}
                  <div className="flex items-center justify-between">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center shadow-lg shadow-indigo-500/10`}>
                      <BookOpen size={16} className="text-white" />
                    </div>
                    {renderCircularProgress(course.progress)}
                  </div>

                  <div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${colors.badge}`}>
                      {course.difficulty}
                    </span>
                    <h2 className="text-sm font-bold text-white mt-2 group-hover:text-indigo-400 transition-colors leading-tight">
                      {course.title}
                    </h2>
                    <p className="text-slate-400 text-xs mt-1.5 leading-relaxed line-clamp-2">
                      {course.description}
                    </p>
                  </div>

                  {/* Accordion Expand Trigger */}
                  <div className="pt-1">
                    <button
                      onClick={(e) => handleToggleExpand(e, course.id)}
                      className="flex items-center gap-1 text-[9px] font-bold text-slate-500 hover:text-slate-350 transition-colors uppercase tracking-wider py-1 cursor-pointer"
                    >
                      Syllabus Preview ({course.lessonsCount} lessons)
                      <ChevronDown
                        size={12}
                        className={`transform transition-transform ${
                          expandedCourseId === course.id ? 'rotate-180 text-indigo-400' : ''
                        }`}
                      />
                    </button>

                    {expandedCourseId === course.id && (
                      <div
                        className="mt-3 pt-3 border-t border-slate-800/60 space-y-1.5 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {course.topics && course.topics.length > 0 ? (
                          course.topics.map((topic) => (
                            <div
                              key={topic.id}
                              onClick={() => navigate(`/learn/topic/${topic.id}`)}
                              className="flex items-center justify-between p-2 rounded-lg bg-slate-950/40 hover:bg-slate-950 border border-slate-900 hover:border-slate-800 transition-all cursor-pointer group/item"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="flex-shrink-0">
                                  {topic.completed ? (
                                    <CheckCircle2 size={13} className="text-emerald-400" />
                                  ) : (
                                    <div className="w-3.5 h-3.5 rounded-full border border-slate-800 flex items-center justify-center text-[8px] text-slate-500 font-bold group-hover/item:border-indigo-500 group-hover/item:text-indigo-400">
                                      {topic.sequenceOrder}
                                    </div>
                                  )}
                                </div>
                                <span className={`text-[10px] font-medium truncate ${
                                  topic.completed ? 'text-slate-500 line-through' : 'text-slate-300 group-hover/item:text-indigo-455'
                                }`}>
                                  {topic.title}
                                </span>
                              </div>
                              <ArrowRight size={10} className="text-slate-650 group-hover/item:text-indigo-400 group-hover/item:translate-x-0.5 transition-all opacity-0 group-hover/item:opacity-100" />
                            </div>
                          ))
                        ) : (
                          <div className="text-[10px] text-slate-500 italic py-1 pl-1">
                            No lessons available for this course yet.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between text-xs font-semibold text-slate-505 group-hover:text-slate-300 transition-colors">
                  <span className="flex items-center gap-1.5 text-[11px]">
                    <TrendingUp size={14} className={colors.text} />
                    {isCompleted ? 'Review Syllabus' : hasStarted ? 'Continue Path' : 'Start Path'}
                  </span>
                  <span className="p-1 rounded-lg bg-slate-800 border border-slate-700 group-hover:bg-indigo-600 group-hover:border-indigo-500 group-hover:text-white transition-all">
                    <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Learn;
