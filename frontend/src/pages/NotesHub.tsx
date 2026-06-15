import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { renderMarkdown } from '../utils/markdown';
import { useToast } from '../context/ToastContext';
import {
  NotebookPen,
  Search,
  Calendar,
  Trash2,
  Edit3,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

interface Note {
  id: number;
  topicId: number;
  topicTitle: string;
  courseId: number;
  courseTitle: string;
  content: string;
  updatedAt: string;
}

const NotesHub: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'recent' | 'topic-asc' | 'course-asc'>('recent');

  // Inline expansion tracking
  const [expandedNotes, setExpandedNotes] = useState<Record<number, boolean>>({});

  // Deletion confirm tracking
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  // Edit modal tracking
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editText, setEditText] = useState('');
  const [editPreviewMode, setEditPreviewMode] = useState(false);
  const [editSavingStatus, setEditSavingStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Fetch all notes
  const fetchNotes = async () => {
    try {
      const response = await api.get<Note[]>('/notes');
      setNotes(response.data);
    } catch (err) {
      console.error('Failed to fetch user notes:', err);
      addToast('Failed to load study notes.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Debounced auto-save for the edit modal
  useEffect(() => {
    if (editSavingStatus !== 'saving' || !editingNote) return;

    const delayDebounceFn = setTimeout(async () => {
      try {
        await api.post('/notes', {
          topicId: editingNote.topicId,
          content: editText,
        });
        setEditSavingStatus('saved');
        // Update local list state
        setNotes((prev) =>
          prev.map((n) =>
            n.id === editingNote.id ? { ...n, content: editText, updatedAt: new Date().toISOString() } : n
          )
        );
      } catch (err) {
        console.error('Failed to auto-save note changes:', err);
        setEditSavingStatus('error');
      }
    }, 1500);

    return () => clearTimeout(delayDebounceFn);
  }, [editText, editSavingStatus, editingNote]);

  const handleEditChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditText(e.target.value);
    setEditSavingStatus('saving');
  };

  const openEditModal = (note: Note) => {
    setEditingNote(note);
    setEditText(note.content);
    setEditPreviewMode(false);
    setEditSavingStatus('idle');
  };

  const closeEditModal = () => {
    setEditingNote(null);
  };

  const handleDeleteClick = (noteId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDeleteId(noteId);
  };

  const confirmDelete = async (noteId: number) => {
    try {
      await api.delete(`/notes/${noteId}`);
      addToast('Note deleted successfully', 'success');
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
      setConfirmDeleteId(null);
    } catch (err) {
      console.error('Failed to delete note:', err);
      addToast('Failed to delete note', 'error');
    }
  };

  const toggleExpand = (noteId: number) => {
    setExpandedNotes((prev) => ({
      ...prev,
      [noteId]: !prev[noteId],
    }));
  };

  // Extract unique courses for filtering dropdown
  const uniqueCourses = ['All', ...Array.from(new Set(notes.map((n) => n.courseTitle)))];

  // Search & filter logic
  const filteredAndSortedNotes = notes
    .filter((note) => {
      const matchSearch =
        note.topicTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCourse = selectedCourse === 'All' || note.courseTitle === selectedCourse;
      return matchSearch && matchCourse;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      if (sortBy === 'topic-asc') {
        return a.topicTitle.localeCompare(b.topicTitle);
      }
      if (sortBy === 'course-asc') {
        return a.courseTitle.localeCompare(b.courseTitle);
      }
      return 0;
    });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Banner */}
      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-hidden">
        {/* Soft violet backdrop blob */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="flex items-center gap-3 mb-2">
          <NotebookPen className="text-indigo-400" size={20} />
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Personal Study Hub</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-100">My Study Notes</h1>
        <p className="text-slate-400 text-sm mt-1 max-w-xl">
          Review, search, and edit your custom markdown study notes taken across all lesson modules in one place.
        </p>
      </div>

      {/* Control Bar (Search, Course filter, Sorting) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
            <Search size={14} />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes content..."
            className="w-full bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Course filter */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Course:</span>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              {uniqueCourses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Sorting filter */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="recent">Recently Updated</option>
              <option value="topic-asc">Topic Title (A-Z)</option>
              <option value="course-asc">Course Title (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content List / Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredAndSortedNotes.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-2xl max-w-lg mx-auto space-y-5 shadow-lg relative overflow-hidden">
          <div className="absolute -top-12 -left-12 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-violet-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
            <NotebookPen size={32} />
          </div>
          <div className="space-y-1 px-6">
            <h3 className="text-base font-bold text-white">No study notes found</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              {notes.length === 0
                ? "You haven't created any personal study notes yet! Explore our course topics, learn concepts, and write down key insights."
                : "No notes match your active search terms or filters. Try adjusting your query or filters."}
            </p>
          </div>
          {notes.length === 0 && (
            <button
              onClick={() => navigate('/learn')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-500/10 active:scale-95 cursor-pointer"
            >
              Explore Courses
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      ) : (
        /* Notes Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedNotes.map((note) => {
            const isExpanded = !!expandedNotes[note.id];
            const isConfirmingDelete = confirmDeleteId === note.id;
            const truncatedLength = 160;
            const shouldTruncate = note.content.length > truncatedLength;
            const displayContent =
              shouldTruncate && !isExpanded ? note.content.substring(0, truncatedLength) + '...' : note.content;

            return (
              <div
                key={note.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md flex flex-col justify-between hover:border-slate-700/80 transition-all hover:translate-y-[-2px] relative overflow-hidden"
              >
                {isConfirmingDelete ? (
                  /* SLEEK IN-CARD CONFIRM DELETION OVERLAY STATE */
                  <div className="absolute inset-0 bg-slate-950/90 flex flex-col justify-center items-center text-center p-5 z-10 animate-fade-in">
                    <Trash2 className="text-rose-500 mb-2" size={28} />
                    <h4 className="text-sm font-bold text-white">Delete Study Note?</h4>
                    <p className="text-[11px] text-slate-400 mt-1 mb-4 max-w-[200px] leading-relaxed">
                      Are you sure? This note content will be permanently removed.
                    </p>
                    <div className="flex gap-2.5 w-full max-w-[200px]">
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="flex-1 py-1.5 px-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-[10px] font-bold text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => confirmDelete(note.id)}
                        className="flex-1 py-1.5 px-3 bg-rose-600 hover:bg-rose-500 text-[10px] font-bold text-white rounded-xl transition-all cursor-pointer shadow-md shadow-rose-500/10"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ) : null}

                {/* Card Top Info */}
                <div className="space-y-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/15 py-0.5 px-2 rounded-full self-start truncate max-w-full">
                      {note.courseTitle}
                    </span>
                    <h3 className="text-sm font-bold text-white truncate" title={note.topicTitle}>
                      {note.topicTitle}
                    </h3>
                  </div>

                  {/* Note Content Preview */}
                  <div className="text-xs text-slate-350 leading-relaxed break-words description-container min-h-[50px]">
                    {renderMarkdown(displayContent)}
                  </div>

                  {/* Toggle Expansion button if content is long */}
                  {shouldTruncate && (
                    <button
                      onClick={() => toggleExpand(note.id)}
                      className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {isExpanded ? (
                        <>
                          Show less <ChevronUp size={12} />
                        </>
                      ) : (
                        <>
                          Read full note <ChevronDown size={12} />
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Card Bottom Meta & Actions */}
                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1 text-slate-500 font-medium">
                    <Calendar size={12} />
                    <span>{formatDate(note.updatedAt)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(note)}
                      title="Edit note"
                      className="p-1.5 bg-slate-950 border border-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit3 size={12} />
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(note.id, e)}
                      title="Delete note"
                      className="p-1.5 bg-slate-950 border border-slate-800 text-slate-400 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                    <button
                      onClick={() => navigate(`/learn/topic/${note.topicId}`)}
                      title="Open topic lesson"
                      className="p-1.5 bg-indigo-600 border border-indigo-500 text-white rounded-lg hover:bg-indigo-500 transition-all cursor-pointer shadow-sm"
                    >
                      <ExternalLink size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EDIT NOTE MODAL */}
      {editingNote && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative overflow-hidden animate-scale-in">
            {/* Soft decorative glow */}
            <div className="absolute top-0 left-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider">
                  {editingNote.courseTitle}
                </span>
                <h3 className="text-base font-bold text-white">{editingNote.topicTitle}</h3>
              </div>
              <button
                onClick={closeEditModal}
                className="p-1 bg-slate-950 border border-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Editor Switchbar & Save status */}
            <div className="flex items-center justify-between">
              {/* Tabs Edit/Preview */}
              <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-0.5">
                <button
                  onClick={() => setEditPreviewMode(false)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    !editPreviewMode ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Edit
                </button>
                <button
                  onClick={() => setEditPreviewMode(true)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    editPreviewMode ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Preview
                </button>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                {editSavingStatus === 'saving' && (
                  <span className="text-[10px] font-semibold text-amber-400 flex items-center gap-1 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    Saving...
                  </span>
                )}
                {editSavingStatus === 'saved' && (
                  <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1 animate-fade-in">
                    <CheckCircle2 size={12} />
                    Saved to Cloud
                  </span>
                )}
                {editSavingStatus === 'error' && (
                  <span className="text-[10px] font-semibold text-rose-400 flex items-center gap-1">
                    <AlertCircle size={12} />
                    Auto-save failed
                  </span>
                )}
              </div>
            </div>

            {/* Textarea or Markdown View */}
            {editPreviewMode ? (
              <div className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 min-h-[250px] max-h-[350px] overflow-y-auto text-xs text-slate-300 leading-relaxed description-container">
                {editText.trim() ? (
                  renderMarkdown(editText)
                ) : (
                  <span className="text-slate-500 italic">No notes written. Switch to "Edit" to type.</span>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <textarea
                  value={editText}
                  onChange={handleEditChange}
                  placeholder="Write your study notes here..."
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-xl p-4 min-h-[250px] max-h-[350px] focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent resize-y font-mono text-xs leading-relaxed"
                />
                <span className="text-[9px] text-slate-500 font-semibold self-end">
                  Markdown supported • Auto-saves as you type
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 bg-slate-950 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesHub;
