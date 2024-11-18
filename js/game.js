const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

let lastTime = 0;

// Game loop
function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw game objects
    player.update(deltaTime);
    player.draw(ctx);

    platforms.forEach((platform) => {
        platform.draw(ctx);
    });

    enemies.forEach((enemy) => {
        enemy.update(deltaTime);
        enemy.draw(ctx);
    });

    requestAnimationFrame(gameLoop);
}

// Start game loop
requestAnimationFrame(gameLoop);


window.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowRight') player.velocity.x = 5;
    if (e.code === 'ArrowLeft') player.velocity.x = -5;
    if (e.code === 'Space') player.jump();
});

window.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowRight' || e.code === 'ArrowLeft') player.velocity.x = 0;
});

