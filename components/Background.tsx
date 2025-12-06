import React from 'react';

export const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0a0a0f]">
        {/* Deep space base */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-[#0f0c29] to-[#302b63] opacity-80" />
        
        {/* Animated Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-600/30 rounded-full blur-[100px] animate-pulse delay-1000" />
        <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-cyan-500/20 rounded-full blur-[80px] animate-bounce duration-[10000ms]" />

        {/* Grid overlay for tech feel */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
    </div>
  );
};