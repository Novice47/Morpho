import React from 'react';

export default function GraphicComposer({ type, gradient, size = 'md' }) {
  const getSizingClass = () => {
    if (size === 'lg') return 'w-48 h-48';
    if (size === 'sm') return 'w-14 h-14';
    return 'w-32 h-32';
  };

  return (
    <div 
      className="w-full h-full rounded-2xl relative overflow-hidden flex items-center justify-center border border-white/5 shadow-inner"
      style={{ background: gradient }}
    >
      {/* GLOBAL HUD DESIGN OVERLAY */}
      <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />
      <div className="absolute inset-2 border border-white/5 rounded-xl pointer-events-none" />
      
      {/* SHAPE SPECIFIC RENDERS */}
      <div className={`relative ${getSizingClass()} flex items-center justify-center`}>
        
        {/* TORUS / NEON ORB */}
        {type === 'torus' && (
          <div className="relative w-full h-full flex items-center justify-center animate-spin-slow">
            {/* Outer dotted orbit */}
            <div className="absolute inset-0 border-2 border-dashed border-white/20 rounded-full" />
            {/* Glow Core */}
            <div className="absolute w-2/3 h-2/3 rounded-full bg-white/5 border border-white/30 backdrop-blur-sm shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
            {/* Inner rotating rings */}
            <div className="absolute w-4/5 h-4/5 border-[3px] border-brand-cyan/60 rounded-full animate-pulse" style={{ transform: 'rotateX(60deg)' }} />
            <div className="absolute w-3/4 h-3/4 border-[3px] border-brand-magenta/80 rounded-full" style={{ transform: 'rotateY(50deg)' }} />
            <div className="absolute w-1/2 h-1/2 border-2 border-brand-violet rounded-full" style={{ transform: 'rotateX(30deg) rotateY(30deg)' }} />
          </div>
        )}

        {type === 'cubes' && (
          <div className="relative w-full h-full flex items-center justify-center" style={{ perspective: '800px', transformStyle: 'preserve-3d' }}>
            {/* Base platform */}
            <div className="absolute bottom-2 w-4/5 h-4 bg-black/40 blur-md rounded-full" />
            
            {/* Main Cube */}
            <div 
              className="w-16 h-16 absolute bg-white/5 border-2 border-white/40 shadow-glow-cyan/20 animate-float-slow"
              style={{
                transformStyle: 'preserve-3d',
                transform: 'rotateX(35deg) rotateY(45deg) translateZ(10px)',
              }}
            >
              {/* Wireframe grids inside main cube */}
              <div className="absolute inset-1 border border-brand-cyan/30" />
              <div className="absolute inset-2 border border-brand-violet/50" />
            </div>

            {/* Small floating satellite cube */}
            <div 
              className="w-8 h-8 absolute bg-brand-violet/10 border border-brand-violet/60 animate-float-medium"
              style={{
                transformStyle: 'preserve-3d',
                transform: 'rotateX(-20deg) rotateY(-20deg) translateZ(50px) translateX(-30px) translateY(-30px)',
              }}
            />
          </div>
        )}

        {/* FLUID WAVES */}
        {type === 'waves' && (
          <div className="w-full h-full flex flex-col justify-end p-4 gap-2 relative">
            {/* Ambient bubble particles */}
            <span className="w-2 h-2 rounded-full bg-white/20 absolute top-4 left-6 animate-ping" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/30 absolute top-8 right-8 animate-pulse" />
            
            {/* Wave lines */}
            <div className="w-full h-6 relative overflow-hidden">
              <svg className="w-full h-full absolute bottom-0" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path 
                  d="M0,10 C30,20 70,0 100,10 L100,20 L0,20 Z" 
                  fill="rgba(255,255,255,0.15)"
                  className="animate-pulse"
                />
                <path 
                  d="M0,12 C20,2 60,18 100,8 L100,20 L0,20 Z" 
                  fill="rgba(255,255,255,0.25)"
                  className="animate-pulse"
                  style={{ animationDelay: '0.4s' }}
                />
                <path 
                  d="M0,15 C40,5 80,15 100,10 L100,20 L0,20 Z" 
                  fill="none" 
                  stroke="rgba(255,255,255,0.6)"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
            <div className="w-5/6 h-2 bg-gradient-to-r from-white/30 to-transparent rounded-full" />
            <div className="w-2/3 h-2 bg-gradient-to-r from-white/10 to-transparent rounded-full" />
          </div>
        )}

        {/* RADIAL CONSTELATION GRID */}
        {type === 'grid' && (
          <div className="w-full h-full relative flex items-center justify-center">
            {/* Radar circles */}
            <div className="absolute w-full h-full border border-white/10 rounded-full animate-ping" />
            <div className="absolute w-3/4 h-3/4 border border-white/5 rounded-full" />
            <div className="absolute w-1/2 h-1/2 border border-brand-cyan/20 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-brand-violet/20 border border-brand-violet/60 rounded-full animate-pulse" />
            </div>
            
            {/* Crossed coordinates */}
            <div className="absolute w-full h-px bg-white/10" />
            <div className="absolute h-full w-px bg-white/10" />
            
            {/* Floating node indicators */}
            <span className="absolute top-2 left-6 w-1.5 h-1.5 rounded-full bg-brand-magenta animate-pulse" />
            <span className="absolute bottom-4 right-8 w-2 h-2 rounded-full bg-brand-cyan animate-pulse" style={{ animationDelay: '0.6s' }} />
          </div>
        )}

        {/* NEUMORPHIC GLOW DIODE */}
        {type === 'neumorph' && (
          <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 shadow-inner flex items-center justify-center relative">
            {/* Outer glow ring */}
            <div className="absolute inset-2 rounded-xl border border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.1)]" />
            {/* Inner tactical socket */}
            <div className="w-10 h-10 rounded-xl bg-black/25 flex items-center justify-center shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),2px_2px_4px_rgba(255,255,255,0.05)]">
              <span className="w-4 h-4 rounded-full bg-gradient-to-tr from-brand-violet to-brand-magenta shadow-glow-violet animate-pulse" />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
