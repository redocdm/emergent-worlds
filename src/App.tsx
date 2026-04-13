import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Network, Zap, TreeDeciduous, Info, Github, ExternalLink } from 'lucide-react';
import BoidsSimulation from './simulations/BoidsSimulation';
import GameOfLifeSimulation from './simulations/GameOfLifeSimulation';
import FractalSimulation from './simulations/FractalSimulation';

type SimulationType = 'collective' | 'structural' | 'recursive';

export default function App() {
  const [activeSim, setActiveSim] = useState<SimulationType>('collective');

  const simulations = {
    collective: {
      id: 'collective',
      title: 'Collective Intelligence',
      icon: Network,
      component: BoidsSimulation,
      description: 'How simple local rules lead to global coordination.',
      level: 'Biological / Macro'
    },
    structural: {
      id: 'structural',
      title: 'Structural Complexity',
      icon: Zap,
      component: GameOfLifeSimulation,
      description: 'How simple state transitions create life-like complexity.',
      level: 'Micro / Chemical'
    },
    recursive: {
      id: 'recursive',
      title: 'Recursive Efficiency',
      icon: TreeDeciduous,
      component: FractalSimulation,
      description: 'How recursive growth optimizes structural space.',
      level: 'Cosmic / Structural'
    }
  };

  return (
    <div className="min-h-screen flex flex-col technical-grid">
      {/* Header */}
      <header className="border-b border-white/10 p-6 flex justify-between items-center glass-panel sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-accent rounded-sm flex items-center justify-center">
            <Zap className="text-black w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-mono font-bold tracking-tighter uppercase">Emergent Worlds</h1>
            <p className="text-[10px] font-mono opacity-50 tracking-widest uppercase">Simulating the architecture of complexity</p>
          </div>
        </div>
        <div className="hidden md:flex gap-8 items-center">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-mono opacity-40 uppercase">System Status</span>
            <span className="text-xs font-mono text-accent">OPERATIONAL // 2026.04.12</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex gap-4">
            <Info className="w-5 h-5 opacity-40 hover:opacity-100 cursor-pointer transition-opacity" />
            <Github className="w-5 h-5 opacity-40 hover:opacity-100 cursor-pointer transition-opacity" />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar */}
        <nav className="w-full md:w-80 border-r border-white/10 p-6 flex flex-col gap-4 bg-black/20">
          <div className="mb-4">
            <h2 className="text-[10px] font-mono opacity-40 uppercase tracking-widest mb-4">Select Principle</h2>
            <div className="flex flex-col gap-2">
              {(Object.values(simulations) as any[]).map((sim) => (
                <button
                  key={sim.id}
                  onClick={() => setActiveSim(sim.id)}
                  className={`group relative flex items-center gap-4 p-4 rounded-lg border transition-all duration-300 text-left ${
                    activeSim === sim.id 
                      ? 'bg-accent/10 border-accent/50 text-accent' 
                      : 'bg-white/5 border-white/5 hover:border-white/20 opacity-60 hover:opacity-100'
                  }`}
                >
                  <sim.icon className={`w-5 h-5 ${activeSim === sim.id ? 'text-accent' : 'text-white'}`} />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold tracking-tight">{sim.title}</span>
                    <span className="text-[10px] font-mono opacity-50">{sim.level}</span>
                  </div>
                  {activeSim === sim.id && (
                    <motion.div 
                      layoutId="active-indicator"
                      className="absolute right-4 w-1.5 h-1.5 bg-accent rounded-full shadow-[0_0_8px_rgba(0,255,157,1)]"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto p-4 rounded-lg bg-accent/5 border border-accent/10">
            <h3 className="text-xs font-bold text-accent mb-2 flex items-center gap-2">
              <Info className="w-3 h-3" />
              What is Emergence?
            </h3>
            <p className="text-[11px] leading-relaxed opacity-70 italic">
              "The whole is greater than the sum of its parts." Emergence occurs when complex patterns arise from a multiplicity of relatively simple interactions.
            </p>
          </div>
        </nav>

        {/* Simulation Viewport */}
        <section className="flex-1 p-6 md:p-10 relative overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSim}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="h-full"
            >
              {activeSim === 'collective' && <BoidsSimulation />}
              {activeSim === 'structural' && <GameOfLifeSimulation />}
              {activeSim === 'recursive' && <FractalSimulation />}
            </motion.div>
          </AnimatePresence>

          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 p-10 pointer-events-none opacity-5">
            <span className="text-[15vw] font-serif italic select-none">Emergence</span>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 p-4 flex justify-between items-center text-[10px] font-mono opacity-40 bg-black/40">
        <div className="flex gap-6">
          <span>LAT: 37.7749° N</span>
          <span>LONG: 122.4194° W</span>
          <span>ENTROPY: 0.842</span>
        </div>
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><ExternalLink className="w-3 h-3" /> SCIENTIFIC DATA</span>
          <span>© 2026 EMERGENT LABS</span>
        </div>
      </footer>
    </div>
  );
}
