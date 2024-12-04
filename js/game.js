// Canvas and Context Setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const mainMenu = document.getElementById("mainMenu");
const gameOverMenu = document.getElementById("gameOverMenu");
const playButton = document.getElementById("playButton");
const optionsButton = document.getElementById("optionsButton");
const restartButton = document.getElementById("restartButton");
const mainMenuButton = document.getElementById("mainMenuButton");

// Set canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Background Image Setup
const backgroundImage = new Image();
backgroundImage.src = './assets/sprites/space_background.png';

// Game Variables
let currentLevel = 1;
let levels = [];
let player, platforms, enemies, camera;
let lastTime = 0;
let animationFrameId; // Store the ID for requestAnimationFrame

// Load Levels
function loadLevels() {
    levels = [
        {
            start: { x: 100, y: canvas.height - 150 },
            end: { x: 4000, y: 400 },
            platforms: [
                { x: 100, y: 500, width: 200, height: 20 },
                { x: 400, y: 400, width: 200, height: 20 },
                { x: 700, y: 300, width: 100, height: 20 },
            ],
            enemies: [{ x: 600, y: 470, width: 50, height: 50 }],
        },
        {
            start: { x: 100, y: canvas.height - 150 },
            end: { x: 4000, y: 200 },
            platforms: [
                { x: 100, y: 500, width: 150, height: 20 },
                { x: 300, y: 450, width: 150, height: 20 },
                { x: 500, y: 400, width: 150, height: 20 },
            ],
            enemies: [
                { x: 400, y: 470, width: 50, height: 50 },
                { x: 600, y: 470, width: 50, height: 50 },
            ],
        },
    ];
}

// Initialize Level
function initLevel(levelNumber) {
    const levelConfig = levels[levelNumber - 1];

    player = new Player(levelConfig.start.x, levelConfig.start.y, 50, 50, './assets/sprites/character.png');
    platforms = levelConfig.platforms.map(
        (p) => new Platform(p.x, p.y, p.width, p.height, './assets/sprites/platform.png')
    );
    enemies = levelConfig.enemies.map(
        (e) => new Enemy(e.x, e.y, e.width, e.height, './assets/sprites/enemy.png')
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
    ctx.drawImage(backgroundImage, backgroundX, 0, backgroundWidth, backgroundHeight);

    // Draw a second image for smooth wrapping
    if (backgroundX + backgroundWidth < canvas.width) {
        ctx.drawImage(backgroundImage, backgroundX + backgroundWidth, 0, backgroundWidth, backgroundHeight);
    }
}

// Display Level Number
function displayLevelNumber() {
    ctx.fillStyle = "#fff";
    ctx.font = "24px Arial";
    ctx.fillText(`Level: ${currentLevel}`, 10, 30);
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
});

// Handle Menu Button Clicks
playButton.addEventListener("click", () => {
    mainMenu.style.display = "none"; // Hide Main Menu
    canvas.style.display = "block"; // Show the game canvas
    startGame(); // Start the game loop
});

optionsButton.addEventListener("click", () => {
    alert("Options are not implemented yet!");
});

// Start the Game Loop
function startGame() {
    initLevel(currentLevel);

    function gameLoop(timestamp) {
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the scrolling background
        drawBackground(ctx, camera);

        // Display Level Number
        displayLevelNumber();

        // Update the camera
        camera.update();

        // Update player and level objects
        player.update(platforms); // Update the player's state

        // Check for Game Over conditions
        if (player.y > canvas.height || enemies.some((e) => detectCollision(player, e))) {
            gameOver();
            return;
        }

        // Check for Level Completion
        const levelEnd = levels[currentLevel - 1].end;
        if (player.x > levelEnd.x && player.y > levelEnd.y) {
            currentLevel++;
            if (currentLevel > levels.length) {
                alert("Congratulations! You completed all levels!");
                currentLevel = 1; // Reset to the first level
                mainMenu.style.display = "flex"; // Show the Main Menu
                return;
            }
            initLevel(currentLevel); // Load the next level
        }

        // Draw platforms and enemies
        platforms.forEach((platform) => platform.draw(ctx, camera));
        enemies.forEach((enemy) => enemy.draw(ctx, camera));

        // Draw the player
        ctx.save();
        ctx.translate(-camera.offsetX, 0);
        player.draw(ctx, camera); // Pass the camera to adjust the player's position
        ctx.restore();

        // Store the animation frame ID for later cancellation
        animationFrameId = requestAnimationFrame(gameLoop);
    }

    animationFrameId = requestAnimationFrame(gameLoop);
}

// Load levels and start the game
loadLevels();
