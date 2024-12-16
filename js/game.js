// Canvas and Context Setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const mainMenu = document.getElementById("mainMenu");
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

// Set canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Background Image Setup
const backgroundImage = new Image();
backgroundImage.src = "./assets/sprites/space_background.png";

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

  dropZone.innerHTML = "";
  const img = document.createElement("img");
  img.src = droppedAvatar.src;
  img.style.width = "100%";
  img.style.height = "100%";
  dropZone.appendChild(img);

  selectedAvatar = avatarId;
});

confirmAvatarButton.addEventListener("click", () => {
  selectedSprites = [
    `./assets/sprites/${selectedAvatar}1.png`,
    `./assets/sprites/${selectedAvatar}2.png`,
    `./assets/sprites/${selectedAvatar}3.png`,
  ];

  alert("Avatar changed with succes !");
  avatarMenu.style.display = "none";
  mainMenu.style.display = "flex";
});

// Game Variables
let currentLevel = 1;
let levels = [];
let player, platforms, enemies, camera;
let lastTime = 0;
let animationFrameId; // Store the ID for requestAnimationFrame
let gameSpeed = 1; // Default speed multiplier

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
  levels = [
    {
      start: { x: 100, y: canvas.height - 150 },
      end: { x: 4000, y: 400 },
      platforms: [
        { x: 100, y: 500, width: 200, height: 20, type: "metal" },
        { x: 400, y: 400, width: 200, height: 20, type: "default" },
        { x: 700, y: 300, width: 100, height: 20, type: "default" },
        { x: 900, y: 300, width: 200, height: 20, type: "default" },
        { x: 1200, y: 300, width: 200, height: 20, type: "default" },
        { x: 1500, y: 300, width: 200, height: 20, type: "default" },
        { x: 1800, y: 300, width: 200, height: 20, type: "default" },
        { x: 2100, y: 300, width: 200, height: 20, type: "default" },
        { x: 2400, y: 300, width: 200, height: 20, type: "default" },
        { x: 2700, y: 300, width: 800, height: 20, type: "default" },
        { x: 3600, y: 300, width: 400, height: 20, type: "default" },
      ],
      enemies: [
        {
          x: 400,
          y: 350,
          width: 50,
          height: 50,
          speed: 1,
          moveDistance: 150,
          type: "robot",
        },
        {
          x: 895,
          y: 210,
          width: 100,
          height: 100,
          speed: 1,
          moveDistance: 120,
          type: "greenMonster",
        },
      ],
    },
    {
      start: { x: 100, y: canvas.height - 150 },
      end: { x: 4000, y: 400 },
      platforms: [
        { x: 100, y: 500, width: 200, height: 20, type: "metal" },
        { x: 400, y: 400, width: 200, height: 20, type: "default" },
        { x: 700, y: 300, width: 100, height: 20, type: "default" },
        { x: 900, y: 300, width: 200, height: 20, type: "default" },
        { x: 1200, y: 300, width: 200, height: 20, type: "default" },
        { x: 1500, y: 300, width: 200, height: 20, type: "default" },
        { x: 1800, y: 300, width: 200, height: 20, type: "default" },
        { x: 2100, y: 300, width: 200, height: 20, type: "default" },
        { x: 2400, y: 300, width: 200, height: 20, type: "default" },
        { x: 2700, y: 300, width: 800, height: 20, type: "default" },
        { x: 3600, y: 300, width: 400, height: 20, type: "default" },
      ],
      enemies: [
        {
          x: 400,
          y: 350,
          width: 50,
          height: 50,
          speed: 1,
          moveDistance: 150,
          type: "robot",
        },
        {
          x: 895,
          y: 210,
          width: 100,
          height: 100,
          speed: 1,
          moveDistance: 120,
          type: "greenMonster",
        },
      ],
    },
  ];
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
      new Enemy(e.x, e.y, e.width, e.height, e.speed, e.moveDistance, e.type)
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
  ctx.fillText(`Level: ${currentLevel}`, 10, 30);
}

function gameComplete() {
  cancelAnimationFrame(animationFrameId); // Stop the game loop
  const gameCompleteMenu = document.getElementById("gameCompleteMenu");
  gameCompleteMenu.style.display = "flex"; // Show the Game Complete screen
}

// Handle Game Over
function gameOver() {
  cancelAnimationFrame(animationFrameId); // Stop the game loop
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
  backgroundMusic.pause(); // stop the music
  backgroundMusic.currentTime = 0; //put the audio at the start
});

// Handle Menu Button Clicks
playButton.addEventListener("click", () => {
  mainMenu.style.display = "none"; // Hide Main Menu
  canvas.style.display = "block"; // Show the game canvas
  startGame(); // Start the game loop
});

avatarButton.addEventListener("click", () => {
  mainMenu.style.display = "none";
  avatarMenu.style.display = "flex";
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
  initLevel(currentLevel);

  function gameLoop(timestamp) {
    const deltaTime = (timestamp - lastTime) * gameSpeed; // Adjust timing
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the scrolling background
    drawBackground(ctx, camera);

    // Display Level Number
    displayLevelNumber();

    // Update the camera
    camera.update();

    // Update player and level objects
    player.update(platforms, deltaTime); // Pass deltaTime to player update

    // Check for Game Over conditions
    if (
      player.y > canvas.height ||
      enemies.some((e) => detectCollision(player, e))
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
