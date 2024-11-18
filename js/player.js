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
    }

    draw(ctx) {
        ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
    }

    update(deltaTime) {
        // Gravity
        this.velocity.y += 0.5;
        this.y += this.velocity.y;

        // Horizontal movement
        this.x += this.velocity.x;

        // Simple ground collision
        if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height;
            this.isJumping = false;
            this.velocity.y = 0;
        }
    }

    jump() {
        if (!this.isJumping) {
            this.isJumping = true;
            this.velocity.y = -12;
        }
    }
}

const player = new Player(100, 500, 50, 50, './assets/sprites/character.png');
