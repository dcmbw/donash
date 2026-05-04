const gameState = {
    grid: Array(10).fill().map(() => Array(10).fill().map(() => ({ height: 0, owner: null }))),
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

    // Setup Phase: only first 4 rows
    if (gameState.setupMode) {
        if (p === 'black' && r > 3) return;
        if (p === 'white' && r < 6) return;
    }

    if (cell.height < 4) {
        cell.height++;
        cell.owner = p;
        gameState.pieces[p]--;
    } else {
        // Tower Falls (Fortensaa)
        cell.height = 0; 
        cell.owner = p; 
        gameState.pieces.black += 2;
        gameState.pieces.white += 2;
    }

    gameState.placements++;
    if (gameState.placements >= 10) gameState.setupMode = false;
    gameState.currentPlayer = p === 'black' ? 'white' : 'black';
    render();
}

function render() {
    document.getElementById('turn-display').innerText = `${gameState.currentPlayer.toUpperCase()}'s Turn`;
    document.getElementById('black-hand').innerText = gameState.pieces.black;
    document.getElementById('white-hand').innerText = gameState.pieces.white;

    for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
            const tile = document.getElementById(`t-${r}-${c}`);
            tile.innerHTML = '';
            if (gameState.grid[r][c].owner) {
                const p = document.createElement('div');
                p.className = `piece ${gameState.grid[r][c].owner}`;
                p.innerHTML = `<span class="height-label">${gameState.grid[r][c].height}</span>`;
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