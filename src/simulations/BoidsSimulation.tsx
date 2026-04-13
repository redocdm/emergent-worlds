import React, { useEffect, useRef, useState } from 'react';

interface Boid {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export default function BoidsSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [boids, setBoids] = useState<Boid[]>([]);
  const [params, setParams] = useState({
    cohesion: 0.005,
    separation: 0.05,
    alignment: 0.05,
    visualRange: 75,
    minDistance: 20,
    speedLimit: 5,
  });

  useEffect(() => {
    const initialBoids: Boid[] = Array.from({ length: 100 }, () => ({
      x: Math.random() * 800,
      y: Math.random() * 600,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
    }));
    setBoids(initialBoids);
  }, []);

  const [mousePos, setMousePos] = useState<{x: number, y: number} | null>(null);

  const scatter = () => {
    setBoids(prev => prev.map(b => ({
      ...b,
      vx: (Math.random() - 0.5) * 20,
      vy: (Math.random() - 0.5) * 20
    })));
  };

  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const update = () => {
      setBoids((prevBoids) => {
        return prevBoids.map((boid) => {
          let centerX = 0;
          let centerY = 0;
          let numNeighbors = 0;
          let moveX = 0;
          let moveY = 0;
          let avgVX = 0;
          let avgVY = 0;

          for (const other of prevBoids) {
            if (other === boid) continue;

            const dx = boid.x - other.x;
            const dy = boid.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < params.visualRange) {
              centerX += other.x;
              centerY += other.y;
              avgVX += other.vx;
              avgVY += other.vy;
              numNeighbors++;
            }

            if (distance < params.minDistance) {
              moveX += boid.x - other.x;
              moveY += boid.y - other.y;
            }
          }

          let vx = boid.vx;
          let vy = boid.vy;

          if (numNeighbors > 0) {
            centerX /= numNeighbors;
            centerY /= numNeighbors;
            vx += (centerX - boid.x) * params.cohesion;
            vy += (centerY - boid.y) * params.cohesion;

            avgVX /= numNeighbors;
            avgVY /= numNeighbors;
            vx += (avgVX - boid.vx) * params.alignment;
            vy += (avgVY - boid.vy) * params.alignment;
          }

          vx += moveX * params.separation;
          vy += moveY * params.separation;

          // Mouse Interaction
          if (mousePos) {
            const dx = boid.x - mousePos.x;
            const dy = boid.y - mousePos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
              vx += dx * 0.01;
              vy += dy * 0.01;
            }
          }

          const speed = Math.sqrt(vx * vx + vy * vy);
          if (speed > params.speedLimit) {
            vx = (vx / speed) * params.speedLimit;
            vy = (vy / speed) * params.speedLimit;
          }

          let x = boid.x + vx;
          let y = boid.y + vy;
          if (x < 0) x = canvas.width;
          if (x > canvas.width) x = 0;
          if (y < 0) y = canvas.height;
          if (y > canvas.height) y = 0;

          return { x, y, vx, vy };
        });
      });

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00ff9d';
      boids.forEach((boid) => {
        ctx.beginPath();
        const angle = Math.atan2(boid.vy, boid.vx);
        ctx.moveTo(boid.x + Math.cos(angle) * 8, boid.y + Math.sin(angle) * 8);
        ctx.lineTo(boid.x + Math.cos(angle + 2.5) * 6, boid.y + Math.sin(angle + 2.5) * 6);
        ctx.lineTo(boid.x + Math.cos(angle - 2.5) * 6, boid.y + Math.sin(angle - 2.5) * 6);
        ctx.closePath();
        ctx.fill();
      });

      if (mousePos) {
        ctx.beginPath();
        ctx.arc(mousePos.x, mousePos.y, 150, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 255, 157, 0.1)';
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, [boids, params, mousePos]);

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-xl font-mono uppercase tracking-widest text-accent">Collective Intelligence</h3>
        <div className="flex gap-2">
          <button 
            onClick={scatter}
            className="px-4 py-1 text-xs font-mono border border-white/20 hover:border-accent hover:text-accent transition-all"
          >
            SCATTER
          </button>
        </div>
      </div>
      <div className="flex-1 flex flex-col bg-black/40 rounded-lg border border-white/10 overflow-hidden cursor-crosshair">
        <div className="relative flex-1 min-h-[300px]">
          <canvas
            ref={canvasRef}
            width={800}
            height={500}
            onMouseMove={(e) => {
              const rect = canvasRef.current?.getBoundingClientRect();
              if (rect) {
                setMousePos({
                  x: (e.clientX - rect.left) * (800 / rect.width),
                  y: (e.clientY - rect.top) * (500 / rect.height)
                });
              }
            }}
            onMouseLeave={() => setMousePos(null)}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="p-4 glass-panel border-t border-white/10 flex flex-wrap gap-6">
          <div className="flex flex-col gap-1 flex-1 min-w-[120px]">
            <label className="text-[10px] uppercase tracking-tighter opacity-50">Cohesion</label>
            <input 
              type="range" min="0" max="0.01" step="0.001" 
              value={params.cohesion} 
              onChange={(e) => setParams(p => ({...p, cohesion: parseFloat(e.target.value)}))}
              className="accent-accent w-full"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-[120px]">
            <label className="text-[10px] uppercase tracking-tighter opacity-50">Separation</label>
            <input 
              type="range" min="0" max="0.1" step="0.01" 
              value={params.separation} 
              onChange={(e) => setParams(p => ({...p, separation: parseFloat(e.target.value)}))}
              className="accent-accent w-full"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-[120px]">
            <label className="text-[10px] uppercase tracking-tighter opacity-50">Alignment</label>
            <input 
              type="range" min="0" max="0.1" step="0.01" 
              value={params.alignment} 
              onChange={(e) => setParams(p => ({...p, alignment: parseFloat(e.target.value)}))}
              className="accent-accent w-full"
            />
          </div>
        </div>
      </div>
      <div className="p-4 bg-white/5 rounded-lg border border-white/5">
        <p className="text-sm leading-relaxed opacity-80">
          <strong className="text-accent">Principle:</strong> Complex group behavior emerges from three simple local rules: 
          <span className="italic"> Cohesion</span> (stay close), <span className="italic">Separation</span> (don't collide), and <span className="italic">Alignment</span> (follow the leader). 
          This is seen in bird murmurations, fish schools, and even human crowd dynamics.
        </p>
      </div>
    </div>
  );
}
