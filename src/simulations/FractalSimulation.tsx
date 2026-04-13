import React, { useEffect, useRef, useState } from 'react';

export default function FractalSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [params, setParams] = useState({
    depth: 8,
    angle: 25,
    lengthRatio: 0.75,
    branchWidth: 2,
  });

  const [sway, setSway] = useState(0);
  const [isSwaying, setIsSwaying] = useState(false);

  useEffect(() => {
    if (!isSwaying) {
      setSway(0);
      return;
    }
    let frame: number;
    const animate = (time: number) => {
      setSway(Math.sin(time / 1000) * 5);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isSwaying]);

  const drawTree = (ctx: CanvasRenderingContext2D, x: number, y: number, len: number, angle: number, branchWidth: number, depth: number) => {
    ctx.beginPath();
    ctx.save();
    ctx.strokeStyle = `rgba(0, 255, 157, ${depth / params.depth + 0.2})`;
    ctx.lineWidth = branchWidth;
    ctx.translate(x, y);
    ctx.rotate(((angle + (depth === params.depth ? 0 : sway)) * Math.PI) / 180);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -len);
    ctx.stroke();

    if (depth > 0) {
      drawTree(ctx, 0, -len, len * params.lengthRatio, params.angle, branchWidth * 0.8, depth - 1);
      drawTree(ctx, 0, -len, len * params.lengthRatio, -params.angle, branchWidth * 0.8, depth - 1);
    }
    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTree(ctx, canvas.width / 2, canvas.height - 50, 120, 0, params.branchWidth, params.depth);
  }, [params, sway]);

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-xl font-mono uppercase tracking-widest text-accent">Recursive Efficiency</h3>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsSwaying(!isSwaying)}
            className={`px-4 py-1 text-xs font-mono border transition-all ${isSwaying ? 'bg-accent text-black border-accent' : 'border-white/20 hover:border-accent'}`}
          >
            {isSwaying ? 'STILL' : 'SWAY'}
          </button>
          <button 
            onClick={() => setParams({
              depth: Math.floor(Math.random() * 5) + 6,
              angle: Math.floor(Math.random() * 60) + 15,
              lengthRatio: Math.random() * 0.15 + 0.65,
              branchWidth: 2,
            })}
            className="px-4 py-1 text-xs font-mono border border-white/20 hover:border-accent transition-all"
          >
            RANDOMIZE
          </button>
        </div>
      </div>
      <div className="flex-1 flex flex-col bg-black/40 rounded-lg border border-white/10 overflow-hidden">
        <div className="relative flex-1 min-h-[300px]">
          <canvas
            ref={canvasRef}
            width={800}
            height={500}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="p-4 glass-panel border-t border-white/10 flex flex-wrap gap-6">
          <div className="flex flex-col gap-1 flex-1 min-w-[120px]">
            <label className="text-[10px] uppercase tracking-tighter opacity-50">Branch Angle</label>
            <input 
              type="range" min="10" max="90" step="1" 
              value={params.angle} 
              onChange={(e) => setParams(p => ({...p, angle: parseInt(e.target.value)}))}
              className="accent-accent w-full"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-[120px]">
            <label className="text-[10px] uppercase tracking-tighter opacity-50">Growth Depth</label>
            <input 
              type="range" min="1" max="12" step="1" 
              value={params.depth} 
              onChange={(e) => setParams(p => ({...p, depth: parseInt(e.target.value)}))}
              className="accent-accent w-full"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-[120px]">
            <label className="text-[10px] uppercase tracking-tighter opacity-50">Length Ratio</label>
            <input 
              type="range" min="0.5" max="0.85" step="0.01" 
              value={params.lengthRatio} 
              onChange={(e) => setParams(p => ({...p, lengthRatio: parseFloat(e.target.value)}))}
              className="accent-accent w-full"
            />
          </div>
        </div>
      </div>
      <div className="p-4 bg-white/5 rounded-lg border border-white/5">
        <p className="text-sm leading-relaxed opacity-80">
          <strong className="text-accent">Principle:</strong> Fractal branching illustrates how recursive rules create maximum surface area and structural efficiency. This pattern is universal: from the distribution of matter in the cosmic web to the branching of lungs, trees, and blood vessels.
        </p>
      </div>
    </div>
  );
}
