import React from 'react';
import { ArrowLeft, Trophy, Medal, Calendar } from 'lucide-react';

interface LeaderboardProps {
    onBack: () => void;
}

interface ScoreEntry {
    name: string;
    score: number;
    date: string;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ onBack }) => {
    const [scores, setScores] = React.useState<ScoreEntry[]>([]);

    React.useEffect(() => {
        const saved = localStorage.getItem('2048-leaderboard');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Sort by score desc matches
                parsed.sort((a: ScoreEntry, b: ScoreEntry) => b.score - a.score);
                setScores(parsed);
            } catch (e) {
                console.error("Failed to load leaderboard", e);
            }
        }
    }, []);

    const getRankIcon = (index: number) => {
        if (index === 0) return <Medal className="text-yellow-400" size={24} />;
        if (index === 1) return <Medal className="text-gray-300" size={24} />;
        if (index === 2) return <Medal className="text-amber-600" size={24} />;
        return <span className="font-mono text-white/40 font-bold w-6 text-center">#{index + 1}</span>;
    };

    return (
        <div className="flex flex-col w-full max-w-md h-[80vh] px-4 pt-12 animate-fade-in relative z-20">
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={onBack}
                    className="p-2 rounded-xl bg-glass-100 hover:bg-glass-200 border border-white/10 text-white transition-all backdrop-blur-md active:scale-95"
                >
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 flex items-center space-x-2">
                    <Trophy size={24} className="text-purple-400 mr-2" />
                    HALL OF FAME
                </h2>
                <div className="w-10"></div> {/* Spacer */}
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {scores.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-white/30 space-y-3">
                        <Trophy size={48} className="opacity-20" />
                        <p>No records yet. Be the first!</p>
                    </div>
                ) : (
                    scores.map((entry, index) => (
                        <div
                            key={`${entry.name}-${entry.date}-${index}`}
                            className={`flex items-center justify-between p-4 rounded-xl border backdrop-blur-md transition-all
                            ${index === 0 ? 'bg-gradient-to-r from-yellow-500/10 to-transparent border-yellow-500/30' : 'bg-glass-100 border-white/5 hover:border-white/20'}`}
                        >
                            <div className="flex items-center space-x-4">
                                <div className="flex-none p-2 rounded-lg bg-black/20">
                                    {getRankIcon(index)}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-white tracking-wide">{entry.name}</span>
                                    <span className="text-[10px] text-white/30 flex items-center space-x-1">
                                        <Calendar size={10} />
                                        <span>{new Date(entry.date).toLocaleDateString()}</span>
                                    </span>
                                </div>
                            </div>
                            <span className="text-xl font-mono font-bold text-cyan-300">{entry.score}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
