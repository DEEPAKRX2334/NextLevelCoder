import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  color: string;
  left: string;
  size: string;
  delay: string;
  duration: string;
  drift: string;
  shape: 'circle' | 'square' | 'triangle';
}

const SHAPES: ('circle' | 'square' | 'triangle')[] = ['circle', 'square', 'triangle'];
const COLORS = [
  '#8a3ffc', // brand purple
  '#6366f1', // indigo
  '#10b981', // emerald
  '#ec4899', // pink
  '#f59e0b', // amber
  '#06b6d4', // cyan
];

export const Confetti: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Generate 80 random particles
    const generated: Particle[] = Array.from({ length: 80 }).map((_, idx) => {
      const size = Math.floor(Math.random() * 8) + 6; // 6px to 14px
      const left = Math.random() * 100; // 0% to 100% of viewport width
      const delay = Math.random() * 1.5; // 0s to 1.5s staggered start
      const duration = Math.random() * 2 + 2.5; // 2.5s to 4.5s fall duration
      const drift = (Math.random() * 150 - 75) + 'px'; // horizontal sway offset
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];

      return {
        id: idx,
        color,
        left: `${left}%`,
        size: `${size}px`,
        delay: `${delay}s`,
        duration: `${duration}s`,
        drift,
        shape,
      };
    });

    setParticles(generated);

    // Auto cleanup after 5 seconds
    const timer = setTimeout(() => {
      setVisible(false);
    }, 5500);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {particles.map((p) => {
        const style: React.CSSProperties = {
          position: 'absolute',
          top: '-20px',
          left: p.left,
          width: p.size,
          height: p.size,
          backgroundColor: p.shape === 'triangle' ? 'transparent' : p.color,
          borderColor: p.shape === 'triangle' ? `transparent transparent ${p.color} transparent` : undefined,
          borderStyle: p.shape === 'triangle' ? 'solid' : undefined,
          borderWidth: p.shape === 'triangle' ? `0 ${parseInt(p.size) / 2}px ${p.size} 0` : undefined,
          borderRadius: p.shape === 'circle' ? '50%' : undefined,
          animationName: 'nlc-confetti-fall',
          animationDuration: p.duration,
          animationDelay: p.delay,
          animationTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          animationFillMode: 'forwards',
          opacity: 0.85,
          transform: 'rotate(0deg)',
          '--drift-x': p.drift,
        } as any;

        return <div key={p.id} style={style} />;
      })}
    </div>
  );
};

export default Confetti;
