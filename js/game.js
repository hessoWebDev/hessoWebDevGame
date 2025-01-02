// Canvas and Context Setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const mainMenu = document.getElementById("mainMenu");
const rankingMenu = document.getElementById("rankingMenu");
const gameOverMenu = document.getElementById("gameOverMenu");
const playButton = document.getElementById("playButton");
const optionsButton = document.getElementById("optionsButton");
const restartButton = document.getElementById("restartButton");
const mainMenuButton = document.getElementById("mainMenuButton");
const playAgainButton = document.getElementById("playAgainButton");
const mainMenuCompleteButton = document.getElementById(
  "mainMenuCompleteButton"
);
const difficultySelect = document.getElementById("difficulty");
const backToMenuButton = document.getElementById("backToMenuButton");
const avatarMenu = document.getElementById("avatarMenu");
const avatarButton = document.getElementById("avatarButton");
const confirmAvatarButton = document.getElementById("confirmAvatarButton");
const dropZone = document.getElementById("dropZone");
const draggableAvatars = document.querySelectorAll(".draggable-avatar");
const avatarsContainer = document.getElementById("avatarsContainer");
let selectedSprites = [
  "./assets/sprites/character1.png", // by default
  "./assets/sprites/character2.png",
  "./assets/sprites/character3.png",
];
const LeaderboardButton = document.getElementById("LeaderboardButton");
const LeaderboardMainMenuButton = document.getElementById(
  "backToMenuFromRanking"
);
const leaderboardTable = document
  .getElementById("leaderboardTable")
  .querySelector("tbody");
const backToMenuFromRanking = document.getElementById("backToMenuFromRanking");
const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

// Set canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Background Image Setup
const backgroundImage = new Image();
backgroundImage.src = "./assets/sprites/space_background.png";

//DRAG N DROP

let selectedAvatar = "character"; // Avatar by default

draggableAvatars.forEach((avatar) => {
  avatar.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", e.target.id);
  });
});

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault(); // Autorize the drop
  dropZone.style.borderColor = "yellow";
});

dropZone.addEventListener("dragleave", () => {
  dropZone.style.borderColor = "white";
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  const avatarId = e.dataTransfer.getData("text/plain");
  const droppedAvatar = document.getElementById(avatarId);

  dropZone.innerHTML = ""; //delete what was inside
  const img = document.createElement("img");
  img.src = droppedAvatar.src;
  img.style.width = "100%";
  img.style.height = "100%";
  dropZone.appendChild(img);

  selectedAvatar = avatarId;
});

//confirm button
confirmAvatarButton.addEventListener("click", () => {
  selectedSprites = [
    `./assets/sprites/${selectedAvatar}1.png`,
    `./assets/sprites/${selectedAvatar}2.png`,
    `./assets/sprites/${selectedAvatar}3.png`,
  ];

  alert("Avatar changed with success !");
  avatarMenu.style.display = "none";
  mainMenu.style.display = "flex";
});

// Game Variables
let globalGameTimer = 0;
let currentLevel = 1;
let levels = [];
let player, platforms, enemies, camera;
let lastTime = 0;
let animationFrameId; // Store the ID for requestAnimationFrame
let gameSpeed = 1; // Default speed multiplier
let elapsedSeconds = 0; // Time counter
let timeInterval; // Interval for updating time

// Fetch and Initialize Time
function fetchAndInitializeTime() {
  if (!navigator.geolocation) {
    console.error("Geolocation is not supported by this browser.");
    elapsedSeconds = 0; // Start from zero if location isn't available
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const apiUrl = `https://api.ipgeolocation.io/timezone?apiKey=462a980efbda407eadc6415e020d0875&lat=${latitude}&long=${longitude}`;
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          const [hours, minutes, seconds] = data.time_24.split(":").map(Number);
          elapsedSeconds = hours * 3600 + minutes * 60 + seconds; // Convert to total seconds
        })
        .catch((error) => {
          console.error("Failed to fetch time:", error);
          elapsedSeconds = 0; // Start from zero if API fails
        });
    },
    (error) => {
      console.error("Failed to get geolocation:", error.message);
      elapsedSeconds = 0; // Start from zero if geolocation fails
    }
  );
}

// Start Time Counter
function startTimeCounter() {
  timeInterval = setInterval(() => {
    elapsedSeconds++;
  }, 1000); // Increment every second
}

// Stop Time Counter
function stopTimeCounter() {
  clearInterval(timeInterval);
}

// Display Elapsed Time
function displayElapsedTime() {
  const hours = Math.floor(elapsedSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((elapsedSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (elapsedSeconds % 60).toString().padStart(2, "0");
  const timeString = `${hours}:${minutes}:${seconds}`;

  ctx.fillStyle = "#fff";
  ctx.font = "24px Arial";
  ctx.textAlign = "right";
  ctx.fillText(timeString, canvas.width - 10, 30); // Top-right corner
}

// Load Levels from JSON
function loadLevelsFromJSON(file) {
  return fetch(file)
    .then((response) => response.json())
    .then((data) => data.levels)
    .catch((error) => {
      console.error("Erreur de chargement des niveaux :", error);
      return [];
    });
}

// Background music
const backgroundMusic = new Audio("./assets/Audio/background.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5; // Volume btw 0.0 and 1.0

playButton.addEventListener("click", () => {
  mainMenu.style.display = "none";
  canvas.style.display = "block";
  backgroundMusic.play();
  startGame();
});

// Mute
const muteButton = document.getElementById("muteButton");
let isMuted = false;

muteButton.addEventListener("click", () => {
  isMuted = !isMuted;

  backgroundMusic.muted = isMuted;

  if (player && player.jumpSound) {
    player.jumpSound.muted = isMuted;
  }
  muteButton.textContent = isMuted ? "Unmute" : "Mute";
});

// Load Levels
function loadLevels() {
  loadLevelsFromJSON("./levels.json").then((loadedLevels) => {
    levels = loadedLevels;
  });
}

// Initialize Level
function initLevel(levelNumber) {
  const levelConfig = levels[levelNumber - 1];

  player = new Player(
    levelConfig.start.x,
    levelConfig.start.y,
    50,
    50,
    selectedSprites
  );

  platforms = levelConfig.platforms.map(
    (p) => new Platform(p.x, p.y, p.width, p.height, p.type)
  );
  enemies = levelConfig.enemies.map(
    (e) =>
      new Enemy(
        e.x,
        e.y,
        e.width,
        e.height,
        e.speed,
        e.moveDistance,
        e.type,
        e.direction
      )
  );
  camera = new Camera(player, canvas);
}

// Draw Scrolling Background
const backgroundWidth = canvas.width; // Cache the width
const backgroundHeight = canvas.height; // Cache the height

function drawBackground(ctx, camera) {
  const parallaxSpeed = 0.5; // Adjust to control background scrolling speed

  // Calculate background position based on the camera's offset
  const backgroundX = -(camera.offsetX * parallaxSpeed) % backgroundWidth;

  // Draw the first image
  ctx.drawImage(
    backgroundImage,
    backgroundX,
    0,
    backgroundWidth,
    backgroundHeight
  );

  // Draw a second image for smooth wrapping
  if (backgroundX + backgroundWidth < canvas.width) {
    ctx.drawImage(
      backgroundImage,
      backgroundX + backgroundWidth,
      0,
      backgroundWidth,
      backgroundHeight
    );
  }
}

// Display Level Number
function displayLevelNumber() {
  ctx.fillStyle = "#fff";
  ctx.font = "24px Arial";
  ctx.fillText(`Level: ${currentLevel}`, 100, 30);
}

// Game Complete
function gameComplete() {
  cancelAnimationFrame(animationFrameId); // Stop the game loop
  stopTimeCounter(); // Stop time counter
  const gameCompleteMenu = document.getElementById("gameCompleteMenu");
  gameCompleteMenu.style.display = "flex";

  const saveScoreButton = document.getElementById("saveScoreButton");
  const playerNameInput = document.getElementById("playerName");

  saveScoreButton.addEventListener("click", () => {
    const playerName = playerNameInput.value.trim();
    if (playerName) {
      const score = Math.floor(globalGameTimer);
      saveScore(playerName, score);
      alert("Score saved!");
      gameCompleteMenu.style.display = "none";
      canvas.style.display = "none";
      globalGameTimer = 0;
      mainMenu.style.display = "flex";
    } else {
      alert("Please enter your name!");
    }
  });
}

// Handle Game Over
function gameOver() {
  cancelAnimationFrame(animationFrameId); // Stop the game loop
  stopTimeCounter(); // Stop time counter

  gameOverMenu.style.display = "flex"; // Show Game Over menu
}

// Restart Level
restartButton.addEventListener("click", () => {
  gameOverMenu.style.display = "none"; // Hide Game Over menu
  startGame(); // Restart the game
});

// Back to Main Menu
mainMenuButton.addEventListener("click", () => {
  gameOverMenu.style.display = "none"; // Hide Game Over menu
  mainMenu.style.display = "flex"; // Show Main Menu
  currentLevel = 1; // Reset levels
  globalGameTimer = 0;
  stopTimeCounter(); // Stop time counter
  backgroundMusic.pause(); // stop the music
  backgroundMusic.currentTime = 0;
});

// Handle Menu Button Clicks
playButton.addEventListener("click", () => {
  mainMenu.style.display = "none"; // Hide Main Menu
  canvas.style.display = "block"; // Show the game canvas
  fetchAndInitializeTime(); // Fetch the time
  startTimeCounter(); // Start time counter
});

avatarButton.addEventListener("click", () => {
  mainMenu.style.display = "none";
  avatarMenu.style.display = "flex";
  canvas.style.display = "none";
});

optionsButton.addEventListener("click", () => {
  mainMenu.style.display = "none"; // Hide Main Menu
  optionsMenu.style.display = "flex"; // Show Options Menu
});

//play again
playAgainButton.addEventListener("click", () => {
  const gameCompleteMenu = document.getElementById("gameCompleteMenu");
  gameCompleteMenu.style.display = "none"; // Hide the Game Complete screen
  currentLevel = 1; // Restart from the first level
  startGame(); // Start the game loop
});

mainMenuCompleteButton.addEventListener("click", () => {
  const gameCompleteMenu = document.getElementById("gameCompleteMenu");
  gameCompleteMenu.style.display = "none"; // Hide the Game Complete screen
  mainMenu.style.display = "flex"; // Show the Main Menu
  currentLevel = 1; // Reset levels
});

// Back to Main Menu Button in Options Menu
backToMenuButton.addEventListener("click", () => {
  optionsMenu.style.display = "none"; // Hide Options Menu
  mainMenu.style.display = "flex"; // Show Main Menu
});

backToMenuFromRanking.addEventListener("click", () => {
  rankingMenu.style.display = "none";
  mainMenu.style.display = "flex";
});

//Game difficulty
document.getElementById("settingsForm").addEventListener("submit", (event) => {
  event.preventDefault();

  // Set game speed based on difficulty
  const selectedDifficulty = difficultySelect.value;
  if (selectedDifficulty === "easy") {
    gameSpeed = 0.75; // Slowest speed
  } else if (selectedDifficulty === "medium") {
    gameSpeed = 1; // Default speed
  } else if (selectedDifficulty === "hard") {
    gameSpeed = 1.5; // Fastest speed
  }

  alert(`Settings Saved! Difficulty set to ${selectedDifficulty}`);
  optionsMenu.style.display = "none"; // Hide Options Menu
  mainMenu.style.display = "flex"; // Show Main Menu
});

// Start the Game Loop
function startGame() {
  if (currentLevel === 1) {
    globalGameTimer = 0; // Reset timer only at level 1
  }

  initLevel(currentLevel);

  function gameLoop(timestamp) {
    const deltaTime = (timestamp - lastTime) * gameSpeed; // Adjust timing
    lastTime = timestamp;

    globalGameTimer += deltaTime / 1000;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the scrolling background
    drawBackground(ctx, camera);

    // Display elapsed time
    displayElapsedTime();

    // Display Level Number
    displayLevelNumber();

    displayGlobalTimer();

    // Update the camera
    camera.update();

    // Update player and level objects
    player.update(platforms, deltaTime); // Pass deltaTime to player update

    // Check for Game Over conditions
    if (
      player.y > canvas.height ||
      enemies.some((e) => detectEnemyCollision(player, e))
    ) {
      gameOver();
      return;
    }

    // Check for Level Completion
    const levelEnd = levels[currentLevel - 1].end;
    if (player.x > levelEnd.x && player.y > levelEnd.y) {
      currentLevel++;
      if (currentLevel > levels.length) {
        gameComplete();
        return;
      }
      initLevel(currentLevel); // Load the next level
    }

    // Update enemies
    enemies.forEach((enemy) => enemy.update(deltaTime));

    // Draw platforms and enemies
    platforms.forEach((platform) => platform.draw(ctx, camera));
    enemies.forEach((enemy) => enemy.draw(ctx, camera));

    // Draw the player
    ctx.save();
    ctx.translate(-camera.offsetX, 0);
    player.draw(ctx, camera); // Pass the camera to adjust the player's position
    ctx.restore();

    animationFrameId = requestAnimationFrame(gameLoop);
  }

  animationFrameId = requestAnimationFrame(gameLoop);
}

// Load levels and start the game
loadLevels();

function displayGlobalTimer() {
  const seconds = Math.floor(globalGameTimer % 60)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor(globalGameTimer / 60)
    .toString()
    .padStart(2, "0");
  const timerString = `${minutes}:${seconds}`;

  ctx.fillStyle = "#fff";
  ctx.font = "24px Arial";
  ctx.fillText(timerString, 90, 60);
}

function saveScore(playerName, scoreInSeconds) {
  if (!playerName || isNaN(scoreInSeconds)) {
    console.error("The name of the player is invalid !");
    return;
  }

  leaderboard.push({ name: playerName, score: scoreInSeconds });
  leaderboard.sort((a, b) => a.score - b.score);
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  console.log("Leaderboard saved :", leaderboard);
}

LeaderboardButton.addEventListener("click", () => {
  mainMenu.style.display = "none";
  canvas.style.display = "none";
  rankingMenu.style.display = "block";
  displayLeaderboard();
});

LeaderboardMainMenuButton.addEventListener("click", () => {
  rankingMenu.style.display = "none";
  mainMenu.style.display = "flex"; // Show the Main Menu
});

function displayLeaderboard() {
  leaderboardTable.innerHTML = "";

  leaderboard.forEach((entry, index) => {
    const row = leaderboardTable.insertRow();
    const rankCell = row.insertCell(0);
    const nameCell = row.insertCell(1);
    const scoreCell = row.insertCell(2);

    rankCell.innerText = index + 1;
    nameCell.innerText = entry.name;
    scoreCell.innerText = formatTime(entry.score);
  });
}
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}
