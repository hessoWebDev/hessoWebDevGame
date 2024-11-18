const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;


let lastTime = 0;

// Initialize game objects
const player = new Player(100, canvas.height - 100, 50, 50, './assets/sprites/character.png');
const platforms = [
    new Platform(100, 500, 200, 20, './assets/sprites/platform.png'),
    new Platform(400, 400, 200, 20, './assets/sprites/platform.png'),
];
const enemies = [
    new Enemy(600, 470, 50, 50, './assets/sprites/enemy.png'),
];
const level = new Level(platforms, enemies);
const camera = new Camera(player, canvas);

// Game loop
function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update the camera
    camera.update();

    // Update and draw game objects
    level.update(deltaTime); // Update level elements like enemies
    player.update(platforms); // Update player position and check collisions

    // Draw platforms and enemies
    level.draw(ctx, camera);

    // Draw the player (apply camera offset for scrolling)
    ctx.save(); // Save the current state
    ctx.translate(-camera.offsetX, 0); // Translate canvas for camera movement
    player.draw(ctx); // Draw the player with the translated context
    ctx.restore(); // Restore canvas state

    // Continue the game loop
    requestAnimationFrame(gameLoop);
}


// Start the game
requestAnimationFrame(gameLoop);
