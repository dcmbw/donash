const gameState = {
    // Each cell tracks height, current owner, and if it's been captured (or "controlled" as defined in code)
    grid: Array(10).fill().map(() => Array(10).fill().map(() => ({ 
        height: 0, 
        owner: null,
        controlled: false 
    }))),
    currentPlayer: 'black',
    pieces: { black: 20, white: 20 },
    viewMode: 'strategic',
    setupMode: true,
    placements: 0
};

function init() {
    const board = document.getElementById('river-board');
    for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.onclick = () => placePiece(r, c);
            tile.id = `t-${r}-${c}`;
            board.appendChild(tile);
        }
    }
}

function placePiece(r, c) {
    const cell = gameState.grid[r][c];
    const p = gameState.currentPlayer;

    // 1. Setup Phase Restrictions
    // White: Rows 0-3 | Black: Rows 6-9
    if (gameState.setupMode) {
        if (p === 'white' && r > 3) return; 
        if (p === 'black' && r < 6) return;
    }

    // 2. Placement & Tower Falls (Fortensaa)
    if (cell.height >= 4) {
        // Tower falls: square is captured, pieces are redistributed
        cell.height = 0; 
        cell.owner = p; 
        cell.controlled = true; 
        cell.permanent = true; // Mark that this control cannot be "broken"

        // +2 pieces to both players' handdas
        gameState.pieces.black += 2;
        gameState.pieces.white += 2;
    } else {
        // Standard placement or stacking
        cell.height++;
        cell.owner = p;
        gameState.pieces[p]--;
    }

    // 3. Dynamic Capture Evaluation (Weh Tilen)
    // Runs this after every move to update the state of the "River" board
    updateAllCaptures(); 

    // 4. Phase & Turn Management
    gameState.placements++;
    if (gameState.placements >= 10) {
        gameState.setupMode = false;
    }
    
    gameState.currentPlayer = (p === 'black') ? 'white' : 'black';
    render();
}

function updateAllCaptures() {
    // Check every square for 3-sided orthogonal surrounding
    for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
            const cell = gameState.grid[r][c];
            
            // Skip squares that were permanently won via a fallen tower
            if (cell.permanent) continue;

            const neighbors = getNeighbors(r, c);
            const blackCount = neighbors.filter(n => n.owner === 'black').length;
            const whiteCount = neighbors.filter(n => n.owner === 'white').length;

            // Capture logic: Must be 3+ neighbors of the OPPOSITE color
            if (blackCount >= 3 && cell.owner === 'white') {
                cell.controlled = true;
                cell.owner = 'black';
                cell.height = 0; // Clear the captured tower
            } else if (whiteCount >= 3 && cell.owner === 'black') {
                cell.controlled = true;
                cell.owner = 'white';
                cell.height = 0;
            } else if (!cell.permanent) {
                // If the 3-side condition is no longer met, the capture "breaks"
                // This makes the center playable and neutral again if not permanent
                cell.controlled = false;
            }
        }
    }
}

function getNeighbors(r, c) {
    const adj = [
        [r - 1, c], // Top
        [r + 1, c], // Bottom
        [r, c - 1], // Left
        [r, c + 1]  // Right
    ];
    return adj
        .filter(([nr, nc]) => nr >= 0 && nr < 10 && nc >= 0 && nc < 10)
        .map(([nr, nc]) => gameState.grid[nr][nc]);
}

function checkCaptures(r, c) {
    // Check the piece just placed and its 4 orthogonal neighbors
    const spotsToCheck = [[r, c], [r-1, c], [r+1, c], [r, c-1], [r, c+1]];

    spotsToCheck.forEach(([row, col]) => {
        if (row >= 0 && row < 10 && col >= 0 && col < 10) {
            const cell = gameState.grid[row][col];
            
            // Can't capture an empty square or one that's already permanently controlled
            if (cell.height === 0 || cell.controlled) return; 

            const neighbors = getNeighbors(row, col);
            
            // Count how many orthogonal neighbors belong to each player
            const blackNeighbors = neighbors.filter(n => n.owner === 'black').length;
            const whiteNeighbors = neighbors.filter(n => n.owner === 'white').length;

            // If 3+ neighbors are Black and the target is White, capture it
            if (blackNeighbors >= 3 && cell.owner === 'white') {
                executeCapture(row, col, 'black');
            } 
            // If 3+ neighbors are White and the target is Black, capture it
            else if (whiteNeighbors >= 3 && cell.owner === 'black') {
                executeCapture(row, col, 'white');
            }
        }
    });
}

function executeCapture(r, c, capturer) {
    const cell = gameState.grid[r][c];
    
    // Rule 1: Captured pieces disappear off the board.
    gameState.pieces[capturer] += cell.height; 
    cell.height = 0; // Clear the tower height
    cell.owner = capturer; // The capturer now "owns" the empty, controlled square
    cell.controlled = true; 
    console.log(`Square ${r},${c} captured by ${capturer}!`);
}

function render() {
    document.getElementById('turn-display').innerText = `${gameState.currentPlayer.toUpperCase()}'s Turn`;
    document.getElementById('black-hand').innerText = gameState.pieces.black;
    document.getElementById('white-hand').innerText = gameState.pieces.white;

for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
            const tile = document.getElementById(`t-${r}-${c}`);
            const cell = gameState.grid[r][c];
            tile.innerHTML = '';
            tile.className = 'tile'; 

            if (cell.controlled) {
                tile.classList.add('controlled');
                tile.classList.add(`${cell.owner}-owner`);
            } else if (cell.height > 0) { // ONLY render if height > 0
                const p = document.createElement('div');
                p.className = `piece ${cell.owner}`;
                p.innerHTML = `<span class="height-label">${cell.height}</span>`;
                tile.appendChild(p);
            }
        }
    }
}

document.getElementById('view-toggle').onclick = () => {
    const b = document.getElementById('river-board');
    b.classList.toggle('tower-view');
};

init();
render();
