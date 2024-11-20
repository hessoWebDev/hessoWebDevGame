class Player {
    constructor(x, y, width, height, sprite) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.sprite = new Image();
        this.sprite.src = sprite;
        this.velocity = { x: 0, y: 0 };
        this.isJumping = false;
        this.gravity = 0.5;
        this.speed = 5;
        this.direction = "right"; // Default direction
    }

    draw(ctx) {
        ctx.save();

        // Flip the canvas horizontally if facing left
        if (this.direction === "left") {
            ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
        } else {
            ctx.translate(this.x + this.width, this.y);
            ctx.scale(-1, 1);
            ctx.drawImage(this.sprite, 0, 0, this.width, this.height);
        }

        ctx.restore();
    }

    update(platforms) {
        // Apply gravity
        this.velocity.y += this.gravity;
        this.y += this.velocity.y;

        // Horizontal movement
        this.x += this.velocity.x;

        // Collision with platforms
        platforms.forEach((platform) => {
            if (
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

        // Stop the player at ground level
        if (this.y + this.height >= canvas.height) {
            this.y = canvas.height - this.height;
            this.isJumping = false;
            this.velocity.y = 0;
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

