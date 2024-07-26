let board = [];
let n = 8;
let solving = false;
let solutionCount = 0;
let allSolutions = [];
let currentSolutionIndex = 0;

function solve(instantly) {
    if (solving) return;
    solving = true;
    n = parseInt(document.getElementById('boardSize').value);
    board = Array(n).fill().map(() => Array(n).fill(0));
    solutionCount = 0;
    displayBoard();
    updateMessage("Solving...");
    if (instantly) {
        solveInstantly();
    } else {
        solveNQueens(0);
    }
}

async function solveNQueens(col) {
    if (col >= n) {
        solutionCount++;
        updateInfo();
        solving = false;
        updateMessage("Solution found!");
        return true;
    }

    for (let i = 0; i < n; i++) {
        if (await isSafe(i, col)) {
            board[i][col] = 1;
            displayBoard();
            await sleep(getSpeed());

            if (await solveNQueens(col + 1)) {
                return true;
            }

            board[i][col] = 0;
            displayBoard();
            await sleep(getSpeed());
        }
    }

    if (col === 0) {
        solving = false;
        updateMessage("No solution exists for the given board size.");
    }
    return false;
}

function solveInstantly() {
    n = parseInt(document.getElementById('boardSize').value);
    board = Array(n).fill().map(() => Array(n).fill(0));
    allSolutions = [];
    solveAllNQueens(board, 0);
    solutionCount = allSolutions.length;
    
    if (solutionCount > 0) {
        currentSolutionIndex = 0;
        displaySolution(currentSolutionIndex);
        updateMessage(`Found ${solutionCount} solution(s) instantly!`);
        document.getElementById('solutionNav').style.display = 'flex';
    } else {
        updateMessage("No solution exists for the given board size.");
        document.getElementById('solutionNav').style.display = 'none';
    }
    
    updateInfo();
    solving = false;
}

function solveAllNQueens(board, col) {
    if (col >= n) {
        allSolutions.push(board.map(row => [...row]));
        return;
    }

    for (let i = 0; i < n; i++) {
        if (isSafeInstant(board, i, col)) {
            board[i][col] = 1;
            solveAllNQueens(board, col + 1);
            board[i][col] = 0;
        }
    }
}

async function isSafe(row, col) {
    for (let i = 0; i < col; i++) {
        if (board[row][i] === 1) {
            highlightAttacked(row, i);
            await sleep(getSpeed() / 2);
            return false;
        }
    }

    for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
        if (board[i][j] === 1) {
            highlightAttacked(i, j);
            await sleep(getSpeed() / 2);
            return false;
        }
    }

    for (let i = row, j = col; i < n && j >= 0; i++, j--) {
        if (board[i][j] === 1) {
            highlightAttacked(i, j);
            await sleep(getSpeed() / 2);
            return false;
        }
    }

    return true;
}

function isSafeInstant(board, row, col) {
    for (let i = 0; i < col; i++)
        if (board[row][i] === 1) return false;

    for (let i = row, j = col; i >= 0 && j >= 0; i--, j--)
        if (board[i][j] === 1) return false;

    for (let i = row, j = col; i < n && j >= 0; i++, j--)
        if (board[i][j] === 1) return false;

    return true;
}

function displayBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
    boardElement.style.gridTemplateColumns = `repeat(${n}, 50px)`;

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const cell = document.createElement('div');
            cell.className = `cell ${(i + j) % 2 === 0 ? 'white' : 'black'}`;
            cell.dataset.row = i;
            cell.dataset.col = j;
            if (board[i][j]) {
                cell.textContent = '♛';
                cell.classList.add('queen');
                cell.onclick = highlightQueenMoves;
            }
            boardElement.appendChild(cell);
        }
    }
}

function highlightQueenMoves(event) {
    clearHighlights();
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    const cells = document.querySelectorAll('.cell');

    // Highlight horizontal
    for (let i = 0; i < n; i++) {
        if (i !== col) cells[row * n + i].classList.add('highlighted');
    }

    // Highlight vertical
    for (let i = 0; i < n; i++) {
        if (i !== row) cells[i * n + col].classList.add('highlighted');
    }

    // Highlight diagonals
    for (let i = 1; i < n; i++) {
        // Top-left to bottom-right
        if (row + i < n && col + i < n) cells[(row + i) * n + (col + i)].classList.add('highlighted');
        if (row - i >= 0 && col - i >= 0) cells[(row - i) * n + (col - i)].classList.add('highlighted');
        
        // Top-right to bottom-left
        if (row + i < n && col - i >= 0) cells[(row + i) * n + (col - i)].classList.add('highlighted');
        if (row - i >= 0 && col + i < n) cells[(row - i) * n + (col + i)].classList.add('highlighted');
    }
}

function clearHighlights() {
    document.querySelectorAll('.highlighted').forEach(cell => cell.classList.remove('highlighted'));
}

function displaySolution(index) {
    board = allSolutions[index];
    displayBoard();
    document.getElementById('solutionCount').textContent = `Solution ${index + 1} of ${solutionCount}`;
}

function nextSolution() {
    currentSolutionIndex = (currentSolutionIndex + 1) % solutionCount;
    displaySolution(currentSolutionIndex);
}

function prevSolution() {
    currentSolutionIndex = (currentSolutionIndex - 1 + solutionCount) % solutionCount;
    displaySolution(currentSolutionIndex);
}

function highlightAttacked(row, col) {
    const cells = document.querySelectorAll('.cell');
    cells[row * n + col].classList.add('attacked');
    setTimeout(() => cells[row * n + col].classList.remove('attacked'), getSpeed());
}

function reset() {
    solving = false;
    board = Array(n).fill().map(() => Array(n).fill(0));
    solutionCount = 0;
    allSolutions = [];
    displayBoard();
    updateInfo();
    updateMessage("Board reset. Ready to solve!");
    document.getElementById('solutionNav').style.display = 'none';
}

function generateRandom() {
    const randomSize = Math.floor(Math.random() * 5) + 4; // Random size between 4 and 8
    document.getElementById('boardSize').value = randomSize;
    reset();
    n = randomSize;
    let placedQueens = 0;
    
    while (placedQueens < n) {
        let row = Math.floor(Math.random() * n);
        let col = placedQueens;
        
        if (isSafeInstant(board, row, col)) {
            board[row][col] = 1;
            placedQueens++;
        }
    }
    
    displayBoard();
    updateMessage(`Random ${n}-Queens problem generated. Try solving it!`);
}

function getSpeed() {
    return parseInt(document.getElementById('speed').value);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function updateInfo() {
    document.getElementById('info').textContent = `Solutions found: ${solutionCount}`;
}

function updateMessage(message) {
    document.getElementById('messageBox').textContent = message;
}

// Initialize the board
reset();