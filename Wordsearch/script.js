const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Define themes and their words
const themes = {
    fruits: ["APPLE", "BANANA", "CHERRY", "DATE", "ELDERBERRY", "FIG", "GRAPE", "HONEYDEW", "KIWI", "LEMON", "MANGO", "ORANGE", "PEACH", "PEAR", "PINEAPPLE", "PLUM", "RASPBERRY", "STRAWBERRY", "WATERMELON"],
    animals: ["LION", "TIGER", "ELEPHANT", "GIRAFFE", "ZEBRA", "KANGAROO", "PANDA", "MONKEY", "BEAR", "DOG", "CAT", "HORSE", "COW", "PIG", "SHEEP", "GOAT", "DEER", "FOX", "WOLF", "RABBIT"],
    countries: ["CANADA", "BRAZIL", "FRANCE", "JAPAN", "AUSTRALIA", "INDIA", "GERMANY", "ITALY", "SPAIN", "CHINA", "RUSSIA", "MEXICO", "ARGENTINA", "EGYPT", "KENYA", "SOUTH AFRICA", "SWEDEN", "NORWAY", "FINLAND", "DENMARK"],
    sports: ["FOOTBALL", "BASKETBALL", "BASEBALL", "SOCCER", "TENNIS", "VOLLEYBALL", "HOCKEY", "CRICKET", "RUGBY", "GOLF", "BOXING", "SWIMMING", "RUNNING", "CYCLING", "SKIING", "SURFING", "WRESTLING", "BADMINTON", "TABLE TENNIS", "ARCHERY"],
    colors: ["RED", "BLUE", "GREEN", "YELLOW", "ORANGE", "PURPLE", "PINK", "BROWN", "BLACK", "WHITE", "GRAY", "GOLD", "SILVER", "VIOLET", "INDIGO", "TURQUOISE", "MAROON", "NAVY", "OLIVE", "TEAL"]
};

// Difficulty settings
const difficultySettings = {
    easy: { gridSize: 10, numWords: 5 },
    medium: { gridSize: 15, numWords: 7 },
    hard: { gridSize: 20, numWords: 10 }
};

let currentGrid = []; // Stores the current grid
let currentWords = []; // Stores the words to find
let selectedCells = []; // Stores the currently selected cells
let foundWords = []; // Stores the words that have been found
let currentDifficulty = "medium"; // Default difficulty
let currentTheme = "random"; // Default theme

function showRandomWordSearch() {
    document.getElementById("home").classList.add("hidden");
    document.getElementById("randomWordSearch").classList.remove("hidden");
    currentDifficulty = document.getElementById("difficulty").value;
    currentTheme = document.getElementById("theme").value;
    document.getElementById("selectedDifficulty").textContent = currentDifficulty.toUpperCase();
    document.getElementById("selectedTheme").textContent = currentTheme === "random" ? "Random Theme" : currentTheme.toUpperCase();
    generateRandomWordSearch();
}

function showCustomWordSearch() {
    document.getElementById("home").classList.add("hidden");
    document.getElementById("customWordSearch").classList.remove("hidden");
}

function goBack() {
    document.getElementById("randomWordSearch").classList.add("hidden");
    document.getElementById("customWordSearch").classList.add("hidden");
    document.getElementById("home").classList.remove("hidden");
    resetGame();
}

function generateRandomWordSearch() {
    resetGame();

    // Get grid size and number of words based on difficulty
    const { gridSize, numWords } = difficultySettings[currentDifficulty];

    // Select a theme
    let themeWords;
    if (currentTheme === "random") {
        const themeNames = Object.keys(themes);
        const randomTheme = themeNames[Math.floor(Math.random() * themeNames.length)];
        themeWords = themes[randomTheme];
        document.getElementById("selectedTheme").textContent = randomTheme.toUpperCase();
    } else {
        themeWords = themes[currentTheme];
    }

    // Randomly select a subset of words from the theme
    currentWords = getRandomSubset(themeWords, numWords);

    currentGrid = createGrid(gridSize);

    // Place words in the grid
    currentWords.forEach(word => {
        placeWord(currentGrid, word);
    });

    // Fill remaining spaces with random letters
    fillGrid(currentGrid);

    // Display the grid and words list
    displayGrid(currentGrid, "randomGrid");
    displayWordsList(currentWords, "randomWordsList");
    addGridListeners("randomGrid");
}

function generateCustomWordSearch() {
    resetGame();
    const wordInput = document.getElementById('wordInput').value.trim();
    currentWords = wordInput.split(',').map(word => word.trim().toUpperCase());
    const gridSize = difficultySettings[currentDifficulty].gridSize; // Use selected difficulty's grid size
    currentGrid = createGrid(gridSize);

    // Place words in the grid
    currentWords.forEach(word => {
        placeWord(currentGrid, word);
    });

    // Fill remaining spaces with random letters
    fillGrid(currentGrid);

    // Display the grid and words list
    displayGrid(currentGrid, "customGrid");
    displayWordsList(currentWords, "customWordsList");
    addGridListeners("customGrid");
}

function createGrid(size) {
    const grid = [];
    for (let i = 0; i < size; i++) {
        grid[i] = [];
        for (let j = 0; j < size; j++) {
            grid[i][j] = '';
        }
    }
    return grid;
}

function placeWord(grid, word) {
    const directions = [
        { x: 1, y: 0 },   // Horizontal
        { x: 0, y: 1 },   // Vertical
        { x: 1, y: 1 },   // Diagonal down-right
        { x: 1, y: -1 }   // Diagonal up-right
    ];

    let placed = false;
    while (!placed) {
        const direction = directions[Math.floor(Math.random() * directions.length)];
        const startX = Math.floor(Math.random() * grid.length);
        const startY = Math.floor(Math.random() * grid[0].length);

        let x = startX;
        let y = startY;
        let canPlace = true;

        // Check if the word fits in the chosen direction
        for (let i = 0; i < word.length; i++) {
            if (x >= grid.length || y >= grid[0].length || y < 0 || (grid[x][y] !== '' && grid[x][y] !== word[i])) {
                canPlace = false;
                break;
            }
            x += direction.x;
            y += direction.y;
        }

        // Place the word if it fits
        if (canPlace) {
            x = startX;
            y = startY;
            for (let i = 0; i < word.length; i++) {
                grid[x][y] = word[i];
                x += direction.x;
                y += direction.y;
            }
            placed = true;
        }
    }
}

function fillGrid(grid) {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === '') {
                grid[i][j] = alphabet[Math.floor(Math.random() * alphabet.length)];
            }
        }
    }
}

function displayGrid(grid, gridId) {
    const table = document.getElementById(gridId);
    table.innerHTML = '';
    for (let i = 0; i < grid.length; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < grid[i].length; j++) {
            const cell = document.createElement('td');
            cell.textContent = grid[i][j];
            cell.dataset.row = i;
            cell.dataset.col = j;
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
}

function displayWordsList(words, listId) {
    const wordsList = document.getElementById(listId);
    wordsList.innerHTML = '';
    words.forEach(word => {
        const li = document.createElement('li');
        li.textContent = word;
        li.id = `word-${word}`;
        wordsList.appendChild(li);
    });
}

function addGridListeners(gridId) {
    const table = document.getElementById(gridId);
    table.addEventListener('mousedown', handleMouseDown);
    table.addEventListener('mouseover', handleMouseOver);
    table.addEventListener('mouseup', handleMouseUp);
}

function handleMouseDown(event) {
    if (event.target.tagName === 'TD') {
        selectedCells = [];
        event.target.classList.add('selected');
        selectedCells.push(event.target);
    }
}

function handleMouseOver(event) {
    if (event.target.tagName === 'TD' && event.buttons === 1) {
        const currentCell = event.target;
        const lastCell = selectedCells[selectedCells.length - 1];

        if (lastCell) {
            const lastRow = parseInt(lastCell.dataset.row);
            const lastCol = parseInt(lastCell.dataset.col);
            const currentRow = parseInt(currentCell.dataset.row);
            const currentCol = parseInt(currentCell.dataset.col);

            // Check if the current cell is adjacent to the last selected cell
            const rowDiff = Math.abs(currentRow - lastRow);
            const colDiff = Math.abs(currentCol - lastCol);

            if ((rowDiff === 1 && colDiff === 0) || // Vertical
                (rowDiff === 0 && colDiff === 1) || // Horizontal
                (rowDiff === 1 && colDiff === 1)) { // Diagonal
                if (!selectedCells.includes(currentCell)) {
                    currentCell.classList.add('selected');
                    selectedCells.push(currentCell);
                }
            }
        } else {
            currentCell.classList.add('selected');
            selectedCells.push(currentCell);
        }
    }
}

function handleMouseUp() {
    checkSelectedCells();
    selectedCells.forEach(cell => cell.classList.remove('selected'));
    selectedCells = [];
}

function checkSelectedCells() {
    const selectedWord = selectedCells.map(cell => cell.textContent).join('');
    if (currentWords.includes(selectedWord) && !foundWords.includes(selectedWord)) {
        foundWords.push(selectedWord);
        document.getElementById(`word-${selectedWord}`).classList.add('found');

        // Highlight the cells of the found word
        selectedCells.forEach(cell => {
            cell.classList.add('found');
        });

        if (foundWords.length === currentWords.length) {
            alert('Congratulations! You found all the words!');
        }
    }
}

function resetGame() {
    currentGrid = [];
    currentWords = [];
    selectedCells = [];
    foundWords = [];
    document.getElementById('randomGrid').innerHTML = '';
    document.getElementById('customGrid').innerHTML = '';
    document.getElementById('randomWordsList').innerHTML = '';
    document.getElementById('customWordsList').innerHTML = '';
}

function getRandomSubset(array, size) {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, size);
}