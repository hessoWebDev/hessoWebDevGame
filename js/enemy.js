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

    draw(ctx, camera) {
        ctx.drawImage(this.sprite, this.x - camera.offsetX, this.y, this.width, this.height);
    }

    update(deltaTime) {
        this.x += this.velocity.x;
        if (this.x < 0 || this.x + this.width > canvas.width) {
            this.velocity.x *= -1; // Reverse direction
        }
    }
}
