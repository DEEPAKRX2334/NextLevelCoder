import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Trophy, Search, Sparkles } from 'lucide-react';
import { Avatar } from '../components/Avatar';

interface LeaderboardRow {
  rank: number;
  username: string;
  level: string;
  xp: number;
  problemsSolved: number;
  accuracy: number;
  avatarUrl?: string;
}

const Leaderboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [filteredRows, setFilteredRows] = useState<LeaderboardRow[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get<LeaderboardRow[]>('/leaderboard');
        setRows(response.data);
        setFilteredRows(response.data);
      } catch (err) {
        console.error('Failed to load leaderboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    if (search.trim() === '') {
      setFilteredRows(rows);
    } else {
      setFilteredRows(
        rows.filter((row) =>
          row.username.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, rows]);

  const levelColors: Record<string, string> = {
    Beginner: 'from-slate-400 to-slate-500 bg-slate-500/10 border-slate-500/20 text-slate-400',
    Intermediate: 'from-blue-400 to-indigo-500 bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
    Advanced: 'from-violet-400 to-purple-600 bg-purple-500/10 border-purple-500/20 text-purple-400',
    Expert: 'from-amber-400 to-orange-500 bg-amber-500/10 border-amber-500/20 text-amber-400',
    Master: 'from-rose-400 to-red-600 bg-red-500/10 border-red-500/20 text-red-400',
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Trophy className="text-yellow-400" size={18} />;
    if (rank === 2) return <Trophy className="text-slate-300" size={18} />;
    if (rank === 3) return <Trophy className="text-amber-600" size={18} />;
    return <span className="text-slate-500 font-bold text-xs">{rank}</span>;
  };

  const currentUsername = profile?.username ?? user?.username;

  return (
    <div className="space-y-6 w-full">
      {/* Header Banner */}
      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="text-amber-400" size={20} />
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Global Rankings</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white">Leaderboard</h1>
        <p className="text-slate-400 text-sm mt-1 max-w-xl">
          Compare your progress with other developers. Solve problems, complete courses, and earn XP to climb the ranks!
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex gap-4 items-center justify-between">
        <div className="relative w-full max-w-xs">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search username..."
            className="w-full bg-slate-900 border border-slate-800 text-white placeholder-slate-500 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Leaderboard Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredRows.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/40 border border-slate-800 rounded-2xl">
          <Trophy className="mx-auto text-slate-600 mb-3" size={32} />
          <p className="text-slate-400 text-sm">No coders found matching your search.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <th className="py-4 px-5 w-20 text-center">Rank</th>
                  <th className="py-4 px-4">Coder</th>
                  <th className="py-4 px-4">Level</th>
                  <th className="py-4 px-4 text-center">Solved</th>
                  <th className="py-4 px-4 text-center">Accuracy</th>
                  <th className="py-4 px-5 text-right">XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 text-sm">
                {filteredRows.map((row) => {
                  const isSelf = row.username === currentUsername;
                  const levelStyle = levelColors[row.level] || levelColors.Beginner;

                  return (
                    <tr
                      key={row.username}
                      className={`transition-colors ${
                        isSelf 
                          ? 'bg-indigo-600/5 hover:bg-indigo-600/10 border-l-4 border-indigo-500' 
                          : 'hover:bg-slate-800/20'
                      }`}
                    >
                      <td className="py-3.5 px-5 text-center">
                        <div className="flex items-center justify-center">
                          {getRankBadge(row.rank)}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-white">
                        <div className="flex items-center gap-2.5">
                          <Avatar
                            url={row.avatarUrl}
                            username={row.username}
                            size={32}
                            className="shadow-sm"
                          />
                          <span>{row.username}</span>
                          {isSelf && (
                            <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded-full ml-1">
                              You
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded border uppercase ${levelStyle.split(' ').slice(2).join(' ')}`}>
                          {row.level}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-medium">
                        {row.problemsSolved}
                      </td>
                      <td className="py-3.5 px-4 text-center font-medium text-slate-400">
                        {Math.round(row.accuracy * 10) / 10}%
                      </td>
                      <td className="py-3.5 px-5 text-right font-bold text-indigo-400">
                        {row.xp.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
