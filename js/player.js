class Player {
    constructor(x, y, width, height, spritePaths) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocity = { x: 0, y: 0 };
        this.isJumping = false;
        this.gravity = 0.5;
        this.speed = 5;
        this.direction = "right"; // Default direction

        // Animation properties
        this.sprites = spritePaths.map((path) => {
            const img = new Image();
            img.src = path;
            return img;
        });
        this.currentFrame = 0; // Current frame index
        this.frameTimer = 0; // Timer to control frame switching
        this.frameInterval = 100; // Time (ms) per frame
    }

    draw(ctx) {
        ctx.save();

        const sprite = this.sprites[this.currentFrame]; // Get the current frame

        // Flip the canvas horizontally if facing left
        if (this.direction === "left") {
            ctx.drawImage(sprite, this.x, this.y, this.width, this.height);
        } else {
            ctx.translate(this.x + this.width, this.y);
            ctx.scale(-1, 1);
            ctx.drawImage(sprite, 0, 0, this.width, this.height);
        }

        ctx.restore();
    }

    update(platforms, deltaTime) {
        // Apply gravity
        this.velocity.y += this.gravity;
        this.y += this.velocity.y;

        // Prevent the player from running left out of the screen
        this.x = Math.max(0, this.x + this.velocity.x);

        // Collision with platforms (only when falling)
        platforms.forEach((platform) => {
            if (
                this.velocity.y > 0 && // Falling
                this.y + this.height >= platform.y &&
                this.y + this.height <= platform.y + platform.height &&
                this.x + this.width >= platform.x &&
                this.x <= platform.x + platform.width
            ) {
                this.isJumping = false;
                this.y = platform.y - this.height;
                this.velocity.y = 0;
            }
        });

        // Update animation frame (only when moving horizontally)
        if (this.velocity.x !== 0) {
            this.frameTimer += deltaTime;
            if (this.frameTimer >= this.frameInterval) {
                this.currentFrame = (this.currentFrame + 1) % this.sprites.length;
                this.frameTimer = 0; // Reset timer
            }
        } else {
            this.currentFrame = 0; // Reset to the first frame when idle
        }
    }

    jump() {
        if (!this.isJumping) {
            this.isJumping = true;
            this.velocity.y = -12; // Adjust jump height
        }
    }
}

// Player controls
const keys = {
    w: false,
    a: false,
    d: false,
};

window.addEventListener("keydown", (e) => {
    switch (e.code) {
        case "KeyW":
        case "Space":
            if (!keys.w) player.jump();
            keys.w = true;
            break;
        case "KeyA":
            keys.a = true;
            player.velocity.x = -player.speed;
            player.direction = "left"; // Update direction to left
            break;
        case "KeyD":
            keys.d = true;
            player.velocity.x = player.speed;
            player.direction = "right"; // Update direction to right
            break;
    }
});

window.addEventListener("keyup", (e) => {
    switch (e.code) {
        case "KeyW":
        case "Space":
            keys.w = false;
            break;
        case "KeyA":
            keys.a = false;
            if (!keys.d) player.velocity.x = 0;
            break;
        case "KeyD":
            keys.d = false;
            if (!keys.a) player.velocity.x = 0;
            break;
    }
});
