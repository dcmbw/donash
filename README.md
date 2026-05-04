Phase 1: Project Scaffolding & 2010s Aesthetic
Repo Setup: Initialize Git repository and create index.html, style.css, and main.js.

Grid Rendering: Generate the 10x10 "River" board.

Visual Style: Use CSS gradients, rounded corners, and "plastic" textures to mimic 2010s board game UI.

UI Elements: Create side panels to track "Pieces in Hand" (starting at 20 each) and a "Status Bar" for game messages.

Phase 2: Core Placement & Multi-View Logic
Setup Phase: Implement the "Starting Bridge Rule" (5 tiles in the first 4 rows).

Tower Logic (Fortensaa):

Track height (0-5) for each cell.

Implement "Falling" trigger: at height 5, return pieces and set the permanent owner.

Perspective Toggle (New):

Add a button to switch between Strategic View (shows who controls/occupies the square) and Tower View (shows the number of pieces stacked).

Implement a "Layer" visualization (e.g., small number badges or a 3D-stacking CSS effect).

Turn Management: Coin flip logic to determine who goes first.

Phase 3: Advanced Rules & Win States
Capture Logic (Weh Tilen):

Detect squares surrounded on 3 sides orthogonally by the same color.

Handle piece removal: captured pieces go to the capturing player.

Late Game Movement (Donash ven Moto):

Activate when a player's hand count reaches zero.

Allow moving one piece one space in any direction (no stacking, but allows moving "down a level").

Win Detection: Use BFS pathfinding to detect a continuous "bridge" from side-to-side.

Phase 4: Mobile Polish & Deployment
Responsive Design: Ensure the grid and perspective toggle button are touch-friendly for your future mobile version.

Branding: Incorporate noir-glitch signature logo for the credits/main menu.

Deployment: Host via GitHub Pages for easy testing and sharing.