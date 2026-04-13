import React, { useEffect, useRef, useState, useCallback } from 'react';

const ROWS = 50;
const COLS = 80;
const CELL_SIZE = 10;

export default function GameOfLifeSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [grid, setGrid] = useState<number[][]>(() => {
    const rows = [];
    for (let i = 0; i < ROWS; i++) {
      rows.push(Array.from(Array(COLS), () => (Math.random() > 0.85 ? 1 : 0)));
    }
    return rows;
  });

  const [running, setRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [speed, setSpeed] = useState(100);
  const [chaos, setChaos] = useState(0); // 0 to 0.001 (0.1%)
  const runningRef = useRef(running);
  runningRef.current = running;

  // Optimized simulation loop
  useEffect(() => {
    if (!running) return;

    let timer: NodeJS.Timeout;
    
    const tick = () => {
      setGrid((g) => {
        return g.map((row, i) => {
          return row.map((cell, j) => {
            // Apply Chaos/Entropy: Randomly flip state
            if (chaos > 0 && Math.random() < chaos) {
              return cell === 1 ? 0 : 1;
            }

            let neighbors = 0;
            for (let x = -1; x <= 1; x++) {
              for (let y = -1; y <= 1; y++) {
                if (x === 0 && y === 0) continue;
                const ni = i + x;
                const nj = j + y;
                if (ni >= 0 && ni < ROWS && nj >= 0 && nj < COLS) {
                  neighbors += g[ni][nj];
                }
              }
            }
            if (cell === 1) return (neighbors === 2 || neighbors === 3) ? 1 : 0;
            return neighbors === 3 ? 1 : 0;
          });
        });
      });
      setGeneration(prev => prev + 1);
      timer = setTimeout(tick, speed);
    };

    timer = setTimeout(tick, speed);
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [running, speed, chaos]);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= COLS; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, ROWS * CELL_SIZE);
      ctx.stroke();
    }
    for (let i = 0; i <= ROWS; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(COLS * CELL_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw cells
    ctx.fillStyle = '#00ff9d';
    grid.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = 'rgba(0, 255, 157, 0.5)';
          ctx.fillRect(j * CELL_SIZE + 1, i * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
          ctx.shadowBlur = 0;
        }
      });
    });
  }, [grid]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const col = Math.floor((x / rect.width) * COLS);
    const row = Math.floor((y / rect.height) * ROWS);

    if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
      setGrid(prev => {
        const next = prev.map(r => [...r]);
        next[row][col] = next[row][col] ? 0 : 1;
        return next;
      });
    }
  };

  const clearGrid = () => {
    setRunning(false);
    setGeneration(0);
    setGrid(Array.from(Array(ROWS), () => Array(COLS).fill(0)));
  };

  const loadPreset = (type: 'glider' | 'pulsar' | 'acorn') => {
    setRunning(false);
    setGeneration(0);
    // Start with a very sparse "primordial soup" (0.5% noise) to ensure interaction
    const newGrid = Array.from(Array(ROWS), () => 
      Array.from(Array(COLS), () => (Math.random() > 0.995 ? 1 : 0))
    );
    
    if (type === 'glider') {
      // Multiple gliders heading for collision
      const gliders = [
        { r: 5, c: 5, dr: 1, dc: 1 },
        { r: 5, c: COLS - 10, dr: 1, dc: -1 },
        { r: ROWS - 10, c: 5, dr: -1, dc: 1 },
        { r: ROWS - 10, c: COLS - 10, dr: -1, dc: -1 }
      ];
      
      gliders.forEach(({ r, c, dr, dc }) => {
        // Standard glider shape adjusted for direction
        if (dr === 1 && dc === 1) {
          newGrid[r][c+1] = 1; newGrid[r+1][c+2] = 1; newGrid[r+2][c] = 1; newGrid[r+2][c+1] = 1; newGrid[r+2][c+2] = 1;
        } else if (dr === 1 && dc === -1) {
          newGrid[r][c-1] = 1; newGrid[r+1][c-2] = 1; newGrid[r+2][c] = 1; newGrid[r+2][c-1] = 1; newGrid[r+2][c-2] = 1;
        } else if (dr === -1 && dc === 1) {
          newGrid[r][c+1] = 1; newGrid[r-1][c+2] = 1; newGrid[r-2][c] = 1; newGrid[r-2][c+1] = 1; newGrid[r-2][c+2] = 1;
        } else {
          newGrid[r][c-1] = 1; newGrid[r-1][c-2] = 1; newGrid[r-2][c] = 1; newGrid[r-2][c-1] = 1; newGrid[r-2][c-2] = 1;
        }
      });
    } else if (type === 'pulsar') {
      // Four pulsars in a grid
      const centers = [
        { r: 15, c: 25 }, { r: 15, c: 55 },
        { r: 35, c: 25 }, { r: 35, c: 55 }
      ];
      
      centers.forEach(({ r, c }) => {
        const points = [
          [r-1, c-2], [r-1, c-3], [r-1, c-4], [r-1, c+2], [r-1, c+3], [r-1, c+4],
          [r+1, c-2], [r+1, c-3], [r+1, c-4], [r+1, c+2], [r+1, c+3], [r+1, c+4],
          [r-2, c-1], [r-3, c-1], [r-4, c-1], [r-2, c+1], [r-3, c+1], [r-4, c+1],
          [r+2, c-1], [r+3, c-1], [r+4, c-1], [r+2, c+1], [r+3, c+1], [r+4, c+1],
          [r-6, c-2], [r-6, c-3], [r-6, c-4], [r-6, c+2], [r-6, c+3], [r-6, c+4],
          [r+6, c-2], [r+6, c-3], [r+6, c-4], [r+6, c+2], [r+6, c+3], [r+6, c+4],
          [r-2, c-6], [r-3, c-6], [r-4, c-6], [r-2, c+6], [r-3, c+6], [r-4, c+6],
          [r+2, c-6], [r+3, c-6], [r+4, c-6], [r+2, c+6], [r+3, c+6], [r+4, c+6],
        ];
        points.forEach(([pr, pc]) => { if (newGrid[pr] && newGrid[pr][pc] !== undefined) newGrid[pr][pc] = 1; });
      });
    } else if (type === 'acorn') {
      // The Acorn: A famous methuselah that grows for 5206 generations
      const r = 25, c = 40;
      // Acorn pattern: 
      // . X . . . . .
      // . . . X . . .
      // X X . . X X X
      newGrid[r][c] = 1;
      newGrid[r+1][c+1] = 1;
      newGrid[r-1][c-1] = 1;
      newGrid[r-1][c-2] = 1;
      newGrid[r+1][c-2] = 1;
      newGrid[r+1][c-1] = 1;
      newGrid[r+1][c+2] = 1;
    }
    setGrid(newGrid);
  };

  const randomize = () => {
    setRunning(false);
    setGeneration(0);
    const rows = [];
    for (let i = 0; i < ROWS; i++) {
      rows.push(Array.from(Array(COLS), () => (Math.random() > 0.85 ? 1 : 0)));
    }
    setGrid(rows);
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col">
          <h3 className="text-xl font-mono uppercase tracking-widest text-accent">Structural Complexity</h3>
          <span className="text-[10px] font-mono opacity-50 uppercase">Generation: {generation}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setRunning(!running)}
            className={`px-4 py-1 text-xs font-mono border transition-all ${running ? 'bg-accent text-black border-accent' : 'border-white/20 hover:border-accent'}`}
          >
            {running ? 'STOP' : 'START'}
          </button>
          <button 
            onClick={clearGrid}
            className="px-4 py-1 text-xs font-mono border border-white/20 hover:border-accent transition-all"
          >
            CLEAR
          </button>
          <button 
            onClick={() => loadPreset('glider')}
            className="px-4 py-1 text-xs font-mono border border-white/20 hover:border-accent transition-all"
          >
            GLIDER
          </button>
          <button 
            onClick={() => loadPreset('pulsar')}
            className="px-4 py-1 text-xs font-mono border border-white/20 hover:border-accent transition-all"
          >
            PULSAR
          </button>
          <button 
            onClick={() => loadPreset('acorn')}
            className="px-4 py-1 text-xs font-mono border border-white/20 hover:border-accent transition-all"
          >
            ACORN
          </button>
          <button 
            onClick={randomize}
            className="px-4 py-1 text-xs font-mono border border-white/20 hover:border-accent transition-all"
          >
            RANDOMIZE
          </button>
          <button 
            onClick={() => {
              setGrid(prev => prev.map(row => row.map(cell => (Math.random() > 0.98 ? (cell ? 0 : 1) : cell))));
            }}
            className="px-4 py-1 text-xs font-mono border border-accent/30 text-accent hover:bg-accent/10 transition-all"
            title="Inject 2% random noise into the current state"
          >
            PERTURB
          </button>
        </div>
      </div>
      <div className="flex-1 bg-black/40 rounded-lg border border-white/10 overflow-hidden p-2 flex flex-col items-center justify-center">
        <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden">
          <canvas
            ref={canvasRef}
            width={COLS * CELL_SIZE}
            height={ROWS * CELL_SIZE}
            onClick={handleCanvasClick}
            className="max-w-full max-h-full cursor-pointer object-contain"
          />
        </div>
        <div className="w-full p-4 glass-panel border-t border-white/10 flex flex-wrap gap-6 mt-2">
          <div className="flex flex-col gap-1 flex-1 min-w-[120px]">
            <label className="text-[10px] uppercase tracking-tighter opacity-50">Simulation Speed (ms delay)</label>
            <input 
              type="range" min="10" max="500" step="10" 
              value={speed} 
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              className="accent-accent w-full"
            />
            <div className="flex justify-between text-[8px] font-mono opacity-30">
              <span>FAST (10ms)</span>
              <span>SLOW (500ms)</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-[120px]">
            <label className="text-[10px] uppercase tracking-tighter opacity-50 text-accent">Chaos / Entropy (Random Flips)</label>
            <input 
              type="range" min="0" max="0.005" step="0.0001" 
              value={chaos} 
              onChange={(e) => setChaos(parseFloat(e.target.value))}
              className="accent-accent w-full"
            />
            <div className="flex justify-between text-[8px] font-mono opacity-30">
              <span>ORDER (0%)</span>
              <span>CHAOS (0.5%)</span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 bg-white/5 rounded-lg border border-white/5">
        <p className="text-sm leading-relaxed opacity-80">
          <strong className="text-accent">Principle:</strong> Cellular Automata demonstrate how simple binary states and neighbor-based rules lead to self-organizing structures. 
          <br /><br />
          <span className="text-accent/70 italic">Note: Use the <strong>Chaos</strong> slider to introduce "Cosmic Radiation" (entropy), preventing the system from reaching a static equilibrium. Use <strong>Perturb</strong> to manually inject noise and trigger new waves of emergence.</span>
        </p>
      </div>
    </div>
  );
}
