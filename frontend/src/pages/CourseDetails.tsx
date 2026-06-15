import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, Play, Award, CheckCircle2 } from 'lucide-react';

interface TopicSummary {
  id: number;
  title: string;
  sequenceOrder: number;
  completed?: boolean;
}

interface CourseDetails {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  progress: number;
  topics: TopicSummary[];
}

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await api.get<CourseDetails>(`/courses/${id}`);
        setCourse(response.data);
      } catch (err) {
        console.error('Failed to load course details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-white">Course not found.</p>
        <button
          onClick={() => navigate('/learn')}
          className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  const colors: Record<string, string> = {
    Basic: 'from-emerald-500 to-teal-600 border-emerald-500/20 text-emerald-400',
    Medium: 'from-indigo-500 to-violet-600 border-indigo-500/20 text-indigo-400',
    Advanced: 'from-amber-500 to-orange-600 border-amber-500/20 text-amber-400',
  };

  const borderCol = colors[course.difficulty] || colors.Basic;

  return (
    <div className="w-full space-y-6">
      {/* Header Bar */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
        <button
          onClick={() => navigate('/learn')}
          className="p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <div>
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            {course.title}
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase bg-slate-950 ${borderCol.split(' ').slice(2).join(' ')}`}>
              {course.difficulty}
            </span>
          </h1>
        </div>
      </div>

      {/* Description */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
        <h2 className="text-xs font-semibold uppercase text-slate-500 tracking-wider">About this Course</h2>
        <p className="text-slate-300 text-sm leading-relaxed mt-2">{course.description}</p>
      </div>

      {/* Certificate claim box */}
      {course.progress === 100 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-transparent border border-amber-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-amber-500/5">
          <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Award size={24} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Course Completed!</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Congratulations, you solved all quizzes and mastered the syllabus for this course.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCertificate(true)}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-md shadow-amber-500/15 whitespace-nowrap"
          >
            Claim Certificate
          </button>
        </div>
      )}

      {showCertificate && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 print:p-0 print:bg-white print:backdrop-blur-none">
          <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-8 max-w-2xl w-full text-center relative overflow-hidden shadow-2xl flex flex-col items-center gap-6 print:border-0 print:bg-white print:shadow-none print:w-full print:max-w-none print:h-full print:justify-center">
            
            {/* Elegant Background Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none print:hidden" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none print:hidden" />
            
            {/* Header / Ribbon */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-lg text-slate-950 print:bg-amber-500">
              <Award size={32} strokeWidth={1.5} />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold tracking-[0.2em] text-amber-400 uppercase">
                Certificate of Completion
              </span>
              <h2 className="text-2xl font-extrabold text-white uppercase tracking-wider print:text-black">
                NextLevelCoder Mastery
              </h2>
            </div>

            <p className="text-slate-400 text-xs italic font-medium print:text-slate-600">
              This is proudly presented to
            </p>

            <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200 py-1 print:text-black print:bg-none">
              {profile?.firstName || profile?.lastName
                ? `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim()
                : profile?.username ?? user?.username ?? 'Coder'}
            </h3>

            <p className="text-slate-300 text-xs max-w-md leading-relaxed print:text-slate-700">
              for successfully mastering all topics, completing the interactive quiz evaluations, 
              and demonstrating coding proficiency in the course:
            </p>

            <h4 className="text-xl font-bold text-indigo-400 print:text-indigo-850">
              {course.title}
            </h4>

            {/* Signatures Row */}
            <div className="w-full grid grid-cols-2 gap-8 border-t border-slate-800/80 pt-6 mt-4 print:border-slate-300">
              <div className="space-y-1 text-left pl-6">
                <p className="text-[10px] font-semibold text-slate-500 uppercase">Verified Date</p>
                <p className="text-xs font-bold text-slate-300 print:text-black">
                  {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div className="space-y-1 text-right pr-6 flex flex-col items-end">
                <p className="text-[10px] font-semibold text-slate-500 uppercase">Issuer</p>
                <div className="font-serif italic text-sm text-amber-400 font-bold print:text-black">
                  NextLevelCoder Team
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-4 w-full print:hidden">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
              >
                Print Certificate
              </button>
              <button
                onClick={() => setShowCertificate(false)}
                className="py-2.5 px-5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all border border-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Syllabus / Topics List */}
      <div className="space-y-4">
        <h2 className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Course Syllabus</h2>

        {course.topics.length === 0 ? (
          <div className="text-center py-8 bg-slate-900/40 border border-slate-800 rounded-2xl">
            <p className="text-slate-500 text-sm">No topics seeded for this course yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {[...course.topics]
              .sort((a, b) => {
                if (a.completed && !b.completed) return 1;
                if (!a.completed && b.completed) return -1;
                return a.sequenceOrder - b.sequenceOrder;
              })
              .map((topic, index) => {
                const isCompleted = topic.completed;
              return (
                <div
                  key={topic.id}
                  onClick={() => navigate(`/learn/topic/${topic.id}`)}
                  className={`flex items-center justify-between p-4 bg-slate-900 border rounded-2xl hover:bg-slate-800/20 transition-all cursor-pointer group ${
                    isCompleted ? 'border-emerald-500/20 hover:border-emerald-500/40' : 'border-slate-800 hover:border-slate-700/60'
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-colors ${
                      isCompleted 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : 'bg-slate-800 text-indigo-400 group-hover:bg-indigo-500/10 group-hover:text-indigo-300'
                    }`}>
                      {isCompleted ? <CheckCircle2 size={14} /> : index + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-200 group-hover:text-white truncate">
                        {topic.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-500 font-medium">Lesson {topic.sequenceOrder}</span>
                        {isCompleted && (
                          <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/5 px-1.5 py-0.5 rounded border border-emerald-500/10">
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs font-semibold rounded-xl transition-all shadow-sm ${
                    isCompleted 
                      ? 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-700' 
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-indigo-600 hover:border-indigo-500 hover:text-white'
                  }`}>
                    {isCompleted ? (
                      <>
                        <Play size={10} />
                        Review Lesson
                      </>
                    ) : (
                      <>
                        <Play size={10} fill="currentColor" />
                        Start Lesson
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
