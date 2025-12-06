import React, { memo } from 'react';

interface TileProps {
  value: number;
}

const getTileStyles = (value: number) => {
  const base = "flex items-center justify-center w-full h-full rounded-xl shadow-lg border backdrop-blur-md transition-all duration-200 animate-pop font-bold";
  
  if (value === 0) return "bg-glass-100 border-white/5"; // Empty placeholder styling handled by parent usually, but just in case

  switch (value) {
    case 2: return `${base} bg-white/10 border-white/20 text-white text-3xl shadow-[0_0_15px_rgba(255,255,255,0.1)]`;
    case 4: return `${base} bg-indigo-500/20 border-indigo-400/30 text-indigo-100 text-3xl shadow-[0_0_15px_rgba(99,102,241,0.2)]`;
    case 8: return `${base} bg-blue-500/30 border-blue-400/30 text-blue-50 text-3xl shadow-[0_0_20px_rgba(59,130,246,0.3)]`;
    case 16: return `${base} bg-cyan-500/30 border-cyan-400/30 text-cyan-50 text-3xl shadow-[0_0_20px_rgba(6,182,212,0.3)]`;
    case 32: return `${base} bg-teal-500/40 border-teal-400/40 text-teal-50 text-3xl shadow-[0_0_25px_rgba(20,184,166,0.4)]`;
    case 64: return `${base} bg-emerald-500/40 border-emerald-400/40 text-emerald-50 text-3xl shadow-[0_0_25px_rgba(16,185,129,0.4)]`;
    case 128: return `${base} bg-green-500/50 border-green-400/50 text-green-50 text-2xl shadow-[0_0_30px_rgba(34,197,94,0.5)]`;
    case 256: return `${base} bg-yellow-500/50 border-yellow-400/50 text-yellow-50 text-2xl shadow-[0_0_30px_rgba(234,179,8,0.5)]`;
    case 512: return `${base} bg-orange-500/60 border-orange-400/50 text-orange-50 text-2xl shadow-[0_0_35px_rgba(249,115,22,0.6)]`;
    case 1024: return `${base} bg-red-500/60 border-red-400/50 text-red-50 text-2xl shadow-[0_0_35px_rgba(239,68,68,0.6)]`;
    case 2048: return `${base} bg-purple-600/70 border-purple-400/60 text-white text-2xl shadow-[0_0_50px_rgba(147,51,234,0.8)] border-2 border-purple-200`;
    default: return `${base} bg-pink-600/70 border-pink-400/60 text-white text-xl shadow-[0_0_50px_rgba(219,39,119,0.8)]`;
  }
};

export const Tile: React.FC<TileProps> = memo(({ value }) => {
  return (
    <div className={getTileStyles(value)}>
       {value > 0 ? value : ''}
    </div>
  );
});

Tile.displayName = 'Tile';