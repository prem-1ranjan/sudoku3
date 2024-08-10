document.addEventListener('DOMContentLoaded', () => {
    loadPuzzle();

    document.querySelector('#check-button').addEventListener('click', () => {
        checkWinCondition();
    });

    document.querySelector('#next-button').addEventListener('click', nextPuzzle);
    document.querySelector('#prev-button').addEventListener('click', prevPuzzle);
    document.querySelector('#close-modal').addEventListener('click', () => {
        document.querySelector('#win-modal').style.display = 'none';
    });
});

const puzzles = [
    [   // Puzzle 1
        [0, 6, 1, 0, 0, 5, 0, 0, 0],
        [0, 7, 0, 0, 6, 0, 8, 3, 0],
        [0, 0, 3, 0, 0, 0, 0, 0, 2],
        [0, 8, 0, 0, 0, 7, 0, 0, 5],
        [0, 0, 4, 1, 0, 0, 6, 0, 0],
        [7, 0, 0, 0, 4, 0, 0, 0, 0],
        [0, 5, 0, 0, 0, 0, 2, 7, 0],
        [0, 0, 0, 8, 0, 0, 0, 4, 6],
        [0, 9, 0, 0, 0, 0, 0, 0, 1]
    ],
    [   // Puzzle 2
        [0, 4, 0, 8, 0, 5, 0, 0, 3],
        [0, 2, 0, 0, 0, 1, 0, 7, 0],
        [0, 0, 7, 0, 0, 4, 0, 0, 9],
        [0, 0, 6, 0, 0, 3, 0, 8, 0],
        [5, 0, 0, 9, 0, 0, 0, 0, 8],
        [0, 8, 0, 0, 0, 2, 0, 9, 0],
        [0, 7, 0, 0, 0, 9, 0, 0, 5],
        [0, 0, 0, 5, 0, 0, 0, 3, 7],
        [3, 0, 0, 6, 0, 7, 0, 0, 0]
    ],
    [   // Puzzle 3
        [0, 0, 0, 7, 0, 0, 3, 8, 0],
        [7, 0, 0, 1, 0, 0, 0, 2, 0],
        [0, 0, 0, 5, 0, 0, 4, 6, 0],
        [0, 4, 0, 0, 3, 0, 1, 0, 0],
        [0, 0, 8, 0, 0, 7, 4, 0, 0],
        [6, 0, 0, 0, 5, 0, 8, 0, 0],
        [0, 0, 1, 0, 0, 0, 7, 0, 0],
        [0, 0, 0, 8, 0, 0, 0, 9, 0],
        [0, 0, 0, 4, 0, 0, 0, 0, 5]
    ],
    // Add more puzzles here
];

let currentPuzzleIndex = 0;

function loadPuzzle() {
    const puzzle = puzzles[currentPuzzleIndex];
    const table = document.querySelector('#sudoku-grid');
    table.innerHTML = ''; // Clear existing table content

    for (let row = 0; row < 9; row++) {
        const tr = document.createElement('tr');
        for (let col = 0; col < 9; col++) {
            const td = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'number';
            input.max = '9';
            input.min = '1';
            input.value = puzzle[row][col] !== 0 ? puzzle[row][col] : '';
            td.appendChild(input);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
}

function nextPuzzle() {
    if (currentPuzzleIndex < puzzles.length - 1) {
        currentPuzzleIndex++;
        loadPuzzle();
    }
}

function prevPuzzle() {
    if (currentPuzzleIndex > 0) {
        currentPuzzleIndex--;
        loadPuzzle();
    }
}

function showWinMessage() {
    const modal = document.querySelector('#win-modal');
    const winSound = document.querySelector('#win-sound');

    // Play sound
    winSound.play();

    // Show modal
    modal.style.display = 'flex';

    // Create confetti
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.animationDuration = `${Math.random() * 2 + 1}s`;
        confetti.style.animationDelay = `${Math.random() * 2}s`;
        document.body.appendChild(confetti);
    }

    // Remove confetti after animation
    setTimeout(() => {
        document.querySelectorAll('.confetti').forEach(confetti => confetti.remove());
    }, 3000); // Match with confetti animation duration
}

function checkWinCondition() {
    const grid = Array.from(document.querySelectorAll('#sudoku-grid input'))
        .map(input => parseInt(input.value) || 0);
    
    const isSolved = validateSudoku(grid);

    if (isSolved) {
        showWinMessage();
    }
}

function validateSudoku(grid) {
    const checkRow = (row) => {
        const seen = new Set();
        for (let i = 0; i < 9; i++) {
            const num = grid[row * 9 + i];
            if (num < 1 || num > 9 || seen.has(num)) return false;
            seen.add(num);
        }
        return true;
    };

    const checkColumn = (col) => {
        const seen = new Set();
        for (let i = 0; i < 9; i++) {
            const num = grid[i * 9 + col];
            if (num < 1 || num > 9 || seen.has(num)) return false;
            seen.add(num);
        }
        return true;
    };

    const checkBox = (box) => {
        const seen = new Set();
        for (let i = 0; i < 9; i++) {
            const row = Math.floor(box / 3) * 3 + Math.floor(i / 3);
            const col = (box % 3) * 3 + (i % 3);
            const num = grid[row * 9 + col];
            if (num < 1 || num > 9 || seen.has(num)) return false;
            seen.add(num);
        }
        return true;
    };

    for (let i = 0; i < 9; i++) {
        if (!checkRow(i) || !checkColumn(i) || !checkBox(i)) return false;
    }

    return true;
}
