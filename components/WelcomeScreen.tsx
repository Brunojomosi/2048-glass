import React, { useState } from 'react';
import { Play, Trophy, User } from 'lucide-react';

interface WelcomeScreenProps {
    onStart: (name: string) => void;
    onShowLeaderboard: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, onShowLeaderboard }) => {
    const [name, setName] = useState(localStorage.getItem('2048-last-player') || '');

    const handleStart = () => {
        if (!name.trim()) return;
        localStorage.setItem('2048-last-player', name.trim());
        onStart(name.trim());
    };

    return (
        <div className="flex flex-col items-center justify-center space-y-12 animate-fade-in w-full max-w-sm px-6">


            <div className="text-center space-y-2">
                <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 tracking-tighter drop-shadow-lg">
                    2048
                </h1>
                <p className="text-white/40 text-sm font-mono tracking-[0.3em] uppercase">Quantum Edition</p>
            </div>

            {/* Input Section */}
            <div className="w-full space-y-4">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={18} className="text-cyan-400/70" />
                    </div>
                    <input
                        type="text"
                        placeholder="Enter your codename"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-glass-100 border border-white/10 rounded-xl py-4 pl-10 pr-4 text-white text-lg font-mono placeholder:text-white/20 focus:outline-none focus:border-cyan-400/50 focus:bg-glass-200 transition-all shadow-inner backdrop-blur-md"
                    />
                </div>

                <button
                    onClick={handleStart}
                    disabled={!name.trim()}
                    className={`w-full group relative flex items-center justify-center space-x-2 py-4 rounded-xl text-lg font-bold tracking-wide transition-all duration-300
            ${name.trim()
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-[1.02]'
                            : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'}`}
                >
                    <Play size={20} className={name.trim() ? "fill-white" : ""} />
                    <span>START MISSION</span>
                    {name.trim() && (
                        <div className="absolute inset-0 rounded-xl bg-white/20 blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    )}
                </button>

                <button
                    onClick={onShowLeaderboard}
                    className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-glass-100 border border-white/10 text-cyan-200/80 hover:bg-glass-200 hover:text-white hover:border-white/30 transition-all duration-300 backdrop-blur-sm"
                >
                    <Trophy size={18} />
                    <span className="font-medium text-sm tracking-wider uppercase">Hall of Fame</span>
                </button>
            </div>
        </div>
    );
};
