"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";

interface DogCandidate {
  url: string;
  breed: string;
  id: string; // Add a unique ID for framer motion keys
}

interface GalleryViewProps {
  onSelectCandidate: (candidate: DogCandidate) => void;
}

export function GalleryView({ onSelectCandidate }: GalleryViewProps) {
  const [candidates, setCandidates] = useState<DogCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchDogs() {
      try {
        const res = await fetch("https://dog.ceo/api/breeds/image/random/15");
        const data = await res.json();
        if (data.message) {
          const dogs = data.message.map((url: string, index: number) => {
            const match = url.match(/breeds\/([^/]+)/);
            let breed = "Unknown";
            if (match && match[1]) {
              breed = match[1].replace("-", " ");
            }
            // Use a stable but unique ID
            return { url, breed, id: `dog-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` };
          });
          setCandidates(dogs);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchDogs();
  }, []);

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="min-h-screen flex flex-col items-center justify-center text-neon-cyan relative z-10"
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md -z-10" />
        <Loader2 className="w-16 h-16 animate-spin mb-4" />
        <h2 className="text-2xl font-display font-medium tracking-widest animate-pulse">FETCHING ELITE TALENT...</h2>
      </motion.div>
    );
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % candidates.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + candidates.length) % candidates.length);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -100) {
      handleNext(); // swipe left goes to next
    } else if (info.offset.x > 100) {
      handlePrev(); // swipe right goes to prev
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen p-4 md:p-8 flex flex-col pt-16 relative z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm -z-10" />

      <h2 className="text-3xl md:text-5xl font-display font-black text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-neon-pink to-neon-cyan pb-2 shadow-neon">
        Select Your New Overlord
      </h2>
      
      {/* Decorative Cyberpunk Data overlays */}
      <div className="absolute top-20 left-4 md:left-8 font-mono text-[10px] md:text-xs text-neon-cyan/40 pointer-events-none hidden sm:block">
        <p>SYS.INIT_SEQ // OK</p>
        <p>MEM: [####------] 42%</p>
        <p>NETWORK: SECURE</p>
        <div className="w-16 h-1 mt-2 bg-neon-cyan/20">
          <div className="w-8 h-full bg-neon-cyan animate-pulse"></div>
        </div>
      </div>

      <div className="absolute bottom-32 right-4 md:right-8 font-mono text-[10px] md:text-xs text-neon-pink/40 text-right pointer-events-none hidden sm:block">
        <p>TARGET VERIFIED</p>
        <p>ID: {candidates[currentIndex]?.id?.toUpperCase() || 'SCANNING...'}</p>
        <div className="flex justify-end mt-2 gap-1">
          <div className="w-2 h-4 bg-neon-pink/30 animate-ping"></div>
          <div className="w-2 h-4 bg-neon-pink/60"></div>
          <div className="w-2 h-4 bg-neon-pink"></div>
        </div>
      </div>

      {/* Center Deck */}
      <div className="flex-1 flex flex-col items-center justify-center relative w-full mb-12 sm:mb-20 max-w-2xl mx-auto h-[50vh] sm:h-[60vh] perspective-1000">
        <AnimatePresence mode="popLayout">
          {candidates.map((dog, index) => {
            // Calculate distance to current index in a cyclic array to create stacked effect
            let distance = index - currentIndex;
            
            // To make it loop smoothly, we figure out the shortest distance
            if (distance > candidates.length / 2) distance -= candidates.length;
            if (distance < -candidates.length / 2) distance += candidates.length;

            if (distance < 0 || distance > 2) return null; // Show only top 3 cards in the stack

            const isFront = distance === 0;

            return (
              <motion.div
                key={dog.id}
                layoutId={dog.id}
                drag={isFront ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.8}
                onDragEnd={handleDragEnd}
                initial={{ opacity: 0, scale: 0.8, y: 100 }}
                animate={{ 
                  opacity: 1 - distance * 0.3,
                  scale: 1 - distance * 0.05, 
                  y: distance * 20,
                  zIndex: 30 - distance
                }}
                exit={{ opacity: 0, scale: 0.9, x: -300 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute w-[85vw] max-w-[17rem] sm:max-w-[20rem] aspect-[3/4.5] sm:h-[28rem] cursor-grab active:cursor-grabbing"
              >
                <div onClick={() => isFront && onSelectCandidate(dog)} className="w-full h-full relative group shadow-[0_0_30px_rgba(0,0,0,0.8)] rounded-xl border border-white/10 hover:border-neon-cyan transition-all duration-300 bg-gray-900 overflow-hidden transform-gpu">
                  <img src={dog.url} alt={dog.breed} className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
                  
                  {/* Glassmorphism gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10 pointer-events-none mix-blend-overlay" />
                  
                  {/* Tech HUD overlay */}
                  <div className="absolute top-0 left-0 w-full h-full border-[1px] border-transparent group-hover:border-neon-cyan/30 rounded-xl transition-all duration-500 pointer-events-none" style={{ background: 'radial-gradient(circle, transparent 20%, rgba(0,0,0,0.4) 120%)' }}></div>
                  
                  <div className="absolute bottom-0 inset-x-0 p-6 pointer-events-none backdrop-blur-sm bg-black/30 border-t border-white/5">
                    <h3 className="font-display text-3xl font-bold text-white capitalize drop-shadow-lg mb-1 tracking-wide">{dog.breed}</h3>
                    <p className="text-sm text-neon-cyan font-mono flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse shadow-[0_0_10px_#00ffff]"></span> ACTIVE CANDIDATE
                    </p>
                  </div>

                  {isFront && (
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-neon-pink/50 font-mono text-neon-pink text-[10px] uppercase shadow-[0_0_10px_rgba(255,0,255,0.3)] pointer-events-none animate-pulse">
                      Select for Interview
                    </div>
                  )}

                  {/* Corners HUD styling */}
                  <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-neon-cyan/50 rounded-tl-sm pointer-events-none"></div>
                  <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-neon-cyan/50 rounded-br-sm pointer-events-none"></div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Control Buttons Container */}
      <div className="fixed bottom-10 inset-x-0 mx-auto w-full max-w-2xl px-6 flex justify-between gap-4 z-40 font-display">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={handleNext}
          className="flex-1 max-w-[200px] flex items-center justify-center gap-2 px-4 py-3 sm:py-4 bg-black/80 backdrop-blur-md border border-neon-pink text-neon-pink hover:bg-neon-pink/20 transition-all rounded-sm uppercase tracking-widest text-sm sm:text-base shadow-[0_0_15px_rgba(255,0,255,0.2)] border-b-4 hover:border-b-neon-pink active:border-b"
        >
          <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5" /> PASS ON MUTT
        </motion.button>
        
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => onSelectCandidate(candidates[currentIndex])}
          className="flex-1 max-w-[200px] flex items-center justify-center gap-2 px-4 py-3 sm:py-4 bg-neon-cyan text-black hover:bg-white transition-all rounded-sm uppercase font-bold tracking-widest text-sm sm:text-base shadow-[0_0_20px_rgba(0,255,255,0.6)] border-b-4 hover:border-b-white active:border-b"
        >
          GOOD BOY <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
}
