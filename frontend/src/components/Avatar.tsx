import React from 'react';

interface AvatarProps {
  url?: string;
  username?: string;
  size?: number;
  className?: string;
}

export const AVATAR_PRESETS = [
  { id: 'avatar:wizard', name: 'Code Wizard', description: 'Master of algorithms & magic brackets' },
  { id: 'avatar:ninja', name: 'Keyboard Ninja', description: 'Stealthy bug execution & fast typing' },
  { id: 'avatar:coffee', name: 'Coffee Coder', description: 'Fueled by caffeine & clean syntax' },
  { id: 'avatar:robot', name: 'AI Bot', description: 'Neural network optimized automation' },
  { id: 'avatar:cyber', name: 'Cyberpunk', description: 'Futuristic debugger with neon visor' },
  { id: 'avatar:bug', name: 'Bug Hunter', description: 'Precision scanner of security exploits' },
  { id: 'avatar:rocket', name: 'Rocket Dev', description: 'High performance launcher of features' },
  { id: 'avatar:binary', name: 'Terminal Hacker', description: 'Matrix shell master' },
];

export const Avatar: React.FC<AvatarProps> = ({ url, username, size = 36, className = '' }) => {
  const initials = username?.charAt(0)?.toUpperCase() ?? '?';

  // Helper to get initials colors (based on username character sum to keep it stable per user)
  const getInitialsGradient = (name?: string) => {
    if (!name) return 'from-slate-600 to-slate-700';
    const sum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const gradients = [
      'from-slate-500 to-slate-600',
      'from-blue-500 to-indigo-600',
      'from-violet-500 to-purple-600',
      'from-amber-500 to-orange-600',
      'from-emerald-500 to-teal-600',
      'from-rose-500 to-red-600',
      'from-pink-500 to-fuchsia-600',
      'from-cyan-500 to-blue-600',
    ];
    return gradients[sum % gradients.length];
  };

  const gradientClass = getInitialsGradient(username);

  // Map preset keys to inline vector SVGs
  const renderPreset = (presetId: string) => {
    const strokeWidth = 1.5;
    
    switch (presetId) {
      case 'avatar:wizard':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad-wizard" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#grad-wizard)" />
            {/* Wizard Hat */}
            <path d="M30 65 L50 20 L70 65 Z" fill="#1e1b4b" stroke="#ffffff" strokeWidth={strokeWidth} />
            <path d="M25 65 C25 65, 50 72, 75 65 L70 60 C70 60, 50 67, 30 60 Z" fill="#fbbf24" stroke="#ffffff" strokeWidth={strokeWidth} />
            {/* Sparkles */}
            <path d="M30 35 L33 38 L30 41 L27 38 Z" fill="#fbbf24" />
            <path d="M70 30 L72 32 L70 34 L68 32 Z" fill="#fbbf24" />
            <path d="M50 12 L52 14 L50 16 L48 14 Z" fill="#ffffff" />
            {/* Code Brackets on hat */}
            <path d="M42 48 L37 53 L42 58" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            <path d="M58 48 L63 53 L58 58" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      case 'avatar:ninja':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad-ninja" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#be123c" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#grad-ninja)" />
            {/* Ninja Headband Mask */}
            <rect x="20" y="32" width="60" height="28" rx="4" fill="#18181b" stroke="#ffffff" strokeWidth={strokeWidth} />
            {/* Eye Cutout */}
            <rect x="30" y="38" width="40" height="16" rx="2" fill="#f43f5e" />
            {/* Eyes */}
            <circle cx="38" cy="46" r="2.5" fill="#ffffff" />
            <circle cx="62" cy="46" r="2.5" fill="#ffffff" />
            {/* Headband Ties */}
            <path d="M20 42 L8 38 L12 48 Z" fill="#18181b" />
            {/* Star Pattern */}
            <path d="M50 70 L53 76 L60 76 L55 80 L57 86 L50 82 L43 86 L45 80 L40 76 L47 76 Z" fill="#fbbf24" stroke="#ffffff" strokeWidth={0.8} />
          </svg>
        );

      case 'avatar:coffee':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad-coffee" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#grad-coffee)" />
            {/* Coffee Cup */}
            <path d="M30 45 L34 72 C35 77, 65 77, 66 72 L70 45 Z" fill="#1e293b" stroke="#ffffff" strokeWidth={strokeWidth} />
            {/* Handle */}
            <path d="M70 50 C77 50, 77 62, 70 62" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
            {/* Steam (S-Curves) */}
            <path d="M40 35 C42 30, 38 25, 40 20" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            <path d="M50 35 C52 30, 48 25, 50 20" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            <path d="M60 35 C62 30, 58 25, 60 20" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            {/* Code on Cup */}
            <path d="M44 54 L40 57 L44 60" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M56 54 L60 57 L56 60" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="48" y1="61" x2="52" y2="53" stroke="#f59e0b" strokeWidth="1.5" />
          </svg>
        );

      case 'avatar:robot':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad-robot" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#0891b2" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#grad-robot)" />
            {/* Robot Head */}
            <rect x="28" y="32" width="44" height="36" rx="8" fill="#0f172a" stroke="#ffffff" strokeWidth={strokeWidth} />
            {/* Neck */}
            <rect x="44" y="68" width="12" height="10" fill="#334155" stroke="#ffffff" strokeWidth={strokeWidth} />
            {/* Ears/Bolts */}
            <rect x="22" y="44" width="6" height="12" rx="2" fill="#64748b" stroke="#ffffff" strokeWidth={strokeWidth} />
            <rect x="72" y="44" width="6" height="12" rx="2" fill="#64748b" stroke="#ffffff" strokeWidth={strokeWidth} />
            {/* Visor Screen */}
            <rect x="34" y="38" width="32" height="18" rx="4" fill="#000000" />
            {/* Eyes (Glowing LEDs) */}
            <circle cx="43" cy="47" r="3" fill="#06b6d4" />
            <circle cx="57" cy="47" r="3" fill="#06b6d4" />
            {/* Antenna */}
            <line x1="50" y1="32" x2="50" y2="20" stroke="#ffffff" strokeWidth="2" />
            <circle cx="50" cy="18" r="3" fill="#fbbf24" />
          </svg>
        );

      case 'avatar:cyber':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad-cyber" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#grad-cyber)" />
            {/* Cyber Visor */}
            <path d="M20 40 H80 L76 56 H24 Z" fill="#000000" stroke="#ffffff" strokeWidth={strokeWidth} />
            {/* Visor Glow lines */}
            <line x1="22" y1="48" x2="78" y2="48" stroke="#ec4899" strokeWidth="2.5" />
            <line x1="28" y1="44" x2="72" y2="44" stroke="#06b6d4" strokeWidth="1" />
            {/* Headphones */}
            <path d="M24 50 C24 30, 76 30, 76 50" stroke="#1f2937" strokeWidth="4" strokeLinecap="round" />
            {/* Ear cups */}
            <rect x="16" y="44" width="8" height="18" rx="3" fill="#1f2937" stroke="#ffffff" strokeWidth={strokeWidth} />
            <rect x="76" y="44" width="8" height="18" rx="3" fill="#1f2937" stroke="#ffffff" strokeWidth={strokeWidth} />
            {/* Matrix rain or patterns in visor */}
            <rect x="48" y="51" width="4" height="2" fill="#ffffff" />
          </svg>
        );

      case 'avatar:bug':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad-bug" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#grad-bug)" />
            {/* Bug Body */}
            <ellipse cx="50" cy="55" rx="14" ry="18" fill="#1e293b" stroke="#ffffff" strokeWidth={strokeWidth} />
            {/* Bug Head */}
            <circle cx="50" cy="34" r="8" fill="#1e293b" stroke="#ffffff" strokeWidth={strokeWidth} />
            {/* Antennas */}
            <path d="M45 28 C42 22, 36 24, 34 26" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M55 28 C58 22, 64 24, 66 26" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
            {/* Legs */}
            <path d="M32 46 L24 42" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            <path d="M30 55 L22 55" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            <path d="M32 64 L24 68" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            <path d="M68 46 L76 42" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            <path d="M70 55 L78 55" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            <path d="M68 64 L76 68" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            {/* Magnifying Glass (overlaying) */}
            <circle cx="60" cy="45" r="16" fill="rgba(6, 182, 212, 0.15)" stroke="#ffffff" strokeWidth="2.5" />
            <line x1="72" y1="57" x2="84" y2="69" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" />
          </svg>
        );

      case 'avatar:rocket':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad-rocket" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#eab308" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#grad-rocket)" />
            {/* Rocket Body */}
            <path d="M50 18 C58 35, 58 60, 56 68 H44 C42 60, 42 35, 50 18 Z" fill="#f8fafc" stroke="#1e293b" strokeWidth={1.8} />
            {/* Nose Cone */}
            <path d="M50 18 C54 26, 56 32, 56 32 H44 C44 32, 46 26, 50 18 Z" fill="#ef4444" />
            {/* Fins */}
            <path d="M44 60 L32 70 V66 L44 54 Z" fill="#ef4444" stroke="#1e293b" strokeWidth={1} />
            <path d="M56 60 L68 70 V66 L56 54 Z" fill="#ef4444" stroke="#1e293b" strokeWidth={1} />
            {/* Window */}
            <circle cx="50" cy="44" r="5" fill="#38bdf8" stroke="#1e293b" strokeWidth="1.5" />
            {/* Fire Blast */}
            <path d="M46 68 L50 82 L54 68 Z" fill="#f97316" />
            <path d="M48 68 L50 78 L52 68 Z" fill="#f59e0b" />
          </svg>
        );

      case 'avatar:binary':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad-binary" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#grad-binary)" stroke="#10b981" strokeWidth="1.5" />
            {/* Code Console Display */}
            <rect x="20" y="24" width="60" height="52" rx="4" fill="#000000" stroke="#10b981" strokeWidth={strokeWidth} />
            {/* Command Line Prompt */}
            <path d="M28 36 L34 40 L28 44" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="38" y1="44" x2="48" y2="44" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
            {/* Floating Binary numbers */}
            <text x="56" y="42" fill="#10b981" fontSize="10" fontFamily="monospace" fontWeight="bold" opacity="0.8">1</text>
            <text x="32" y="60" fill="#10b981" fontSize="10" fontFamily="monospace" fontWeight="bold" opacity="0.5">0</text>
            <text x="48" y="66" fill="#10b981" fontSize="10" fontFamily="monospace" fontWeight="bold" opacity="0.9">1</text>
            <text x="64" y="58" fill="#10b981" fontSize="10" fontFamily="monospace" fontWeight="bold" opacity="0.6">0</text>
          </svg>
        );

      default:
        return null;
    }
  };

  const isPreset = url && url.startsWith('avatar:');

  return (
    <div
      className={`rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center select-none shadow-sm ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {isPreset ? (
        renderPreset(url!)
      ) : url && url.trim().length > 0 ? (
        <img
          src={url}
          alt={username ?? 'Avatar'}
          className="w-full h-full object-cover"
          onError={(e) => {
            // If image fails, clear it to fallback to initials
            (e.target as HTMLElement).style.display = 'none';
            // Show initials instead
            const sibling = (e.target as HTMLElement).nextElementSibling;
            if (sibling) (sibling as HTMLElement).style.display = 'flex';
          }}
        />
      ) : null}

      {/* Initials Fallback (always rendered in DOM as backup in case image fails, or used directly if no url) */}
      {(!url || !isPreset) && (
        <div
          className={`w-full h-full bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white font-bold tracking-wider`}
          style={{
            fontSize: `${Math.max(10, Math.floor(size * 0.4))}px`,
            display: url && url.trim().length > 0 ? 'none' : 'flex',
          }}
        >
          {initials}
        </div>
      )}
    </div>
  );
};
