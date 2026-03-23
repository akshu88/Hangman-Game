// Redirect to login if not logged in
if (!localStorage.getItem("hangman_user")) {
  window.location.href = "login.html";
}

// Grab the player's name
const playerName = localStorage.getItem("hangman_user");

// ---- WORD BANK WITH RIDDLES ----
const wordBank = {
  computer: [
    { word: "keyboard", riddle: "I have keys but no locks, I have space but no room. What am I?" },
    { word: "mouse", riddle: "I have a tail but I'm not an animal. I help you point and click. What am I?" },
    { word: "monitor", riddle: "I show you everything but I'm not a mirror. What am I?" },
    { word: "processor", riddle: "I am the brain of the computer. What am I?" },
    { word: "software", riddle: "You can't touch me but you can use me. What am I?" },
    { word: "internet", riddle: "I connect the whole world but you can't see me. What am I?" },
    { word: "memory", riddle: "I store things temporarily in a computer. What am I?" },
    { word: "virus", riddle: "I am harmful to computers just like I am to humans. What am I?" },
  ],
  lifestyle: [
    { word: "exercise", riddle: "I keep you healthy and strong but I make you tired. What am I?" },
    { word: "sleep", riddle: "Everyone needs me but some ignore me. I recharge your body. What am I?" },
    { word: "nutrition", riddle: "I am the study of food and how it affects your body. What am I?" },
    { word: "meditation", riddle: "I calm your mind and require silence and focus. What am I?" },
    { word: "hygiene", riddle: "I keep you clean and healthy every day. What am I?" },
    { word: "breakfast", riddle: "I am the most important meal of the day. What am I?" },
    { word: "hobby", riddle: "I am something you do for fun in your free time. What am I?" },
    { word: "fitness", riddle: "I describe how healthy and strong your body is. What am I?" },
  ]
};

let currentRiddle = "";
let currentCategory = "";  // add this
let currentLevel = 1;      // add this
let soundOn = true;        // add this
let musicOn = true;        // add this

// ---- PLAYER STATS ----
let playerStats = JSON.parse(localStorage.getItem("hangman_stats_" + playerName)) || {
  level: 1,
  coins: 0,
  wins: 0,
  losses: 0
};

function saveStats() {
  localStorage.setItem("hangman_stats_" + playerName, JSON.stringify(playerStats));
}

function updateDashboard() {
  document.getElementById("dash-level").textContent = playerStats.level;
  document.getElementById("dash-coins").textContent = playerStats.coins;
  document.getElementById("dash-wins").textContent = playerStats.wins;
  document.getElementById("dash-losses").textContent = playerStats.losses;
}

let secretWord = "";
let guessedLetters = [];
let wrongGuesses = 0;
const maxWrong = 6;
let canvas;
let ctx;

// ---- SHOW CATEGORY SCREEN ----
function showCategories() {
  document.getElementById("category-screen").style.display = "flex";
  document.getElementById("level-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "none";
}

function showLevelScreen(category) {
  currentCategory = category;
  document.getElementById("category-screen").style.display = "none";
  document.getElementById("level-screen").style.display = "flex";
  document.getElementById("game-screen").style.display = "none";
  document.getElementById("level-category-name").textContent = 
    category === "computer" ? "💻 Computer Fundamentals" : "🏃 Lifestyle";

  const grid = document.getElementById("level-grid");
  grid.innerHTML = "";

  for (let i = 1; i <= 10; i++) {
    const btn = document.createElement("button");
    if (i <= playerStats.level) {
      // Unlocked level
      btn.textContent = `Level ${i}`;
      btn.classList.add("level-btn");
      btn.onclick = () => startGame(category, i);
    } else {
      // Locked level
      btn.textContent = "🔒";
      btn.classList.add("level-btn", "locked");
    }
    grid.appendChild(btn);
  }
}
// ---- START GAME WITH CHOSEN CATEGORY ----
function startGame(category, level) {
  currentCategory = category;
  currentLevel = level;

  document.getElementById("category-screen").style.display = "none";
  document.getElementById("level-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "flex";

  canvas = document.getElementById("hangman-canvas");
  ctx = canvas.getContext("2d");

  const list = wordBank[category];
  const picked = list[Math.floor(Math.random() * list.length)];
  secretWord = picked.word;
  currentRiddle = picked.riddle;

  guessedLetters = [];
  wrongGuesses = 0;

  document.getElementById("riddle-text").textContent = `🧩 Riddle: ${currentRiddle}`;
  document.getElementById("message").textContent = "";
  document.getElementById("wrong-count").textContent = "Wrong guesses: 0 / 6";
  document.getElementById("player-name").textContent = `👤 Playing as: ${playerName}`;

  buildKeyboard();
  renderWord();
  updateCanvas();
  updateDashboard();
}
// ---- INIT ----
function init() {
  showCategories();
}

// Start the game
init();
// ---- HOME SCREEN ANIMATION ----
const homeCanvas = document.getElementById("home-canvas");
const homeCtx = homeCanvas.getContext("2d");

const homeParts = [
  // Head
  () => {
    homeCtx.beginPath();
    homeCtx.arc(130, 70, 20, 0, Math.PI * 2);
    homeCtx.strokeStyle = "#6c63ff";
    homeCtx.stroke();
  },
  // Body
  () => {
    homeCtx.beginPath();
    homeCtx.moveTo(130, 90); homeCtx.lineTo(130, 160);
    homeCtx.strokeStyle = "#6c63ff";
    homeCtx.stroke();
  },
  // Left Arm
  () => {
    homeCtx.beginPath();
    homeCtx.moveTo(130, 110); homeCtx.lineTo(100, 140);
    homeCtx.strokeStyle = "#6c63ff";
    homeCtx.stroke();
  },
  // Right Arm
  () => {
    homeCtx.beginPath();
    homeCtx.moveTo(130, 110); homeCtx.lineTo(160, 140);
    homeCtx.strokeStyle = "#6c63ff";
    homeCtx.stroke();
  },
  // Left Leg
  () => {
    homeCtx.beginPath();
    homeCtx.moveTo(130, 160); homeCtx.lineTo(100, 200);
    homeCtx.strokeStyle = "#6c63ff";
    homeCtx.stroke();
  },
  // Right Leg
  () => {
    homeCtx.beginPath();
    homeCtx.moveTo(130, 160); homeCtx.lineTo(160, 200);
    homeCtx.strokeStyle = "#6c63ff";
    homeCtx.stroke();
  }
];

let homeStep = 0;

function drawHomeGallows() {
  homeCtx.clearRect(0, 0, homeCanvas.width, homeCanvas.height);
  homeCtx.strokeStyle = "#6c63ff";
  homeCtx.lineWidth = 4;
  homeCtx.beginPath();
  homeCtx.moveTo(20, 240); homeCtx.lineTo(180, 240);
  homeCtx.moveTo(60, 240); homeCtx.lineTo(60, 20);
  homeCtx.moveTo(60, 20); homeCtx.lineTo(130, 20);
  homeCtx.moveTo(130, 20); homeCtx.lineTo(130, 50);
  homeCtx.stroke();
}

function animateHome() {
  if (homeStep === 0) {
    drawHomeGallows();
  }
  if (homeStep < homeParts.length) {
    homeParts[homeStep]();
    homeStep++;
  } else {
    setTimeout(() => {
      homeStep = 0;
      drawHomeGallows();
    }, 1000);
    return;
  }
  setTimeout(animateHome, 500);
}

// Start the animation
animateHome();


// ---- DRAW FUNCTIONS ----
function drawGallows() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(20, 240); ctx.lineTo(180, 240);
  ctx.moveTo(60, 240); ctx.lineTo(60, 20);
  ctx.moveTo(60, 20); ctx.lineTo(130, 20);
  ctx.moveTo(130, 20); ctx.lineTo(130, 50);
  ctx.stroke();
}

function drawHead() {
  ctx.beginPath();
  ctx.arc(130, 70, 20, 0, Math.PI * 2);
  ctx.strokeStyle = "#ffffff";
  ctx.stroke();
}

function drawBody() {
  ctx.beginPath();
  ctx.moveTo(130, 90); ctx.lineTo(130, 160);
  ctx.strokeStyle = "#ffffff";
  ctx.stroke();
}

function drawLeftArm() {
  ctx.beginPath();
  ctx.moveTo(130, 110); ctx.lineTo(100, 140);
  ctx.strokeStyle = "#ffffff";
  ctx.stroke();
}

function drawRightArm() {
  ctx.beginPath();
  ctx.moveTo(130, 110); ctx.lineTo(160, 140);
  ctx.strokeStyle = "#ffffff";
  ctx.stroke();
}

function drawLeftLeg() {
  ctx.beginPath();
  ctx.moveTo(130, 160); ctx.lineTo(100, 200);
  ctx.strokeStyle = "#ffffff";
  ctx.stroke();
}

function drawRightLeg() {
  ctx.beginPath();
  ctx.moveTo(130, 160); ctx.lineTo(160, 200);
  ctx.strokeStyle = "#ffffff";
  ctx.stroke();
}

const drawSteps = [drawHead, drawBody, drawLeftArm, drawRightArm, drawLeftLeg, drawRightLeg];

function updateCanvas() {
  drawGallows();
  for (let i = 0; i < wrongGuesses; i++) {
    drawSteps[i]();
  }
  // If all parts drawn, start swinging
  if (wrongGuesses >= maxWrong) {
    startSwing();
  }
}

// ---- SWING ANIMATION ----
let swingAngle = 0;
let swingDirection = 1;
let swingInterval = null;

function startSwing() {
  // Clear any existing swing
  if (swingInterval) clearInterval(swingInterval);

  swingInterval = setInterval(() => {
    // Clear and redraw gallows
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGallows();

    // Save canvas state and rotate around rope point
    ctx.save();
    ctx.translate(130, 50); // rope point
    ctx.rotate((swingAngle * Math.PI) / 180);

    // Draw all body parts shifted to origin
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;

    // Head
    ctx.beginPath();
    ctx.arc(0, 20, 20, 0, Math.PI * 2);
    ctx.stroke();

    // Body
    ctx.beginPath();
    ctx.moveTo(0, 40); ctx.lineTo(0, 110);
    ctx.stroke();

    // Left Arm
    ctx.beginPath();
    ctx.moveTo(0, 60); ctx.lineTo(-30, 90);
    ctx.stroke();

    // Right Arm
    ctx.beginPath();
    ctx.moveTo(0, 60); ctx.lineTo(30, 90);
    ctx.stroke();

    // Left Leg
    ctx.beginPath();
    ctx.moveTo(0, 110); ctx.lineTo(-30, 150);
    ctx.stroke();

    // Right Leg
    ctx.beginPath();
    ctx.moveTo(0, 110); ctx.lineTo(30, 150);
    ctx.stroke();

    ctx.restore();

    // Update swing angle
    swingAngle += swingDirection * 2;
    if (swingAngle > 15) swingDirection = -1;
    if (swingAngle < -15) swingDirection = 1;

  }, 30);
}

function stopSwing() {
  if (swingInterval) {
    clearInterval(swingInterval);
    swingInterval = null;
  }
}

// ---- RENDER WORD DISPLAY ----
function renderWord() {
  const display = document.getElementById("word-display");
  display.innerHTML = "";
  for (let letter of secretWord) {
    const box = document.createElement("div");
    box.classList.add("letter-box");
    // Only show letter if it has been guessed
    if (guessedLetters.includes(letter)) {
      box.textContent = letter;
    } else {
      box.textContent = "";
    }
    display.appendChild(box);
  }
}

// ---- BUILD KEYBOARD ----
function buildKeyboard() {
  const keyboard = document.getElementById("keyboard");
  keyboard.innerHTML = "";
  for (let i = 65; i <= 90; i++) {
    const letter = String.fromCharCode(i).toLowerCase();
    const btn = document.createElement("button");
    btn.textContent = letter.toUpperCase();
    btn.classList.add("key-btn");
    btn.id = `key-${letter}`;
    btn.onclick = () => handleGuess(letter);
    keyboard.appendChild(btn);
  }
}

// ---- HANDLE A GUESS ----
function handleGuess(letter) {
  if (guessedLetters.includes(letter)) return;

  guessedLetters.push(letter);

  const btn = document.getElementById(`key-${letter}`);
  if (btn) btn.disabled = true;

  if (!secretWord.includes(letter)) {
    wrongGuesses++;
  }

  updateCanvas();
  renderWord();
  document.getElementById("wrong-count").textContent = `Wrong guesses: ${wrongGuesses} / ${maxWrong}`;
  checkGameOver();
}

// ---- CHECK WIN / LOSE ----
function checkGameOver() {
  const won = [...secretWord].every(letter => guessedLetters.includes(letter));

  if (won) {
    disableKeyboard();
    // Update stats on win
    playerStats.wins++;
    playerStats.coins += 10 * playerStats.level;
    playerStats.level++;
    saveStats();
    updateDashboard();
    setTimeout(() => showPopup("win"), 300);
    return;
  }

  if (wrongGuesses >= maxWrong) {
    disableKeyboard();
    // Update stats on lose
    playerStats.losses++;
    saveStats();
    updateDashboard();
    setTimeout(() => showPopup("lose"), 300);
  }
}

// ---- DISABLE KEYBOARD ----
function disableKeyboard() {
  document.querySelectorAll(".key-btn").forEach(btn => btn.disabled = true);
}

// ---- SHOW POPUP ----
function showPopup(result) {
  const existing = document.getElementById("popup-overlay");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "popup-overlay";

  const popup = document.createElement("div");
  popup.id = "popup-box";

  if (result === "win") {
    popup.innerHTML = `
      <div class="popup-icon">🎉</div>
      <h2>You Won!</h2>
      <p>Great job! You guessed the word <strong>${secretWord}</strong> correctly!</p>
      <button onclick="closePopupAndRestart()">Play Again</button>
      <button onclick="closePopupAndCategory()">Choose Category</button>
    `;
    popup.style.borderColor = "#6c63ff";
  } else {
    popup.innerHTML = `
      <div class="popup-icon">💀</div>
      <h2>You Lost!</h2>
      <p>The correct word was <strong>${secretWord}</strong>. Better luck next time!</p>
      <button onclick="closePopupAndRestart()">Try Again</button>
      <button onclick="closePopupAndCategory()">Choose Category</button>
    `;
    popup.style.borderColor = "#ff5c5c";
  }

  overlay.appendChild(popup);
  document.body.appendChild(overlay);
}

function closePopupAndRestart() {
  const overlay = document.getElementById("popup-overlay");
  if (overlay) overlay.remove();
  showCategories();
}
function closePopupAndCategory() {
  const overlay = document.getElementById("popup-overlay");
  if (overlay) overlay.remove();
  showCategories();
}

function closePopupAndNextLevel() {
  const overlay = document.getElementById("popup-overlay");
  if (overlay) overlay.remove();
  const nextLevel = currentLevel + 1;
  if (nextLevel <= 10) {
    startGame(currentCategory, nextLevel);
  } else {
    alert("🎉 You completed all levels!");
    showCategories();
  }
}

function closePopupAndHome() {
  const overlay = document.getElementById("popup-overlay");
  if (overlay) overlay.remove();
  showCategories();
}

function showDashboard() {
  closeAllModals();
  const content = document.getElementById("dashboard-content");
  content.innerHTML = `
    <div class="leaderboard-item"><span>👤 Player</span><span>${playerName}</span></div>
    <div class="leaderboard-item"><span>⭐ Level</span><span>${playerStats.level}</span></div>
    <div class="leaderboard-item"><span>🪙 Coins</span><span>${playerStats.coins}</span></div>
    <div class="leaderboard-item"><span>🏆 Wins</span><span>${playerStats.wins}</span></div>
    <div class="leaderboard-item"><span>❌ Losses</span><span>${playerStats.losses}</span></div>
  `;
  document.getElementById("dashboard-popup").style.display = "flex";
}

function showLeaderboard() {
  closeAllModals();
  const content = document.getElementById("leaderboard-content");
  const allStats = [];
  for (let key in localStorage) {
    if (key.startsWith("hangman_stats_")) {
      const name = key.replace("hangman_stats_", "");
      const stats = JSON.parse(localStorage.getItem(key));
      allStats.push({ name, ...stats });
    }
  }
  allStats.sort((a, b) => b.coins - a.coins);
  content.innerHTML = allStats.length === 0 ? "<p style='color:#888'>No players yet!</p>" :
    allStats.map((p, i) => `
      <div class="leaderboard-item">
        <span>${i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`} ${p.name}</span>
        <span>🪙 ${p.coins}</span>
      </div>
    `).join("");
  document.getElementById("leaderboard-popup").style.display = "flex";
}

function closeAllModals() {
  document.getElementById("dashboard-popup").style.display = "none";
  document.getElementById("leaderboard-popup").style.display = "none";
  document.getElementById("settings-popup").style.display = "none";
}

function showSettings() {
  closeAllModals();
  document.getElementById("sound-toggle").checked = soundOn;
  document.getElementById("music-toggle").checked = musicOn;
  document.getElementById("settings-popup").style.display = "flex";
}

function toggleSound() {
  soundOn = !soundOn;
}

function toggleMusic() {
  musicOn = !musicOn;
}

// function closeAllModals() {
//   document.getElementById(id).style.display = "none";
// }

function closeModal(id) {
  document.getElementById(id).style.display = "none";
}

// ---- LOGOUT ----
function logout() {
  localStorage.removeItem("hangman_user");
  window.location.href = "login.html";
}