// Canvas and Context Setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const mainMenu = document.getElementById("mainMenu");
const playButton = document.getElementById("playButton");
const optionsButton = document.getElementById("optionsButton");

// Set canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Background Image Setup
const backgroundImage = new Image();
backgroundImage.src = './assets/sprites/space_background.png';

// Game Variables
let lastTime = 0;

// Initialize game objects
const player = new Player(100, canvas.height - 100, 50, 50, './assets/sprites/character.png');
const platforms = [
    new Platform(100, 500, 200, 20, './assets/sprites/platform.png'),
    new Platform(400, 400, 200, 20, './assets/sprites/platform.png'),
];
const enemies = [
    new Enemy(600, 550, 50, 50, './assets/sprites/enemy.png'),
];
const level = new Level(platforms, enemies);
const camera = new Camera(player, canvas);

// Handle Menu Button Clicks
playButton.addEventListener("click", () => {
    mainMenu.style.display = "none"; // Hide the main menu
    canvas.style.display = "block"; // Show the game canvas
    startGame(); // Start the game loop
});

optionsButton.addEventListener("click", () => {
    alert("Options are not implemented yet!");
});

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

// Start the Game Loop
function startGame() {
    function gameLoop(timestamp) {
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the scrolling background
        drawBackground(ctx, camera);

        // Update the camera
        camera.update();

        // Update player and level objects
        player.update(platforms); // Update the player's state
        level.update(deltaTime); // Update enemies and other level elements

        // Draw level elements
        level.draw(ctx, camera);

        // Draw the player
        ctx.save();
        ctx.translate(-camera.offsetX, 0);
        player.draw(ctx, camera); // Pass the camera to adjust the player's position
        ctx.restore();

        requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);
}
