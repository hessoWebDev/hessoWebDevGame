class Enemy {
    constructor(x, y, width, height, sprite, speed, moveDistance) {
        this.startX = x; // Starting position
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.sprite = new Image();
        this.sprite.src = sprite;
        this.velocity = { x: speed, y: 0 }; // Horizontal speed
        this.moveDistance = moveDistance; // Total distance to move
        this.travelled = 0; // Distance travelled so far
    }

    draw(ctx, camera) {
        ctx.drawImage(this.sprite, this.x - camera.offsetX, this.y, this.width, this.height);
    }

    update(deltaTime) {
        // Move the enemy
        this.x += this.velocity.x;
        this.travelled += Math.abs(this.velocity.x);

        // Reverse direction if the enemy exceeds its movement range
        if (this.travelled >= this.moveDistance) {
            this.velocity.x *= -1; // Reverse direction
            this.travelled = 0; // Reset distance travelled
        }
    }
}
