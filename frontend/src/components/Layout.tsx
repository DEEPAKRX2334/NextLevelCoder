import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Avatar } from './Avatar';
import logo from '../assets/logo.png';
import {
  LayoutDashboard,
  Code2,
  Trophy,
  BookOpen,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronRight,
  Gamepad2,
  NotebookPen,
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
  { label: 'Problems', path: '/problems', icon: <Code2 size={20} /> },
  { label: 'Learn', path: '/learn', icon: <BookOpen size={20} /> },
  { label: 'My Notes', path: '/notes', icon: <NotebookPen size={20} /> },
  { label: 'Coding Games', path: '/games', icon: <Gamepad2 size={20} /> },
  { label: 'Leaderboard', path: '/leaderboard', icon: <Trophy size={20} /> },
  { label: 'Profile', path: '/profile', icon: <User size={20} /> },
  { label: 'Settings', path: '/settings', icon: <Settings size={20} /> },
];

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { profile, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Array<{ id: number; title: string; message: string; type: string; isRead: boolean; createdAt: string }>>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [bellDropdownOpen, setBellDropdownOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
      const countRes = await api.get('/notifications/unread-count');
      setUnreadCount(countRes.data.unreadCount);
    } catch (e) {
      console.error('Failed to fetch notifications', e);
    }
  };

  useEffect(() => {
    if (profile) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [profile]);

  const handleMarkAsRead = async (id: number) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (e) {
      console.error('Failed to mark notification as read', e);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error('Failed to mark all as read', e);
    }
  };

  const handleNotificationClick = (n: any) => {
    handleMarkAsRead(n.id);
    setBellDropdownOpen(false);
    
    if (n.message.toLowerCase().includes('problem')) {
      navigate('/problems');
    } else if (n.message.toLowerCase().includes('quiz') || n.message.toLowerCase().includes('lesson')) {
      navigate('/learn');
    } else {
      navigate('/dashboard');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };



  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex relative overflow-hidden">
      {/* Aurora background glows to attract and be interactive */}
      <div className="absolute top-[-50px] right-[10%] w-[400px] h-[400px] bg-[#8a3ffc]/15 rounded-full blur-[100px] z-0 pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[10%] left-[20%] w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[120px] z-0 pointer-events-none animate-pulse" style={{ animationDuration: '12s' }} />
      <div className="absolute top-[40%] right-[-100px] w-[350px] h-[350px] bg-orange-400/8 rounded-full blur-[90px] z-0 pointer-events-none" />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Vibrant Purple Gradient matching the mockup */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-[#8a3ffc] to-[#6228dc] text-white border-r border-transparent z-30 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Logo container matching mockup */}
        <div className="p-4 flex items-center gap-3 border-b border-white/10 w-full relative">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 overflow-hidden flex items-center justify-center rounded-xl bg-slate-950/60 flex-shrink-0 border border-white/10">
              <img src={logo} alt="Logo" className="w-14 h-14 max-w-none object-cover object-top" />
            </div>
            <div>
              <span className="font-bold text-white text-base tracking-tight">NextLevel</span>
              <span className="font-bold text-violet-200 text-base tracking-tight block -mt-1">Coder</span>
            </div>
          </Link>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 lg:hidden text-white/70 hover:text-white z-10"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* User info card with opacity track */}
        <div className="px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Avatar
              url={profile?.avatarUrl}
              username={profile?.username}
              size={40}
              className="border-2 border-white/20 bg-white"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{profile?.username ?? 'User'}</p>
              <span className="text-xs font-medium text-violet-200">
                {profile?.level ?? 'Beginner'}
              </span>
            </div>
          </div>
          {/* XP Bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-violet-200 mb-1">
              <span>{profile?.xp ?? 0} XP</span>
              <span>Next level</span>
            </div>
            <div className="h-1.5 bg-white/25 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-700"
                style={{ width: `${Math.min(((profile?.xp ?? 0) % 500) / 500 * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Navigation - rounded-xl buttons with white transparency active states */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
                  ${isActive
                    ? 'bg-white/20 text-white shadow-sm font-semibold'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
              >
                <span className={isActive ? 'text-white' : 'text-white/60 group-hover:text-white'}>
                  {item.icon}
                </span>
                {item.label}
                {isActive && <ChevronRight size={14} className="ml-auto text-white" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout container */}
        <div className="px-3 pb-4 border-t border-white/10 pt-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all duration-150 w-full"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 animate-fade-in">
        {/* Top bar with pill search and profile block */}
        <header className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-sm border-b border-slate-800 px-4 lg:px-6 h-16 flex items-center gap-4">
          <button
            className="lg:hidden text-slate-400 hover:text-white"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu size={22} />
          </button>

          {/* Search bar matching the mockup search box */}
          <div className="hidden sm:flex items-center relative w-64">
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-slate-900 border border-slate-800 rounded-full px-4 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#8a3ffc] focus:border-transparent transition-all"
            />
          </div>

          <div className="flex-1" />

          {/* Notification bell */}
          <div className="relative">
            <button
              onClick={() => setBellDropdownOpen(!bellDropdownOpen)}
              className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#8a3ffc] text-[9px] font-extrabold text-white shadow-sm ring-1 ring-slate-950">
                  {unreadCount}
                </span>
              )}
            </button>

            {bellDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setBellDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden py-1">
                  <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                      <Bell size={13} className="text-[#8a3ffc]" />
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer active:scale-95 transition-all"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60 scrollbar-thin">
                    {notifications.length === 0 ? (
                      <div className="text-center py-8 px-4">
                        <Bell className="mx-auto text-slate-700 mb-2 opacity-50" size={22} />
                        <p className="text-[11px] text-slate-500 font-medium">All caught up! No notifications yet.</p>
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => handleNotificationClick(n)}
                          className={`px-4 py-3 hover:bg-slate-800/40 transition-colors cursor-pointer flex gap-2.5 relative ${
                            !n.isRead ? 'bg-slate-800/10' : ''
                          }`}
                        >
                          {!n.isRead && (
                            <span className="absolute top-4 left-2.5 w-1.5 h-1.5 bg-[#8a3ffc] rounded-full" />
                          )}
                          <div className={`flex-1 min-w-0 ${!n.isRead ? 'pl-2' : ''}`}>
                            <p className="text-xs font-bold text-slate-200 truncate">{n.title}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed break-words">
                              {n.message}
                            </p>
                            <span className="text-[9px] text-slate-500 font-semibold block mt-1">
                              {new Date(n.createdAt).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User profile block matching mockup header profile display */}
          <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-100 leading-tight">{profile?.username ?? 'User'}</p>
              <p className="text-[9px] text-slate-400 font-semibold leading-none mt-0.5 uppercase tracking-wider">{profile?.level ?? 'Beginner'}</p>
            </div>
            {/* Avatar */}
            <Avatar
              url={profile?.avatarUrl}
              username={profile?.username}
              size={36}
              className="cursor-pointer border border-white"
            />
          </div>
        </header>

        {/* Page content container */}
        <main className="flex-1 px-4 pb-4 pt-4 lg:px-6 lg:pb-6 lg:pt-4 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
