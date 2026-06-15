import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAppTheme } from '../context/ThemeContext';
import { authService } from '../services/authService';
import { Avatar, AVATAR_PRESETS } from '../components/Avatar';
import {
  User,
  Lock,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Save,
  Sparkles,
} from 'lucide-react';

const Settings: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const {
    theme,
    setTheme,
    fontSize,
    setFontSize,
    lineHeight,
    setLineHeight,
    editorFontSize,
    setEditorFontSize,
    editorFontFamily,
    setEditorFontFamily,
  } = useAppTheme();
  
  // Tabs: 'profile', 'security', or 'appearance'
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'appearance'>('profile');

  // Edit Profile Form State
  const [firstName, setFirstName] = useState(profile?.firstName ?? '');
  const [lastName, setLastName] = useState(profile?.lastName ?? '');
  const [bio, setBio] = useState(profile?.bio ?? '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl ?? '');
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Security Form State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [securitySuccess, setSecuritySuccess] = useState(false);
  const [securityError, setSecurityError] = useState<string | null>(null);
  const [securityLoading, setSecurityLoading] = useState(false);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(false);
    setProfileLoading(true);
    try {
      await updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        bio: bio.trim(),
        avatarUrl: avatarUrl.trim(),
      });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err: any) {
      setProfileError(err?.response?.data?.message || 'Failed to update profile details.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityError(null);
    setSecuritySuccess(false);

    if (newPassword !== confirmPassword) {
      setSecurityError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setSecurityError('New password must be at least 6 characters.');
      return;
    }

    setSecurityLoading(true);
    try {
      await authService.changePassword({ oldPassword, newPassword });
      setSecuritySuccess(true);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSecuritySuccess(false), 3000);
    } catch (err: any) {
      setSecurityError(err?.response?.data?.message || 'Incorrect old password or update failed.');
    } finally {
      setSecurityLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Account Settings</h1>
          <p className="text-slate-400 text-sm mt-0.5">Manage your profile details and security settings</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Navigation Tabs */}
        <div className="w-full md:w-56 flex md:flex-col gap-1.5 flex-shrink-0">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${
              activeTab === 'profile'
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <User size={18} />
            Edit Profile
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${
              activeTab === 'security'
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Lock size={18} />
            Password & Security
          </button>
          <button
            onClick={() => setActiveTab('appearance')}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${
              activeTab === 'appearance'
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Sparkles size={18} />
            Appearance & Themes
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative">
          
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-5">
              <h2 className="text-lg font-bold text-white mb-2">Profile Information</h2>
              
              {profileSuccess && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                  <CheckCircle2 size={16} className="flex-shrink-0" />
                  Profile details updated successfully!
                </div>
              )}

              {profileError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  {profileError}
                </div>
              )}

              {/* Read Only Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 tracking-wider mb-1.5">
                    Username
                  </label>
                  <input
                    type="text"
                    disabled
                    value={profile?.username || ''}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-500 rounded-xl px-4 py-2.5 text-sm cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={profile?.email || ''}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-500 rounded-xl px-4 py-2.5 text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first-name" className="block text-xs font-semibold uppercase text-slate-400 tracking-wider mb-1.5">
                    First Name
                  </label>
                  <input
                    id="first-name"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="last-name" className="block text-xs font-semibold uppercase text-slate-400 tracking-wider mb-1.5">
                    Last Name
                  </label>
                  <input
                    id="last-name"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Bio Field */}
              <div>
                <label htmlFor="bio" className="block text-xs font-semibold uppercase text-slate-400 tracking-wider mb-1.5">
                  Bio / Tagline
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself, your favorite programming languages, etc."
                  rows={4}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Avatar Selector Gallery */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold uppercase text-slate-400 tracking-wider">
                  Select Custom Avatar Preset
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {AVATAR_PRESETS.map((preset) => {
                    const isSelected = avatarUrl === preset.id;
                    return (
                      <div
                        key={preset.id}
                        onClick={() => setAvatarUrl(preset.id)}
                        className={`p-3 rounded-2xl border bg-slate-950/40 hover:bg-slate-950/80 cursor-pointer transition-all flex flex-col items-center gap-2 relative group ${
                          isSelected
                            ? 'ring-2 ring-indigo-500 border-transparent bg-slate-950 shadow-md shadow-indigo-500/10'
                            : 'border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <Avatar
                          url={preset.id}
                          username={profile?.username}
                          size={48}
                          className="shadow-sm"
                        />
                        <span className="text-[10px] font-bold text-slate-300 text-center block truncate max-w-full">
                          {preset.name}
                        </span>
                        {/* Tooltip for preset description */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-slate-950 border border-slate-800 text-[9px] text-slate-400 px-2 py-1 rounded shadow-xl whitespace-nowrap z-10 pointer-events-none">
                          {preset.description}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Custom Avatar URL Field */}
              <div>
                <label htmlFor="avatar" className="block text-xs font-semibold uppercase text-slate-400 tracking-wider mb-1.5">
                  Or enter a Custom Image URL
                </label>
                <input
                  id="avatar"
                  type="text"
                  value={avatarUrl.startsWith('avatar:') ? '' : avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <p className="text-[10px] text-slate-500 mt-1.5">Provide a direct image URL (jpg, png, svg) to use a external avatar profile image.</p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-end">
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-indigo-500/10"
                >
                  {profileLoading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save size={15} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <h2 className="text-lg font-bold text-white mb-2">Change Password</h2>

              {securitySuccess && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                  <CheckCircle2 size={16} className="flex-shrink-0" />
                  Password updated successfully!
                </div>
              )}

              {securityError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  {securityError}
                </div>
              )}

              {/* Old Password */}
              <div>
                <label htmlFor="old-password" className="block text-xs font-semibold uppercase text-slate-400 tracking-wider mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    id="old-password"
                    type={showOldPassword ? 'text' : 'password'}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    onClick={() => setShowOldPassword((v) => !v)}
                  >
                    {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label htmlFor="new-password" className="block text-xs font-semibold uppercase text-slate-400 tracking-wider mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    onClick={() => setShowNewPassword((v) => !v)}
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label htmlFor="confirm-password" className="block text-xs font-semibold uppercase text-slate-400 tracking-wider mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-end">
                <button
                  type="submit"
                  disabled={securityLoading}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-indigo-500/10"
                >
                  {securityLoading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Lock size={15} />
                      Update Password
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Appearance & Themes</h2>
                <p className="text-slate-400 text-xs">Customize your visual interface, colors, and layout typography</p>
              </div>

              {/* Theme Grid */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold uppercase text-slate-400 tracking-wider">
                  Select Theme
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      id: 'slate' as const,
                      name: 'Lavender Light (Default)',
                      desc: 'Modern, soft pastel lavender mockup style.',
                      bg: 'bg-[#f4f3ff]',
                      border: 'border-[#e2dffe]',
                      dots: ['bg-[#8a3ffc]', 'bg-[#1e1b4b]'],
                    },
                    {
                      id: 'dark' as const,
                      name: 'Slate Dark',
                      desc: 'Clean, standard, dark slate theme.',
                      bg: 'bg-[#0f172a]',
                      border: 'border-[#1e293b]',
                      dots: ['bg-[#6366f1]', 'bg-[#94a3b8]'],
                    },
                  ].map((t) => {
                    const active = theme === t.id;
                    return (
                      <div
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 hover:scale-[1.01] ${t.bg} ${t.border} ${
                          active
                            ? 'ring-2 ring-indigo-500 border-transparent shadow-lg shadow-indigo-500/10'
                            : 'opacity-85 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-white">{t.name}</span>
                          <div className="flex gap-1.5">
                            {t.dots.map((dotClass, idx) => (
                              <span key={idx} className={`w-3.5 h-3.5 rounded-full ${dotClass}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-slate-400 text-xs leading-relaxed">{t.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Typography Scaling controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
                {/* Font Size */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-semibold uppercase text-slate-400 tracking-wider">
                    App Font Size
                  </label>
                  <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-0.5 w-full">
                    {(['small', 'medium', 'large', 'xl'] as const).map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setFontSize(size)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                          fontSize === size
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-500">Adjusts text descriptions and question layout sizing.</p>
                </div>

                {/* Line Height */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-semibold uppercase text-slate-400 tracking-wider">
                    Description Line Spacing
                  </label>
                  <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-0.5 w-full">
                    {(['tight', 'normal', 'loose'] as const).map((height) => (
                      <button
                        key={height}
                        type="button"
                        onClick={() => setLineHeight(height)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                          lineHeight === height
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {height}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-500">Increases spacing between lines for relaxed readability.</p>
                </div>
              </div>

              {/* Code Editor Customization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
                {/* Editor Font Family */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-semibold uppercase text-slate-400 tracking-wider">
                    Editor Font Family
                  </label>
                  <select
                    value={editorFontFamily}
                    onChange={(e) => setEditorFontFamily(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-mono"
                  >
                    <option value="'Fira Code', 'JetBrains Mono', monospace">Fira Code</option>
                    <option value="'JetBrains Mono', monospace">JetBrains Mono</option>
                    <option value="'Source Code Pro', monospace">Source Code Pro</option>
                    <option value="'Courier New', Courier, monospace">Courier New</option>
                  </select>
                </div>

                {/* Editor Font Size */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-semibold uppercase text-slate-400 tracking-wider">
                      Editor Font Size
                    </label>
                    <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded font-mono">
                      {editorFontSize}px
                    </span>
                  </div>
                  <div className="flex items-center gap-3 pt-1">
                    <input
                      type="range"
                      min="12"
                      max="24"
                      step="1"
                      value={editorFontSize}
                      onChange={(e) => setEditorFontSize(parseInt(e.target.value, 10))}
                      className="flex-1 accent-indigo-500 bg-slate-950 h-1 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;
