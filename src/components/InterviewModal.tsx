"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import OpenAI from "openai";
import { X, Bot } from "lucide-react";

interface DogCandidate {
  url: string;
  breed: string;
}

interface InterviewModalProps {
  candidate: DogCandidate;
  onClose: () => void;
}

export function InterviewModal({ candidate, onClose }: InterviewModalProps) {
  const [resume, setResume] = useState("");
  const [loading, setLoading] = useState(true);

  // Play dog barking audio on mount
  useEffect(() => {
    try {
      const audio = new Audio('https://actions.google.com/sounds/v1/animals/dog_barking.ogg');
      audio.volume = 1.0;
      audio.play().catch(e => console.warn("Audio play blocked by browser policies", e));
    } catch (e) {
      console.error(e);
    }
  }, []);

  // API Chain implementation
  useEffect(() => {
    async function generateResume() {
      const prompt = `You are a cynical, fast-talking Silicon Valley tech recruiter. Look at this dog (${candidate.breed}). Write a short, hilarious tech resume based on this image. Assign them a ridiculous Senior Software Engineering role (e.g., 'Lead Bark-end Developer'). List 3 technical skills related to their appearance, and what salary they demand in treats. Be unhinged.`;
      
      const tryGroq = async () => {
        const openai = new OpenAI({
          baseURL: "https://api.groq.com/openai/v1",
          apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY || "",
          dangerouslyAllowBrowser: true,
        });

        const completion = await openai.chat.completions.create({
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                { type: "image_url", image_url: { url: candidate.url } }
              ]
            }
          ],
          model: "llama-3.2-90b-vision-preview",
          temperature: 0.9,
          max_tokens: 300,
        });
        return completion.choices[0]?.message?.content;
      };

      // Fallback to text-only if vision fails or model is decommissioned
      const tryTextFallback = async () => {
        const openai = new OpenAI({
          baseURL: "https://api.groq.com/openai/v1",
          apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY || "",
          dangerouslyAllowBrowser: true,
        });

        const completion = await openai.chat.completions.create({
          messages: [
            {
              role: "user",
              content: `Look at this breed of dog: ${candidate.breed}. Write a short, hilarious tech resume based on this breed. Assign them a ridiculous Senior Software Engineering role (e.g., 'Lead Bark-end Developer'). List 3 technical skills related to their appearance/breed traits, and what salary they demand in treats. Be unhinged.`
            }
          ],
          model: "llama-3.3-70b-versatile",
          temperature: 0.9,
          max_tokens: 300,
        });
        return completion.choices[0]?.message?.content;
      };

      try {
        const text = await tryGroq();
        if (text) {
          setResume(text);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error("Vision attempt failed, falling back to text", error);
        try {
           const text = await tryTextFallback();
           setResume(text || "Bark! (Data corruption detected)");
        } catch (e) {
           setResume("SYSTEM FAILURE. The candidate chewed through the fiber optic cable, and the neural backup is offline. Please feed more tokens.");
        }
      } finally {
        setLoading(false);
      }
    }
    
    generateResume();
  }, [candidate]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-xl"
    >
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none"></div>
      
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="relative w-full max-w-5xl bg-indigo-950/40 border border-amber-500/50 shadow-[0_0_50px_rgba(251,191,36,0.2)] rounded-lg overflow-hidden flex flex-col md:flex-row h-full max-h-[92vh]"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 text-white/50 hover:text-amber-400 hover:bg-amber-400/10 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Left Side: Biometric ID */}
        <div className="relative w-full md:w-2/5 h-48 md:h-auto bg-black border-b md:border-b-0 md:border-r border-amber-500/30 flex-shrink-0 overflow-hidden group">
          <div className="absolute inset-0 bg-amber-500/5 animate-pulse z-10 pointer-events-none mix-blend-overlay"></div>
          
          <div className="absolute top-0 left-0 w-full h-1 bg-amber-500 shadow-[0_0_15px_rgba(251,191,36,1)] animate-scanline z-20 pointer-events-none opacity-80"></div>
          
          <img 
            src={candidate.url} 
            alt={candidate.breed} 
            className="w-full h-full object-contain bg-zinc-900 filter contrast-125 saturate-50 grayscale-[20%]" 
          />
          
          <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent z-10">
            <div className="font-mono text-amber-500 text-[10px] md:text-sm uppercase tracking-widest">
              Biometric ID: <br className="hidden md:block"/> {candidate.breed.replace(" ", "_").toUpperCase()}_X99
            </div>
          </div>
        </div>

        {/* Right Side: Resume content */}
        <div className="p-4 md:p-8 flex-1 overflow-y-auto flex flex-col relative bg-black/60 scrollbar-thin scrollbar-thumb-amber-500/20">
          <div className="flex items-center gap-3 mb-4 md:mb-6 border-b border-amber-500/30 pb-4 shrink-0">
            <Bot className="w-8 h-8 text-amber-500 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
            <h3 className="text-xl md:text-2xl font-display font-bold text-amber-500 tracking-wider uppercase">Candidate Profile</h3>
          </div>
          
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-amber-500 space-y-4 py-8">
              <div className="w-full max-w-xs h-1 bg-amber-500/10 overflow-hidden relative rounded-full">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 left-0 h-full bg-amber-500 shadow-[0_0_15px_rgba(251,191,36,0.8)]"
                ></motion.div>
              </div>
              <p className="font-mono text-xs tracking-widest animate-pulse">RECONSTRUCTING NEURAL DATA...</p>
            </div>
          ) : (
            <div className="font-mono text-amber-50/90 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
              <TypewriterText text={resume} />
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function TypewriterText({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) clearInterval(interval);
    }, 10); 
    
    return () => clearInterval(interval);
  }, [text]);

  return (
    <>
      {displayedText}
      <motion.span 
        animate={{ opacity: [1, 0] }} 
        transition={{ duration: 0.5, repeat: Infinity }}
        className="inline-block w-2 md:w-3 h-4 md:h-5 bg-amber-500 ml-1 align-middle"
      ></motion.span>
    </>
  );
}
