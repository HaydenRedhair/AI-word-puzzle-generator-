var words = ["breeze", "puzzle", "window", "lantern", "whisper", "bicycle", "journey", "diamond", "harvest", "freedom", "castle", "library", "sunshine", "butterfly"];
var gridSize = 25;
var grid = [];
var highlightWords = true; // Set this to false to disable highlighting
var isMouseDown = false;
var selectedCells = [];

// Select words using right click
function handleCellMouseDown(i, j, cell) {
  cell.classList.add('selected');
  selectedCells.push({ i: i, j: j });
}

function handleCellMouseEnter(i, j, cell) {
  if (isMouseDown) {
    cell.classList.add('selected');
    selectedCells.push({ i: i, j: j });
  }
}

function handleCellMouseUp() {
  var selectedWord = selectedCells.map(function(cell) {
    return grid[cell.i][cell.j].char;
  }).join('');
  if (words.includes(selectedWord)) {
    var listItems = document.querySelectorAll('#word-list li');
    for (var listItem of listItems) {
      if (listItem.textContent === selectedWord) {
        listItem.style.textDecoration = 'line-through';
        break;
      }
    }
  }
  // Clear the selection
  selectedCells = [];
  document.querySelectorAll('#word-search-grid .selected').forEach(function(cell) {
    cell.classList.remove('selected');
  });
}
// Select words using right click

function generateGrid() {
  // Create empty grid
  var gridElement = document.getElementById('word-search-grid');
  gridElement.innerHTML = '';
  for (var i = 0; i < gridSize; i++) {
    grid[i] = [];
    for (var j = 0; j < gridSize; j++) {
      grid[i][j] = '-';
    }
  }

  function checkPlacement(row, col, direction, word) {
    for (var i = 0; i < word.length; i++) {
      if (direction == 0) { // horizontal
        if (grid[row][col + i] !== '-') {
          return false;
        }
      } else if (direction == 1) { // vertical
        if (grid[row + i][col] !== '-') {
          return false;
        }
      } else if (direction == 2) { // diagonal down-right
        if (grid[row + i][col + i] !== '-') {
          return false;
        }
      } else if (direction == 3) { // diagonal up-right
        if (grid[row - i] && grid[row - i][col + i] !== '-') {
          return false;
        }
      }
    }
    return true;
  }

  // Insert words into the grid in random directions
  for (var word of words) {
    var placed = false;
    while (!placed) {
      var direction = Math.floor(Math.random() * 4);
      var startRow, startCol;
      if (direction == 0 && gridSize - word.length >= 0) { // horizontal
        startRow = Math.floor(Math.random() * gridSize);
        startCol = Math.floor(Math.random() * (gridSize - word.length + 1));
        if (checkPlacement(startRow, startCol, direction, word)) {
          for (var i = 0; i < word.length; i++) {
            grid[startRow][startCol + i] = { char: word.charAt(i), isWord: true };
          }
          placed = true;
        }
      } else if (direction == 1 && gridSize - word.length >= 0) { // vertical
        startRow = Math.floor(Math.random() * (gridSize - word.length + 1));
        startCol = Math.floor(Math.random() * gridSize);
        if (checkPlacement(startRow, startCol, direction, word)) {
          for (var i = 0; i < word.length; i++) {
            grid[startRow + i][startCol] = { char: word.charAt(i), isWord: true };
          }
          placed = true;
        }
      } else if (direction == 2 && gridSize - word.length >= 0) { // diagonal down-right
        startRow = Math.floor(Math.random() * (gridSize - word.length + 1));
        startCol = Math.floor(Math.random() * (gridSize - word.length + 1));
        if (checkPlacement(startRow, startCol, direction, word)) {
          for (var i = 0; i < word.length; i++) {
            grid[startRow + i][startCol + i] = { char: word.charAt(i), isWord: true };
          }
          placed = true;
        }
      } else if (direction == 3 && gridSize - word.length >= 0) { // diagonal up-right
        startRow = Math.floor(Math.random() * (gridSize - word.length + 1)) + (word.length - 1);
        startCol = Math.floor(Math.random() * (gridSize - word.length + 1));
        if (checkPlacement(startRow, startCol, direction, word)) {
          for (var i = 0; i < word.length; i++) {
            grid[startRow - i][startCol + i] = { char: word.charAt(i), isWord: true };
          }
          placed = true;
        }
      }
    }
  }
  
  // Fill the remaining empty spaces with random letters
  for (var i = 0; i < gridSize; i++) {
    for (var j = 0; j < gridSize; j++) {
      if (grid[i][j] === '-') {
        grid[i][j] = { char: String.fromCharCode(Math.floor(Math.random() * 26) + 97), isWord: false };
      }
    }
  }

  var gridElement = document.getElementById('word-search-grid');
  gridElement.innerHTML = '';
  for (var i = 0; i < gridSize; i++) {
    var rowElement = document.createElement('div');
    for (var j = 0; j < gridSize; j++) {
      var cell = document.createElement('span');
      cell.style.width = '20px';
      cell.style.display = 'inline-block';
      cell.textContent = '-';
      rowElement.appendChild(cell);

      (function(i, j, cell) {
        setTimeout(function() {
          animateCell(cell, grid[i][j]);
          // Adding event listeners
          cell.addEventListener('mousedown', function() {
            isMouseDown = true;
            handleCellMouseDown(i, j, cell);
          });
          cell.addEventListener('mouseenter', function() {
            handleCellMouseEnter(i, j, cell);
          });
          cell.addEventListener('mouseup', function() {
            isMouseDown = false;
            handleCellMouseUp();
          });
        }, 1000 * i); // Multiply the delay by i to animate each row one by one
      })(i, j, cell);
    }
    gridElement.appendChild(rowElement);
  }

function animateCell(cell, finalChar, row, col) { // renamed i and j to row and col for clarity
  var possibleChars = 'abcdefghijklmnopqrstuvwxyz';
  var i = Math.floor(Math.random() * possibleChars.length);  // Randomize the starting point for the animation
  var animationFrames = Math.floor(Math.random() * 10) + 10; // Randomize the number of animation frames (between 10 and 19)
  var frameCount = 0;

  // Assign cell id 
  cell.id = 'cell-' + row + '-' + col;

  var animation = setInterval(function() {
    cell.textContent = possibleChars[i % possibleChars.length];
    i++;
    frameCount++;
      
    if (frameCount >= animationFrames) {
      clearInterval(animation);
        
      if (typeof finalChar === 'object') {
        cell.textContent = finalChar.char;
          
        if (highlightWords && finalChar.isWord) {
            // Change the color of the cell's text if it is part of a word
            cell.style.color = 'red';
        }
      } else {
        cell.textContent = finalChar;
      }
    }
  }, 100); // Change the letter every 100 ms
  } 
}

function displayWords() {
  var wordsElement = document.getElementById('word-list');
  wordsElement.innerHTML = '';
  for (var word of words) {
    var wordElement = document.createElement('li');
    wordElement.textContent = word;
    wordElement.style.textDecoration = 'none';
    wordElement.style.cursor = 'pointer';
    wordsElement.appendChild(wordElement);

    wordElement.addEventListener('click', function() {
      var wordText = this.textContent;
      if (checkWordFound(wordText)) {
        this.style.textDecoration = 'line-through';
      }
    });
  }
}

generateGrid();
displayWords();
addEventListenersToCells();