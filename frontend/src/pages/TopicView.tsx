import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import type { Question } from '../types';
import { renderMarkdown } from '../utils/markdown';
import {
  ChevronLeft,
  BookOpen,
  Lightbulb,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Send,
  Sparkles,
  Trophy,
  RotateCcw,
  Award,
  ArrowRight,
  Bookmark,
} from 'lucide-react';

interface TopicDetail {
  id: number;
  courseId: number;
  title: string;
  concept: string;
  examples: string;
  notes: string;
  hints: string;
  solutions: string;
  sequenceOrder: number;
}

const parseOptions = (optionsStr?: string): string[] => {
  if (!optionsStr) return [];
  try {
    return JSON.parse(optionsStr);
  } catch (e) {
    console.error('Failed to parse options JSON:', e);
    return [];
  }
};

const triggerConfetti = () => {
  const colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'];
  const count = 80;
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100vw';
  container.style.height = '100vh';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '9999';
  document.body.appendChild(container);

  const particles: Array<{
    el: HTMLDivElement;
    x: number;
    y: number;
    vx: number;
    vy: number;
    rotation: number;
    rotationSpeed: number;
    opacity: number;
  }> = [];

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.style.position = 'absolute';
    el.style.width = `${Math.random() * 8 + 6}px`;
    el.style.height = `${Math.random() * 8 + 6}px`;
    el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    el.style.borderRadius = Math.random() > 0.5 ? '50%' : '0%';
    container.appendChild(el);

    particles.push({
      el,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2 - 100,
      vx: (Math.random() - 0.5) * 15,
      vy: (Math.random() - 0.7) * 15 - 5,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      opacity: 1,
    });
  }

  let start: number | null = null;
  const animate = (timestamp: number) => {
    if (!start) start = timestamp;
    const elapsed = timestamp - start;

    let active = false;
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.4; // gravity
      p.vx *= 0.98; // resistance
      p.rotation += p.rotationSpeed;
      p.opacity = Math.max(0, 1 - elapsed / 1500);

      p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) rotate(${p.rotation}deg)`;
      p.el.style.opacity = p.opacity.toString();

      if (p.opacity > 0 && p.y < window.innerHeight) {
        active = true;
      }
    });

    if (active && elapsed < 1500) {
      requestAnimationFrame(animate);
    } else {
      container.remove();
    }
  };

  requestAnimationFrame(animate);
};

const TopicView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const { addToast } = useToast();

  const [topic, setTopic] = useState<TopicDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'concept' | 'examples' | 'notes' | 'personalnotes' | 'quiz'>('concept');
  const [nextTopicId, setNextTopicId] = useState<number | null>(null);

  // Personal Notes states
  const [noteText, setNoteText] = useState('');
  const [noteLoading, setNoteLoading] = useState(false);
  const [noteSavingStatus, setNoteSavingStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [notePreviewMode, setNotePreviewMode] = useState(false);

  // Quiz states
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submissionResults, setSubmissionResults] = useState<Record<number, { correct: boolean; correctAnswer?: string; xpEarned?: number }>>({});
  const [submittingMap, setSubmittingMap] = useState<Record<number, boolean>>({});
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [shakeQuestionId, setShakeQuestionId] = useState<number | null>(null);
  const [scoreCount, setScoreCount] = useState(0);
  const [firstAttempts, setFirstAttempts] = useState<Record<number, boolean>>({});
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Record<number, boolean>>({});

  const handleToggleQuestionBookmark = async (questionId: number) => {
    try {
      const res = await api.post(`/bookmarks/question/${questionId}`);
      const isBookmarked = res.data.bookmarked;
      setBookmarkedQuestions((prev) => ({ ...prev, [questionId]: isBookmarked }));
      addToast(isBookmarked ? 'Question bookmarked!' : 'Bookmark removed.', 'success');
    } catch (err) {
      console.error('Failed to toggle question bookmark:', err);
      addToast('Failed to toggle bookmark', 'error');
    }
  };

  useEffect(() => {
    const fetchTopicDetails = async () => {
      setLoading(true);
      // Reset states immediately when navigating to new topic
      setQuestions([]);
      setAnswers({});
      setSubmissionResults({});
      setSubmittingMap({});
      setActiveQuestionIndex(0);
      setShakeQuestionId(null);
      setScoreCount(0);
      setFirstAttempts({});
      setActiveTab('concept');
      setNextTopicId(null);
      setNoteText('');
      setNoteSavingStatus('idle');
      setNotePreviewMode(false);

      try {
        const response = await api.get<TopicDetail>(`/courses/topics/${id}`);
        setTopic(response.data);
        
        // Fetch course details to calculate next topic ID
        const courseResponse = await api.get<{ topics: { id: number; sequenceOrder: number }[] }>(`/courses/${response.data.courseId}`);
        const sortedTopics = courseResponse.data.topics.sort((a, b) => a.sequenceOrder - b.sequenceOrder);
        const currentIndex = sortedTopics.findIndex(t => t.id === response.data.id);
        if (currentIndex !== -1 && currentIndex < sortedTopics.length - 1) {
          setNextTopicId(sortedTopics[currentIndex + 1].id);
        } else {
          setNextTopicId(null);
        }
      } catch (err) {
        console.error('Failed to load topic details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopicDetails();
  }, [id]);

  // Fetch personal notes when activeTab changes to 'personalnotes'
  useEffect(() => {
    if (activeTab === 'personalnotes' && topic) {
      const fetchNotes = async () => {
        setNoteLoading(true);
        try {
          const res = await api.get(`/notes/topic/${topic.id}`);
          setNoteText(res.data.content || '');
          setNoteSavingStatus('saved');
        } catch (err) {
          console.error('Failed to fetch study notes:', err);
          setNoteSavingStatus('error');
        } finally {
          setNoteLoading(false);
        }
      };
      fetchNotes();
    }
  }, [activeTab, topic?.id]);

  // Debounced auto-save effect
  useEffect(() => {
    if (noteSavingStatus !== 'saving' || !topic) return;

    const delayDebounceFn = setTimeout(async () => {
      try {
        await api.post('/notes', {
          topicId: topic.id,
          content: noteText
        });
        setNoteSavingStatus('saved');
      } catch (err) {
        console.error('Failed to auto-save notes:', err);
        setNoteSavingStatus('error');
      }
    }, 1500);

    return () => clearTimeout(delayDebounceFn);
  }, [noteText, noteSavingStatus, topic?.id]);

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNoteText(e.target.value);
    setNoteSavingStatus('saving');
  };

  useEffect(() => {
    if (activeTab === 'quiz' && topic && questions.length === 0) {
      const fetchQuestions = async () => {
        setQuizLoading(true);
        try {
          const [qRes, bRes] = await Promise.all([
            api.get<Question[]>(`/courses/topics/${topic.id}/questions`),
            api.get<{ type: string; targetId: number }[]>('/bookmarks')
          ]);
          setQuestions(qRes.data);

          // Find bookmarked questions
          const quizBookmarks: Record<number, boolean> = {};
          bRes.data.forEach((b) => {
            if (b.type === 'QUIZ') {
              quizBookmarks[b.targetId] = true;
            }
          });
          setBookmarkedQuestions(quizBookmarks);

          // Pre-populate solved questions so state persists across page refresh
          const solvedMap: Record<number, { correct: boolean; xpEarned?: number }> = {};
          const attemptsMap: Record<number, boolean> = {};
          let solvedCount = 0;
          
          qRes.data.forEach((q) => {
            if (q.correct) {
              solvedMap[q.id] = { correct: true, xpEarned: 0 };
              attemptsMap[q.id] = true;
              solvedCount++;
            }
          });
          setSubmissionResults((prev) => ({ ...prev, ...solvedMap }));
          setFirstAttempts((prev) => ({ ...prev, ...attemptsMap }));
          setScoreCount(solvedCount);

          // Set active question index to the first unsolved question
          const firstUnsolved = qRes.data.findIndex((q) => !q.correct);
          if (firstUnsolved !== -1) {
            setActiveQuestionIndex(firstUnsolved);
          } else {
            setActiveQuestionIndex(0);
          }
        } catch (err) {
          console.error('Failed to load quiz questions:', err);
        } finally {
          setQuizLoading(false);
        }
      };
      fetchQuestions();
    }
  }, [activeTab, topic, questions.length]);

  const handleSelectOption = (questionId: number, option: string) => {
    // Prevent changing answer if already submitted successfully
    if (submissionResults[questionId]?.correct) return;
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleTextChange = (questionId: number, val: string) => {
    if (submissionResults[questionId]?.correct) return;
    setAnswers((prev) => ({ ...prev, [questionId]: val }));
  };

  const handleQuestionSubmit = async (questionId: number) => {
    const userAnswer = answers[questionId];
    if (!userAnswer || userAnswer.trim() === '') return;

    setSubmittingMap((prev) => ({ ...prev, [questionId]: true }));
    try {
      const response = await api.post(`/courses/topics/questions/${questionId}/submit`, {
        answer: userAnswer,
      });

      const data = response.data;

      setSubmissionResults((prev) => ({
        ...prev,
        [questionId]: data,
      }));

      // Track first attempts for scoring
      const isFirstAttempt = !firstAttempts[questionId];
      if (isFirstAttempt) {
        setFirstAttempts((prev) => ({ ...prev, [questionId]: true }));
        if (data.correct) {
          setScoreCount((prev) => prev + 1);
        }
      }

      if (data.correct) {
        addToast('Correct Answer! Well done.', 'success');
        triggerConfetti();
        refreshProfile();
      } else {
        addToast('Incorrect. Try again!', 'error');
        setShakeQuestionId(questionId);
        setTimeout(() => {
          setShakeQuestionId(null);
        }, 500);
      }
    } catch (err) {
      console.error('Failed to submit quiz answer:', err);
    } finally {
      setSubmittingMap((prev) => ({ ...prev, [questionId]: false }));
    }
  };

  const handleResetQuiz = () => {
    setAnswers({});
    setSubmissionResults({});
    setScoreCount(0);
    setFirstAttempts({});
    setActiveQuestionIndex(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="text-center py-12">
        <p className="text-white">Topic not found.</p>
        <button
          onClick={() => navigate('/learn')}
          className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header Bar */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
        <button
          onClick={() => navigate(`/learn/course/${topic.courseId}`)}
          className="p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <div>
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            {topic.title}
          </h1>
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
            Lesson {topic.sequenceOrder}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-900 border border-slate-800 rounded-2xl p-1 max-w-lg overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('concept')}
          className={`flex-1 py-2 px-4 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'concept' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Explanation
        </button>
        <button
          onClick={() => setActiveTab('examples')}
          className={`flex-1 py-2 px-4 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'examples' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Code Examples
        </button>
        {topic.notes && (
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex-1 py-2 px-4 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'notes' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Notes & Hints
          </button>
        )}
        <button
          onClick={() => setActiveTab('personalnotes')}
          className={`flex-1 py-2 px-4 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 justify-center ${
            activeTab === 'personalnotes' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          My Notes
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 py-2 px-4 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 justify-center ${
            activeTab === 'quiz' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles size={12} className={activeTab === 'quiz' ? 'text-amber-300 animate-pulse' : 'text-slate-500'} />
          Practice Quiz
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 min-h-[300px]">
        {activeTab === 'concept' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen size={18} className="text-indigo-400" />
              Core Concept
            </h2>
            <div className="text-slate-300 description-container">
              {renderMarkdown(topic.concept)}
            </div>
          </div>
        )}

        {activeTab === 'examples' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen size={18} className="text-emerald-400" />
              Code Walkthrough
            </h2>
            <pre className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
              {topic.examples || '// No code examples provided for this lesson.'}
            </pre>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-5">
            {topic.notes && (
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Lightbulb size={16} className="text-amber-400" />
                  Key Takeaways
                </h3>
                <div className="text-slate-300 description-container">
                  {renderMarkdown(topic.notes)}
                </div>
              </div>
            )}
            {topic.hints && (
              <div className="space-y-2 pt-4 border-t border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Lightbulb size={16} className="text-indigo-400" />
                  Interview Tip
                </h3>
                <div className="text-slate-300 description-container">
                  {renderMarkdown(topic.hints)}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'personalnotes' && (
          <div className="space-y-4 flex flex-col min-h-[350px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-shrink-0">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen size={18} className="text-indigo-400" />
                My Study Notes
              </h2>
              
              <div className="flex items-center gap-4">
                {noteSavingStatus === 'saving' && (
                  <span className="text-[10px] font-semibold text-amber-400 flex items-center gap-1 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    Saving...
                  </span>
                )}
                {noteSavingStatus === 'saved' && (
                  <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    Saved to Cloud
                  </span>
                )}
                {noteSavingStatus === 'error' && (
                  <span className="text-[10px] font-semibold text-rose-400 flex items-center gap-1">
                    <AlertCircle size={12} />
                    Auto-save failed
                  </span>
                )}

                <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-0.5">
                  <button
                    onClick={() => setNotePreviewMode(false)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      !notePreviewMode ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setNotePreviewMode(true)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      notePreviewMode ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Preview
                  </button>
                </div>
              </div>
            </div>

            {noteLoading ? (
              <div className="flex-1 flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : notePreviewMode ? (
              <div className="flex-1 bg-slate-950/30 border border-slate-800 rounded-2xl p-4 min-h-[220px] text-slate-350 overflow-y-auto description-container leading-relaxed text-xs">
                {noteText.trim() ? renderMarkdown(noteText) : <span className="text-slate-500 italic">No notes written yet. Switch to "Edit" tab to start writing. Markdown is supported!</span>}
              </div>
            ) : (
              <div className="flex-1 flex flex-col gap-1.5 min-h-[220px]">
                <textarea
                  value={noteText}
                  onChange={handleNoteChange}
                  placeholder="Write your study notes for this lesson here... Markdown formatting is fully supported (e.g. # Header, **bold**, *italic*, - list, `code`). Notes are automatically saved to your profile in the cloud."
                  className="w-full flex-1 min-h-[200px] bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none font-mono text-xs leading-relaxed transition-all"
                />
                <span className="text-[9px] text-slate-500 font-semibold self-end">Markdown supported • Auto-saves as you type</span>
              </div>
            )}
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <HelpCircle size={18} className="text-violet-400" />
                Lesson Practice Quiz
              </h2>
              <span className="text-xs text-slate-500 font-medium">Test your understanding</span>
            </div>

            {quizLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-12 bg-slate-950/20 border border-slate-800/60 rounded-xl">
                <HelpCircle className="mx-auto text-slate-700 mb-2" size={28} />
                <p className="text-xs text-slate-500">No practice questions available for this lesson yet.</p>
              </div>
            ) : activeQuestionIndex === questions.length ? (
              /* Quiz Score Card Summary */
              <div className="space-y-6 py-4 text-center animate-fade-in">
                <div className="max-w-md mx-auto bg-slate-950/35 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                  {/* Decorative Glow */}
                  <div className="absolute -top-12 -left-12 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />

                  <Trophy className="mx-auto text-amber-400 mb-4 animate-bounce" size={48} />
                  <h3 className="text-xl font-bold text-white mb-1">Quiz Complete!</h3>
                  <p className="text-xs text-slate-400 mb-6 font-medium">Topic Lesson Evaluation Metrics</p>

                  {/* Radial Score Circle */}
                  <div className="relative w-36 h-36 flex items-center justify-center mx-auto mb-6">
                    <svg className="w-full h-full transform -rotate-90">
                      {/* Background circle */}
                      <circle
                        cx="72"
                        cy="72"
                        r="50"
                        className="stroke-slate-800"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      {/* Foreground circle with gradient/color transition */}
                      <circle
                        cx="72"
                        cy="72"
                        r="50"
                        className="stroke-indigo-500 transition-all duration-1000 ease-out"
                        strokeWidth="8"
                        strokeDasharray={2 * Math.PI * 50}
                        strokeDashoffset={
                          2 * Math.PI * 50 - (2 * Math.PI * 50 * (questions && questions.length > 0 && typeof scoreCount === 'number' && !isNaN(scoreCount) ? (scoreCount / questions.length) : 0))
                        }
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-2xl font-extrabold text-white">
                        {questions.length > 0 ? Math.round((scoreCount / questions.length) * 100) : 0}%
                      </span>
                      <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Accuracy</p>
                    </div>
                  </div>

                  {/* Details block */}
                  <div className="grid grid-cols-2 gap-4 border-y border-slate-800 py-4 mb-6">
                    <div>
                      <span className="text-xs text-slate-400 font-medium block">Correct Ratio</span>
                      <span className="text-base font-extrabold text-white">
                        {scoreCount} / {questions.length}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-medium block">XP Earned</span>
                      <span className="text-base font-extrabold text-indigo-400 flex items-center justify-center gap-1">
                        <Award size={16} />
                        +{questions.reduce((acc, q) => acc + (submissionResults[q.id]?.correct ? (q.xpReward || 10) : 0), 0)} XP
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveQuestionIndex(0)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-semibold rounded-xl text-slate-350 hover:text-white transition-all active:scale-95 cursor-pointer"
                    >
                      <HelpCircle size={14} />
                      Review Answers
                    </button>
                    <button
                      type="button"
                      onClick={handleResetQuiz}
                      className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 border text-xs font-semibold rounded-xl transition-all active:scale-95 cursor-pointer ${
                        nextTopicId
                          ? 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-350 hover:text-white'
                          : 'bg-indigo-600 border-indigo-500 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/10'
                      }`}
                    >
                      <RotateCcw size={14} />
                      Try Again
                    </button>
                    {nextTopicId && (
                      <button
                        type="button"
                        onClick={() => navigate(`/learn/topic/${nextTopicId}`)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold rounded-xl text-white transition-all shadow-md shadow-indigo-500/10 active:scale-95 cursor-pointer"
                      >
                        Next Module
                        <ArrowRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Progress bar header */}
                <div className="bg-slate-950/20 border border-slate-800/40 rounded-2xl p-4">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                      <Sparkles size={13} className="text-indigo-400" />
                      Question {activeQuestionIndex + 1} of {questions.length}
                    </span>
                    <span className="text-indigo-400 font-bold text-[11px]">
                      Score: {scoreCount} / {questions.length}
                    </span>
                    <span className="text-slate-500 font-medium">
                      {Math.round((activeQuestionIndex / questions.length) * 100)}% Completed
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${(activeQuestionIndex / questions.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Question Card */}
                {(() => {
                  const q = questions[activeQuestionIndex];
                  const opts = parseOptions(q.options);
                  const result = submissionResults[q.id];
                  const chosenVal = answers[q.id] || '';
                  const isSubmitting = submittingMap[q.id] || false;
                  const isSolved = result?.correct;

                  return (
                    <div
                      key={q.id}
                      className={`space-y-5 bg-slate-950/10 border border-slate-800 p-5 rounded-2xl transition-all ${
                        shakeQuestionId === q.id ? 'animate-shake' : ''
                      }`}
                    >
                      {/* Title & XP */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            Question {activeQuestionIndex + 1} • {q.type}
                            <button
                              type="button"
                              onClick={() => handleToggleQuestionBookmark(q.id)}
                              title={bookmarkedQuestions[q.id] ? "Remove bookmark" : "Bookmark question"}
                              className={`p-0.5 rounded transition-all cursor-pointer ${
                                bookmarkedQuestions[q.id]
                                  ? 'text-amber-500 hover:text-amber-400'
                                  : 'text-slate-500 hover:text-slate-400'
                              }`}
                            >
                              <Bookmark size={11} fill={bookmarkedQuestions[q.id] ? "currentColor" : "none"} />
                            </button>
                          </span>
                          <h3 className="text-sm font-semibold text-slate-200 leading-snug">
                            {q.description}
                          </h3>
                        </div>
                        <span className="text-[10px] font-bold bg-violet-500/10 border border-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full flex-shrink-0">
                          +{q.xpReward} XP
                        </span>
                      </div>

                      {/* Interactive Options Area */}
                      {q.type === 'MCQ' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                          {opts.map((opt) => {
                            const isSelected = chosenVal === opt;
                            const optStyle = isSelected
                              ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                              : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-950/80 hover:border-slate-700';

                            return (
                              <button
                                key={opt}
                                type="button"
                                disabled={isSolved}
                                onClick={() => handleSelectOption(q.id, opt)}
                                className={`px-4 py-3 rounded-xl border text-xs font-medium text-left transition-all relative ${optStyle} ${
                                  isSolved ? 'opacity-85' : 'cursor-pointer'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="pt-1">
                          <input
                            type="text"
                            disabled={isSolved}
                            value={chosenVal}
                            onChange={(e) => handleTextChange(q.id, e.target.value)}
                            placeholder="Type your answer here..."
                            className="w-full bg-slate-950 border border-slate-800 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          />
                        </div>
                      )}

                      {/* Action & Feedback Box */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                        {/* Status feedback */}
                        {result && (
                          <div
                            className={`flex items-center gap-2 text-xs font-semibold ${
                              result.correct ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {result.correct ? (
                              <>
                                <CheckCircle2 size={16} />
                                Correct! +{result.xpEarned} XP awarded.
                              </>
                            ) : (
                              <>
                                <AlertCircle size={16} />
                                Wrong answer. Correct: <span className="font-mono bg-slate-950 px-1.5 py-0.5 rounded text-white">{result.correctAnswer}</span>
                              </>
                            )}
                          </div>
                        )}
                        {!result && <div className="hidden sm:block" />}

                        {/* Submit Button */}
                        <button
                          type="button"
                          disabled={isSubmitting || isSolved || !chosenVal.trim()}
                          onClick={() => handleQuestionSubmit(q.id)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-850 disabled:text-slate-500 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 shadow-indigo-500/10 ml-auto cursor-pointer"
                        >
                          {isSubmitting ? (
                            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              <Send size={11} />
                              {isSolved ? 'Completed' : 'Submit Answer'}
                            </>
                          )}
                        </button>
                      </div>

                      {/* Stepper Navigation Buttons inside the card footer */}
                      <div className="flex items-center justify-between border-t border-slate-800/80 pt-4 mt-6">
                        <button
                          type="button"
                          disabled={activeQuestionIndex === 0}
                          onClick={() => setActiveQuestionIndex((prev) => prev - 1)}
                          className="px-4 py-2 bg-slate-950 border border-slate-800 text-slate-350 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-900 rounded-xl text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                        >
                          Previous
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveQuestionIndex((prev) => prev + 1)}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-500/10 active:scale-95 cursor-pointer animate-pulse"
                        >
                          {activeQuestionIndex === questions.length - 1 ? 'Finish & View Results' : 'Next Question'}
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="flex justify-between items-center pt-2">
        <button
          onClick={() => navigate(`/learn/course/${topic.courseId}`)}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition-colors shadow-sm"
        >
          Back to Curriculum
        </button>
        {nextTopicId && (
          <button
            onClick={() => navigate(`/learn/topic/${nextTopicId}`)}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
          >
            Next Module
            <ArrowRight size={12} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TopicView;
