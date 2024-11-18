class Platform {
    constructor(x, y, width, height, sprite) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.sprite = new Image();
        this.sprite.src = sprite;
    }

    draw(ctx, camera) {
        ctx.drawImage(this.sprite, this.x - camera.offsetX, this.y, this.width, this.height);
    }
}
