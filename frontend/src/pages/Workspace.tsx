import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Confetti from '../components/Confetti';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import type { CodingProblem } from '../types';
import { renderMarkdown } from '../utils/markdown';
import { useAppTheme } from '../context/ThemeContext';
import Editor from '@monaco-editor/react';
import {
  Play,
  CheckCircle2,
  AlertCircle,
  Code2,
  ChevronLeft,
  Terminal,
  RotateCcw,
  Cpu,
  Database,
  Clock,
  Keyboard,
  Eye,
  EyeOff,
  LayoutGrid,
  Key,
  Link2,
  Bookmark,
} from 'lucide-react';
const DEFAULT_PYTHON_TEMPLATE = `import sys

def main():
    # Read standard input and write solution here
    for line in sys.stdin:
        pass

if __name__ == '__main__':
    main()`;

interface TableColumn {
  name: string;
  type: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
}

interface TableSchema {
  name: string;
  columns: TableColumn[];
}

const parseSchema = (schemaSql: string): TableSchema[] => {
  const tables: TableSchema[] = [];
  const statements = schemaSql.split(';');
  
  for (let statement of statements) {
    statement = statement.replace(/\s+/g, ' ').trim();
    if (!statement) continue;
    
    const createTableMatch = statement.match(/CREATE\s+TABLE\s+(\w+)\s*\((.*)\)/i);
    if (!createTableMatch) continue;
    
    const tableName = createTableMatch[1];
    const columnsContent = createTableMatch[2];
    
    const columnDefinitions: string[] = [];
    let currentDef = '';
    let parenCount = 0;
    
    for (let char of columnsContent) {
      if (char === '(') parenCount++;
      if (char === ')') parenCount--;
      if (char === ',' && parenCount === 0) {
        columnDefinitions.push(currentDef.trim());
        currentDef = '';
      } else {
        currentDef += char;
      }
    }
    if (currentDef.trim()) {
      columnDefinitions.push(currentDef.trim());
    }
    
    const columns: TableColumn[] = [];
    
    for (const colDef of columnDefinitions) {
      const cleanColDef = colDef.replace(/\s+/g, ' ').trim();
      if (!cleanColDef) continue;
      
      const tokens = cleanColDef.split(' ');
      const colName = tokens[0];
      
      if (/^(CONSTRAINT|FOREIGN|PRIMARY|KEY|UNIQUE)/i.test(colName)) {
        continue;
      }
      
      const colType = tokens[1] || 'UNKNOWN';
      const isPrimaryKey = /PRIMARY\s+KEY/i.test(cleanColDef);
      const isForeignKey = /FOREIGN\s+KEY|REFERENCES/i.test(cleanColDef) || colName.toLowerCase().endsWith('_id');
      
      columns.push({
        name: colName,
        type: colType.toUpperCase(),
        isPrimaryKey,
        isForeignKey
      });
    }
    
    tables.push({
      name: tableName,
      columns
    });
  }
  
  return tables;
};

const Workspace: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const { addToast } = useToast();
  const { editorFontSize, editorFontFamily } = useAppTheme();

  const [problem, setProblem] = useState<CodingProblem | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [language, setLanguage] = useState<'java' | 'javascript' | 'sql' | 'html' | 'python'>('java');
  const [code, setCode] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [loading, setLoading] = useState(true);
  const [leftTab, setLeftTab] = useState<'description' | 'schema'>('description');

  const handleToggleBookmark = async () => {
    if (!problem) return;
    try {
      const res = await api.post(`/bookmarks/problem/${problem.id}`);
      const isBookmarked = res.data.bookmarked;
      setBookmarked(isBookmarked);
      addToast(isBookmarked ? 'Problem bookmarked successfully!' : 'Bookmark removed.', 'success');
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
      addToast('Failed to toggle bookmark', 'error');
    }
  };

  // Monaco Editor states
  const [editorInstance, setEditorInstance] = useState<any>(null);
  const [monacoInstance, setMonacoInstance] = useState<any>(null);
  const [minimapEnabled, setMinimapEnabled] = useState(true);

  // Submit / Test run states
  const [submitting, setSubmitting] = useState(false);
  const [runningCode, setRunningCode] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [consoleTab, setConsoleTab] = useState<'input' | 'output' | 'preview'>('output');

  const [result, setResult] = useState<{
    status: string;
    errorMessage?: string;
    executionTimeMs?: number;
    cpuTimeMs?: number;
    memoryMb?: number;
    xpEarned?: number;
  } | null>(null);

  const [runResult, setRunResult] = useState<{
    status: string;
    stdout?: string;
    stderr?: string;
    executionTimeMs?: number;
    cpuTimeMs?: number;
    memoryMb?: number;
  } | null>(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await api.get<CodingProblem>(`/problems/${id}`);
        setProblem(response.data);
        setBookmarked(response.data.bookmarked || false);
        if (response.data.category === 'HTML & CSS') {
          setLanguage('html');
          setCode(response.data.javascriptTemplate || '');
          setConsoleTab('preview');
        } else if (response.data.sqlTemplate) {
          setLanguage('sql');
          setCode(response.data.sqlTemplate);
        } else {
          setLanguage('java');
          setCode(response.data.javaTemplate || response.data.javascriptTemplate || '');
        }
      } catch (err) {
        console.error('Failed to load coding problem:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id]);

  const handleLanguageChange = (lang: 'java' | 'javascript' | 'sql' | 'html' | 'python') => {
    setLanguage(lang);
    if (lang === 'sql') {
      setConsoleTab('output');
    }
    if (problem) {
      setCode(
        lang === 'sql'
          ? (problem.sqlTemplate || '')
          : lang === 'html'
          ? (problem.javascriptTemplate || '')
          : lang === 'java'
          ? (problem.javaTemplate || '')
          : lang === 'python'
          ? DEFAULT_PYTHON_TEMPLATE
          : (problem.javascriptTemplate || '')
      );
    }
  };

  const handleReset = () => {
    if (problem) {
      setCode(
        language === 'sql'
          ? (problem.sqlTemplate || '')
          : language === 'html'
          ? (problem.javascriptTemplate || '')
          : language === 'java'
          ? (problem.javaTemplate || '')
          : language === 'python'
          ? DEFAULT_PYTHON_TEMPLATE
          : (problem.javascriptTemplate || '')
      );
    }
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    setEditorInstance(editor);
    setMonacoInstance(monaco);

    // Register theme
    monaco.editor.defineTheme('nlc-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '64748b', fontStyle: 'italic' },
        { token: 'keyword', foreground: '6366f1', fontStyle: 'bold' },
        { token: 'string', foreground: '10b981' },
        { token: 'number', foreground: 'f59e0b' },
      ],
      colors: {
        'editor.background': '#0f172a',
        'editor.foreground': '#cbd5e1',
        'editorLineNumber.foreground': '#475569',
        'editorLineNumber.activeForeground': '#6366f1',
        'editor.lineHighlightBackground': '#1e293b',
        'editor.selectionBackground': '#334155',
        'dropdown.background': '#0f172a',
      }
    });
    monaco.editor.setTheme('nlc-dark');

    // Register custom java suggestions if not already registered
    // @ts-ignore
    if (!monaco._nlcJavaRegistered) {
      const provider = monaco.languages.registerCompletionItemProvider('java', {
        provideCompletionItems: (model: any, position: any) => {
          const textUntilPosition = model.getValueInRange({
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: position.column
          });

          const suggestions: any[] = [];

          // Check if we are typing after "System.out."
          if (textUntilPosition.endsWith('System.out.')) {
            suggestions.push({
              label: 'println',
              kind: monaco.languages.CompletionItemKind.Method,
              insertText: 'println($1);',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: 'void System.out.println(String x)',
              range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column,
                endLineNumber: position.lineNumber,
                endColumn: position.column
              }
            });
          }
          // Check if we are typing after "System."
          else if (textUntilPosition.endsWith('System.')) {
            suggestions.push({
              label: 'out',
              kind: monaco.languages.CompletionItemKind.Field,
              insertText: 'out',
              detail: 'PrintStream System.out',
              range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column,
                endLineNumber: position.lineNumber,
                endColumn: position.column
              }
            });
          }
          else {
            // System
            suggestions.push({
              label: 'System',
              kind: monaco.languages.CompletionItemKind.Class,
              insertText: 'System',
              detail: 'java.lang.System',
              range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column,
                endLineNumber: position.lineNumber,
                endColumn: position.column
              }
            });
            // System.out.println
            suggestions.push({
              label: 'System.out.println',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'System.out.println($1);',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: 'System.out.println() snippet',
              range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column,
                endLineNumber: position.lineNumber,
                endColumn: position.column
              }
            });
            // Scanner
            suggestions.push({
              label: 'Scanner',
              kind: monaco.languages.CompletionItemKind.Class,
              insertText: 'Scanner ${1:scanner} = new Scanner(System.in);',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: 'java.util.Scanner',
              range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column,
                endLineNumber: position.lineNumber,
                endColumn: position.column
              }
            });
            // ArrayList
            suggestions.push({
              label: 'ArrayList',
              kind: monaco.languages.CompletionItemKind.Class,
              insertText: 'ArrayList<${1:String}> ${2:list} = new ArrayList<>();',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: 'java.util.ArrayList',
              range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column,
                endLineNumber: position.lineNumber,
                endColumn: position.column
              }
            });
            // HashMap
            suggestions.push({
              label: 'HashMap',
              kind: monaco.languages.CompletionItemKind.Class,
              insertText: 'HashMap<${1:String}, ${2:Integer}> ${3:map} = new HashMap<>();',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: 'java.util.HashMap',
              range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column,
                endLineNumber: position.lineNumber,
                endColumn: position.column
              }
            });
            // String
            suggestions.push({
              label: 'String',
              kind: monaco.languages.CompletionItemKind.Class,
              insertText: 'String',
              detail: 'java.lang.String',
              range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column,
                endLineNumber: position.lineNumber,
                endColumn: position.column
              }
            });
            // Math
            suggestions.push({
              label: 'Math',
              kind: monaco.languages.CompletionItemKind.Class,
              insertText: 'Math',
              detail: 'java.lang.Math',
              range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column,
                endLineNumber: position.lineNumber,
                endColumn: position.column
              }
            });
            // Collections
            suggestions.push({
              label: 'Collections',
              kind: monaco.languages.CompletionItemKind.Class,
              insertText: 'Collections',
              detail: 'java.util.Collections',
              range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column,
                endLineNumber: position.lineNumber,
                endColumn: position.column
              }
            });
          }

          return { suggestions };
        }
      });
      // @ts-ignore
      monaco._nlcJavaRegistered = provider;
    }
  };

  useEffect(() => {
    if (!editorInstance || !monacoInstance) return;

    const model = editorInstance.getModel();
    if (!model) return;

    // Reset markers first
    monacoInstance.editor.setModelMarkers(model, 'owner', []);

    // Get error text
    let errorText = '';
    if (result && result.status === 'Compilation Error') {
      errorText = result.errorMessage || '';
    } else if (runResult && runResult.status === 'Compilation Error') {
      errorText = runResult.stderr || '';
    }

    if (!errorText) return;

    // Extract errors using regex
    // Example: Main.java:6: error: cannot find symbol
    // Or: .\Main.java:6: error: cannot find symbol
    const errorRegex = /Main\.java:(\d+):\s*error:\s*(.*)/gi;
    const markers: any[] = [];
    let match;

    // Loop through all matches in the error log
    while ((match = errorRegex.exec(errorText)) !== null) {
      const lineNumber = parseInt(match[1], 10);
      const errorMessage = match[2];

      if (!isNaN(lineNumber) && lineNumber > 0 && lineNumber <= model.getLineCount()) {
        const lineContent = model.getLineContent(lineNumber);
        const startColumn = 1;
        const endColumn = lineContent.length + 1;

        markers.push({
          startLineNumber: lineNumber,
          startColumn,
          endLineNumber: lineNumber,
          endColumn,
          message: errorMessage,
          severity: monacoInstance.MarkerSeverity.Error,
        });
      }
    }

    // Set markers on the model
    if (markers.length > 0) {
      monacoInstance.editor.setModelMarkers(model, 'owner', markers);
    }
  }, [result, runResult, editorInstance, monacoInstance]);

  const handleRun = async () => {
    if (!problem) return;
    setRunningCode(true);
    setRunResult(null);
    setResult(null);
    setConsoleTab('output');
    addToast('Executing code tests...', 'info', { duration: 2000 });
    try {
      const response = await api.post(`/problems/${problem.id}/run`, {
        language: language === 'sql' ? 'SQL' : (language === 'html' ? 'HTML/CSS' : (language === 'java' ? 'Java' : (language === 'python' ? 'Python' : 'JavaScript'))),
        code: code,
        customInput: customInput,
      });
      setRunResult(response.data);
      if (response.data.status === 'Success') {
        addToast('Execution completed successfully!', 'success');
      } else {
        addToast(`Execution failed: ${response.data.status}`, 'error');
      }
    } catch (err: any) {
      setRunResult({
        status: 'Error',
        stderr: err?.response?.data?.message || 'Server error occurred during code run.',
      });
      addToast('Failed to run code: Server error.', 'error');
    } finally {
      setRunningCode(false);
    }
  };

  const handleSubmit = async () => {
    if (!problem) return;
    setSubmitting(true);
    setResult(null);
    setRunResult(null);
    setConsoleTab('output');
    addToast('Verifying code against test cases...', 'info', { duration: 2505 });
    try {
      const response = await api.post(`/problems/${problem.id}/submit`, {
        language: language === 'sql' ? 'SQL' : (language === 'html' ? 'HTML/CSS' : (language === 'java' ? 'Java' : (language === 'python' ? 'Python' : 'JavaScript'))),
        code: code,
      });
      setResult(response.data);
      if (response.data.status === 'Accepted') {
        addToast('Accepted! All test cases passed.', 'success');
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
        // Refresh auth context so user stats/XP updates on the layout instantly!
        refreshProfile();
      } else {
        addToast(`Rejected: ${response.data.status}`, 'error');
      }
    } catch (err: any) {
      setResult({
        status: 'Error',
        errorMessage: err?.response?.data?.message || 'Server error occurred during submission.',
      });
      addToast('Failed to submit: Server error.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const renderSchemaDiagram = (schemaSql?: string) => {
    if (!schemaSql) return null;
    const tables = parseSchema(schemaSql);
    
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-sm font-semibold uppercase text-slate-500 tracking-wider mb-1">Database Schema Diagram</h2>
          <p className="text-xs text-slate-400">Inspect the relational database tables, fields, types, and keys below.</p>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {tables.map((table) => (
            <div 
              key={table.name} 
              className="bg-slate-950/60 border border-slate-800 rounded-xl overflow-hidden shadow-md group hover:border-indigo-500/35 transition-all duration-300"
            >
              {/* Table Header */}
              <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center gap-2 group-hover:bg-slate-900/80 transition-colors">
                <Database size={14} className="text-indigo-400" />
                <span className="text-xs font-bold text-slate-200 tracking-wide">{table.name}</span>
              </div>
              
              {/* Column List */}
              <div className="divide-y divide-slate-900/60">
                {table.columns.map((col) => (
                  <div 
                    key={col.name} 
                    className="px-4 py-2.5 flex items-center justify-between text-xs hover:bg-slate-900/40 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-300">{col.name}</span>
                      {col.isPrimaryKey && (
                        <span 
                          title="Primary Key" 
                          className="inline-flex items-center gap-0.5 px-1 py-0.2 bg-amber-500/10 border border-amber-500/25 rounded text-[9px] font-bold text-amber-400"
                        >
                          <Key size={8} />
                          PK
                        </span>
                      )}
                      {col.isForeignKey && (
                        <span 
                          title="Foreign Key / Relation Link" 
                          className="inline-flex items-center gap-0.5 px-1 py-0.2 bg-indigo-500/10 border border-indigo-500/25 rounded text-[9px] font-bold text-indigo-400"
                        >
                          <Link2 size={8} />
                          FK
                        </span>
                      )}
                    </div>
                    
                    <span className="font-mono text-[10px] text-slate-500 uppercase font-medium">{col.type}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto text-red-500 mb-3" size={36} />
        <p className="text-white">Coding problem not found.</p>
        <button
          onClick={() => navigate('/problems')}
          className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm"
        >
          Back to Problems
        </button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col gap-4 w-full">
      {showConfetti && <Confetti />}
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/problems')}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              {problem.title}
              <button
                onClick={handleToggleBookmark}
                title={bookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
                className={`p-1.5 rounded-lg transition-all border flex items-center justify-center cursor-pointer ${
                  bookmarked
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500/20'
                    : 'bg-slate-950/40 border-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Bookmark size={13} fill={bookmarked ? "currentColor" : "none"} />
              </button>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                problem.difficulty === 'Easy' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                problem.difficulty === 'Medium' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                'bg-rose-500/10 border-rose-500/20 text-rose-400'
              }`}>
                {problem.difficulty}
              </span>
            </h1>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {language === 'sql' ? (
            <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-0.5">
              <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                <Database size={12} />
                SQL
              </span>
            </div>
          ) : language === 'html' ? (
            <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-0.5">
              <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-pink-400 bg-pink-500/10 border border-pink-500/20 rounded-lg">
                <LayoutGrid size={12} />
                HTML & CSS
              </span>
            </div>
          ) : (
            <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-0.5">
              <button
                onClick={() => handleLanguageChange('javascript')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  language === 'javascript' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                JavaScript
              </button>
              <button
                onClick={() => handleLanguageChange('java')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  language === 'java' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Java
              </button>
              <button
                onClick={() => handleLanguageChange('python')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  language === 'python' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Python
              </button>
            </div>
          )}
          
          <button
            onClick={handleReset}
            title="Reset code"
            className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl transition-colors"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Main Workspace splitscreen */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0">
        
        {/* Left Side: Problem Details & Database Schema */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col h-full min-h-0">
          {!!problem.schemaSql && (
            <div className="flex border-b border-slate-800 gap-4 mb-4 flex-shrink-0">
              <button
                onClick={() => setLeftTab('description')}
                className={`pb-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 -mb-px ${
                  leftTab === 'description'
                    ? 'border-indigo-500 text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setLeftTab('schema')}
                className={`pb-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 -mb-px ${
                  leftTab === 'schema'
                    ? 'border-indigo-500 text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Database Schema
              </button>
            </div>
          )}

          {(!problem.schemaSql || leftTab === 'description') ? (
            <div className="flex-1 overflow-y-auto space-y-5 min-h-0">
              <div>
                <h2 className="text-sm font-semibold uppercase text-slate-500 tracking-wider">Description</h2>
                <div className="text-slate-300 mt-2 description-container">
                  {renderMarkdown(problem.description)}
                </div>
              </div>

              {problem.constraints && (
                <div>
                  <h2 className="text-sm font-semibold uppercase text-slate-500 tracking-wider">Constraints</h2>
                  <div className="text-slate-400 mt-2 description-container">
                    {renderMarkdown(problem.constraints)}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto min-h-0">
              {renderSchemaDiagram(problem.schemaSql)}
            </div>
          )}
        </div>

        {/* Right Side: Code Editor & Results */}
        <div className="flex flex-col gap-4 min-h-0 h-full">
          
          {/* Editor Container */}
          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col min-h-0">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/60 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Code2 size={14} className="text-indigo-400" />
                <span className="text-xs font-semibold text-slate-300">Editor</span>
              </div>
              <button
                onClick={() => setMinimapEnabled(!minimapEnabled)}
                title={minimapEnabled ? "Hide Minimap" : "Show Minimap"}
                className="p-1 text-slate-400 hover:text-white bg-slate-950/40 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-[10px] font-semibold"
              >
                {minimapEnabled ? <EyeOff size={11} /> : <Eye size={11} />}
                {minimapEnabled ? "Minimap On" : "Minimap Off"}
              </button>
            </div>
            
            <div className="flex-1 relative overflow-hidden">
              <Editor
                height="100%"
                language={language === 'sql' ? 'sql' : language === 'java' ? 'java' : language === 'html' ? 'html' : language === 'python' ? 'python' : 'javascript'}
                theme="nlc-dark"
                value={code}
                onChange={(val) => setCode(val || '')}
                onMount={handleEditorDidMount}
                options={{
                  autoClosingBrackets: "always",
                  autoClosingQuotes: "always",
                  autoIndent: "full",
                  formatOnPaste: true,
                  formatOnType: true,
                  quickSuggestions: {
                    other: true,
                    comments: true,
                    strings: true
                  },
                  suggestOnTriggerCharacters: true,
                  tabCompletion: "on",
                  wordBasedSuggestions: "allDocuments",
                  acceptSuggestionOnEnter: "on",
                  fontSize: editorFontSize,
                  fontFamily: editorFontFamily,
                  minimap: { enabled: minimapEnabled },
                  wordWrap: 'on',
                  folding: true,
                  matchBrackets: "always",
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </div>
          </div>

          {/* Action Footer & Results Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex-shrink-0 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex gap-2">
                {language === 'html' && (
                  <button
                    onClick={() => setConsoleTab('preview')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      consoleTab === 'preview'
                        ? 'bg-slate-800 border-slate-700 text-white'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Eye size={13} />
                    Live Preview
                  </button>
                )}
                {language !== 'sql' && language !== 'html' && (
                  <button
                    onClick={() => setConsoleTab('input')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      consoleTab === 'input'
                        ? 'bg-slate-800 border-slate-700 text-white'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Keyboard size={13} />
                    Custom Input
                  </button>
                )}
                <button
                  onClick={() => setConsoleTab('output')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    consoleTab === 'output'
                      ? 'bg-slate-800 border-slate-700 text-white'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Terminal size={13} />
                  Console / Output
                </button>
              </div>

              <div className="flex gap-2">
                {/* Run code button */}
                <button
                  onClick={handleRun}
                  disabled={runningCode || submitting}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:border-slate-600 disabled:bg-slate-900 disabled:border-slate-800 disabled:text-slate-600 text-slate-200 text-xs font-semibold rounded-xl transition-all"
                >
                  {runningCode ? (
                    <span className="w-3.5 h-3.5 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Play size={12} fill="currentColor" className="text-emerald-400" />
                      Run Code
                    </>
                  )}
                </button>

                {/* Submit solution button */}
                <button
                  onClick={handleSubmit}
                  disabled={runningCode || submitting}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-indigo-500/15"
                >
                  {submitting ? (
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 size={12} className="text-indigo-200" />
                      Submit Solution
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Console Tab Content */}
            {consoleTab === 'preview' && language === 'html' ? (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Live Web Preview</label>
                <div className="w-full h-48 bg-white rounded-xl overflow-hidden border border-slate-800">
                  <iframe
                    srcDoc={code}
                    title="Live Preview"
                    className="w-full h-full bg-white"
                    sandbox="allow-scripts"
                  />
                </div>
              </div>
            ) : consoleTab === 'input' ? (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Provide Standard Input</label>
                <textarea
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Enter custom program inputs here (separate multiple lines with newlines)..."
                  className="w-full h-24 bg-slate-950 border border-slate-800 text-slate-200 p-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-700 focus:border-transparent resize-none font-mono text-xs leading-relaxed"
                  spellCheck="false"
                />
              </div>
            ) : (
              <div className="space-y-3 min-h-[6rem] max-h-48 overflow-y-auto">
                {/* 1. Custom Code Execution Result */}
                {runResult && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2 py-0.5 rounded border uppercase ${
                        runResult.status === 'Success' || runResult.status === 'Accepted'
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                          : 'bg-red-500/10 border-red-500/20 text-red-400'
                      }`}>
                        {(runResult.status === 'Success' || runResult.status === 'Accepted') ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                        {runResult.status}
                      </span>
                    </div>

                    {/* Premium Stats telemetry widgets */}
                    <div className="grid grid-cols-3 gap-2.5">
                      <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-2.5 flex items-center gap-2">
                        <Clock size={14} className="text-amber-400" />
                        <div>
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider leading-none">Time Elapsed</p>
                          <p className="text-xs font-bold text-slate-200 mt-0.5 leading-none">{runResult.executionTimeMs} ms</p>
                        </div>
                      </div>
                      <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-2.5 flex items-center gap-2">
                        <Cpu size={14} className="text-indigo-400" />
                        <div>
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider leading-none">CPU Time</p>
                          <p className="text-xs font-bold text-slate-200 mt-0.5 leading-none">{runResult.cpuTimeMs} ms</p>
                        </div>
                      </div>
                      <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-2.5 flex items-center gap-2">
                        <Database size={14} className="text-emerald-400" />
                        <div>
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider leading-none">Peak Memory</p>
                          <p className="text-xs font-bold text-slate-200 mt-0.5 leading-none">{runResult.memoryMb} MB</p>
                        </div>
                      </div>
                    </div>

                    {runResult.stdout && runResult.stdout.trim() && (
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Standard Output</p>
                        <pre className="bg-slate-950 border border-slate-800 text-slate-300 p-3 rounded-xl font-mono text-xs overflow-x-auto whitespace-pre leading-relaxed">{runResult.stdout}</pre>
                      </div>
                    )}

                    {runResult.stderr && runResult.stderr.trim() && (
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-red-400/85 uppercase tracking-wider">Standard Error / Logs</p>
                        <pre className="bg-red-950/10 border border-red-500/20 text-red-400 p-3 rounded-xl font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed">{runResult.stderr}</pre>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Full Submission Verification Result */}
                {result && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2 py-0.5 rounded border uppercase ${
                        result.status === 'Accepted'
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                          : 'bg-red-500/10 border-red-500/20 text-red-400'
                      }`}>
                        {result.status === 'Accepted' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                        {result.status}
                      </span>
                      {result.status === 'Accepted' && result.xpEarned ? (
                        <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/25 px-2 py-0.5 rounded-lg animate-pulse">
                          +{result.xpEarned} XP Earned
                        </span>
                      ) : null}
                    </div>

                    {/* Premium Stats telemetry widgets */}
                    <div className="grid grid-cols-3 gap-2.5">
                      <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-2.5 flex items-center gap-2">
                        <Clock size={14} className="text-amber-400" />
                        <div>
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider leading-none">Time Elapsed</p>
                          <p className="text-xs font-bold text-slate-200 mt-0.5 leading-none">{result.executionTimeMs} ms</p>
                        </div>
                      </div>
                      <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-2.5 flex items-center gap-2">
                        <Cpu size={14} className="text-indigo-400" />
                        <div>
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider leading-none">CPU Time</p>
                          <p className="text-xs font-bold text-slate-200 mt-0.5 leading-none">{result.cpuTimeMs || 0} ms</p>
                        </div>
                      </div>
                      <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-2.5 flex items-center gap-2">
                        <Database size={14} className="text-emerald-400" />
                        <div>
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider leading-none">Peak Memory</p>
                          <p className="text-xs font-bold text-slate-200 mt-0.5 leading-none">{result.memoryMb || 0} MB</p>
                        </div>
                      </div>
                    </div>

                    {result.errorMessage && (
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-red-400/85 uppercase tracking-wider">Error Logs</p>
                        <pre className="bg-red-950/10 border border-red-500/20 text-red-400 p-3 rounded-xl font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed">{result.errorMessage}</pre>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Empty console default state */}
                {!runResult && !result && (
                  <div className="h-24 flex items-center justify-center text-slate-500 text-xs font-medium italic">
                    Click "Run Code" or "Submit Solution" to run program compilation and see output console metrics.
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Workspace;
