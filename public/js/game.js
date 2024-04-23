const board = [];
const boardSize = 3; // 3x3 Tic Tac Toe board
let currentPlayer = 'X'; // X always starts
let difficulty = 'easy'; // Default difficulty level
const cells = document.querySelectorAll('.cell'); // Assuming you have cells with the class 'cell'

function initializeGame() {
    // Capture difficulty from menu selection, assuming it's stored in localStorage
    difficulty = localStorage.getItem('difficulty') || 'easy';
    
    for (let i = 0; i < boardSize; i++) {
        board[i] = [];
        for (let j = 0; j < boardSize; j++) {
            board[i][j] = null;
        }
    }
    
    cells.forEach(cell => {
        cell.textContent = '';
        cell.addEventListener('click', cellClicked);
    });
    
    currentPlayer = 'X'; // Reset to X at the start of each game
}

function cellClicked(event) {
    const cell = event.target;
    const [row, col] = cell.id.split('-').map(Number);

    if (board[row][col] || isGameOver()) {
        return; // Ignore the click if the cell is already taken or the game is over
    }

    makeMove(row, col, currentPlayer);
    if (checkWin(currentPlayer)) {
        showModal(`${currentPlayer} wins!`);
        setTimeout(resetGame, 2000); // Give some time to see the modal before resetting
        return;
    }
    if (isBoardFull()) {
        showModal("It's a tie!");
        setTimeout(resetGame, 2000);
        return;
    }
    togglePlayer();
}

function makeMove(row, col, player) {
    board[row][col] = player;
    const cell = document.getElementById(`${row}-${col}`);
    cell.textContent = player;
}

function togglePlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    if (currentPlayer === 'O') {
        setTimeout(aiMove, 200);
    }
}

function aiMove() {
    // Adjust maxDepth based on the difficulty for a less/more challenging AI
    let maxDepth = difficulty === 'hard' ? Infinity : (difficulty === 'medium' ? 4 : 2);
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (board[i][j] == null) {
                board[i][j] = 'O';
                let score = minimax(board, 0, false, maxDepth);
                board[i][j] = null;
                if (score > bestScore) {
                    bestScore = score;
                    move = { i, j };
                }
            }
        }
    }
    if (move) {
        makeMove(move.i, move.j, 'O');
        checkEndOfGame('O');
    }
}

function minimax(board, depth, isMaximizing, maxDepth) {
    if (depth === maxDepth || isGameOver()) {
        return evaluateBoard(board, depth);
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (board[i][j] == null) {
                    board[i][j] = 'O';
                    let score = minimax(board, depth + 1, false, maxDepth);
                    board[i][j] = null;
                    bestScore = Math.max(score, bestScore);
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (board[i][j] == null) {
                    board[i][j] = 'X';
                    let score = minimax(board, depth + 1, true, maxDepth);
                    board[i][j] = null;
                    bestScore = Math.min(score, bestScore);
                }
            }
        }
        return bestScore;
    }
}
function evaluateBoard(board, depth) {
    if (checkWin('O')) {
        return 10 - depth;
    } else if (checkWin('X')) {
        return depth - 10;
    }
    return 0;
}

function checkEndOfGame(player) {
    if (checkWin(player)) {
        showModal(`${player} wins!`);
        setTimeout(resetGame, 2000);
    } else if (isBoardFull()) {
        showModal("It's a tie!");
        setTimeout(resetGame, 2000);
    } else {
        togglePlayer(); // Toggle back to X
    }
}

function checkWin(player) {
    for (let i = 0; i < boardSize; i++) {
        if (board[i].every(cell => cell === player)) {
            return true;
        }
        if (board.map(row => row[i]).every(cell => cell === player)) {
            return true;
        }
    }
    if ([0, 1, 2].map(i => board[i][i]).every(cell => cell === player) ||
        [0, 1, 2].map(i => board[i][2-i]).every(cell => cell === player)) {
        return true;
    }
    return false;
}

function isBoardFull() {
    return board.every(row => row.every(cell => cell != null));
}

function isGameOver() {
    return checkWin('X') || checkWin('O') || isBoardFull();
}

function resetGame() {
    initializeGame();
}

// Modal specific code
function showModal(message) {
    document.getElementById("modalText").innerText = message;
    document.getElementById("myModal").style.display = "block";
}

document.getElementsByClassName("close")[0].onclick = function() {
    document.getElementById("myModal").style.display = "none";
}
window.onclick = function(event) {
    if (event.target == modal) {
        document.getElementById("myModal").style.display = "none";
    }
}

document.addEventListener('DOMContentLoaded', initializeGame);