import React from 'react';
import { RefreshCw, Trophy, Home } from 'lucide-react';

interface MenuProps {
  score: number;
  bestScore: number;
  onReset: () => void;
  onHome: () => void;
}

export const Menu: React.FC<MenuProps> = ({ score, bestScore, onReset, onHome }) => {
  return (
    <div className="w-[90vw] max-w-md mx-auto pt-6 pb-2">
      <div className="flex items-center justify-between bg-glass-100 rounded-2xl p-2 border border-white/10 backdrop-blur-xl shadow-lg w-full">

        {/* Left: Title */}
        <div className="pl-2">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 tracking-tighter drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
            2048
          </h1>
        </div>

        {/* Center: Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onHome}
            className="w-10 h-10 flex items-center justify-center bg-cyan-900/30 hover:bg-cyan-900/50 text-cyan-200 rounded-xl border border-cyan-500/20 transition-all active:scale-95"
          >
            <Home size={18} />
          </button>
          <button
            onClick={onReset}
            className="w-10 h-10 flex items-center justify-center bg-red-900/30 hover:bg-red-900/50 text-red-200 rounded-xl border border-red-500/20 transition-all active:scale-95"
          >
            <RefreshCw size={18} />
          </button>
        </div>

        {/* Right: Scores */}
        <div className="flex space-x-2">
          <div className="flex flex-col items-center justify-center bg-black/20 border border-white/5 rounded-xl px-5 py-2 min-w-[100px]">
            <span className="text-[9px] uppercase text-cyan-300/80 font-bold tracking-wider mb-0.5">Score</span>
            <span className="text-base font-mono text-white font-bold leading-none">{score}</span>
          </div>
          <div className="flex flex-col items-center justify-center bg-black/20 border border-white/5 rounded-xl px-5 py-2 min-w-[100px]">
            <div className="flex items-center space-x-1 mb-0.5">
              <Trophy size={10} className="text-yellow-400" />
              <span className="text-[9px] uppercase text-yellow-400/80 font-bold tracking-wider">Best</span>
            </div>
            <span className="text-base font-mono text-white font-bold leading-none">{bestScore}</span>
          </div>
        </div>
      </div>
    </div>
  );
};