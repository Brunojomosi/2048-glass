import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Background } from './components/Background';
import { Menu } from './components/Menu';
import { Tile } from './components/Tile';
import { Grid, Direction, AIResponse } from './types';
import { getEmptyGrid, addRandomTile, moveGrid, checkGameOver } from './utils/gameLogic';
import { getNextMoveHint } from './services/geminiService';

const App: React.FC = () => {
  const [grid, setGrid] = useState<Grid>(getEmptyGrid());
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  
  // AI State
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiHint, setAiHint] = useState<AIResponse | null>(null);

  // Load Best Score
  useEffect(() => {
    const saved = localStorage.getItem('2048-best-score');
    if (saved) setBestScore(parseInt(saved));
    initGame();
  }, []);

  // Update Best Score
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('2048-best-score', score.toString());
    }
  }, [score, bestScore]);

  const initGame = () => {
    let newGrid = getEmptyGrid();
    newGrid = addRandomTile(newGrid);
    newGrid = addRandomTile(newGrid);
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
    setAiHint(null);
  };

  const handleMove = useCallback((direction: Direction) => {
    if (gameOver) return;

    setAiHint(null); // Clear hint on move
    const { grid: newGrid, score: moveScore, moved } = moveGrid(grid, direction);

    if (moved) {
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

  const handleAiHint = async () => {
    if (gameOver || isAiLoading) return;
    setIsAiLoading(true);
    const result = await getNextMoveHint(grid, score);
    setAiHint(result);
    setIsAiLoading(false);
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden font-sans">
      <Background />
      
      <Menu 
        score={score} 
        bestScore={bestScore} 
        onReset={initGame} 
        onAiHint={handleAiHint}
        isAiLoading={isAiLoading}
        aiHint={aiHint}
      />

      {/* Main Game Container */}
      <div 
        className="relative w-[90vw] max-w-md aspect-square bg-glass-100 rounded-2xl p-3 border border-white/10 backdrop-blur-xl shadow-2xl mt-4"
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
             <p className="text-white/60 mb-8 font-mono">Final Score: {score}</p>
             <button 
               onClick={initGame}
               className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-white font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-105 transition-transform"
             >
               Try Again
             </button>
          </div>
        )}
      </div>

      <div className="mt-8 text-center text-white/20 text-xs font-mono">
        SWIPE TO MOVE &bull; POWERED BY REACT & GEMINI
      </div>
    </div>
  );
};

export default App;