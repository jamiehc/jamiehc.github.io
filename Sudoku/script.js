let board;
let timer;
let timeElapsed = 0;
let history = [];  // Store history of moves
let hintUsed = false;  // Flag for hint usage
let selectedDifficulty = "medium";  // Store the current difficulty level

// Listen for changes to the difficulty selector
document.getElementById("difficulty").addEventListener("change", (event) => {
    selectedDifficulty = event.target.value;
});

// Timer functionality
function startTimer() {
    if (timer) clearInterval(timer);  // Stop the previous timer if any
    timeElapsed = 0;  // Reset the timer
    const timerDisplay = document.getElementById("timer");

    timer = setInterval(() => {
        timeElapsed++;
        timerDisplay.innerText = formatTime(timeElapsed);
    }, 1000);  // Update every second
}

function stopTimer() {
    if (timer) clearInterval(timer);  // Stop the timer when needed
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}

// Generate a full Sudoku solution using backtracking
function generateFullSudoku() {
    let board = Array.from({ length: 9 }, () => Array(9).fill(0));
    solveSudoku(board);
    return board;
}

// Solving Sudoku using backtracking
function solveSudoku(board) {
    let emptySpot = findEmpty(board);
    if (!emptySpot) return true;  // No empty spots means board is solved

    let [row, col] = emptySpot;
    let numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);  // Random order for uniqueness

    for (let num of numbers) {
        if (isValidMove(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) return true;
            board[row][col] = 0;  // Backtrack
        }
    }
    return false;
}

// Find an empty spot on the board (returns row, col)
function findEmpty(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) return [row, col];
        }
    }
    return null;
}

// Check if the number can be placed at position (row, col)
function isValidMove(board, row, col, num) {
    // Check row and column
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num || board[i][col] === num) return false;
    }

    // Check 3x3 box
    let boxRow = Math.floor(row / 3) * 3;
    let boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[boxRow + i][boxCol + j] === num) return false;
        }
    }
    return true;
}

// Shuffle an array for random number placement
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Remove numbers to create a puzzle based on difficulty
function removeNumbers(board, difficulty) {
    let attempts = difficulty === "easy" ? 30 : difficulty === "medium" ? 40 : 50;
    let newBoard = board.map(row => [...row]);

    while (attempts > 0) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        if (newBoard[row][col] !== 0) {
            newBoard[row][col] = 0;
            attempts--;
        }
    }
    return newBoard;
}

// Generate the Sudoku board and display it in the table
function generateSudoku() {
    let fullBoard = generateFullSudoku();  // Generate a fully solved board
    board = removeNumbers(fullBoard, selectedDifficulty);  // Remove numbers based on selected difficulty

    let table = document.getElementById("sudoku-board");
    table.innerHTML = "";  // Clear the board

    for (let i = 0; i < 9; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j < 9; j++) {
            let cell = document.createElement("td");

            if (board[i][j] !== 0) {
                cell.innerText = board[i][j];
                cell.classList.add("prefilled");  // Add class for pre-filled cells
            } else {
                let input = document.createElement("input");
                input.type = "text";
                input.maxLength = "1";
                input.oninput = () => {
                    history.push([i, j, board[i][j]]);
                    board[i][j] = parseInt(input.value) || 0;
                };
                cell.appendChild(input);
            }
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    startTimer();  // Start the timer when the board is generated
}

// New Game button - regenerate the board with selected difficulty
function newGame() {
    hintUsed = false;  // Reset hint usage
    generateSudoku();  // Generate a new Sudoku board based on the current difficulty
}

// Hint Button - Show a hint by filling an empty spot with the correct number
function showHint() {
    if (hintUsed) return;  // Disable further hints
    hintUsed = true;

    // Find an empty spot and fill it with the correct number
    let emptySpot = findEmpty(board);
    if (emptySpot) {
        let [row, col] = emptySpot;
        let correctNumber = board[row][col];
        const input = document.querySelector(`#sudoku-board tr:nth-child(${row + 1}) td:nth-child(${col + 1}) input`);
        input.value = correctNumber;
        input.setAttribute("disabled", true);  // Disable input after hint
    }
}

// Undo Button - Revert the last move
function undoMove() {
    if (history.length === 0) return;  // No move to undo

    let lastMove = history.pop();  // Get the last move
    const [row, col, prevValue] = lastMove;

    // Update the board and input field
    board[row][col] = prevValue;
    const input = document.querySelector(`#sudoku-board tr:nth-child(${row + 1}) td:nth-child(${col + 1}) input`);
    input.value = '';  // Clear the input field
    input.removeAttribute("disabled");  // Enable input again
}

// Check Button - Check if the board is correct
function checkBoard() {
    let isValid = true;

    // Compare user input with correct board
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            let cell = document.querySelector(`#sudoku-board tr:nth-child(${row + 1}) td:nth-child(${col + 1}) input`);
            if (cell && cell.value !== "" && parseInt(cell.value) !== board[row][col]) {
                isValid = false;
                cell.style.backgroundColor = "red";  // Highlight incorrect cells
            }
        }
    }

    if (isValid) {
        alert("Congratulations! You solved the puzzle.");
    } else {
        alert("Some cells are incorrect.");
    }
}