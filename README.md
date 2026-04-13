# Emergent Worlds

**Emergent Worlds** is an interactive exploration of complexity science and the architecture of emergence. It simulates how simple, local interactions can lead to sophisticated, self-organizing global patterns across biological, chemical, and structural systems.

## 🔬 Core Simulations

### 1. Collective Intelligence (Boids)
Based on Craig Reynolds' Boids algorithm, this simulation demonstrates how bird murmurations and fish schools coordinate without a leader.
*   **The Rules:** Cohesion (stay close), Separation (don't collide), and Alignment (match velocity).
*   **Interaction:** Use your mouse to influence the flock or "Scatter" them to watch them re-organize.

### 2. Structural Complexity (Cellular Automata)
A high-performance implementation of Conway's Game of Life, exploring how binary states (alive/dead) create life-like complexity.
*   **Presets:** Load classic patterns like the **Pulsar** (oscillator), **Glider** (traveler), or the **Acorn** (a methuselah that evolves for thousands of generations).
*   **Chaos Control:** Use the **Chaos/Entropy** slider to inject "Cosmic Radiation" (random state flips), preventing the system from reaching a static equilibrium.
*   **Perturb:** Manually inject noise into the current state to trigger new waves of emergence.

### 3. Recursive Efficiency (Fractals)
Visualizes how recursive growth optimizes structural space and surface area.
*   **The Principle:** Recursive branching patterns found in trees, lungs, and the cosmic web.
*   **Interaction:** Adjust growth depth, branch angles, and length ratios to see how small changes in recursive rules transform the final structure.

## 🎮 How to Use

1.  **Select a Principle:** Use the sidebar to switch between Collective, Structural, and Recursive simulations.
2.  **Interact with Parameters:** Use the sliders at the bottom of each simulation to change the "laws of physics" for that world.
3.  **Experiment with Chaos:** In the Structural Complexity view, use the **Chaos** slider or **Perturb** button to break stasis and see how the system recovers or evolves.
4.  **Manual Input:** Click directly on the Game of Life grid to toggle individual cells and create your own patterns.

## 🧠 Learning Objectives

*   **Self-Organization:** Observe how order arises from randomness without central control.
*   **Sensitivity to Initial Conditions:** See how a single "Perturbation" or a tiny change in "Chaos" can lead to vastly different outcomes over time.
*   **Fractal Geometry:** Understand how simple repetition at different scales creates infinite complexity.

## 🛠️ Tech Stack

*   **Framework:** React 18+ with TypeScript
*   **Styling:** Tailwind CSS
*   **Animations:** Motion (formerly Framer Motion)
*   **Icons:** Lucide React
*   **Rendering:** HTML5 Canvas API for high-performance simulation

---
*Simulating the architecture of complexity.*
