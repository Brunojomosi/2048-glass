import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Background } from './components/Background';
import { Menu } from './components/Menu';
import { Tile } from './components/Tile';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Leaderboard } from './components/Leaderboard';
import { Grid, Direction } from './types';
import { getEmptyGrid, addRandomTile, moveGrid, checkGameOver } from './utils/gameLogic';


const App: React.FC = () => {
  const [grid, setGrid] = useState<Grid>(getEmptyGrid());
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [view, setView] = useState<'welcome' | 'game' | 'leaderboard'>('welcome');
  const [playerName, setPlayerName] = useState('');



  // Load Best Score
  useEffect(() => {
    const saved = localStorage.getItem('2048-best-score');
    if (saved) setBestScore(parseInt(saved));
    initGame();
  }, []);

  // Update Best Score
  // Update Best Score and Save to Leaderboard on Game Over
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('2048-best-score', score.toString());
    }
  }, [score, bestScore]);

  useEffect(() => {
    if (gameOver && score > 0) {
      const history = JSON.parse(localStorage.getItem('2048-leaderboard') || '[]');
      history.push({
        name: playerName || 'Anonymous',
        score: score,
        date: new Date().toISOString()
      });
      history.sort((a: any, b: any) => b.score - a.score);
      localStorage.setItem('2048-leaderboard', JSON.stringify(history.slice(0, 50)));
    }
  }, [gameOver]);

  const initGame = () => {
    let newGrid = getEmptyGrid();
    newGrid = addRandomTile(newGrid);
    newGrid = addRandomTile(newGrid);
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);

  };

  const handleMove = useCallback((direction: Direction) => {
    if (gameOver || view !== 'game') return;


    const { grid: newGrid, score: moveScore, moved } = moveGrid(grid, direction);

    if (moved) {
      // Light haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }

      let finalGrid = addRandomTile(newGrid);
      setGrid(finalGrid);
      setScore(prev => prev + moveScore);

      if (checkGameOver(finalGrid)) {
        setGameOver(true);
      }
    }
  }, [grid, gameOver]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': handleMove('UP'); break;
        case 'ArrowDown': handleMove('DOWN'); break;
        case 'ArrowLeft': handleMove('LEFT'); break;
        case 'ArrowRight': handleMove('RIGHT'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove]);

  // Touch controls
  const touchStart = useRef<{ x: number, y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const diffX = touchEndX - touchStart.current.x;
    const diffY = touchEndY - touchStart.current.y;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (Math.abs(diffX) > 30) {
        if (diffX > 0) handleMove('RIGHT');
        else handleMove('LEFT');
      }
    } else {
      if (Math.abs(diffY) > 30) {
        if (diffY > 0) handleMove('DOWN');
        else handleMove('UP');
      }
    }
    touchStart.current = null;
  };



  return (
    <div className="relative w-full min-h-[100dvh] flex flex-col items-center font-sans overflow-x-hidden overflow-y-auto">
      <Background />

      {view === 'welcome' && (
        <div className="flex-1 flex items-center justify-center w-full min-h-[100dvh]">
          <WelcomeScreen
            onStart={(name) => {
              setPlayerName(name);
              setView('game');
              initGame();
            }}
            onShowLeaderboard={() => setView('leaderboard')}
          />
        </div>
      )}

      {view === 'leaderboard' && (
        <Leaderboard onBack={() => setView('welcome')} />
      )}

      {view === 'game' && (
        <div className="flex flex-col items-center justify-between min-h-[100dvh] py-8 w-full max-w-lg mx-auto">
          <div className="flex-none z-10 text-center w-full animate-slide mb-4">
            <Menu
              score={score}
              bestScore={bestScore}
              onReset={initGame}
              onHome={() => setView('welcome')}
            />
          </div>

          {/* Main Game Container */}
          <div className="flex-none relative z-10 animate-pop mb-8 mt-6">
            <div
              className="relative w-[90vw] max-w-md aspect-square bg-glass-100 rounded-2xl p-3 border border-white/10 backdrop-blur-xl shadow-2xl mx-auto"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* The Grid */}
              <div className="w-full h-full grid grid-cols-4 grid-rows-4 gap-2 sm:gap-3">
                {grid.map((row, rIndex) => (
                  row.map((val, cIndex) => (
                    <div key={`${rIndex}-${cIndex}`} className="relative w-full h-full bg-black/20 rounded-xl">
                      <div className="absolute inset-0">
                        <Tile value={val} />
                      </div>
                    </div>
                  ))
                ))}
              </div>

              {/* Game Over Overlay */}
              {gameOver && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md rounded-2xl animate-fade-in">
                  <h2 className="text-5xl font-bold text-white mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">Game Over</h2>
                  <p className="text-white/60 mb-2 font-mono">Final Score: {score}</p>
                  <div className="flex space-x-4">
                    <button
                      onClick={initGame}
                      className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-white font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-105 transition-transform"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={() => setView('leaderboard')}
                      className="px-6 py-3 bg-glass-200 rounded-full text-white font-bold hover:bg-glass-300 transition-colors"
                    >
                      Leaderboard
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex-none text-center text-white/20 text-xs font-mono z-10 animate-fade-in pb-4">
            SWIPE TO MOVE &bull; POWERED BY MAGENTA DESENVOLVE
          </div>
        </div>
      )}
    </div>
  );
};

export default App;