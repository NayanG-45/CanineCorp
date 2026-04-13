"use client";

import { motion } from "framer-motion";

interface IntroViewProps {
  onFetchCandidates: () => void;
}

export function IntroView({ onFetchCandidates }: IntroViewProps) {
  const containerVariants: import("framer-motion").Variants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 2.5,
      },
    },
  };

  const line1Variants: import("framer-motion").Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: [0, 1, 1, 0], 
      y: [20, 0, 0, -20],
      transition: { duration: 2.5, ease: "easeInOut", times: [0, 0.2, 0.8, 1] } 
    },
  };

  const line2Variants: import("framer-motion").Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: [0, 1, 1, 0], 
      y: [20, 0, 0, -20],
      transition: { duration: 2.5, ease: "easeInOut", times: [0, 0.2, 0.8, 1] } 
    },
  };

  const line3Variants: import("framer-motion").Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: [0.8, 1.1, 1],
      transition: { duration: 1.5, ease: "easeOut" },
    },
  };

  const pulseVariants: import("framer-motion").Variants = {
    pulse: {
      textShadow: [
        "0 0 10px #ff00ff, 0 0 20px #ff00ff",
        "0 0 20px #ff00ff, 0 0 40px #ff00ff",
        "0 0 10px #ff00ff, 0 0 20px #ff00ff"
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const buttonVariants: import("framer-motion").Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, delay: 6.5 } }
  };

  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-screen text-center p-6 relative overflow-hidden"
      initial={{ opacity: 0, y: 0 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)", transition: { duration: 0.8, ease: "easeInOut" } }}
      animate={{ opacity: 1 }}
    >
      <div className="absolute inset-0 grid-bg opacity-30 z-0 mix-blend-overlay"></div>
      
      {/* Decorative Morphing Glows - New Amber/Indigo Palette */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse z-0"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse z-0" style={{ animationDelay: '1.5s' }}></div>

      {/* Cyberpunk HUD Decorators */}
      <div className="absolute top-12 left-12 hidden md:flex flex-col gap-2 font-mono text-[10px] text-amber-500/40 text-left pointer-events-none z-10">
        <p>RECRUITMENT_OS // v3.1.0</p>
        <div className="w-32 h-[1px] bg-amber-500/20"></div>
        <p>PRIORITY: MAXIMUM</p>
      </div>

      <div className="absolute bottom-12 right-12 hidden md:flex flex-col gap-2 font-mono text-[10px] text-indigo-400/40 text-right pointer-events-none z-10">
        <p>NEURAL_LINK: STABLE</p>
        <div className="flex justify-end gap-1">
          <span className="w-1 h-3 bg-indigo-500/30 animate-pulse"></span>
          <span className="w-1 h-3 bg-indigo-500/60"></span>
          <span className="w-1 h-3 bg-indigo-400 shadow-[0_0_5px_rgba(129,140,248,0.5)]"></span>
        </div>
      </div>

      {/* Glassmorphism wrapper for central content */}
      <div className="z-10 relative flex flex-col items-center justify-center min-h-[450px] w-full max-w-6xl p-10 md:p-16 rounded-[2.5rem] bg-stone-950/40 backdrop-blur-xl border border-white/10 shadow-[20px_20px_60px_rgba(0,0,0,0.8)] mx-auto overflow-hidden">
        {/* Interior HUD scanline effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent h-1 w-full animate-scanline opacity-30 pointer-events-none"></div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative w-full flex items-center justify-center h-auto min-h-[200px]"
        >
          {/* Using clamp and relative sizing to prevent overflow and stay on one line */}
          <motion.h1 
            variants={line1Variants} 
            className="absolute w-full px-4 text-center text-[clamp(1.5rem,4vw,3.5rem)] font-display font-medium text-white/90 whitespace-nowrap tracking-tight"
          >
            Fed up with human developers?
          </motion.h1>

          <motion.h1 
            variants={line2Variants} 
            className="absolute w-full px-4 text-center text-[clamp(1.5rem,4vw,3.5rem)] font-display font-medium bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500 whitespace-nowrap tracking-tight"
          >
            Sick of their &apos;mental health days&apos;?
          </motion.h1>

          <motion.h1 
            variants={line3Variants} 
            className="absolute w-full px-4 text-center text-[clamp(2.5rem,6vw,5.5rem)] font-display font-black bg-clip-text text-transparent bg-gradient-to-br from-white via-amber-200 to-indigo-400 whitespace-nowrap drop-shadow-[0_0_20px_rgba(245,158,11,0.4)]"
          >
            <motion.span animate="pulse" variants={pulseVariants} className="inline-block">
              Meet your new masters.
            </motion.span>
          </motion.h1>
        </motion.div>
        
        <motion.div variants={buttonVariants} initial="hidden" animate="visible" className="mt-20 sm:mt-28">
          <button 
            onClick={onFetchCandidates}
            className="group relative px-10 sm:px-16 py-4 sm:py-6 font-display text-xl sm:text-2xl font-bold tracking-[0.2em] text-black bg-amber-400 hover:bg-white transition-all duration-500 rounded-none uppercase"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 w-full h-full bg-amber-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <span className="relative z-10 flex items-center justify-center gap-4">
              Access The Pack
              <div className="w-1.5 h-1.5 bg-black rounded-full animate-ping"></div>
            </span>

            {/* Brutalist Button Accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-black"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-black"></div>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
