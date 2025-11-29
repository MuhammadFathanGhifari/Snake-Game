// ===============================
// 1. Setup Awal & Seleksi DOM
// ===============================

// Canvas & Context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d'); // 'ctx' adalah "kuas" untuk menggambar di canvas

// UI Skor
const currentScoreEl = document.getElementById('currentScore');
const topScoreEl = document.getElementById('topScore');

// UI Leaderboard
const leaderboardListEl = document.getElementById('leaderboardList');

// UI Layar Mulai
const startScreen = document.getElementById('startScreen');
const usernameInput = document.getElementById('usernameInput');
const startButton = document.getElementById('startButton');

// UI Layar Game Over
const gameOverScreen = document.getElementById('gameOverScreen');
const finalPlayerEl = document.getElementById('finalPlayer');
const finalScoreEl = document.getElementById('finalScore');
const playAgainButton = document.getElementById('playAgainButton');
const leaderboardButton = document.getElementById('leaderboardButton');

// ===============================
// 2. Variabel Utama Game
// ===============================
const tileSize = 20; // Ukuran setiap kotak (ular & makanan) dalam piksel

let snake;           // Array {x, y} dari bagian tubuh ular
let food;            // Objek {x, y} posisi makanan
let direction;       // 'up' | 'down' | 'left' | 'right'
let score;
let topScore = 0;
let leaderboard = []; // Array {nama, skor}
let username = '';
let gameLoopInterval;
let isGameOver;

// ===============================
// 3. Fungsi Inisialisasi Game
// ===============================
function initGame() {
  isGameOver = false;
  gameOverScreen.classList.add('hidden');
  canvas.style.display = 'block';

  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ];

  direction = 'right';
  score = 0;

  updateScoreDisplay();
  placeFood();
  draw(snake.forEach((part, index) => {
  if (index === 0) {
    drawSnakeHead(part);
  } else {
    ctx.fillStyle = '#0f0';
    ctx.fillRect(part.x * tileSize, part.y * tileSize, tileSize, tileSize);
  }
})); // <--- tambah ini

  if (gameLoopInterval) clearInterval(gameLoopInterval);
  gameLoopInterval = setInterval(gameLoop, 100);
}


// ===============================
// 4. Loop Utama Game
// ===============================
function gameLoop() {
  if (isGameOver) return;

  updateSnakePosition(); // Gerakkan ular

  if (isGameOver) return; // Jika mati, berhenti

  draw(); // Gambar ulang
}
function gameLoop() {
  if (isGameOver) return;
  updateSnakePosition(); // ini penting
  if (isGameOver) return;
  draw(); // menggambar ulang canvas
}


// ===============================
// 5. Update Posisi Ular
// ===============================
function updateSnakePosition() {
    
  const head = { ...snake[0] }; // Salin kepala

  // Tentukan arah baru
switch (direction) {
  case 'up': head.y--; break;
  case 'down': head.y++; break;
  case 'left': head.x--; break;
  case 'right': head.x++; break;
}


  // Cek tabrakan dinding
    const gridSize = canvas.width / tileSize;
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
        endGame();
        return;
}


  // Cek tabrakan diri sendiri
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      endGame();
      return;
    }
  }

  // Tambahkan kepala baru
  snake.unshift(head);

  // Cek makan makanan
  if (head.x === food.x && head.y === food.y) {
    score++;
    updateScoreDisplay();
    placeFood();
  } else {
    snake.pop(); // Tidak makan → hapus ekor
  }
}

// ===============================
// 6. Tempatkan Makanan
// ===============================
function placeFood() {
  const gridSize = canvas.width / tileSize;
  let newFood;

  while (true) {
    newFood = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize)
    };

    // pastikan gak di atas badan ular
    const onSnake = snake.some(part => part.x === newFood.x && part.y === newFood.y);
    if (!onSnake) break;
  }

  food = newFood;
}


// ===============================
// 7. Akhiri Game
// ===============================
function endGame() {
  isGameOver = true;
  clearInterval(gameLoopInterval);

  // Update skor tertinggi
  if (score > topScore) topScore = score;

  // Update leaderboard
  updateLeaderboard();

  // Tampilkan layar Game Over
  finalPlayerEl.textContent = username;
  finalScoreEl.textContent = score;
  gameOverScreen.classList.remove('hidden');
}

// ===============================
// 8. Menggambar ke Canvas
// ===============================
function draw() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // gambar makanan
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);

  // gambar semua bagian ular
  snake.forEach((part, index) => {
    ctx.fillStyle = index === 0 ? '#7fff00' : '#00ff55';
    ctx.fillRect(part.x * tileSize, part.y * tileSize, tileSize, tileSize);
  });
}


// ===============================
// 9. Kepala Ular dengan Mata
// ===============================
function drawSnakeHead(head) {
  // TODO: gambar kotak kepala & mata
  switch (direction) {
    // Tambahkan logika posisi mata
  }
}

// ===============================
// 10. Update Tampilan Skor
// ===============================
function updateScoreDisplay() {
  currentScoreEl.textContent = score;
  topScoreEl.textContent = topScore;
}

// ===============================
// 11. Update Leaderboard
// ===============================
function updateLeaderboard() {
  leaderboard.push({ name: username, score });
  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard = leaderboard.slice(0, 5);

  leaderboardListEl.innerHTML = '';
  leaderboard.forEach(entry => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="leaderboard-name">${entry.name}</span>:
      <span class="leaderboard-score">${entry.score}</span>
    `;
    leaderboardListEl.appendChild(li);
  });
}

// ===============================
// 12. Kontrol Arah
// ===============================
document.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowUp':
    case 'w':
      if (direction !== 'down') direction = 'up';
      break;

    case 'ArrowDown':
    case 's':
      if (direction !== 'up') direction = 'down';
      break;

    case 'ArrowLeft':
    case 'a':
      if (direction !== 'right') direction = 'left';
      break;

    case 'ArrowRight':
    case 'd':
      if (direction !== 'left') direction = 'right';
      break;
  }
});

// ===============================
// 13. Tombol UI
// ===============================
startButton.addEventListener('click', () => {
  username = usernameInput.value || 'Player';
  startScreen.classList.add('hidden');
  initGame();
});

playAgainButton.addEventListener('click', () => {
  gameOverScreen.classList.add('hidden');
  startScreen.classList.remove('hidden');
});
function drawSnakeHead(head) {
  ctx.fillStyle = '#7fff00';
  ctx.fillRect(head.x * tileSize, head.y * tileSize, tileSize, tileSize);
}
let aiEnabled = false;

document.getElementById('toggleAI').addEventListener('click', () => {
  aiEnabled = !aiEnabled;
  document.getElementById('toggleAI').textContent = `AI Mode: ${aiEnabled ? 'ON' : 'OFF'}`;
});
function updateAIDirection() {
  const head = snake[0];
  
  if (head.x < food.x && direction !== 'left') direction = 'right';
  else if (head.x > food.x && direction !== 'right') direction = 'left';
  else if (head.y < food.y && direction !== 'up') direction = 'down';
  else if (head.y > food.y && direction !== 'down') direction = 'up';
}

function gameLoop() {
  if (isGameOver) return;

  if (aiEnabled) updateAIDirection(function updateAIDirection() {
  const head = snake[0];

  if (head.x < food.x && direction !== 'left') {
    direction = 'right';
  } else if (head.x > food.x && direction !== 'right') {
    direction = 'left';
  } else if (head.y < food.y && direction !== 'up') {
    direction = 'down';
  } else if (head.y > food.y && direction !== 'down') {
    direction = 'up';
  }
}
); // <- tambahin ini
  updateSnakePosition();
  if (isGameOver) return;
  draw();
}
function buildHamiltonianIfPossible() {
  const cols = gridCols();
  const rows = gridRows();

  // need at least 2x2
  if (cols < 2 || rows < 2) {
    cycle = null;
    cycleIndexMap = null;
    return;
  }

  // If rows even -> horizontal serpentine
  if (rows % 2 === 0) {
    const arr = [];
    for (let y = 0; y < rows; y++) {
      if (y % 2 === 0) {
        // left -> right
        for (let x = 0; x < cols; x++) arr.push({x, y});
      } else {
        // right -> left
        for (let x = cols - 1; x >= 0; x--) arr.push({x, y});
      }
    }
    // arr now is Hamiltonian path; to make cycle, connect end to start via column shift
    // For even rows serpentine, last cell is (0, rows-1). It is adjacent to start (0,0) only if rows==1, so we need to reorder edges to make cycle.
    // A standard trick: create cycle by stitching vertical moves between end of each row; serpentine already adjacent between rows.
    cycle = arr;
    buildCycleIndexMap();
    // cycle is a cycle in practice for even rows if you follow arr then wrap to start:
    // last and first might not be adjacent; but serpentine with even rows guarantees they are adjacent vertically? Let's ensure adjacency:
    // For even rows, arr[0] = (0,0). arr[last] = (0,rows-1). They are not adjacent if rows>2. However following arr then wrapping to start produces non-adjacent step.
    // To create a true cycle, we transform arr to explicit cycle using pairwise stitching:
    cycle = makeCycleFromSerpentine(cols, rows, 'row');
    buildCycleIndexMap();
    return;
  }

  // Else if cols even -> vertical serpentine
  if (cols % 2 === 0) {
    cycle = makeCycleFromSerpentine(cols, rows, 'col');
    buildCycleIndexMap();
    return;
  }

  // else impossible with simple serpentine cycle (both odd) -> fallback null
  cycle = null;
  cycleIndexMap = null;
}

// Helper: build index map
function buildCycleIndexMap() {
  cycleIndexMap = new Map();
  for (let i = 0; i < cycle.length; i++) {
    cycleIndexMap.set(`${cycle[i].x},${cycle[i].y}`, i);
  }
}

// Create explicit Hamiltonian cycle from serpentine layout
function makeCycleFromSerpentine(cols, rows, mode) {
  // We'll construct cycle explicitly ensuring adjacency between consecutive cells including wrap-around.
  // mode 'row' means serpentine by rows (rows must be even), 'col' serpentine by columns (cols even).
  const nodes = [];
  if (mode === 'row') {
    // We'll pair up columns in vertical ladders.
    // Construct cycle by for x from 0..cols-1:
    //   if x is even: go down column x
    //   else: go up column x
    for (let x = 0; x < cols; x++) {
      if (x % 2 === 0) {
        for (let y = 0; y < rows; y++) nodes.push({x, y});
      } else {
        for (let y = rows - 1; y >= 0; y--) nodes.push({x, y});
      }
    }
    // nodes is a Hamiltonian path; for even rows, ends are adjacent -> wrap forms cycle.
  } else {
    // mode === 'col' (cols even)
    for (let y = 0; y < rows; y++) {
      if (y % 2 === 0) {
        for (let x = 0; x < cols; x++) nodes.push({x, y});
      } else {
        for (let x = cols - 1; x >= 0; x--) nodes.push({x, y});
      }
    }
    // For even cols, ends are adjacent -> wrap forms cycle.
  }
  return nodes;
}

// ===== 13. Follow Hamiltonian Step =====
function followHamiltonianStep() {
  if (!cycle || !cycleIndexMap) return;

  const head = snake[0];
  const key = `${head.x},${head.y}`;
  const idx = cycleIndexMap.get(key);

  // If head not found (shouldn't happen) -> try to find nearest cycle cell
  let currentIndex = (typeof idx === 'number') ? idx : findNearestCycleIndex(head);

  const nextIndex = (currentIndex + 1) % cycle.length;
  const nextCell = cycle[nextIndex];

  // set direction from head -> nextCell
  if (nextCell.x > head.x) {
    if (direction !== 'left') direction = 'right';
  } else if (nextCell.x < head.x) {
    if (direction !== 'right') direction = 'left';
  } else if (nextCell.y > head.y) {
    if (direction !== 'up') direction = 'down';
  } else if (nextCell.y < head.y) {
    if (direction !== 'down') direction = 'up';
  }
}

// helper: nearest cycle index (rare)
function findNearestCycleIndex(pos) {
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < cycle.length; i++) {
    const c = cycle[i];
    const d = Math.abs(c.x - pos.x) + Math.abs(c.y - pos.y);
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  }
  return best;
}

// ===== 14. Fallback SMART AI (BFS + tail simulation) =====
// If grid cannot build Hamiltonian cycle (both odd), we use this smart fallback.
// The BFS here avoids stepping into squares that would definitely trap the snake by simulating tail movement.
function updateAIDirectionSmart() {
  const path = findPathToFoodWithTailSim();
  if (path && path.length > 0) {
    direction = path[0];
  } else {
    // fallback: choose safe move
    direction = chooseSafeMove();
  }
}

// BFS that simulates tail movement: returns list of directions to food if safe
function findPathToFoodWithTailSim() {
  const cols = gridCols();
  const rows = gridRows();
  const start = `${snake[0].x},${snake[0].y}`;
  const goal = `${food.x},${food.y}`;

  const dirs = [
    [1, 0, "right"],
    [-1, 0, "left"],
    [0, 1, "down"],
    [0, -1, "up"]
  ];

  // We will run BFS on states: position + index of steps (simulate tail moving)
  // But to keep it light, we implement BFS where we treat the snake body as obstacles except the tail cell,
  // and when we move step s, we assume tail will have moved s steps (so some cells free).
  // A simpler approach: for each candidate path from BFS, after reaching food, simulate snake occupying path and check if there's a path from new head to tail.
  const queue = [];
  const visited = new Set();
  const cameFrom = {};

  queue.push(start);
  visited.add(start);

  // body set for occupancy at time 0 (excluding tail because it moves)
  const bodyInitial = snake.map(p => `${p.x},${p.y}`);

  while (queue.length > 0) {
    const current = queue.shift();
    if (current === goal) {
      // reconstruct path
      const pathDirs = [];
      let temp = goal;
      while (temp !== start) {
        pathDirs.push(cameFrom[temp].dir);
        temp = cameFrom[temp].from;
      }
      pathDirs.reverse();

      // simulate: if after following this path the snake isn't trapped, accept it
      if (isPathSafeAfterEating(pathDirs)) return pathDirs;
      // else continue BFS (maybe alternative path)
    }

    const [cx, cy] = current.split(',').map(Number);
    for (const [dx, dy, dir] of dirs) {
      const nx = cx + dx;
      const ny = cy + dy;
      const key = `${nx},${ny}`;

      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;

      // check collision with body at time of entering this cell:
      // basic: if key is in bodyInitial and key !== tail cell (allowed), skip.
      const tailKey = `${snake[snake.length - 1].x},${snake[snake.length - 1].y}`;
      if (bodyInitial.includes(key) && key !== tailKey) continue;

      if (visited.has(key)) continue;

      visited.add(key);
      cameFrom[key] = { from: current, dir };
      queue.push(key);
    }
  }

  return null;
}

// simulate after following pathDirs: will there be path from new head to tail?
function isPathSafeAfterEating(pathDirs) {
  // make copy of snake positions and simulate moves
  const simSnake = snake.map(p => ({x: p.x, y: p.y}));
  const cols = gridCols();
  const rows = gridRows();

  // simulate moves until eat (pathDirs leads to food)
  for (let step = 0; step < pathDirs.length; step++) {
    const dir = pathDirs[step];
    const head = { ...simSnake[0] };
    if (dir === 'up') head.y--;
    if (dir === 'down') head.y++;
    if (dir === 'left') head.x--;
    if (dir === 'right') head.x++;

    // move: add head, remove tail (unless eating)
    simSnake.unshift(head);
    // If this step reaches the actual food pos, we simulate the food eaten so tail doesn't move this step
    if (head.x === food.x && head.y === food.y) {
      // eaten: tail not removed this step
    } else {
      simSnake.pop();
    }
  }

  // After eating, check if there's a path from head to tail (so snake can move)
  const start = `${simSnake[0].x},${simSnake[0].y}`;
  const target = `${simSnake[simSnake.length - 1].x},${simSnake[simSnake.length - 1].y}`;

  // basic BFS treating simSnake body as obstacles except tail cell
  const queue = [start];
  const visited = new Set([start]);
  const snakeBodySet = new Set(simSnake.slice(0, simSnake.length - 1).map(p => `${p.x},${p.y}`)); // exclude tail

  const dirs = [[1,0],[ -1,0],[0,1],[0,-1]];
  while (queue.length) {
    const cur = queue.shift();
    if (cur === target) return true;
    const [cx, cy] = cur.split(',').map(Number);
    for (const [dx, dy] of dirs) {
      const nx = cx + dx, ny = cy + dy;
      const key = `${nx},${ny}`;
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
      if (snakeBodySet.has(key)) continue;
      if (visited.has(key)) continue;
      visited.add(key);
      queue.push(key);
    }
  }
  return false;
}

// choose safe random move if no path
function chooseSafeMove() {
  const head = snake[0];
  const cols = gridCols();
  const rows = gridRows();
  const options = [
    { dir: "up",    x: head.x,     y: head.y - 1 },
    { dir: "down",  x: head.x,     y: head.y + 1 },
    { dir: "left",  x: head.x - 1, y: head.y },
    { dir: "right", x: head.x + 1, y: head.y }
  ];
  const snakeBody = new Set(snake.slice(1).map(p => `${p.x},${p.y}`));
  const safeMoves = options.filter(o =>
    o.x >= 0 && o.y >= 0 && o.x < cols && o.y < rows && !snakeBody.has(`${o.x},${o.y}`)
  );
  if (safeMoves.length === 0) return direction;
  // choose move that maximizes distance to body (heuristic)
  safeMoves.sort((a,b) => {
    return distToNearestBody(a.x,a.y) - distToNearestBody(b.x,b.y);
  });
  return safeMoves[0].dir;
}

function distToNearestBody(x,y) {
  let best = Infinity;
  for (let i = 1; i < snake.length; i++) {
    const p = snake[i];
    const d = Math.abs(p.x - x) + Math.abs(p.y - y);
    if (d < best) best = d;
  }
  return best;
}

// ===== 15. Optional: rebuild cycle on resize or tile changes =====
// If your canvas size changes at runtime, you can call this to rebuild:
function rebuildCycle() {
  buildHamiltonianIfPossible();
}

// ===== 16. Utility: Score display =====
function updateScoreDisplay() {
  currentScoreEl.textContent = score;
  topScoreEl.textContent = topScore;
}

// ===== 17. Optional: Watch for canvas size changes (if you change CSS) =====
// If you programmatically change canvas width/height, call rebuildCycle() after.
// e.g. window.addEventListener('resize', rebuildCycle);

// ===== 18. Smart BFS functions used by fallback (reused from earlier) =====
// (Already included above)

// ===== End of Script =====


