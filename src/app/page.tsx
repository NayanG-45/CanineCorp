"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { IntroView } from "@/components/IntroView";
import { GalleryView } from "@/components/GalleryView";
import { InterviewModal } from "@/components/InterviewModal";

interface DogCandidate {
  url: string;
  breed: string;
}

export default function Home() {
  const [view, setView] = useState<"intro" | "gallery">("intro");
  const [selectedCandidate, setSelectedCandidate] = useState<DogCandidate | null>(null);

  return (
    <main className="relative min-h-screen bg-black overflow-hidden selection:bg-neon-pink/30 selection:text-neon-pink">
      <div className="dynamic-bg"></div>
      <AnimatePresence mode="wait">
        {view === "intro" && (
          <IntroView key="intro" onFetchCandidates={() => setView("gallery")} />
        )}
        
        {view === "gallery" && (
          <GalleryView key="gallery" onSelectCandidate={setSelectedCandidate} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedCandidate && (
          <InterviewModal 
            key="modal" 
            candidate={selectedCandidate} 
            onClose={() => setSelectedCandidate(null)} 
          />
        )}
      </AnimatePresence>
    </main>
  );
}
