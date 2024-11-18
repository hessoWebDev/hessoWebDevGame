class Enemy {
    constructor(x, y, width, height, sprite) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.sprite = new Image();
        this.sprite.src = sprite;
        this.velocity = { x: 1, y: 0 };
    }

    draw(ctx) {
        ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
    }

    update(deltaTime) {
        // Simple movement logic
        this.x += this.velocity.x;
        if (this.x < 0 || this.x + this.width > canvas.width) {
            this.velocity.x *= -1;
        }
    }
}

const enemies = [
    new Enemy(300, 470, 50, 50, './assets/sprites/enemy.png')
];
