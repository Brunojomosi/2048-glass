import React from 'react';
import { RefreshCw, Cpu, Trophy, Activity } from 'lucide-react';

interface MenuProps {
  score: number;
  bestScore: number;
  onReset: () => void;
  onAiHint: () => void;
  isAiLoading: boolean;
  aiHint?: { move: string; reason: string } | null;
}

export const Menu: React.FC<MenuProps> = ({ score, bestScore, onReset, onAiHint, isAiLoading, aiHint }) => {
  return (
    <div className="w-full max-w-md px-4 pt-6 pb-2 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] tracking-tighter">
            2048
          </h1>
          <p className="text-white/40 text-xs font-mono tracking-widest uppercase">Quantum Edition</p>
        </div>
        
        <div className="flex space-x-3">
            <div className="flex flex-col items-center justify-center bg-glass-100 border border-white/10 rounded-xl px-4 py-2 backdrop-blur-md">
                <span className="text-[10px] uppercase text-cyan-300 font-bold tracking-wider">Score</span>
                <span className="text-xl font-mono text-white font-bold">{score}</span>
            </div>
            <div className="flex flex-col items-center justify-center bg-glass-100 border border-white/10 rounded-xl px-4 py-2 backdrop-blur-md">
                <div className="flex items-center space-x-1">
                    <Trophy size={10} className="text-yellow-400" />
                    <span className="text-[10px] uppercase text-yellow-400 font-bold tracking-wider">Best</span>
                </div>
                <span className="text-xl font-mono text-white font-bold">{bestScore}</span>
            </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex justify-between items-stretch space-x-3 h-14">
        
        {/* Reset */}
        <button 
            onClick={onReset}
            className="flex-none w-14 flex items-center justify-center bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-xl border border-red-500/30 transition-all active:scale-95 backdrop-blur-sm"
        >
            <RefreshCw size={24} />
        </button>

        {/* AI Hint Button */}
        <button 
            onClick={onAiHint}
            disabled={isAiLoading}
            className={`flex-1 flex items-center justify-center space-x-2 rounded-xl border transition-all active:scale-95 backdrop-blur-sm
            ${isAiLoading 
                ? 'bg-cyan-900/40 border-cyan-700/50 cursor-not-allowed' 
                : 'bg-glass-200 border-white/20 hover:bg-white/20 text-cyan-100 shadow-[0_0_15px_rgba(6,182,212,0.15)]'}`}
        >
            {isAiLoading ? (
                <Activity className="animate-spin text-cyan-400" size={20} />
            ) : (
                <Cpu size={20} className={aiHint ? 'text-purple-300' : 'text-cyan-300'} />
            )}
            <span className="font-semibold text-sm">
                {isAiLoading ? 'Analyzing...' : 'AI Neural Hint'}
            </span>
        </button>
      </div>

      {/* Hint Display */}
      {aiHint && (
        <div className="animate-fade-in w-full bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border border-purple-500/30 rounded-xl p-3 backdrop-blur-md flex items-center justify-between">
           <div className="flex items-center space-x-3">
             <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-400/50">
                <span className="font-bold text-purple-200">{aiHint.move.charAt(0)}</span>
             </div>
             <p className="text-sm text-purple-100 font-medium leading-tight">{aiHint.reason}</p>
           </div>
           <div className="text-[10px] font-mono text-white/30 uppercase">Gemini 2.5</div>
        </div>
      )}
    </div>
  );
};